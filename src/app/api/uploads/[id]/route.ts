import { NextRequest, NextResponse } from "next/server";
import { getUpload } from "@/lib/uploads";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = await getUpload(id);
  if (!book) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(book);
}
