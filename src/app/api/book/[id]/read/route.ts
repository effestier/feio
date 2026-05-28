import { NextRequest, NextResponse } from "next/server";
import { getGutenbergBook, getReadUrl } from "@/lib/gutenberg";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  if (isNaN(bookId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let book;
  try {
    book = await getGutenbergBook(bookId);
  } catch {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const readUrl = getReadUrl(book);
  if (!readUrl) {
    return NextResponse.json(
      { error: "No readable format available" },
      { status: 404 }
    );
  }

  try {
    const res = await fetch(readUrl);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch book content" },
        { status: 502 }
      );
    }

    const html = await res.text();
    const styled = wrapContent(html, book.title, bookId);

    return new NextResponse(styled, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch content" },
      { status: 502 }
    );
  }
}

function wrapContent(html: string, title: string, bookId: number): string {
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const content = bodyMatch ? bodyMatch[1] : html;

  // Remove Gutenberg chrome — keep content and attribution
  const cleaned = content
    .replace(/<div[^>]*id="[^"]*pg-header[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*id="[^"]*pg-footer[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*id="[^"]*pg-desktop-header[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*class="[^"]*pgheader[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*id="[^"]*header[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*class="[^"]*header[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*class="[^"]*nav[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<link[^>]*>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)} — FEIO Reader</title>
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
      padding: 1.5rem 1.25rem;
      max-width: var(--reader-max-width);
      margin: 0 auto;
      transition: background 0.3s, color 0.3s;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    @media (min-width: 640px) { body { padding: 2rem; } }

    h1, h2, h3, h4 {
      font-family: var(--reader-heading-font);
      color: var(--reader-heading-color);
      line-height: 1.25;
      letter-spacing: -0.01em;
    }

    h1 { font-size: 1.8em; text-align: center; margin: 2.5em 0 0.5em; }
    h2 { font-size: 1.4em; margin: 2em 0 0.5em; }
    h3 { font-size: 1.15em; margin: 1.8em 0 0.4em; text-transform: uppercase; letter-spacing: 0.05em; }
    h4 { font-size: 1em; margin: 1.5em 0 0.3em; }

    p {
      margin-bottom: 0.9em;
      text-align: justify;
      hyphens: auto;
      orphans: 3;
      widows: 3;
    }

    p + p { text-indent: 1.5em; margin-top: 0; }
    h1 + p, h2 + p, h3 + p, h4 + p, hr + p, blockquote + p { text-indent: 0; }

    a { color: var(--reader-link); text-decoration: none; }
    a:hover { text-decoration: underline; }

    .chapter { margin-top: 3rem; }

    hr { border: none; border-top: 1px solid var(--reader-border); margin: 2.5rem auto; width: 60px; }

    blockquote {
      border-left: 3px solid #C4A35A;
      padding: 0.5rem 0 0.5rem 1.2rem;
      margin: 1.5rem 0;
      color: var(--reader-blockquote);
      font-style: italic;
    }

    pre, code {
      font-family: 'Courier New', monospace;
      background: var(--reader-code-bg);
      padding: 0.15em 0.35em;
      border-radius: 3px;
      font-size: 0.88em;
    }
    pre { padding: 1rem; overflow-x: auto; line-height: 1.5; }

    img { max-width: 100%; height: auto; border-radius: 4px; }
    ul, ol { margin: 1em 0; padding-left: 1.5em; }
    li { margin-bottom: 0.3em; }

    .poem, .verse { margin: 1.5em 2em; font-style: italic; }
    .poem p, .verse p { text-indent: 0; margin-bottom: 0.2em; }

    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--reader-bg); }
    ::-webkit-scrollbar-thumb { background: #C4B8A8; border-radius: 3px; }

    .gutenberg-attr { text-align: center; font-size: 10px; color: #B0A898; margin-top: 4rem; padding-top: 1.5rem; border-top: 1px solid var(--reader-border); }
    .gutenberg-attr a { color: #9A8A7A; }
  </style>
</head>
<body>
  ${cleaned}
  <div class="gutenberg-attr">
    <a href="https://www.gutenberg.org/ebooks/${bookId}" target="_blank" rel="noopener">Project Gutenberg</a> &mdash; public domain
  </div>
  <script>
    (function() {
      var KEY = 'feio-reader-prefs';
      var SCROLL_KEY = 'feio-scroll-${bookId}';
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

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
