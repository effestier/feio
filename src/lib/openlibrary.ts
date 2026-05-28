import type { SearchResult, BookDetail, AuthorDetail, SubjectResponse, BookDoc } from "./types";
import { GENRE_SEARCH_TERMS } from "./types";

const BASE = "https://openlibrary.org";
const COVERS = "https://covers.openlibrary.org/b";
const FIELDS = "key,title,author_name,first_publish_year,cover_i,subject,language,ratings_average,ratings_count,ia";

export function coverUrl(coverId: number | undefined, size: "S" | "M" | "L" = "M"): string {
  if (!coverId) return "/placeholder.svg";
  return `${COVERS}/id/${coverId}-${size}.jpg`;
}

export function coverUrlByKey(coverKey: string | undefined, size: "S" | "M" | "L" = "M"): string {
  if (!coverKey) return "/placeholder.svg";
  return `${COVERS}/b/olid/${coverKey}-${size}.jpg`;
}

export function workUrl(key: string): string {
  return `https://openlibrary.org${key}`;
}

export async function searchBooks(query: string, page = 1, limit = 20): Promise<SearchResult> {
  const offset = (page - 1) * limit;
  const res = await fetch(
    `${BASE}/search.json?q=${encodeURIComponent(query)}&language=eng&limit=${limit}&offset=${offset}&fields=${FIELDS}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

export async function getBookDetail(olid: string): Promise<BookDetail> {
  const res = await fetch(`${BASE}/works/${olid}.json`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("Book not found");
  return res.json();
}

export async function getAuthorDetail(key: string): Promise<AuthorDetail> {
  const res = await fetch(`${BASE}${key}.json`, {
    next: { revalidate: 600 },
  });
  if (!res.ok) throw new Error("Author not found");
  return res.json();
}

export async function getTrending(): Promise<SearchResult> {
  const res = await fetch(`${BASE}/trending/daily.json?limit=20`, {
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error("Trending fetch failed");
  const data = await res.json();
  return { numFound: data.works?.length ?? 0, start: 0, numFoundExact: true, docs: data.works ?? [] };
}

export async function getBySubject(subject: string, page = 1, limit = 20): Promise<SubjectResponse> {
  const offset = (page - 1) * limit;
  const res = await fetch(
    `${BASE}/subjects/${subject}.json?limit=${limit}&offset=${offset}&language=eng`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error("Subject fetch failed");
  return res.json();
}

export async function searchBySubject(query: string, page = 1, limit = 20): Promise<SearchResult> {
  const offset = (page - 1) * limit;
  const res = await fetch(
    `${BASE}/search.json?subject=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}&fields=${FIELDS}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error("Subject search failed");
  return res.json();
}

/**
 * Fetch books by genre using search.json?subject=keyword queries.
 * Searches multiple genre-specific keywords in parallel, merges and deduplicates.
 * Returns books WITH covers first, then those without.
 */
export async function getByGenre(genreSlug: string, limit = 20, offset = 0): Promise<{ books: BookDoc[]; hasMore: boolean }> {
  const keywords = GENRE_SEARCH_TERMS[genreSlug];
  if (!keywords || keywords.length === 0) return { books: [], hasMore: false };

  // Fetch enough to cover offset + limit + buffer for dedup
  const totalNeeded = offset + limit + 10;
  const perKeyword = Math.ceil(totalNeeded / keywords.length) + 3;

  // Fire all keyword searches in parallel
  const results = await Promise.allSettled(
    keywords.map((kw) =>
      fetch(
        `${BASE}/search.json?subject=${encodeURIComponent(kw)}&language=eng&limit=${perKeyword}&fields=${FIELDS}`,
        { next: { revalidate: 300 } }
      ).then((r) => r.json() as Promise<SearchResult>)
    )
  );

  // Merge and deduplicate by key
  const seen = new Set<string>();
  const merged: BookDoc[] = [];

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const doc of result.value.docs) {
      if (!seen.has(doc.key)) {
        seen.add(doc.key);
        merged.push(doc);
      }
    }
  }

  // Prefer books with covers
  const withCover = merged.filter((b) => b.cover_i);
  const withoutCover = merged.filter((b) => !b.cover_i);
  const sorted = [...withCover, ...withoutCover];

  const books = sorted.slice(offset, offset + limit);
  const hasMore = sorted.length > offset + limit;
  return { books, hasMore };
}
