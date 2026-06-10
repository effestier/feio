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
  return <CoverRow books={popular} title="Popular Fiction" seeAllHref="/browse/fiction" />;
}

async function MysterySection() {
  let books: BookDoc[] = [];
  try {
    const res = await getByGenre("mystery", 20, 0, true);
    books = res.books;
  } catch {}
  if (!books.length) return null;
  return <CoverRow books={books} title="Mystery & Thriller" seeAllHref="/browse/mystery" />;
}

async function FantasySection() {
  let books: BookDoc[] = [];
  try {
    const res = await getByGenre("fantasy", 20, 0, true);
    books = res.books;
  } catch {}
  if (!books.length) return null;
  return <CoverRow books={books} title="Fantasy" seeAllHref="/browse/fantasy" />;
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

async function HistorySection() {
  let books: BookDoc[] = [];
  try {
    const res = await getByGenre("history", 20, 0, true);
    books = res.books;
  } catch {}
  if (!books.length) return null;
  return <CoverRow books={books} title="History" seeAllHref="/browse/history" />;
}

async function SciFiSection() {
  let books: BookDoc[] = [];
  try {
    const res = await getByGenre("science_fiction", 20, 0, true);
    books = res.books;
  } catch {}
  if (!books.length) return null;
  return <CoverRow books={books} title="Science Fiction" seeAllHref="/browse/science_fiction" />;
}

async function RomanceSection() {
  let books: BookDoc[] = [];
  try {
    const res = await getByGenre("romance", 20, 0, true);
    books = res.books;
  } catch {}
  if (!books.length) return null;
  return <CoverRow books={books} title="Romance" seeAllHref="/browse/romance" />;
}

function CoverRowSkeleton({ title }: { title: string }) {
  return (
    <div>
      <h2 className="font-serif text-xl text-charcoal mb-4">{title}</h2>
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-[120px] sm:w-[140px]">
            <div className="aspect-[2/3] bg-[#E8DCCC] rounded-md animate-pulse" />
            <div className="h-3 bg-[#E8DCCC] rounded mt-1.5 animate-pulse w-3/4" />
            <div className="h-2 bg-[#E8DCCC] rounded mt-1 animate-pulse w-1/2" />
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
      <section className="text-center py-16 sm:py-24 animate-fadeIn relative">
        {/* Decorative book-end lines */}
        <div className="absolute top-20 left-8 hidden lg:block w-px h-32 bg-gradient-to-b from-burgundy/20 to-transparent" />
        <div className="absolute top-20 right-8 hidden lg:block w-px h-32 bg-gradient-to-b from-burgundy/20 to-transparent" />

        <div className="inline-block px-4 py-1 mb-6 text-xs font-medium uppercase tracking-[0.15em] text-burgundy bg-burgundy/8 rounded-full border border-burgundy/20 animate-slideUp">
          ✦ Free &amp; Open Digital Library
        </div>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl text-charcoal mb-4 tracking-tight leading-[1.05] animate-slideUp">
          Discover Timeless
          <br />
          <span className="bg-gradient-to-r from-burgundy to-[#A84C3E] bg-clip-text text-transparent">
            Books, Boundless
          </span>{" "}
          Knowledge
        </h1>
        <p className="text-[#6B5B45] text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed animate-slideUp">
          Browse millions of free books from Project Gutenberg, Internet
          Archive, and Open Library. Read classics in your browser or download
          in any format.
        </p>
        <div className="max-w-xl mx-auto animate-slideUp">
          <SearchBar large />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-sm text-[#8B7355]/70 animate-slideUp">
          <span className="text-xs uppercase tracking-wider text-[#8B7355]/50">Popular</span>
          <Link href="/search?q=dune" className="text-burgundy hover:underline font-medium transition-colors">
            Dune
          </Link>
          <span className="text-[#D4C5A9]">·</span>
          <Link href="/search?q=pride+and+prejudice" className="text-burgundy hover:underline font-medium transition-colors">
            Pride &amp; Prejudice
          </Link>
          <span className="text-[#D4C5A9]">·</span>
          <Link href="/search?q=tolstoy" className="text-burgundy hover:underline font-medium transition-colors">
            Tolstoy
          </Link>
          <span className="text-[#D4C5A9]">·</span>
          <Link href="/search?q=1984" className="text-burgundy hover:underline font-medium transition-colors">
            1984
          </Link>
          <span className="text-[#D4C5A9]">·</span>
          <Link href="/search?q=moby+dick" className="text-burgundy hover:underline font-medium transition-colors">
            Moby Dick
          </Link>
        </div>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-8 sm:gap-12 mt-12 pt-8 border-t border-[#D4C5A9]/20 max-w-md mx-auto">
          {[
            { value: "7M+", label: "Books" },
            { value: "100K+", label: "Authors" },
            { value: "Free", label: "To Read" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-2xl sm:text-3xl text-burgundy font-bold">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-widest text-[#8B7355]/60 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Genres Quick Browse */}
      <section className="mb-14 animate-slideUp">
        <div className="flex items-baseline justify-between mb-6">
          <div>
            <h2 className="font-serif text-xl text-charcoal">Browse by Genre</h2>
            <p className="text-xs text-[#8B7355]/60 mt-0.5">Explore thousands of books in every category</p>
          </div>
          <Link href="/browse/fiction" className="text-sm text-burgundy hover:underline font-medium transition-colors">
            View all genres →
          </Link>
        </div>
        <GenreGrid />
      </section>

      {/* Book Sections - each suspended independently for progressive loading */}
      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Trending Today" />}>
          <TrendingSection />
        </Suspense>
      </div>

      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Popular Fiction" />}>
          <PopularSection />
        </Suspense>
      </div>

      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Mystery & Thriller" />}>
          <MysterySection />
        </Suspense>
      </div>

      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Fantasy" />}>
          <FantasySection />
        </Suspense>
      </div>

      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Science" />}>
          <ScienceSection />
        </Suspense>
      </div>

      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="History" />}>
          <HistorySection />
        </Suspense>
      </div>

      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Science Fiction" />}>
          <SciFiSection />
        </Suspense>
      </div>

      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Romance" />}>
          <RomanceSection />
        </Suspense>
      </div>

      {/* Community CTA */}
      <section className="text-center py-14 sm:py-16 bg-gradient-to-br from-[#EDE6DC] to-[#F5F0E8] border border-[#D4C5A9]/30 rounded-2xl px-6 mb-8 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-burgundy/[0.03]" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-[#B8860B]/[0.03]" />

        <div className="max-w-md mx-auto relative">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-burgundy/10 mb-4">
            <svg className="w-6 h-6 text-burgundy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3">
            Have a book to share?
          </h2>
          <p className="text-[#6B5B45] mb-6 max-w-sm mx-auto text-sm leading-relaxed">
            Upload your own books to the community library. PDF, EPUB, TXT, and
            MOBI supported. Every book adds to the world&apos;s knowledge.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/upload"
              className="inline-block px-6 py-3 bg-burgundy text-white rounded-lg font-medium text-sm hover:bg-burgundy-light transition-all shadow-sm hover:shadow-md"
            >
              Upload a Book
            </Link>
            <Link
              href="/library"
              className="inline-block px-6 py-3 bg-white text-charcoal rounded-lg font-medium text-sm hover:bg-[#EDE6DC] transition-colors border border-[#D4C5A9]/40"
            >
              Browse Library
            </Link>
          </div>
        </div>
      </section>

      {/* Powered by */}
      <div className="text-center pb-6">
        <p className="text-xs text-[#8B7355]/50">
          Powered by{" "}
          <a href="https://openlibrary.org" target="_blank" rel="noopener noreferrer" className="text-burgundy/60 hover:text-burgundy transition-colors">Open Library</a>
          ,{" "}
          <a href="https://www.gutenberg.org" target="_blank" rel="noopener noreferrer" className="text-burgundy/60 hover:text-burgundy transition-colors">Project Gutenberg</a>
          , and{" "}
          <a href="https://archive.org" target="_blank" rel="noopener noreferrer" className="text-burgundy/60 hover:text-burgundy transition-colors">Internet Archive</a>
        </p>
      </div>
    </div>
  );
}
