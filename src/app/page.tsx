import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import CoverRow from "@/components/CoverRow";
import GenreGrid from "@/components/GenreGrid";
import Link from "next/link";
import { getTrending, getByGenre } from "@/lib/openlibrary";
import type { BookDoc } from "@/lib/types";

export const dynamic = "force-dynamic";

async function TrendingSection() {
  let trending: BookDoc[] = [];
  try {
    const res = await getTrending();
    trending = res.docs.filter((b) => b.cover_i);
  } catch {}
  if (!trending.length) return null;
  return <CoverRow books={trending} title="Trending Today" />;
}

async function PopularSection() {
  let popular: BookDoc[] = [];
  try {
    const res = await getByGenre("fiction", 20, 0, true);
    popular = res.books;
  } catch {}
  if (!popular.length) return null;
  return <CoverRow books={popular} title="Popular" seeAllHref="/browse/fiction" />;
}

async function SpiritualitySection() {
  let books: BookDoc[] = [];
  try {
    const res = await getByGenre("spirituality", 20, 0, true);
    books = res.books;
  } catch {}
  if (!books.length) return null;
  return <CoverRow books={books} title="Spirituality & Sacred Texts" seeAllHref="/browse/spirituality" />;
}

async function ScienceSection() {
  let books: BookDoc[] = [];
  try {
    const res = await getByGenre("science", 20, 0, true);
    books = res.books;
  } catch {}
  if (!books.length) return null;
  return <CoverRow books={books} title="Science" seeAllHref="/browse/science" />;
}

async function PhilosophySection() {
  let books: BookDoc[] = [];
  try {
    const res = await getByGenre("philosophy", 20, 0, true);
    books = res.books;
  } catch {}
  if (!books.length) return null;
  return <CoverRow books={books} title="Philosophy" seeAllHref="/browse/philosophy" />;
}

async function ReligionSection() {
  let books: BookDoc[] = [];
  try {
    const res = await getByGenre("religion", 20, 0, true);
    books = res.books;
  } catch {}
  if (!books.length) return null;
  return <CoverRow books={books} title="Religion & Faiths" seeAllHref="/browse/religion" />;
}

function CoverRowSkeleton({ title }: { title: string }) {
  return (
    <div>
      <h2 className="font-serif text-xl text-charcoal mb-4">{title}</h2>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[120px] sm:w-[140px]">
            <div className="aspect-[2/3] bg-cream-dark rounded-md animate-pulse" />
            <div className="h-3 bg-cream-dark rounded mt-1.5 animate-pulse w-3/4" />
            <div className="h-2 bg-cream-dark rounded mt-1 animate-pulse w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <section className="text-center py-16 sm:py-24">
        <div className="inline-block px-3 py-1 mb-6 text-xs font-medium uppercase tracking-widest text-burgundy bg-burgundy/8 rounded-full">
          Free &amp; Open Digital Library
        </div>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-charcoal mb-4 tracking-tight leading-none">
          Every book,<br />one search away.
        </h1>
        <p className="text-muted text-base sm:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Browse millions of books. Read classics for free. Download in any
          format. Share your own collection.
        </p>
        <div className="max-w-xl mx-auto">
          <SearchBar large />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-muted/60">
          <span>Try</span>
          <Link href="/search?q=bhagavad+gita" className="text-burgundy hover:underline">Bhagavad Gita</Link>
          <Link href="/search?q=upanishads" className="text-burgundy hover:underline">Upanishads</Link>
          <Link href="/search?q=dune" className="text-burgundy hover:underline">dune</Link>
          <Link href="/search?q=tolstoy" className="text-burgundy hover:underline">tolstoy</Link>
        </div>
      </section>

      {/* Trending */}
      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Trending Today" />}>
          <TrendingSection />
        </Suspense>
      </div>

      {/* Genres */}
      <section className="mb-14">
        <h2 className="font-serif text-xl text-charcoal mb-4">Browse by Genre</h2>
        <GenreGrid />
      </section>

      {/* Popular */}
      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Popular" />}>
          <PopularSection />
        </Suspense>
      </div>

      {/* Spirituality */}
      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Spirituality & Sacred Texts" />}>
          <SpiritualitySection />
        </Suspense>
      </div>

      {/* Religion */}
      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Religion & Faiths" />}>
          <ReligionSection />
        </Suspense>
      </div>

      {/* Science */}
      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Science" />}>
          <ScienceSection />
        </Suspense>
      </div>

      {/* Philosophy */}
      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Philosophy" />}>
          <PhilosophySection />
        </Suspense>
      </div>

      {/* Community CTA */}
      <section className="text-center py-14 bg-charcoal rounded-2xl px-6 mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl text-white mb-3">
          Have something to share?
        </h2>
        <p className="text-white/60 mb-6 max-w-md mx-auto text-sm">
          Upload your own books to the community library. PDF, EPUB, TXT, and
          MOBI supported.
        </p>
        <Link
          href="/upload"
          className="inline-block px-6 py-3 bg-burgundy text-white rounded-lg font-medium text-sm hover:bg-burgundy-light transition-colors"
        >
          Upload a Book
        </Link>
      </section>
    </div>
  );
}
