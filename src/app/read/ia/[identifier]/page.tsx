import { getIAMetadata } from "@/lib/internetarchive";
import { notFound } from "next/navigation";
import ReadPageContent from "@/components/ReadPageContent";

export const dynamic = "force-dynamic";

export default async function IAReadPage({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
  const { identifier } = await params;
  const id = decodeURIComponent(identifier);

  let meta;
  try {
    meta = await getIAMetadata(id);
  } catch {
    notFound();
  }

  if (!meta) notFound();

  const title = meta.metadata?.title || id;
  const author =
    typeof meta.metadata?.creator === "string"
      ? meta.metadata.creator
      : Array.isArray(meta.metadata?.creator)
        ? (meta.metadata.creator as string[]).join(", ")
        : "Unknown";

  // Check if text format is available for reading
  const files = meta.files || [];
  const hasHtml = files.some((f) => f.format === "HTML");
  const hasTxt = files.some(
    (f) => f.format === "Plain Text" || f.format === "DjVuTXT"
  );

  if (!hasHtml && !hasTxt) {
    notFound();
  }

  // Check available download formats
  const hasEpub = files.some((f) => f.format === "EPUB");
  const hasPdf = files.some(
    (f) => f.format === "Text PDF" || f.format === "Image Container PDF"
  );
  const hasTxtDl = files.some(
    (f) => f.format === "Plain Text" || f.format === "DjVuTXT"
  );

  return (
    <ReadPageContent
      title={title}
      authors={author}
      readUrl={`/api/ia/${id}/read`}
      downloadPdfUrl={
        hasPdf
          ? `/api/ia/${id}/download?format=pdf`
          : hasEpub
            ? `/api/ia/${id}/download?format=epub`
            : `/api/ia/${id}/download?format=txt`
      }
      downloadTxtUrl={`/api/ia/${id}/download?format=txt`}
      detailsUrl={`https://archive.org/details/${id}`}
      detailsLabel="Archive.org"
    />
  );
}
