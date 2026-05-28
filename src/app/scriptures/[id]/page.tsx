import { notFound } from "next/navigation";
import Link from "next/link";
import { SACRED_TEXTS, getTextVerses, getSacredText } from "@/lib/sacred-texts";
import VerseCard from "@/components/VerseCard";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return SACRED_TEXTS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const text = getSacredText(id);
  if (!text) return {};
  return {
    title: `${text.title} — FEIO Sacred Texts`,
    description: text.description,
  };
}

export default async function ScripturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const text = getSacredText(id);
  if (!text) notFound();

  const verses = getTextVerses(id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-6">
        <Link href="/scriptures" className="link-underline hover:text-gold">
          Sacred Texts
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{text.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{text.icon}</span>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
              {text.title}
            </h1>
            <p className="text-gold/70 text-sm">{text.titleHi}</p>
          </div>
        </div>

        <p className="text-muted text-base leading-relaxed mt-4 max-w-2xl">
          {text.description}
        </p>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
            {text.language}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
            {text.period}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
            {text.totalChapters} chapters · {text.totalVerses.toLocaleString()} verses
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
            {text.traditionLabel}
          </div>
        </div>
      </div>

      {/* Verses */}
      {verses.length > 0 ? (
        <div>
          <h2 className="font-serif text-xl text-charcoal mb-6 flex items-center gap-2">
            <span className="w-8 h-px bg-gold/30" />
            Selected Verses
            <span className="w-8 h-px bg-gold/30" />
          </h2>

          <div className="space-y-6">
            {verses.map((verse, i) => (
              <VerseCard key={`${verse.chapter}-${verse.verse}`} verse={verse} index={i} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-muted text-lg mb-2">Verses coming soon</p>
          <p className="text-muted/60 text-sm">
            We&apos;re carefully adding verses from this scripture with authentic translations and commentary.
          </p>
        </div>
      )}

      {/* Related */}
      <div className="mt-12 pt-8 border-t border-gold/10">
        <h3 className="font-serif text-lg text-charcoal mb-4">Explore Other Texts</h3>
        <div className="flex flex-wrap gap-2">
          {SACRED_TEXTS.filter((t) => t.id !== id)
            .slice(0, 6)
            .map((t) => (
              <Link
                key={t.id}
                href={`/scriptures/${t.id}`}
                className="px-3 py-1.5 text-sm bg-paper border border-charcoal/8 rounded-full hover:border-gold/30 hover:text-gold transition-colors"
              >
                {t.icon} {t.title}
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
