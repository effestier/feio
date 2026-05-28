import Link from "next/link";
import { SACRED_TEXTS } from "@/lib/sacred-texts";
import { TRADITIONS } from "@/lib/sacred-types";
import type { TraditionId } from "@/lib/sacred-types";

export const metadata = {
  title: "Sacred Texts — FEIO",
  description: "Explore the world's great scriptures. Bhagavad Gita, Quran, Bible, Torah, Dhammapada, Guru Granth Sahib, Tao Te Ching, and more.",
};

export default function ScripturesPage() {
  const grouped = TRADITIONS.map((t) => ({
    ...t,
    texts: SACRED_TEXTS.filter((s) => s.tradition === t.id),
  })).filter((g) => g.texts.length > 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-widest text-gold bg-gold/10 rounded-full border border-gold/20">
          Sacred Literature
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-4 tracking-tight">
          The World&apos;s Sacred Texts
        </h1>
        <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
          Explore the scriptures that have shaped civilizations, guided billions,
          and illuminated the path to the Divine for millennia. Every tradition,
          every voice, one search for truth.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12 max-w-md mx-auto">
        <div className="text-center">
          <p className="font-serif text-2xl text-gold">{SACRED_TEXTS.length}</p>
          <p className="text-xs text-muted">Scriptures</p>
        </div>
        <div className="text-center">
          <p className="font-serif text-2xl text-gold">{TRADITIONS.length}</p>
          <p className="text-xs text-muted">Traditions</p>
        </div>
        <div className="text-center">
          <p className="font-serif text-2xl text-gold">5000+</p>
          <p className="text-xs text-muted">Years of Wisdom</p>
        </div>
      </div>

      {/* By Tradition */}
      {grouped.map((group) => (
        <section key={group.id} className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl">{group.emoji}</span>
            <h2 className="font-serif text-2xl text-charcoal">{group.label}</h2>
            <div className="flex-1 h-px bg-gold/10" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.texts.map((text) => (
              <Link
                key={text.id}
                href={`/scriptures/${text.id}`}
                className="group p-5 bg-paper border border-charcoal/8 rounded-xl hover:border-gold/30 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-2xl mt-0.5">{text.icon}</span>
                  <div>
                    <h3 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors">
                      {text.title}
                    </h3>
                    <p className="text-xs text-gold/70 font-sans">{text.titleHi}</p>
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-3">
                  {text.description}
                </p>
                <div className="flex items-center gap-4 text-xs text-muted/60">
                  <span>{text.language}</span>
                  <span>·</span>
                  <span>{text.period}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {/* Bottom note */}
      <div className="text-center py-8 border-t border-gold/10">
        <p className="text-sm text-muted/60 max-w-lg mx-auto">
          All texts are presented with respect and reverence for their traditions.
          Content is sourced from public domain translations and scholarly editions.
        </p>
      </div>
    </div>
  );
}
