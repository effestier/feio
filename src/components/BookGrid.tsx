import type { BookDoc } from "@/lib/types";
import BookCard from "./BookCard";

export default function BookGrid({ books }: { books: BookDoc[] }) {
  if (!books.length) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-lg">No books found</p>
        <p className="text-sm mt-1">Try a different search term</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-6">
      {books.map((book, i) => (
        <BookCard key={book.key} book={book} priority={i < 4} />
      ))}
    </div>
  );
}
