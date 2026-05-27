import { NextResponse } from "next/server";
import { getUploads } from "@/lib/uploads";

export async function GET() {
  const uploads = await getUploads();
  return NextResponse.json(uploads);
}
