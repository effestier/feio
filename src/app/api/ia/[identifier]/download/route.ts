import { NextRequest, NextResponse } from "next/server";
import { getIAMetadata } from "@/lib/internetarchive";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params;
  const id = decodeURIComponent(identifier);
  const format = req.nextUrl.searchParams.get("format") || "pdf";

  let meta;
  try {
    meta = await getIAMetadata(id);
  } catch {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  if (!meta) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const files = meta.files || [];
  const base = `https://archive.org/download/${encodeURIComponent(id)}`;
  const title = meta.metadata?.title || id;
  const safeName = title.replace(/[^a-zA-Z0-9\s-_]/g, "").trim();

  let targetFile: { name: string; format: string } | undefined;
  let mime: string;

  switch (format) {
    case "epub":
      targetFile = files.find((f) => f.format === "EPUB");
      mime = "application/epub+zip";
      break;
    case "pdf":
      targetFile = files.find((f) => f.format === "Text PDF");
      if (!targetFile) targetFile = files.find((f) => f.format === "Image Container PDF");
      mime = "application/pdf";
      break;
    case "txt":
      targetFile = files.find((f) => f.format === "Plain Text");
      if (!targetFile) targetFile = files.find((f) => f.format === "DjVuTXT");
      mime = "text/plain; charset=utf-8";
      break;
    case "kindle":
      targetFile = files.find((f) => f.format === "Kindle");
      mime = "application/x-mobipocket-ebook";
      break;
    default:
      return NextResponse.json({ error: "Unknown format" }, { status: 400 });
  }

  if (!targetFile) {
    return NextResponse.json(
      { error: `${format.toUpperCase()} not available` },
      { status: 404 }
    );
  }

  const url = `${base}/${targetFile.name}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch file" },
        { status: 502 }
      );
    }

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mime,
        "Content-Disposition": `attachment; filename="${safeName}.${format === "kindle" ? "mobi" : format}"`,
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Download failed" }, { status: 502 });
  }
}
