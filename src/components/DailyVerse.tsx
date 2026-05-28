import { getDailyVerse } from "@/lib/sacred-texts";

export default function DailyVerse() {
  const { verse, text } = getDailyVerse();

  return (
    <div className="relative p-6 sm:p-8 bg-paper border border-gold/15 rounded-2xl overflow-hidden">
      {/* Decorative corner */}
      <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <circle cx="100" cy="0" r="80" stroke="currentColor" strokeWidth="0.5" className="text-gold" />
          <circle cx="100" cy="0" r="60" stroke="currentColor" strokeWidth="0.3" className="text-gold" />
          <circle cx="100" cy="0" r="40" stroke="currentColor" strokeWidth="0.3" className="text-gold" />
        </svg>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-8 h-px bg-gold/30" />
          <span className="text-xs font-medium uppercase tracking-widest text-gold/60">
            Verse of the Day
          </span>
          <span className="w-8 h-px bg-gold/30" />
        </div>

        {/* Original text */}
        {verse.sanskrit && (
          <p className="text-xl sm:text-2xl font-serif text-charcoal/80 leading-relaxed mb-3">
            {verse.sanskrit}
          </p>
        )}

        {/* Transliteration */}
        {verse.transliteration && verse.transliteration !== verse.english && (
          <p className="text-sm text-gold/60 italic mb-3 font-sans">
            {verse.transliteration}
          </p>
        )}

        {/* English */}
        <p className="text-base sm:text-lg text-charcoal leading-relaxed mb-4 font-sans">
          {verse.english}
        </p>

        {/* Source */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{text.icon}</span>
          <div>
            <p className="text-sm font-medium text-charcoal">{text.title}</p>
            <p className="text-xs text-muted">
              Chapter {verse.chapter}, Verse {verse.verse}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
