/**
 * Standard Ebooks integration
 * No JSON API — we scrape their clean HTML pages.
 * https://standardebooks.org
 */

export interface SEBook {
  title: string;
  author: string;
  url: string;
  coverUrl: string | null;
  description?: string;
  subjects?: string[];
  epubUrl?: string;
  kepubUrl?: string;
}

/**
 * Search Standard Ebooks by query.
 * Uses the OpenSearch-compatible ?query= parameter.
 */
export async function searchSE(query: string): Promise<SEBook[]> {
  try {
    const res = await fetch(
      `https://standardebooks.org/ebooks?query=${encodeURIComponent(query)}`,
      { next: { revalidate: 600 } }
    );
    if (!res.ok) return [];

    const html = await res.text();
    return parseSESearchResults(html);
  } catch {
    return [];
  }
}

/**
 * Parse SE search results HTML.
 * Each book is in an <li typeof="schema:Book"> inside an <ol>.
 */
function parseSESearchResults(html: string): SEBook[] {
  const books: SEBook[] = [];

  // Find the <ol> containing book entries
  const olMatch = html.match(/<ol[^>]*>([\s\S]*?)<\/ol>/i);
  if (!olMatch) return books;

  const olContent = olMatch[1];

  // Split by <li> entries
  const liRegex = /<li[^>]*typeof="schema:Book"[^>]*>([\s\S]*?)<\/li>/gi;
  let match;

  while ((match = liRegex.exec(olContent)) !== null) {
    const item = match[1];

    // URL + author from the first link: /ebooks/author/title
    const linkMatch = item.match(/href="(\/ebooks\/([a-z-]+)\/([a-z-]+))"/i);
    if (!linkMatch) continue;

    const url = linkMatch[1];
    const authorSlug = linkMatch[2];
    const author = authorSlug
      .split("-")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    // Cover image from <img src="/images/covers/...">
    const imgMatch = item.match(/src="(\/images\/covers\/[^"]+)"/i);
    const coverUrl = imgMatch ? `https://standardebooks.org${imgMatch[1]}` : null;

    // Title from the URL slug (most reliable): /ebooks/author/the-title-slug
    const titleSlug = linkMatch[3];
    let title = titleSlug
      .split("-")
      .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

    // Try to get a better title from <a> text (second link has the title)
    const allLinks = [...item.matchAll(/<a[^>]*href="[^"]*"[^>]*>([\s\S]*?)<\/a>/gi)];
    for (const lm of allLinks) {
      const text = lm[1].replace(/<[^>]+>/g, "").trim();
      if (text.length > 2 && text.length < 200) {
        title = text;
        break;
      }
    }
    if (!title) continue;

    books.push({
      title,
      author,
      url: `https://standardebooks.org${url}`,
      coverUrl,
    });
  }

  return books;
}

/**
 * Get full details for a Standard Ebooks book page.
 */
export async function getSEBookDetail(url: string): Promise<SEBook | null> {
  try {
    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) return null;

    const html = await res.text();

    // Title from <h1>
    const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const title = titleMatch ? stripHtml(titleMatch[1]).trim() : "";

    // Author
    const authorMatch = html.match(/<a[^>]*href="\/ebooks\/[^"]*"[^>]*>([^<]+)<\/a>\s*<\/p>/i);
    const author = authorMatch ? authorMatch[1].trim() : "Unknown";

    // Cover image from og:image or cover element
    const ogImg = html.match(/property="og:image"\s+content="([^"]*)"/i);
    const coverSrc = html.match(/src="(\/images\/covers\/[^"]*cover[^"]*\.(?:jpg|webp))"/i);
    const coverUrl = ogImg
      ? ogImg[1]
      : coverSrc
        ? `https://standardebooks.org${coverSrc[1]}`
        : null;

    // EPUB download links
    const epubMatch = html.match(/href="(\/ebooks\/[^"]*\.epub)"/i);
    const kepubMatch = html.match(/href="(\/ebooks\/[^"]*\.kepub\.epub)"/i);

    // Description from og:description
    const descMatch = html.match(/name="description"\s+content="([^"]*)"/i) ||
      html.match(/property="og:description"\s+content="([^"]*)"/i);
    const description = descMatch ? descMatch[1] : "";

    // Subjects from collection links
    const subjectMatches = [...html.matchAll(/href="\/collections\/[^"]*"[^>]*>([^<]+)<\/a>/gi)];
    const subjects = subjectMatches.map((m) => m[1].trim());

    return {
      title,
      author,
      url,
      coverUrl,
      description,
      subjects: subjects.length > 0 ? subjects : undefined,
      epubUrl: epubMatch ? `https://standardebooks.org${epubMatch[1]}` : undefined,
      kepubUrl: kepubMatch ? `https://standardebooks.org${kepubMatch[1]}` : undefined,
    };
  } catch {
    return null;
  }
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ");
}
