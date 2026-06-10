import Link from "next/link";
import Image from "next/image";
import type { BookDoc } from "@/lib/types";
import { coverUrl } from "@/lib/openlibrary";

export default function BookCard({ book, priority = false }: { book: BookDoc; priority?: boolean }) {
  const cover = coverUrl(book.cover_i, "M");
  const href = book.key.replace("/works/", "/book/");

  return (
    <Link href={href} className="book-card block group">
      <div className="relative aspect-[2/3] bg-[#EDE6DC] rounded-md overflow-hidden mb-2 shadow-sm">
        {book.cover_i ? (
          <Image
            src={cover}
            alt={book.title}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
            className="object-cover"
            priority={priority}
            unoptimized
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#EDE6DC] text-[#8B7355] text-xs text-center px-3">
            {book.title}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-charcoal leading-tight line-clamp-2 group-hover:text-burgundy transition-colors">
        {book.title}
      </h3>
      {book.author_name && (
        <p className="text-xs text-[#8B7355] mt-0.5 line-clamp-1">
          {book.author_name[0]}
        </p>
      )}
    </Link>
  );
}
