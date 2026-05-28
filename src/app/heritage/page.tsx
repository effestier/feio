import Link from "next/link";
import { HERITAGE_SITES } from "@/lib/spiritual-content";

export const metadata = {
  title: "Sacred Heritage Sites — FEIO",
  description: "Explore the world's most sacred places — temples, mosques, churches, and shrines that have shaped human spiritual history.",
};

export default function HeritagePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <div className="inline-block px-3 py-1 mb-4 text-xs font-medium uppercase tracking-widest text-gold bg-gold/10 rounded-full border border-gold/20">
          Sacred Places
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl text-charcoal mb-4 tracking-tight">
          Heritage Sites
        </h1>
        <p className="text-muted text-base max-w-2xl mx-auto leading-relaxed">
          The world&apos;s most sacred places — where the divine has touched
          the earth, where millions have prayed, and where architecture
          becomes devotion.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {HERITAGE_SITES.map((site) => (
          <Link
            key={site.id}
            href={`/heritage/${site.id}`}
            className="group p-5 bg-paper border border-charcoal/8 rounded-xl hover:border-gold/30 transition-all"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{site.traditionEmoji}</span>
              <span className="text-xs font-medium text-gold/60 uppercase tracking-wider">
                {site.tradition}
              </span>
              {site.unesco && (
                <span className="text-[10px] px-1.5 py-0.5 bg-gold/10 text-gold rounded-full ml-auto">
                  UNESCO
                </span>
              )}
            </div>
            <h2 className="font-serif text-lg text-charcoal group-hover:text-gold transition-colors mb-1">
              {site.name}
            </h2>
            <p className="text-xs text-gold/50 mb-2">{site.nameLocal}</p>
            <p className="text-xs text-muted mb-2">
              {site.location}, {site.country}
            </p>
            <p className="text-sm text-muted leading-relaxed line-clamp-3">
              {site.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
