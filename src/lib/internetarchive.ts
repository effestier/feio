/**
 * Internet Archive API integration
 * Docs: https://archive.org/developers/internetarchive/
 */

export interface IABook {
  identifier: string;
  title: string;
  creator?: string;
  subject?: string[];
  description?: string;
  language?: string;
  downloads?: number;
}

export interface IAMetadata {
  metadata: {
    identifier: string;
    title: string;
    creator?: string;
    subject?: string | string[];
    description?: string;
    language?: string | string[];
    imagecount?: string;
  };
  files: IAFile[];
}

export interface IAFile {
  name: string;
  format: string;
  size?: string;
  length?: string;
}

/**
 * Search Internet Archive for books by query.
 */
export async function searchIA(query: string, limit = 10): Promise<IABook[]> {
  const params = new URLSearchParams({
    q: `${query} AND mediatype:texts AND language:eng AND -collection:inlibrary AND -collection:printdisabled`,
    "fl[]": "identifier,title,creator,subject,downloads",
    "sort[]": "downloads desc",
    rows: String(limit),
    output: "json",
  });

  const res = await fetch(
    `https://archive.org/advancedsearch.php?${params}`,
    { next: { revalidate: 600 } }
  );
  if (!res.ok) return [];

  const data = await res.json();
  return (data.response?.docs || []).map((doc: Record<string, unknown>) => ({
    identifier: doc.identifier,
    title: doc.title,
    creator: doc.creator || undefined,
    subject: Array.isArray(doc.subject) ? doc.subject : doc.subject ? [doc.subject as string] : [],
    downloads: doc.downloads || 0,
  }));
}

/**
 * Search Internet Archive by subject/genre.
 */
export async function searchIABySubject(subject: string, limit = 10): Promise<IABook[]> {
  const params = new URLSearchParams({
    q: `subject:${subject} AND mediatype:texts AND language:eng AND format:EPUB AND -collection:inlibrary AND -collection:printdisabled`,
    "fl[]": "identifier,title,creator,subject,downloads",
    "sort[]": "downloads desc",
    rows: String(limit),
    output: "json",
  });

  const res = await fetch(
    `https://archive.org/advancedsearch.php?${params}`,
    { next: { revalidate: 600 } }
  );
  if (!res.ok) return [];

  const data = await res.json();
  return (data.response?.docs || []).map((doc: Record<string, unknown>) => ({
    identifier: doc.identifier,
    title: doc.title,
    creator: doc.creator || undefined,
    subject: Array.isArray(doc.subject) ? doc.subject : doc.subject ? [doc.subject as string] : [],
    downloads: doc.downloads || 0,
  }));
}

/**
 * Get full metadata for an IA item including file list.
 */
export async function getIAMetadata(identifier: string): Promise<IAMetadata | null> {
  const res = await fetch(
    `https://archive.org/metadata/${encodeURIComponent(identifier)}`,
    { next: { revalidate: 600 } }
  );
  if (!res.ok) return null;
  return res.json();
}

/**
 * Get the cover image URL for an IA item.
 */
export function getIACoverUrl(identifier: string): string {
  return `https://archive.org/services/img/${encodeURIComponent(identifier)}`;
}

/**
 * Get the IA page URL for an item.
 */
export function getIAUrl(identifier: string): string {
  return `https://archive.org/details/${encodeURIComponent(identifier)}`;
}

/**
 * Find readable formats (HTML, text) from IA metadata.
 */
export function getIAReadUrl(meta: IAMetadata): string | null {
  const id = meta.metadata.identifier;
  // Use the BookReader (stream) URL — renders in-browser, no auth needed for public items
  return `https://archive.org/details/${id}`;
}

/**
 * Check if an IA item has readable text (HTML or Plain Text).
 */
export function hasIAReadableText(meta: IAMetadata): boolean {
  return meta.files.some(
    (f) =>
      f.format === "HTML" ||
      f.format === "Plain Text" ||
      f.format === "DjVuTXT"
  );
}

/**
 * Get downloadable formats from IA metadata.
 */
export function getIADownloadFormats(meta: IAMetadata): { format: string; label: string; url: string }[] {
  const result: { format: string; label: string; url: string }[] = [];
  const id = meta.metadata.identifier;
  const base = `https://archive.org/download/${encodeURIComponent(id)}`;

  const epub = meta.files.find((f) => f.format === "EPUB");
  if (epub) result.push({ format: "epub", label: "EPUB", url: `${base}/${epub.name}` });

  const pdf = meta.files.find((f) => f.format === "Text PDF");
  if (pdf) result.push({ format: "pdf", label: "PDF", url: `${base}/${pdf.name}` });

  const txt = meta.files.find((f) => f.format === "Plain Text");
  if (txt) result.push({ format: "txt", label: "TXT", url: `${base}/${txt.name}` });

  const kindle = meta.files.find((f) => f.format === "Kindle");
  if (kindle) result.push({ format: "kindle", label: "Kindle", url: `${base}/${kindle.name}` });

  return result;
}
