import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";
import { addUpload } from "@/lib/uploads";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Auth check — require upload key from header or form field
    const uploadKey = process.env.UPLOAD_KEY;
    if (uploadKey) {
      const headerKey = req.headers.get("x-upload-key");
      const formKey = (formData.get("key") as string) || "";
      if (headerKey !== uploadKey && formKey !== uploadKey) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }
    const file = formData.get("file") as File | null;
    const title = sanitize(formData.get("title") as string) || "Untitled";
    const author = sanitize(formData.get("author") as string) || "Anonymous";
    const description = sanitize(formData.get("description") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate both MIME type AND extension
    const allowedMimes = new Set([
      "application/pdf",
      "application/epub+zip",
      "text/plain",
      "application/x-mobipocket-ebook",
    ]);
    const allowedExts = /\.(pdf|epub|txt|mobi)$/i;
    const ext = path.extname(file.name) || ".pdf";

    if (!allowedMimes.has(file.type) || !allowedExts.test(file.name)) {
      return NextResponse.json({ error: "Only PDF, EPUB, TXT, and MOBI files are allowed" }, { status: 400 });
    }

    // Verify extension matches MIME
    const mimeExtMap: Record<string, string[]> = {
      "application/pdf": [".pdf"],
      "application/epub+zip": [".epub"],
      "text/plain": [".txt"],
      "application/x-mobipocket-ebook": [".mobi"],
    };
    const expectedExts = mimeExtMap[file.type];
    if (!expectedExts || !expectedExts.includes(ext.toLowerCase())) {
      return NextResponse.json({ error: "File extension does not match content type" }, { status: 400 });
    }

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File too large (max 50MB)" }, { status: 400 });
    }

    // Check title/author lengths
    if (title.length > 500 || author.length > 200 || description.length > 2000) {
      return NextResponse.json({ error: "Input too long" }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const filename = `${id}${ext}`;
    const filePath = path.join(process.cwd(), "uploads", filename);

    const buffer = Buffer.from(await file.arrayBuffer());

    // Verify file magic bytes
    const magic = buffer.slice(0, 4);
    const validMagic =
      (ext.toLowerCase() === ".pdf" && magic[0] === 0x25 && magic[1] === 0x50) || // %PDF
      (ext.toLowerCase() === ".epub" && magic[0] === 0x50 && magic[1] === 0x4b) || // PK (ZIP)
      (ext.toLowerCase() === ".txt") || // text has no magic
      (ext.toLowerCase() === ".mobi" && magic[0] === 0x4d && magic[1] === 0x4f); // MO

    if (!validMagic) {
      return NextResponse.json({ error: "File content does not match extension" }, { status: 400 });
    }

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

function sanitize(input: string | null): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, "") // strip angle brackets (XSS)
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "") // strip control chars
    .trim()
    .slice(0, 2000);
}
