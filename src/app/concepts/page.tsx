import Link from "next/link";
import { DHARMIC_CONCEPTS } from "@/lib/dharmic-concepts";

export const metadata = {
  title: "Dharmic Concepts — FEIO",
  description: "Explore the fundamental concepts of world religions — Dharma, Karma, Nirvana, Tawhid, Grace, Wu Wei, and more.",
};

export default function ConceptsPage() {
  const traditions = [...new Set(DHARMIC_CONCEPTS.map((c) => c.tradition))];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-widest text-gold bg-gold/10 rounded-full border border-gold/20">
          Spiritual Knowledge
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-4 tracking-tight">
          Dharmic Concepts
        </h1>
        <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
          The foundational ideas that have shaped human spiritual understanding
          for millennia. From every tradition, a deeper look at the truths that
          guide billions.
        </p>
      </div>

      {traditions.map((tradition) => {
        const concepts = DHARMIC_CONCEPTS.filter((c) => c.tradition === tradition);
        const emoji = concepts[0]?.traditionEmoji || "🙏";
        return (
          <section key={tradition} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-2xl">{emoji}</span>
              <h2 className="font-serif text-2xl text-charcoal">{tradition}</h2>
              <div className="flex-1 h-px bg-gold/10" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {concepts.map((concept) => (
                <Link
                  key={concept.id}
                  href={`/concepts/${concept.id}`}
                  className="group p-5 bg-paper border border-charcoal/8 rounded-xl hover:border-gold/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors">
                        {concept.name}
                      </h3>
                      <p className="text-xs text-gold/60">{concept.nameOriginal}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted leading-relaxed line-clamp-3">
                    {concept.definition}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
