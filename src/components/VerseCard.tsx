"use client";

import { useState } from "react";
import type { SacredVerse } from "@/lib/sacred-types";

export default function VerseCard({
  verse,
  index,
}: {
  verse: SacredVerse;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="p-5 bg-paper border border-charcoal/8 rounded-xl hover:border-gold/15 transition-all"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="text-xs font-medium text-gold/60 uppercase tracking-wider">
          Chapter {verse.chapter}, Verse {verse.verse}
        </span>
        {verse.commentary && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-muted hover:text-gold transition-colors"
          >
            {expanded ? "Hide" : "Commentary"}
          </button>
        )}
      </div>

      {/* Sanskrit / Original */}
      {verse.sanskrit && (
        <p className="text-lg leading-relaxed text-charcoal/80 mb-2 font-serif">
          {verse.sanskrit}
        </p>
      )}

      {/* Transliteration */}
      {verse.transliteration && verse.transliteration !== verse.english && (
        <p className="text-sm text-gold/70 italic mb-2">
          {verse.transliteration}
        </p>
      )}

      {/* English */}
      <p className="text-base text-charcoal leading-relaxed">{verse.english}</p>

      {/* Commentary */}
      {verse.commentary && expanded && (
        <div className="mt-4 pt-4 border-t border-gold/10">
          <p className="text-sm text-muted leading-relaxed">
            <span className="text-gold font-medium text-xs uppercase tracking-wider block mb-1">
              Commentary
            </span>
            {verse.commentary}
          </p>
        </div>
      )}

      {/* Source */}
      <div className="mt-3 flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-gold/30" />
        <span className="text-xs text-muted/50">{verse.source}</span>
      </div>
    </div>
  );
}
