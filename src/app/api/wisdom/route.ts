import { NextResponse } from "next/server";
import { getDailyVerse, searchVerses, SACRED_TEXTS, KEY_VERSES } from "@/lib/sacred-texts";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const textId = searchParams.get("text");
  const mode = searchParams.get("mode"); // "daily", "search", "random", "text"

  // Daily verse
  if (mode === "daily" || (!query && !textId && !mode)) {
    const daily = getDailyVerse();
    return NextResponse.json({
      type: "daily",
      verse: daily.verse,
      text: {
        id: daily.text.id,
        title: daily.text.title,
        tradition: daily.text.tradition,
        traditionLabel: daily.text.traditionLabel,
      },
    });
  }

  // Search verses
  if (mode === "search" && query) {
    const results = searchVerses(query);
    return NextResponse.json({
      type: "search",
      query,
      count: results.length,
      results: results.map(({ verse, text }) => ({
        verse,
        text: { id: text.id, title: text.title, tradition: text.tradition },
      })),
    });
  }

  // Random verse
  if (mode === "random") {
    const allVerses: { verse: typeof KEY_VERSES[string][0]; textId: string }[] = [];
    for (const [tid, verses] of Object.entries(KEY_VERSES)) {
      for (const v of verses) {
        allVerses.push({ verse: v, textId: tid });
      }
    }
    const pick = allVerses[Math.floor(Math.random() * allVerses.length)];
    const text = SACRED_TEXTS.find((t) => t.id === pick.textId);
    return NextResponse.json({
      type: "random",
      verse: pick.verse,
      text: text
        ? { id: text.id, title: text.title, tradition: text.tradition, traditionLabel: text.traditionLabel }
        : null,
    });
  }

  // Verses by text
  if (textId) {
    const verses = KEY_VERSES[textId] || [];
    const text = SACRED_TEXTS.find((t) => t.id === textId);
    return NextResponse.json({
      type: "text",
      text: text
        ? { id: text.id, title: text.title, tradition: text.tradition, traditionLabel: text.traditionLabel }
        : null,
      count: verses.length,
      verses,
    });
  }

  // Default: return available texts
  return NextResponse.json({
    type: "index",
    texts: SACRED_TEXTS.map((t) => ({
      id: t.id,
      title: t.title,
      tradition: t.tradition,
      traditionLabel: t.traditionLabel,
      verseCount: (KEY_VERSES[t.id] || []).length,
    })),
  });
}
