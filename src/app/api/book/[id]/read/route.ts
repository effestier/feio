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

  // Fetch the actual HTML content from Gutenberg
  try {
    const res = await fetch(readUrl);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch book content" },
        { status: 502 }
      );
    }

    const html = await res.text();

    // Clean up the HTML — inject FEIO styling, remove Gutenberg chrome
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
  // Extract just the body content if possible
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const content = bodyMatch ? bodyMatch[1] : html;

  // Remove Gutenberg chrome (headers, footers, navigation) — keep attribution
  const cleaned = content
    .replace(/<div[^>]*class="[^"]*header[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*class="[^"]*nav[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<a[^>]*name="[^"]*"[^>]*><\/a>\s*/gi, "")
    .replace(/<div[^>]*id="[^"]*header[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*id="[^"]*pg-header[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*id="[^"]*pg-footer[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
    .replace(/<div[^>]*id="[^"]*pg-desktop-header[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title} — FEIO Reader</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500&display=swap');

    :root {
      --reader-font-size: 18px;
      --reader-font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --reader-heading-font: 'Playfair Display', Georgia, serif;
      --reader-bg: #FAF7F0;
      --reader-color: #2C2C2C;
      --reader-heading-color: #1A1A1A;
      --reader-line-height: 1.8;
      --reader-link: #7A3B3B;
      --reader-border: #E8E0D0;
      --reader-blockquote: #4A4A4A;
      --reader-code-bg: #E8E0D0;
    }

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: var(--reader-font);
      background: var(--reader-bg);
      color: var(--reader-color);
      font-size: var(--reader-font-size);
      line-height: var(--reader-line-height);
      padding: 1.5rem;
      max-width: 720px;
      margin: 0 auto;
      transition: background 0.3s, color 0.3s;
    }

    @media (min-width: 640px) {
      body { padding: 2rem; }
    }

    h1, h2, h3, h4 {
      font-family: var(--reader-heading-font);
      color: var(--reader-heading-color);
      margin: 2em 0 0.5em;
      line-height: 1.3;
    }

    h1 { font-size: 2em; text-align: center; margin-top: 3rem; margin-bottom: 1rem; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.25em; }

    p { margin-bottom: 1em; text-align: justify; hyphens: auto; }

    a { color: var(--reader-link); text-decoration: none; }
    a:hover { text-decoration: underline; }

    .chapter { margin-top: 3rem; }

    hr { border: none; border-top: 1px solid var(--reader-border); margin: 2rem 0; }

    blockquote {
      border-left: 3px solid #C4A35A;
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: var(--reader-blockquote);
      font-style: italic;
    }

    pre, code {
      font-family: 'Courier New', monospace;
      background: var(--reader-code-bg);
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }

    pre { padding: 1rem; overflow-x: auto; }

    img { max-width: 100%; height: auto; }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: var(--reader-bg); }
    ::-webkit-scrollbar-thumb { background: #4A4A4A; border-radius: 3px; }

    .gutenberg-attr { text-align: center; font-size: 10px; color: #B0A898; margin-top: 4rem; padding-top: 1.5rem; border-top: 1px solid var(--reader-border); }
    .gutenberg-attr a { color: #9A8A7A; }
  </style>
</head>
<body>
  ${cleaned}
  <div class="gutenberg-attr">
    <a href="https://www.gutenberg.org/" target="_blank" rel="noopener">Project Gutenberg</a> &mdash; public domain
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
          ? "'Georgia', 'Times New Roman', serif"
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
        try {
          var s = localStorage.getItem(KEY);
          if (s) return JSON.parse(s);
        } catch(e) {}
        return { fontSize: 18, fontFamily: 'sans', theme: 'light', lineHeight: 1.8 };
      }

      // Apply on load
      applyPrefs(getPrefs());

      // Restore scroll position
      try {
        var saved = parseInt(localStorage.getItem(SCROLL_KEY) || '0', 10);
        if (saved > 0) setTimeout(function() { window.scrollTo(0, saved); }, 100);
      } catch(e) {}

      // Save scroll on unload
      window.addEventListener('beforeunload', function() {
        try { localStorage.setItem(SCROLL_KEY, String(window.scrollY)); } catch(e) {}
      });

      // Listen for real-time updates from parent
      window.addEventListener('message', function(e) {
        if (e.data && e.data.type === 'feio-reader-prefs') {
          applyPrefs(e.data.prefs);
        }
      });
    })();
  </script>
</body>
</html>`;
}
