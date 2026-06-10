import { getByGenre } from "@/lib/openlibrary";
import type { BookDoc } from "@/lib/types";
import BookGridLoadable from "@/components/BookGridLoadable";
import Link from "next/link";
import { GENRES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function BrowsePage({
  params,
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject } = await params;
  const decoded = decodeURIComponent(subject);
  const label = GENRES.find((g) => g.slug === decoded)?.label || decoded.replace(/_/g, " ");

  let books: BookDoc[] = [];

  try {
    const result = await getByGenre(decoded, 40);
    books = result.books;
  } catch {
    // API error
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Subject nav */}
      <div className="flex gap-2 overflow-x-auto scroll-row pb-4 mb-6">
        {GENRES.map((genre) => (
          <Link
            key={genre.slug}
            href={`/browse/${genre.slug}`}
            className={`flex-shrink-0 px-3 py-1.5 text-sm rounded-full border transition-colors ${
              genre.slug === decoded
                ? "bg-burgundy text-white border-burgundy"
                : "bg-paper border-[#D4C5A9]/40 text-[#6B5B45] hover:text-charcoal hover:border-[#B8860B]/50"
            }`}
          >
            {genre.emoji} {genre.label}
          </Link>
        ))}
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl text-charcoal capitalize">{label}</h1>
        <p className="text-sm text-muted mt-1">
          {books.length} book{books.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <BookGridLoadable initialBooks={books} genre={decoded} />
    </div>
  );
}
