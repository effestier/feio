"use client";

import { useState, useCallback } from "react";
import type { BookDoc } from "@/lib/types";
import BookGrid from "./BookGrid";

export default function BookGridLoadable({
  initialBooks,
  genre,
}: {
  initialBooks: BookDoc[];
  genre: string;
}) {
  const [books, setBooks] = useState<BookDoc[]>(initialBooks);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialBooks.length >= 40);

  const loadMore = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/browse?genre=${encodeURIComponent(genre)}&limit=20&offset=${books.length}`
      );
      const data = await res.json();
      if (data.books?.length) {
        setBooks((prev) => [...prev, ...data.books]);
        setHasMore(data.hasMore);
      } else {
        setHasMore(false);
      }
    } catch {
      // silent
    }
    setLoading(false);
  }, [genre, books.length]);

  return (
    <div>
      <BookGrid books={books} />
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2.5 bg-burgundy text-white text-sm rounded-lg hover:bg-burgundy-light transition-colors disabled:opacity-50 shadow-sm hover:shadow-md"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}
