import Link from "next/link";
import { GENRES } from "@/lib/types";

export default function GenreGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {GENRES.map((genre, i) => (
        <Link
          key={genre.slug}
          href={`/browse/${genre.slug}`}
          className="genre-card bg-white border border-[#D4C5A9]/40 rounded-xl p-4 flex items-center gap-3 hover:shadow-md transition-all animate-fadeIn"
          style={{ animationDelay: `${i * 40}ms` }}
        >
          <span className="text-xl">{genre.emoji}</span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-charcoal">{genre.label}</span>
            <span className="text-[10px] text-[#8B7355]/50 mt-0.5">Browse →</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
