import Link from "next/link";
import { SPIRITUAL_TEACHINGS } from "@/lib/spiritual-content";

export const metadata = {
  title: "Spiritual Teachings — FEIO",
  description: "Deep explorations of spiritual practices from all traditions — Yoga, the Eightfold Path, Contemplative Prayer, and more.",
};

export default function TeachingsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-widest text-gold bg-gold/10 rounded-full border border-gold/20">
          Deep Study
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-4 tracking-tight">
          Spiritual Teachings
        </h1>
        <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
          In-depth explorations of the world&apos;s great spiritual practices.
          Not just information — transformation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SPIRITUAL_TEACHINGS.map((teaching) => (
          <Link
            key={teaching.id}
            href={`/teachings/${teaching.id}`}
            className="group p-6 bg-paper border border-charcoal/8 rounded-xl hover:border-gold/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{teaching.icon}</span>
              <span className="text-xs font-medium text-gold/60 uppercase tracking-wider">
                {teaching.tradition}
              </span>
            </div>
            <h2 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors mb-2">
              {teaching.title}
            </h2>
            <p className="text-xs text-gold/50 mb-2">{teaching.titleHi}</p>
            <p className="text-sm text-muted leading-relaxed line-clamp-3">
              {teaching.summary}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
