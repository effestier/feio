import { NextRequest, NextResponse } from "next/server";
import { getIAMetadata } from "@/lib/internetarchive";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params;
  const id = decodeURIComponent(identifier);

  let meta;
  try {
    meta = await getIAMetadata(id);
  } catch {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  if (!meta) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const files = meta.files || [];
  const title = meta.metadata?.title || id;
  const author =
    typeof meta.metadata?.creator === "string"
      ? meta.metadata.creator
      : Array.isArray(meta.metadata?.creator)
        ? (meta.metadata.creator as string[]).join(", ")
        : "Unknown";

  // Sanitize identifier for safe use in HTML/JS contexts
  const safeId = id.replace(/[^a-zA-Z0-9_\-./]/g, "");

  // Priority: HTML > DjVuTXT (plain text from OCR) > embed BookReader
  const htmlFile = files.find(
    (f) => f.format === "HTML" && !f.name.startsWith("_") && f.name !== `${safeId}_meta.html`
  );
  const txtFile = files.find(
    (f) => f.format === "DjVuTXT" || (f.format === "Plain Text" && f.name.endsWith(".txt"))
  );
  const hasDjVu = files.some((f) => f.format === "DjVu");
  const hasImages = files.some(
    (f) => f.format === "Single Page Processed JP2 ZIP" || f.format === "Image Container PDF"
  );

  let html: string;

  try {
    if (htmlFile) {
      html = await serveHtml(safeId, htmlFile.name, title, author);
    } else if (txtFile) {
      html = await servePlainText(safeId, txtFile.name, title, author);
    } else if (hasDjVu || hasImages) {
      html = serveBookReader(safeId, title, author);
    } else {
      return NextResponse.json(
        { error: "No readable format available" },
        { status: 404 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to load book content" },
      { status: 502 }
    );
  }

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

/** Fetch and clean an HTML file from IA */
async function serveHtml(
  id: string,
  filename: string,
  title: string,
  author: string
): Promise<string> {
  const url = `https://archive.org/download/${encodeURIComponent(id)}/${encodeURIComponent(filename)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const raw = await res.text();

  // Extract body content
  const bodyMatch = raw.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : raw;

  // Strip IA chrome, scripts, styles, navigation
  content = content
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<meta[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<div[^>]*>\s*<\/div>/gi, "")
    .replace(/<span[^>]*>\s*<\/span>/gi, "")
    .replace(/<[^>]*id="[^"]*ia[_-][^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi, "")
    .replace(/<[^>]*class="[^"]*ia[_-][^"]*"[^>]*>[\s\S]*?<\/[^>]+>/gi, "")
    // Clean attributes — keep only semantic ones
    .replace(/<(div|span|p|table|tr|td|th|ul|ol|li|blockquote|pre|img|a|h[1-6])\s+[^>]*?>/gi, (match) => {
      const tag = match.match(/^<(\w+)/)?.[1] || "";
      const idAttr = match.match(/\bid="([^"]*)"/);
      const cls = match.match(/\bclass="([^"]*)"/);
      const href = match.match(/\bhref="([^"]*)"/);
      const src = match.match(/\bsrc="([^"]*)"/);
      const alt = match.match(/\balt="([^"]*)"/);

      let cleaned = `<${tag}`;
      if (idAttr) cleaned += ` id="${idAttr[1]}"`;
      if (cls) cleaned += ` class="${cls[1]}"`;
      if (tag === "a" && href) cleaned += ` href="${href[1]}"`;
      if (tag === "img" && src) cleaned += ` src="${src[1]}"`;
      if (tag === "img" && alt) cleaned += ` alt="${alt[1]}"`;
      cleaned += ">";
      return cleaned;
    })
    .replace(/&amp;#(\d+);/g, "&#$1;")
    .replace(/\s+/g, " ")
    .replace(/>\s+</g, "><")
    .trim();

  return wrapDocument(content, title, id, author, "html");
}

/** Fetch and format plain text from IA */
async function servePlainText(
  id: string,
  filename: string,
  title: string,
  author: string
): Promise<string> {
  const url = `https://archive.org/download/${encodeURIComponent(id)}/${encodeURIComponent(filename)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  let raw = await res.text();

  // Fix common OCR artifacts
  raw = raw
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/(\w)-\n(\w)/g, "$1$2") // hyphenated line breaks
    .replace(/  +/g, " ");

  // Split into paragraphs
  const blocks = raw.split(/\n\s*\n/);
  const formatted: string[] = [];

  for (const block of blocks) {
    const trimmed = block.trim();
    if (!trimmed) continue;

    const lines = trimmed.split("\n").map((l) => l.trim()).filter(Boolean);
    const isHeading =
      lines.length <= 2 &&
      trimmed.length < 120 &&
      (
        /^[A-Z\s\d.:;,.]+$/.test(trimmed) ||
        /^(chapter|book|part|section|canto|verse|act|scene)\s+/i.test(trimmed) ||
        /^[IVXLC]+\.\s/.test(trimmed) ||
        /^\d+\.\s/.test(trimmed)
      );

    if (isHeading) {
      const level = /^[IVXLC]+\.\s/.test(trimmed) || /^(BOOK|PART)\s+/i.test(trimmed) ? "h2" : "h3";
      formatted.push(`<${level}>${escapeHtml(trimmed.replace(/\n/g, " "))}</${level}>`);
    } else {
      const text = lines.join(" ");
      formatted.push(`<p>${escapeHtml(text)}</p>`);
    }
  }

  const content = formatted.join("\n");
  return wrapDocument(content, title, id, author, "text");
}

/** Embed IA BookReader for scanned books */
function serveBookReader(id: string, title: string, author: string): string {
  const embedUrl = `https://archive.org/embed/${encodeURIComponent(id)}?ui=embed`;
  return wrapDocument("", title, id, author, "reader", embedUrl);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function wrapDocument(
  content: string,
  title: string,
  identifier: string,
  author: string,
  mode: "html" | "text" | "reader",
  embedUrl?: string
): string {
  const isEmbed = mode === "reader";
  const safeTitle = escapeHtml(title);
  const safeAuthor = escapeHtml(author);
  // Escape identifier for JS string context (single-quoted)
  const jsSafeId = identifier.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/"/g, "&quot;");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle} — FEIO Reader</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500&family=Lora:wght@400;500;600&display=swap');

    :root {
      --reader-font-size: 18px;
      --reader-font: 'Lora', 'Georgia', 'Times New Roman', serif;
      --reader-heading-font: 'Playfair Display', Georgia, serif;
      --reader-bg: #FAF7F0;
      --reader-color: #2C2C2C;
      --reader-heading-color: #1A1A1A;
      --reader-line-height: 1.85;
      --reader-link: #7A3B3B;
      --reader-border: #E8E0D0;
      --reader-blockquote: #4A4A4A;
      --reader-code-bg: #E8E0D0;
      --reader-max-width: 680px;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--reader-font);
      background: var(--reader-bg);
      color: var(--reader-color);
      font-size: var(--reader-font-size);
      line-height: var(--reader-line-height);
      ${isEmbed ? "padding: 0;" : "padding: 1.5rem 1.25rem;"}
      max-width: var(--reader-max-width);
      margin: 0 auto;
      transition: background 0.3s, color 0.3s;
      -webkit-font-smoothing: antialiased;
    }

    @media (min-width: 640px) { body { padding: ${isEmbed ? "0" : "2rem"}; } }

    .book-title {
      font-family: var(--reader-heading-font);
      font-size: 2em; font-weight: 700; text-align: center;
      margin: 2rem 0 0.5rem; color: var(--reader-heading-color);
      line-height: 1.2; letter-spacing: -0.01em;
    }
    .book-author { text-align: center; color: #888; font-size: 0.95em; margin-bottom: 2.5rem; font-style: italic; }
    .divider { width: 60px; height: 1px; background: var(--reader-border); margin: 2rem auto; }

    h1, h2, h3, h4 { font-family: var(--reader-heading-font); color: var(--reader-heading-color); line-height: 1.25; letter-spacing: -0.01em; }
    h1 { font-size: 1.8em; text-align: center; margin: 2.5em 0 0.5em; }
    h2 { font-size: 1.4em; margin: 2em 0 0.5em; }
    h3 { font-size: 1.15em; margin: 1.8em 0 0.4em; text-transform: uppercase; letter-spacing: 0.05em; }
    h4 { font-size: 1em; margin: 1.5em 0 0.3em; }

    p { margin-bottom: 0.9em; text-align: justify; hyphens: auto; orphans: 3; widows: 3; }
    p + p { text-indent: 1.5em; margin-top: 0; }
    h1 + p, h2 + p, h3 + p, h4 + p, .divider + p, blockquote + p { text-indent: 0; }

    a { color: var(--reader-link); text-decoration: none; }
    a:hover { text-decoration: underline; }
    hr { border: none; border-top: 1px solid var(--reader-border); margin: 2.5rem auto; width: 60px; }

    blockquote { border-left: 3px solid #C4A35A; padding: 0.5rem 0 0.5rem 1.2rem; margin: 1.5rem 0; color: var(--reader-blockquote); font-style: italic; }
    pre, code { font-family: 'Courier New', monospace; background: var(--reader-code-bg); padding: 0.15em 0.35em; border-radius: 3px; font-size: 0.88em; }
    pre { padding: 1rem; overflow-x: auto; line-height: 1.5; }
    img { max-width: 100%; height: auto; border-radius: 4px; }
    ul, ol { margin: 1em 0; padding-left: 1.5em; }
    li { margin-bottom: 0.3em; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--reader-bg); }
    ::-webkit-scrollbar-thumb { background: #C4B8A8; border-radius: 3px; }

    .ia-attr { text-align: center; font-size: 10px; color: #B0A898; margin-top: 4rem; padding-top: 1.5rem; border-top: 1px solid var(--reader-border); }
    .ia-attr a { color: #9A8A7A; }
    .embed-container { width: 100%; height: calc(100dvh - 2rem); border: none; }
  </style>
</head>
<body>
${isEmbed
  ? `<iframe src="${embedUrl}" class="embed-container" title="${safeTitle}" allowfullscreen></iframe>`
  : `<div class="book-title">${safeTitle}</div>
  ${author !== "Unknown" ? `<div class="book-author">${safeAuthor}</div>` : ""}
  <div class="divider"></div>
  ${content}`}

  <div class="ia-attr">
    <a href="https://archive.org/details/${identifier}" target="_blank" rel="noopener">Internet Archive</a> &mdash; public domain
  </div>

  <script>
    (function() {
      var KEY = 'feio-reader-prefs';
      var SCROLL_KEY = 'feio-scroll-ia-${jsSafeId}';
      var themes = {
        light:  { bg: '#FAF7F0', color: '#2C2C2C', heading: '#1A1A1A', link: '#7A3B3B', border: '#E8E0D0', bq: '#4A4A4A', code: '#E8E0D0' },
        sepia:  { bg: '#F4ECD8', color: '#5B4636', heading: '#3E2723', link: '#8B5E3C', border: '#D4C5A9', bq: '#6D5D4B', code: '#D4C5A9' },
        dark:   { bg: '#1A1A1A', color: '#E0E0E0', heading: '#F5F5F5', link: '#E8A0A0', border: '#333', bq: '#999', code: '#333' }
      };
      function applyPrefs(prefs) {
        var r = document.documentElement.style;
        r.setProperty('--reader-font-size', prefs.fontSize + 'px');
        r.setProperty('--reader-line-height', prefs.lineHeight);
        r.setProperty('--reader-font', prefs.fontFamily === 'serif'
          ? "'Lora', 'Georgia', 'Times New Roman', serif"
          : "'Inter', -apple-system, BlinkMacSystemFont, sans-serif");
        var t = themes[prefs.theme] || themes.light;
        r.setProperty('--reader-bg', t.bg);
        r.setProperty('--reader-color', t.color);
        r.setProperty('--reader-heading-color', t.heading);
        r.setProperty('--reader-link', t.link);
        r.setProperty('--reader-border', t.border);
        r.setProperty('--reader-blockquote', t.bq);
        r.setProperty('--reader-code-bg', t.code);
      }
      function getPrefs() {
        try { var s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch(e) {}
        return { fontSize: 18, fontFamily: 'serif', theme: 'light', lineHeight: 1.85 };
      }
      applyPrefs(getPrefs());
      try { var saved = parseInt(localStorage.getItem(SCROLL_KEY) || '0', 10); if (saved > 0) setTimeout(function() { window.scrollTo(0, saved); }, 100); } catch(e) {}
      window.addEventListener('beforeunload', function() { try { localStorage.setItem(SCROLL_KEY, String(window.scrollY)); } catch(e) {} });
      window.addEventListener('message', function(e) { if (e.data && e.data.type === 'feio-reader-prefs') applyPrefs(e.data.prefs); });
    })();
  </script>
</body>
</html>`;
}
