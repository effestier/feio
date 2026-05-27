const BASE = "https://gutendex.com";

export interface GutenbergBook {
  id: number;
  title: string;
  authors: { name: string; birth_year?: number; death_year?: number }[];
  translators: { name: string; birth_year?: number; death_year?: number }[];
  subjects: string[];
  bookshelves: string[];
  languages: string[];
  copyright: boolean;
  media_type: string;
  formats: Record<string, string>;
  download_count: number;
}

export interface GutenbergSearchResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: GutenbergBook[];
}

export async function searchGutenberg(
  query: string,
  page: number = 1
): Promise<GutenbergSearchResponse> {
  const res = await fetch(`${BASE}/books/?search=${encodeURIComponent(query)}&page=${page}`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("Gutenberg search failed");
  return res.json();
}

export async function getGutenbergBook(id: number): Promise<GutenbergBook> {
  const res = await fetch(`${BASE}/books/${id}`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("Book not found on Gutenberg");
  return res.json();
}

export function getReadUrl(book: GutenbergBook): string | null {
  // Prefer HTML for in-browser reading
  return book.formats["text/html"] || book.formats["text/html; charset=utf-8"] || null;
}

export function getDownloadFormats(book: GutenbergBook): { format: string; label: string }[] {
  const result: { format: string; label: string }[] = [];

  // PDF = generated from HTML via browser print
  const hasHtml = !!(book.formats["text/html"] || book.formats["text/html; charset=utf-8"]);
  if (hasHtml) {
    result.push({ format: "pdf", label: "PDF" });
  }

  // TXT = plain text download
  const hasTxt = !!(book.formats["text/plain; charset=utf-8"] || book.formats["text/plain"]);
  if (hasTxt) {
    result.push({ format: "txt", label: "TXT" });
  }

  return result;
}

export async function getPopularGutenberg(): Promise<GutenbergBook[]> {
  const res = await fetch(`${BASE}/books/?sort=popular&languages=en`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

export async function getGutenbergBySubject(subject: string): Promise<GutenbergBook[]> {
  const res = await fetch(`${BASE}/books/?topic=${encodeURIComponent(subject)}&languages=en`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

export function gutenbergCoverUrl(book: GutenbergBook): string | null {
  return book.formats["image/jpeg"] || null;
}

/**
 * Normalize a title for fuzzy matching:
 * - lowercase
 * - remove punctuation, special chars
 * - remove articles (the, a, an)
 * - collapse whitespace
 */
function normalizeTitle(t: string): string {
  return t
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\b(the|a|an)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Check if two titles are a fuzzy match.
 * Handles: "Pride & Prejudice" vs "Pride and Prejudice",
 *          "The Great Gatsby" vs "Great Gatsby",
 *          "Dune (Dune Chronicles, #1)" vs "Dune"
 */
export function titlesMatch(a: string, b: string): boolean {
  const na = normalizeTitle(a);
  const nb = normalizeTitle(b);

  // Exact match after normalization
  if (na === nb) return true;

  // One contains the other
  if (na.includes(nb) || nb.includes(na)) return true;

  // Check if shorter title is at least 80% of the longer one
  const shorter = na.length < nb.length ? na : nb;
  const longer = na.length < nb.length ? nb : na;
  if (shorter.length > 4 && longer.startsWith(shorter)) return true;

  return false;
}

/**
 * Find the best Gutenberg match for a given book title.
 * Searches page 1, normalizes titles for fuzzy matching.
 * Returns the matching GutenbergBook or null.
 */
export async function findGutenbergMatch(title: string): Promise<GutenbergBook | null> {
  // Try direct title search
  const res = await searchGutenberg(title, 1);
  const match = res.results.find((g) => titlesMatch(g.title, title));
  if (match) return match;

  // Try simplified title (remove subtitles, parentheticals)
  const simplified = title.replace(/[:\(].*$/g, "").trim();
  if (simplified !== title && simplified.length > 3) {
    const res2 = await searchGutenberg(simplified, 1);
    const match2 = res2.results.find((g) => titlesMatch(g.title, title) || titlesMatch(g.title, simplified));
    if (match2) return match2;
  }

  return null;
}
