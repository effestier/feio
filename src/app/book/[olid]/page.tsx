import { getBookDetail, searchBySubject, coverUrl } from "@/lib/openlibrary";
import { findGutenbergMatch, getReadUrl, getDownloadFormats } from "@/lib/gutenberg";
import { searchIA, getIAMetadata, getIAUrl, getIADownloadFormats, hasIAReadableText } from "@/lib/internetarchive";
import { searchSE } from "@/lib/standardebooks";
import type { BookDoc } from "@/lib/types";
import BookGrid from "@/components/BookGrid";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function BookPage({
  params,
}: {
  params: Promise<{ olid: string }>;
}) {
  const { olid } = await params;

  let book;
  try {
    book = await getBookDetail(olid);
  } catch {
    notFound();
  }

  const cover = coverUrl(book.covers?.[0], "L");
  const description =
    typeof book.description === "string"
      ? book.description
      : typeof book.description === "object" && book.description !== null
        ? (book.description as { value: string }).value
        : "";

  const subjects = book.subjects?.slice(0, 12) || [];
  const firstSubject = book.subjects?.[0] || "";

  // --- Multi-source lookup ---
  // 1. Gutenberg (best: in-browser reading via FEIO reader)
  let gMatch = null;
  try {
    gMatch = await findGutenbergMatch(book.title);
  } catch {}
  const hasRead = gMatch ? !!getReadUrl(gMatch) : false;
  const downloadFormats = gMatch ? getDownloadFormats(gMatch) : [];
  const gutenbergId = gMatch?.id;

  // 2. Internet Archive (fallback: EPUB/PDF downloads, read on IA)
  let iaBook: Awaited<ReturnType<typeof searchIA>>[0] | null = null;
  let iaMeta: Awaited<ReturnType<typeof getIAMetadata>> = null;
  if (!gutenbergId) {
    try {
      const iaResults = await searchIA(book.title, 5);
      // Fuzzy match by title
      const bTitle = book.title.toLowerCase();
      iaBook = iaResults.find((ia) => {
        const t = ia.title.toLowerCase();
        return t.includes(bTitle) || bTitle.includes(t) ||
          t.replace(/[^a-z0-9]/g, "").includes(bTitle.replace(/[^a-z0-9]/g, ""));
      }) || null;

      if (iaBook) {
        iaMeta = await getIAMetadata(iaBook.identifier);
      }
    } catch {}
  }

  // 3. Standard Ebooks (premium formatted editions)
  let seBook: Awaited<ReturnType<typeof searchSE>>[0] | null = null;
  try {
    const seResults = await searchSE(book.title);
    const bTitle = book.title.toLowerCase();
    seBook = seResults.find((se) => {
      const t = se.title.toLowerCase();
      return t.includes(bTitle) || bTitle.includes(t);
    }) || null;
  } catch {}

  // Build actions list
  const iaHasText = iaMeta ? hasIAReadableText(iaMeta) : false;
  const iaDownloads = iaMeta ? getIADownloadFormats(iaMeta) : [];
  const iaUrl = iaBook ? getIAUrl(iaBook.identifier) : null;

  // Related books — search by the book's primary subject keyword
  let related: BookDoc[] = [];
  if (firstSubject) {
    try {
      const res = await searchBySubject(firstSubject, 1, 10);
      related = res.docs
        .filter((w) => w.key !== `/works/${olid}`)
        .slice(0, 5);
    } catch {
      // ignore
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-10">
        {/* Left column */}
        <div className="space-y-5">
          {/* Book Cover */}
          <div className="w-[280px] mx-auto md:mx-0">
            <div className="relative aspect-[2/3] bg-cream-dark rounded-xl overflow-hidden shadow-lg">
              {book.covers?.[0] ? (
                <img
                  src={cover}
                  alt={book.title}
                  width={280}
                  height={420}
                  className="w-full h-full object-cover"
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted/30 text-sm text-center px-6">
                  {book.title}
                </div>
              )}
            </div>

            {/* Actions — always rendered to prevent layout shift */}
            <div className="mt-4 space-y-3">
              {/* Read on FEIO (Gutenberg) */}
              {gutenbergId && hasRead && (
                <Link
                  href={`/read/${gutenbergId}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-burgundy text-white rounded-lg font-medium text-sm hover:bg-burgundy-light transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Read on FEIO
                </Link>
              )}

              {/* Gutenberg downloads */}
              {gutenbergId && downloadFormats.length > 0 && (
                <div>
                  <p className="text-xs text-muted mb-2 uppercase tracking-wider">Download</p>
                  <div className="flex flex-wrap gap-2">
                    {downloadFormats.map(({ format, label }) => (
                      <a
                        key={format}
                        href={`/api/book/${gutenbergId}/download?format=${format}`}
                        className="px-3 py-1.5 text-xs font-medium bg-white border border-[#D4C5A9]/50 rounded-md hover:border-burgundy hover:text-burgundy transition-colors tracking-wider"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Internet Archive — read on FEIO (when text available) */}
              {!gutenbergId && iaHasText && iaBook && (
                <Link
                  href={`/read/ia/${iaBook.identifier}`}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-burgundy text-white rounded-lg font-medium text-sm hover:bg-burgundy-light transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Read on FEIO
                </Link>
              )}

              {/* Internet Archive — downloads (proxied through FEIO) */}
              {!gutenbergId && iaBook && iaDownloads.length > 0 && (
                <div>
                  <p className="text-xs text-muted mb-2 uppercase tracking-wider">Download</p>
                  <div className="flex flex-wrap gap-2">
                    {iaDownloads.map(({ format }) => (
                      <a
                        key={format}
                        href={`/api/ia/${iaBook.identifier}/download?format=${format}`}
                        className="px-3 py-1.5 text-xs font-medium bg-white border border-[#D4C5A9]/50 rounded-md hover:border-burgundy hover:text-burgundy transition-colors tracking-wider"
                      >
                        {format.toUpperCase()}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Internet Archive — link (when no readable text format) */}
              {!gutenbergId && !iaHasText && iaUrl && (
                <a
                  href={iaUrl}
                  target="_blank"
                  rel="noopener"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#EDE6DC] text-charcoal rounded-lg font-medium text-sm hover:bg-[#E0D5C4] transition-all hover:shadow-sm"
                >
                  View on Internet Archive
                </a>
              )}

              {/* Standard Ebooks — premium formatted */}
              {seBook && (
                <div>
                  <p className="text-xs text-[#B8860B] mb-2 uppercase tracking-wider font-medium">Premium Edition</p>
                  <a
                    href={seBook.url}
                    target="_blank"
                    rel="noopener"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-[#EDE6DC] text-charcoal rounded-lg font-medium text-sm hover:bg-[#E0D5C4] transition-all hover:shadow-sm"
                  >
                    Standard Ebooks
                    {seBook.epubUrl && <span className="text-xs text-charcoal/60 ml-1">(EPUB)</span>}
                  </a>
                </div>
              )}

              {/* Nothing available */}
              {!gutenbergId && !iaBook && !seBook && (
                <div className="text-center space-y-1">
                  <p className="text-xs text-muted/60 italic">
                    Full text not available
                  </p>
                  <p className="text-[10px] text-muted/40">
                    Only public domain books can be read for free
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal leading-tight">
              {book.title}
            </h1>
            {book.first_publish_date && (
              <p className="text-muted mt-2 text-sm">First published {book.first_publish_date}</p>
            )}
          </div>

          {description && (
            <div>
              <h2 className="font-serif text-lg text-charcoal mb-2">About</h2>
              <p className="text-charcoal/80 leading-relaxed">{description}</p>
            </div>
          )}

          {subjects.length > 0 && (
            <div>
              <h2 className="font-serif text-lg text-charcoal mb-2">Subjects</h2>
              <div className="flex flex-wrap gap-2">
                {subjects.map((subject) => (
                  <Link
                    key={subject}
                    href={`/browse/${encodeURIComponent(subject.toLowerCase().replace(/\s+/g, "_"))}`}
                    className="px-3 py-1 text-xs bg-white border border-[#D4C5A9]/40 rounded-full hover:border-burgundy/40 hover:text-burgundy transition-colors"
                  >
                    {subject}
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl text-charcoal mb-5">You might also enjoy</h2>
          <BookGrid books={related} />
        </section>
      )}
    </div>
  );
}
