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

  const authors = book.authors.map((a) => a.name).join(", ") || "Unknown";

  return (
    <ReadPageContent
      title={book.title}
      authors={authors}
      readUrl={`/api/book/${bookId}/read`}
      downloadPdfUrl={`/api/book/${bookId}/download?format=pdf`}
      downloadTxtUrl={`/api/book/${bookId}/download?format=txt`}
      detailsUrl={`/book/${bookId}`}
    />
  );
}
