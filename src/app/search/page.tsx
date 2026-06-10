import { searchBooks } from "@/lib/openlibrary";
import type { BookDoc } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import BookGrid from "@/components/BookGrid";
import Link from "next/link";

export const dynamic = "force-dynamic";

const QUICK_SEARCHES = [
  { label: "Dune", q: "dune" },
  { label: "Pride & Prejudice", q: "pride and prejudice" },
  { label: "Moby Dick", q: "moby dick" },
  { label: "1984", q: "1984" },
  { label: "Great Gatsby", q: "great gatsby" },
  { label: "Jane Austen", q: "jane austen" },
];

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 20;

  let books: BookDoc[] = [];
  let total = 0;

  if (query) {
    try {
      const result = await searchBooks(query, page, limit);
      books = result.docs;
      total = result.numFound;
    } catch {
      // API error
    }
  }

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-8">
        <SearchBar defaultValue={query} />
      </div>

      {query ? (
        <>
          <div className="mb-6">
            <p className="text-sm text-[#6B5B45]">
              {total > 0 ? (
                <>
                  Showing {books.length} of{" "}
                  <span className="font-medium text-charcoal">{total.toLocaleString()}</span>{" "}
                  results for{" "}
                  <span className="text-charcoal font-medium">&ldquo;{query}&rdquo;</span>
                </>
              ) : (
                <>
                  No results for{" "}
                  <span className="text-charcoal font-medium">&ldquo;{query}&rdquo;</span>
                </>
              )}
            </p>
          </div>

          {total === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#EDE6DC] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#8B7355]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <h3 className="font-serif text-xl text-charcoal mb-2">No books found</h3>
              <p className="text-sm text-[#6B5B45] mb-4">
                Try a different search term or browse by genre
              </p>
              <Link
                href="/browse/fiction"
                className="text-sm text-burgundy hover:underline font-medium"
              >
                Browse genres →
              </Link>
            </div>
          )}

          <BookGrid books={books} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {page > 1 && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
                  className="px-3 py-1.5 text-sm border border-[#D4C5A9]/40 rounded-md hover:bg-[#EDE6DC] transition-colors text-[#6B5B45]"
                >
                  ← Previous
                </Link>
              )}
              <span className="text-sm text-[#8B7355] px-3">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
                  className="px-3 py-1.5 text-sm border border-[#D4C5A9]/40 rounded-md hover:bg-[#EDE6DC] transition-colors text-[#6B5B45]"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 max-w-md mx-auto">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#EDE6DC] flex items-center justify-center">
            <svg className="w-10 h-10 text-[#8B7355]/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl text-charcoal mb-3">
            Search millions of books
          </h2>
          <p className="text-sm text-[#6B5B45] mb-6 leading-relaxed">
            Find your next great read. Search by title, author, or topic across
            Open Library, Project Gutenberg, and Internet Archive.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-[#8B7355]/60 mr-1">Try:</span>
            {QUICK_SEARCHES.map((s) => (
              <Link
                key={s.q}
                href={`/search?q=${encodeURIComponent(s.q)}`}
                className="px-3 py-1.5 text-xs bg-white border border-[#D4C5A9]/40 rounded-full text-burgundy hover:bg-burgundy/5 hover:border-burgundy/30 transition-colors"
              >
                {s.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
