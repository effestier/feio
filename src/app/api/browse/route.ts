import { NextRequest, NextResponse } from "next/server";
import { getByGenre } from "@/lib/openlibrary";

export async function GET(req: NextRequest) {
  const genre = req.nextUrl.searchParams.get("genre");
  const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get("limit")) || 20, 1), 100);
  const offset = Math.max(Number(req.nextUrl.searchParams.get("offset")) || 0, 0);

  if (!genre) {
    return NextResponse.json({ error: "genre required" }, { status: 400 });
  }

  try {
    const result = await getByGenre(genre, limit, offset);
    return NextResponse.json({ books: result.books, hasMore: result.hasMore });
  } catch {
    return NextResponse.json({ error: "fetch failed" }, { status: 500 });
  }
}
