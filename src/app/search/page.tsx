import { searchBooks } from "@/lib/openlibrary";
import type { BookDoc } from "@/lib/types";
import SearchBar from "@/components/SearchBar";
import BookGrid from "@/components/BookGrid";
import Link from "next/link";

export const dynamic = "force-dynamic";

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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <SearchBar defaultValue={query} />
      </div>

      {query && (
        <div className="mb-6">
          <p className="text-sm text-muted">
            {total > 0 ? (
              <>
                Showing {books.length} of {total.toLocaleString()} results for{" "}
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
      )}

      {!query && (
        <div className="text-center py-16">
          <p className="text-muted text-lg">Type something to start searching</p>
          <p className="text-muted text-sm mt-1">Try &ldquo;dune&rdquo;, &ldquo;tolstoy&rdquo;, or &ldquo;quantum physics&rdquo;</p>
        </div>
      )}

      <BookGrid books={books} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {page > 1 && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${page - 1}`}
              className="px-3 py-1.5 text-sm border border-charcoal/15 rounded-md hover:bg-white transition-colors"
            >
              Previous
            </Link>
          )}
          <span className="text-sm text-muted px-3">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={`/search?q=${encodeURIComponent(query)}&page=${page + 1}`}
              className="px-3 py-1.5 text-sm border border-charcoal/15 rounded-md hover:bg-white transition-colors"
            >
              Next
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
