import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export interface UploadedBook {
  id: string;
  title: string;
  author: string;
  description: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedAt: string;
  downloads: number;
}

const DATA_DIR = path.join(process.cwd(), "uploads");
const META_FILE = path.join(DATA_DIR, "metadata.json");

async function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true });
  }
}

async function readMeta(): Promise<UploadedBook[]> {
  try {
    await ensureDir();
    const data = await readFile(META_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeMeta(books: UploadedBook[]) {
  await ensureDir();
  await writeFile(META_FILE, JSON.stringify(books, null, 2));
}

export async function addUpload(book: UploadedBook) {
  const books = await readMeta();
  books.unshift(book);
  await writeMeta(books);
}

export async function getUploads(): Promise<UploadedBook[]> {
  return readMeta();
}

export async function getUpload(id: string): Promise<UploadedBook | null> {
  const books = await readMeta();
  return books.find((b) => b.id === id) || null;
}

export async function incrementDownload(id: string) {
  const books = await readMeta();
  const book = books.find((b) => b.id === id);
  if (book) {
    book.downloads++;
    await writeMeta(books);
  }
}

export function getUploadPath(filename: string): string {
  return path.join(DATA_DIR, filename);
}
