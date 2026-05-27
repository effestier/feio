import { getGutenbergBook } from "@/lib/gutenberg";
import { notFound } from "next/navigation";
import ReadPageContent from "@/components/ReadPageContent";

export const dynamic = "force-dynamic";

export default async function ReadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  if (isNaN(bookId)) notFound();

  let book;
  try {
    book = await getGutenbergBook(bookId);
  } catch {
    notFound();
  }

  const readUrl = `/api/book/${bookId}/read`;
  const authors = book.authors.map((a) => a.name).join(", ") || "Unknown";

  return (
    <ReadPageContent
      bookId={bookId}
      title={book.title}
      authors={authors}
      readUrl={readUrl}
    />
  );
}
