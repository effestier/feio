export interface SacredVerse {
  chapter: number;
  verse: number;
  sanskrit: string;
  transliteration: string;
  english: string;
  hindi?: string;
  commentary?: string;
  source: string;
}

export interface SacredText {
  id: string;
  title: string;
  titleHi: string;
  tradition: "hindu" | "buddhist" | "sikh" | "jain" | "christian" | "islamic" | "jewish" | "taoist" | "zoroastrian";
  traditionLabel: string;
  description: string;
  language: string;
  period: string;
  totalChapters: number;
  totalVerses: number;
  icon: string;
}

export interface DailyVerse {
  verse: SacredVerse;
  textId: string;
  textTitle: string;
  date: string;
}

export interface ScriptureChapter {
  chapterNumber: number;
  title: string;
  titleHi: string;
  verseCount: number;
  summary: string;
  verses: SacredVerse[];
}

export const TRADITIONS = [
  { id: "hindu", label: "Hinduism", emoji: "🙏", color: "#C4A35A" },
  { id: "buddhist", label: "Buddhism", emoji: "☸️", color: "#D4A017" },
  { id: "sikh", label: "Sikhism", emoji: "🙏", color: "#FF8C00" },
  { id: "jain", label: "Jainism", emoji: "🙏", color: "#DAA520" },
  { id: "christian", label: "Christianity", emoji: "✝️", color: "#8B0000" },
  { id: "islamic", label: "Islam", emoji: "☪️", color: "#006400" },
  { id: "jewish", label: "Judaism", emoji: "✡️", color: "#00008B" },
  { id: "taoist", label: "Taoism", emoji: "☯️", color: "#2F4F4F" },
  { id: "zoroastrian", label: "Zoroastrianism", emoji: "🔥", color: "#B8860B" },
] as const;

export type TraditionId = (typeof TRADITIONS)[number]["id"];
