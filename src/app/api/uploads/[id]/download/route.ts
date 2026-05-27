import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { getUpload, incrementDownload, getUploadPath } from "@/lib/uploads";
import { existsSync } from "fs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = await getUpload(id);

  if (!book) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filePath = getUploadPath(book.filename);
  if (!existsSync(filePath)) {
    return NextResponse.json({ error: "File missing" }, { status: 404 });
  }

  await incrementDownload(id);
  const buffer = await readFile(filePath);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": book.mimeType || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${book.originalName}"`,
      "Content-Length": buffer.length.toString(),
    },
  });
}
