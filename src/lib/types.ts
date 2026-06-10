export interface BookDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  publisher?: string[];
  language?: string[];
  isbn?: string[];
  ia?: string[];
  ratings_average?: number;
  ratings_count?: number;
  want_to_read_count?: number;
  currently_reading_count?: number;
  already_read_count?: number;
}

export interface SearchResult {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: BookDoc[];
}

export interface BookDetail {
  key: string;
  title: string;
  description?: string | { value: string };
  covers?: number[];
  subjects?: string[];
  subject_places?: string[];
  subject_times?: string[];
  authors?: { author: { key: string }; type: { key: string } }[];
  first_publish_date?: string;
  created?: { type: string; value: string };
  last_modified?: { type: string; value: string };
}

export interface AuthorDetail {
  key: string;
  name: string;
  personal_name?: string;
  bio?: string | { value: string };
  birth_date?: string;
  death_date?: string;
  photos?: number[];
  links?: { title: string; url: string }[];
}

export interface TrendingBook {
  key: string;
  title: string;
  author_name?: string[];
  cover_edition_key?: string;
  cover_i?: number;
  first_publish_year?: number;
  ia?: string[];
  subject?: string[];
}

export interface SubjectResponse {
  key: string;
  name: string;
  work_count: number;
  works: TrendingBook[];
}

// Genre → SOLR subject search terms (used with search.json?subject=...)
// Each term is searched individually, results are merged and deduplicated
export const GENRE_SEARCH_TERMS: Record<string, string[]> = {
  fiction: ["fiction", "novel", "literary fiction", "short stories", "literature"],
  science: ["physics", "chemistry", "biology", "astronomy", "mathematics", "ecology", "genetics", "evolution", "geology", "natural history", "botany", "zoology"],
  history: ["history", "historical", "ancient", "medieval", "world war", "revolution", "american history", "european history", "military history"],
  philosophy: ["philosophy", "ethics", "metaphysics", "epistemology", "stoicism", "existentialism", "logic", "aesthetics"],
  romance: ["romance", "love stories", "romantic", "love story", "romantic suspense", "contemporary romance"],
  mystery: ["mystery", "detective", "crime", "thriller", "suspense", "murder", "noir", "police", "forensic"],
  fantasy: ["fantasy", "magic", "dragon", "fairy tale", "mythology", "epic fantasy", "dark fantasy", "urban fantasy"],
  biography: ["biography", "autobiography", "memoir", "personal narratives", "diaries"],
  poetry: ["poetry", "poems", "verse", "sonnets", "haiku", "epic poetry"],
  science_fiction: ["science fiction", "sci-fi", "dystopia", "alien", "space", "robot", "time travel", "cyberpunk"],
  horror: ["horror", "ghost", "vampire", "zombie", "demon", "occult", "supernatural", "gothic"],
  psychology: ["psychology", "psychoanalysis", "mental health", "cognitive", "psychiatry", "consciousness"],
  self_help: ["self-help", "personal development", "motivation", "mindfulness", "meditation", "productivity"],
  adventure: ["adventure", "exploration", "survival", "pirate", "treasure", "voyage"],
  children: ["children", "juvenile", "fairy tale", "picture book", "young adult"],
  humor: ["humor", "comedy", "satire", "parody", "wit"],
  manuscripts: ["manuscripts", "ancient texts", "illuminated manuscripts", "palm leaf manuscript", "scroll", "codex", "ancient literature", "papyrus"],
  politics: ["politics", "government", "democracy", "election", "policy", "diplomacy"],
};

export const GENRES = [
  { slug: "fiction", label: "Fiction", emoji: "📖" },
  { slug: "science", label: "Science", emoji: "🔬" },
  { slug: "history", label: "History", emoji: "🏛️" },
  { slug: "philosophy", label: "Philosophy", emoji: "💭" },
  { slug: "romance", label: "Romance", emoji: "💕" },
  { slug: "mystery", label: "Mystery", emoji: "🔍" },
  { slug: "fantasy", label: "Fantasy", emoji: "🐉" },
  { slug: "biography", label: "Biography", emoji: "👤" },
  { slug: "poetry", label: "Poetry", emoji: "🪶" },
  { slug: "science_fiction", label: "Sci-Fi", emoji: "🚀" },
  { slug: "horror", label: "Horror", emoji: "👻" },
  { slug: "psychology", label: "Psychology", emoji: "🧠" },
  { slug: "adventure", label: "Adventure", emoji: "⚔️" },
  { slug: "self_help", label: "Self-Help", emoji: "💡" },
  { slug: "children", label: "Children", emoji: "🧸" },
  { slug: "humor", label: "Humor", emoji: "😄" },
  { slug: "manuscripts", label: "Manuscripts", emoji: "📜" },
  { slug: "politics", label: "Politics", emoji: "🏛️" },
] as const;
