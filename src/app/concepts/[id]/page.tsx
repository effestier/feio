import { notFound } from "next/navigation";
import Link from "next/link";
import { DHARMIC_CONCEPTS, getConceptById } from "@/lib/dharmic-concepts";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return DHARMIC_CONCEPTS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getConceptById(id);
  if (!concept) return {};
  return {
    title: `${concept.name} — FEIO Dharmic Concepts`,
    description: concept.definition,
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const concept = getConceptById(id);
  if (!concept) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-6">
        <Link href="/concepts" className="link-underline hover:text-gold">
          Dharmic Concepts
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{concept.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{concept.traditionEmoji}</span>
          <span className="text-sm text-muted">{concept.tradition}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-1">
          {concept.name}
        </h1>
        <p className="text-gold/60 text-lg">{concept.nameOriginal}</p>
      </div>

      {/* Definition */}
      <div className="p-5 bg-paper border border-gold/15 rounded-xl mb-8">
        <p className="text-charcoal text-lg leading-relaxed font-serif italic">
          {concept.definition}
        </p>
      </div>

      {/* Deeper Explanation */}
      <section className="mb-8">
        <h2 className="font-serif text-xl text-charcoal mb-3 flex items-center gap-2">
          <span className="w-6 h-px bg-gold/30" />
          Deeper Understanding
        </h2>
        <div className="text-muted leading-relaxed space-y-4">
          {concept.deeperExplanation.split(". ").reduce((acc: string[], sentence, i) => {
            const paraIndex = Math.floor(i / 3);
            if (!acc[paraIndex]) acc[paraIndex] = "";
            acc[paraIndex] += sentence + ". ";
            return acc;
          }, []).map((para, i) => (
            <p key={i}>{para.trim()}</p>
          ))}
        </div>
      </section>

      {/* Practical Application */}
      <section className="mb-8 p-5 bg-paper border border-charcoal/8 rounded-xl">
        <h2 className="font-serif text-lg text-charcoal mb-3 flex items-center gap-2">
          <span className="w-6 h-px bg-gold/30" />
          Practical Application
        </h2>
        <p className="text-muted leading-relaxed">{concept.practicalApplication}</p>
      </section>

      {/* Source Texts */}
      <section className="mb-8">
        <h2 className="font-serif text-lg text-charcoal mb-3">Source Texts</h2>
        <div className="flex flex-wrap gap-2">
          {concept.sourceTexts.map((text) => (
            <span
              key={text}
              className="px-3 py-1 text-sm bg-gold/10 text-gold rounded-full border border-gold/20"
            >
              {text}
            </span>
          ))}
        </div>
      </section>

      {/* Related Concepts */}
      {concept.relatedConcepts.length > 0 && (
        <section className="mb-8">
          <h2 className="font-serif text-lg text-charcoal mb-3">Related Concepts</h2>
          <div className="flex flex-wrap gap-2">
            {concept.relatedConcepts.map((relId) => {
              const related = DHARMIC_CONCEPTS.find((c) => c.id === relId);
              if (!related) return null;
              return (
                <Link
                  key={relId}
                  href={`/concepts/${relId}`}
                  className="px-3 py-1.5 text-sm bg-paper border border-charcoal/8 rounded-full hover:border-gold/30 hover:text-gold transition-colors"
                >
                  {related.traditionEmoji} {related.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Back link */}
      <div className="pt-6 border-t border-gold/10">
        <Link
          href="/concepts"
          className="text-sm text-gold hover:underline"
        >
          ← All Dharmic Concepts
        </Link>
      </div>
    </div>
  );
}
