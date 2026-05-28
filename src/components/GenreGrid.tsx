import Link from "next/link";
import { GENRES } from "@/lib/types";

export default function GenreGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {GENRES.map((genre) => (
        <Link
          key={genre.slug}
          href={`/browse/${genre.slug}`}
          className="genre-card bg-paper border border-charcoal/10 rounded-lg p-4 flex items-center gap-3"
        >
          <span className="text-xl">{genre.emoji}</span>
          <span className="text-sm font-medium text-charcoal">{genre.label}</span>
        </Link>
      ))}
    </div>
  );
}
