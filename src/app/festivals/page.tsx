import { SPIRITUAL_FESTIVALS } from "@/lib/spiritual-content";

export const metadata = {
  title: "Festivals — FEIO",
  description:
    "A spiritual calendar of the world's great festivals. Diwali, Easter, Ramadan, Vesak, Passover, and more.",
};

export default function FestivalsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-widest text-gold bg-gold/10 rounded-full border border-gold/20">
          Sacred Calendar
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-4 tracking-tight">
          Spiritual Festivals
        </h1>
        <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
          The great celebrations that mark the rhythms of the spiritual year.
          Festivals of light, fasting, renewal, and devotion — observed by
          billions across every tradition.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-12 max-w-md mx-auto">
        <div className="text-center">
          <p className="font-serif text-2xl text-gold">
            {SPIRITUAL_FESTIVALS.length}
          </p>
          <p className="text-xs text-muted">Festivals</p>
        </div>
        <div className="text-center">
          <p className="font-serif text-2xl text-gold">
            {new Set(SPIRITUAL_FESTIVALS.map((f) => f.tradition)).size}
          </p>
          <p className="text-xs text-muted">Traditions</p>
        </div>
        <div className="text-center">
          <p className="font-serif text-2xl text-gold">365</p>
          <p className="text-xs text-muted">Days of Celebration</p>
        </div>
      </div>

      {/* Festival Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SPIRITUAL_FESTIVALS.map((festival) => (
          <div
            key={festival.id}
            className="bg-paper border border-charcoal/8 rounded-xl p-5 hover:border-gold/30 transition-all"
          >
            {/* Header */}
            <div className="mb-3">
              <h3 className="font-serif text-lg text-charcoal">
                {festival.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full">
                  {festival.tradition}
                </span>
              </div>
            </div>

            {/* Date */}
            <div className="flex items-center gap-2 mb-3 text-sm text-muted">
              <svg
                className="w-3.5 h-3.5 text-gold/60"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {festival.date}
            </div>

            {/* Description */}
            <p className="text-sm text-ink leading-relaxed mb-3">
              {festival.description}
            </p>

            {/* Significance */}
            <div className="border-t border-charcoal/5 pt-3">
              <p className="text-xs text-muted/70 uppercase tracking-wider mb-1">
                Significance
              </p>
              <p className="text-xs text-muted leading-relaxed">
                {festival.significance}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div className="text-center py-8 mt-8 border-t border-gold/10">
        <p className="text-sm text-muted/60 max-w-lg mx-auto">
          Dates shown are approximate and may vary by region and lunar calendar.
          Each festival represents a living tradition observed by millions.
        </p>
      </div>
    </div>
  );
}
