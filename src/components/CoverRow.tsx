import Image from "next/image";
import Link from "next/link";
import type { BookDoc } from "@/lib/types";
import { coverUrl } from "@/lib/openlibrary";

export default function CoverRow({ books, title, seeAllHref }: { books: BookDoc[]; title: string; seeAllHref?: string }) {
  if (!books.length) return null;

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="font-serif text-xl text-charcoal">{title}</h2>
        {seeAllHref && (
          <Link href={seeAllHref} className="text-sm text-burgundy hover:underline font-medium">
            See all →
          </Link>
        )}
      </div>
      <div className="scroll-row flex gap-3 overflow-x-auto pb-2">
        {books.map((book, i) => {
          const href = book.key.replace("/works/", "/book/");
          const cover = coverUrl(book.cover_i, "M");

          return (
            <Link
              key={book.key}
              href={href}
              className="cover-hover flex-shrink-0 w-[120px] sm:w-[140px]"
            >
              <div className="relative aspect-[2/3] bg-[#EDE6DC] rounded-md overflow-hidden mb-1.5 shadow-sm">
                {book.cover_i ? (
                  <Image
                    src={cover}
                    alt={book.title}
                    fill
                    sizes="140px"
                    className="object-cover"
                    priority={i < 4}
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#EDE6DC] text-[#8B7355] text-[10px] text-center px-2">
                    {book.title}
                  </div>
                )}
              </div>
              <p className="text-xs text-charcoal leading-tight line-clamp-2">
                {book.title}
              </p>
              {book.author_name && (
                <p className="text-[10px] text-[#8B7355] mt-0.5 line-clamp-1">
                  {book.author_name[0]}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
