import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { addUpload } from "@/lib/uploads";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = (formData.get("title") as string) || "Untitled";
    const author = (formData.get("author") as string) || "Anonymous";
    const description = (formData.get("description") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const allowed = [
      "application/pdf",
      "application/epub+zip",
      "text/plain",
      "application/x-mobipocket-ebook",
    ];
    if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|epub|txt|mobi)$/i)) {
      return NextResponse.json({ error: "Only PDF, EPUB, TXT, and MOBI files are allowed" }, { status: 400 });
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
    }

    const ext = path.extname(file.name) || ".pdf";
    const id = crypto.randomUUID();
    const filename = `${id}${ext}`;
    const filePath = path.join(process.cwd(), "uploads", filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const book = {
      id,
      title,
      author,
      description,
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      downloads: 0,
    };

    await addUpload(book);

    return NextResponse.json({ success: true, book });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
