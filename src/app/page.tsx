import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import CoverRow from "@/components/CoverRow";
import GenreGrid from "@/components/GenreGrid";
import DailyVerse from "@/components/DailyVerse";
import Link from "next/link";
import { getTrending, getByGenre } from "@/lib/openlibrary";
import { SACRED_TEXTS } from "@/lib/sacred-texts";
import { SPIRITUAL_TEACHINGS, HERITAGE_SITES } from "@/lib/spiritual-content";
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
            <div className="aspect-[2/3] bg-paper rounded-md animate-pulse" />
            <div className="h-3 bg-paper rounded mt-1.5 animate-pulse w-3/4" />
            <div className="h-2 bg-paper rounded mt-1 animate-pulse w-1/2" />
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
        <div className="inline-block px-3 py-1 mb-6 text-xs font-medium uppercase tracking-widest text-gold bg-gold/10 rounded-full border border-gold/20">
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
          <Link href="/search?q=bhagavad+gita" className="text-gold hover:underline">Bhagavad Gita</Link>
          <Link href="/search?q=upanishads" className="text-gold hover:underline">Upanishads</Link>
          <Link href="/search?q=dune" className="text-gold hover:underline">dune</Link>
          <Link href="/search?q=tolstoy" className="text-gold hover:underline">tolstoy</Link>
        </div>

        {/* Daily Verse */}
        <div className="max-w-2xl mx-auto mt-10">
          <DailyVerse />
        </div>
      </section>

      {/* Trending */}
      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Trending Today" />}>
          <TrendingSection />
        </Suspense>
      </div>

      {/* Sacred Texts */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-xl text-charcoal">Sacred Texts</h2>
          <Link href="/scriptures" className="text-sm text-gold hover:underline">
            Explore all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {SACRED_TEXTS.slice(0, 4).map((text) => (
            <Link
              key={text.id}
              href={`/scriptures/${text.id}`}
              className="bg-paper border border-gold/10 rounded-xl p-5 flex flex-col gap-3 hover:border-gold/30 transition-colors group"
            >
              <span className="text-3xl">{text.icon}</span>
              <div>
                <p className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors leading-tight">{text.title}</p>
                <p className="text-xs text-muted mt-1 line-clamp-2">{text.description}</p>
              </div>
              <span className="text-[11px] text-gold/60 mt-auto">{text.traditionLabel}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Spirituality & Sacred Texts (books) */}
      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Spirituality & Sacred Texts" />}>
          <SpiritualitySection />
        </Suspense>
      </div>

      {/* Popular */}
      <div className="mb-14">
        <Suspense fallback={<CoverRowSkeleton title="Popular" />}>
          <PopularSection />
        </Suspense>
      </div>

      {/* Spiritual Teachings */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-xl text-charcoal">Spiritual Teachings</h2>
          <Link href="/teachings" className="text-sm text-gold hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {SPIRITUAL_TEACHINGS.slice(0, 3).map((t) => (
            <Link
              key={t.id}
              href={`/teachings/${t.id}`}
              className="bg-paper border border-gold/10 rounded-xl p-5 flex flex-col gap-3 hover:border-gold/30 transition-colors group"
            >
              <span className="text-3xl">{t.icon}</span>
              <div>
                <p className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors leading-tight">{t.title}</p>
                <p className="text-xs text-muted mt-1 line-clamp-3">{t.summary}</p>
              </div>
              <span className="text-[11px] text-gold/60 mt-auto">{t.tradition}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Religion & Faiths */}
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

      {/* Heritage Sites */}
      <section className="mb-14">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-serif text-xl text-charcoal">Heritage Sites</h2>
          <Link href="/heritage" className="text-sm text-gold hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {HERITAGE_SITES.slice(0, 3).map((site) => (
            <Link
              key={site.id}
              href={`/heritage/${site.id}`}
              className="bg-paper border border-gold/10 rounded-xl p-5 flex flex-col gap-2 hover:border-gold/30 transition-colors group"
            >
              <p className="text-sm font-medium text-charcoal group-hover:text-gold transition-colors">{site.name}</p>
              <p className="text-xs text-muted">{site.location}, {site.country}</p>
              <p className="text-xs text-muted line-clamp-2">{site.description}</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="text-[11px] text-gold/60">{site.tradition}</span>
                {site.unesco && (
                  <span className="text-[10px] px-1.5 py-0.5 bg-gold/10 text-gold rounded-full">UNESCO</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Community CTA */}
      <section className="text-center py-14 bg-cream-dark/60 border border-gold/10 rounded-2xl px-6 mb-8">
        <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3">
          Have something to share?
        </h2>
        <p className="text-muted mb-6 max-w-md mx-auto text-sm">
          Upload your own books to the community library. PDF, EPUB, TXT, and
          MOBI supported.
        </p>
        <Link
          href="/upload"
          className="inline-block px-6 py-3 bg-gold text-cream rounded-lg font-medium text-sm hover:bg-burgundy-light transition-colors"
        >
          Upload a Book
        </Link>
      </section>
    </div>
  );
}
