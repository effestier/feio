import { notFound } from "next/navigation";
import Link from "next/link";
import { SPIRITUAL_TEACHINGS, getTeachingById } from "@/lib/spiritual-content";
import TeachingContent from "@/components/TeachingContent";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return SPIRITUAL_TEACHINGS.map((t) => ({ id: t.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teaching = getTeachingById(id);
  if (!teaching) return {};
  return {
    title: `${teaching.title} — FEIO Teachings`,
    description: teaching.summary,
  };
}

export default async function TeachingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const teaching = getTeachingById(id);
  if (!teaching) notFound();

  const related = SPIRITUAL_TEACHINGS.filter(
    (t) => t.id !== id && t.tradition === teaching.tradition
  );
  const otherRelated = SPIRITUAL_TEACHINGS.filter(
    (t) => t.id !== id && t.tradition !== teaching.tradition
  ).slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-6">
        <Link href="/teachings" className="link-underline hover:text-gold">
          Teachings
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{teaching.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{teaching.icon}</span>
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl text-charcoal">
              {teaching.title}
            </h1>
            <p className="text-gold/70 text-sm">{teaching.titleHi}</p>
          </div>
        </div>

        <p className="text-muted text-base leading-relaxed mt-4 max-w-2xl">
          {teaching.summary}
        </p>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
            {teaching.tradition}
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-gold/40" />
            {teaching.source}
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="bg-paper border border-charcoal/8 rounded-xl p-6 sm:p-8 mb-8">
        <TeachingContent content={teaching.content} />
      </article>

      {/* Related teachings */}
      {(related.length > 0 || otherRelated.length > 0) && (
        <div className="mt-8 pt-8 border-t border-gold/10">
          <h3 className="font-serif text-lg text-charcoal mb-4">
            Related Teachings
          </h3>
          <div className="flex flex-wrap gap-2">
            {[...related, ...otherRelated].slice(0, 6).map((t) => (
              <Link
                key={t.id}
                href={`/teachings/${t.id}`}
                className="px-3 py-1.5 text-sm bg-paper border border-charcoal/8 rounded-full hover:border-gold/30 hover:text-gold transition-colors"
              >
                {t.icon} {t.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
