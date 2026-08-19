/**
 * Turn a vocabulary word into a concrete stock-photo search phrase so the
 * image on a flashcard is easy to understand at a glance (object, action, or
 * scene — not an abstract English word alone).
 */

const CURATED_VISUAL_KEYWORDS: Record<string, string> = {
  hole: "hole in ground",
  organic: "organic vegetables garden",
  run: "person running outdoors",
  walk: "person walking street",
  eat: "person eating meal",
  drink: "glass of water",
  happy: "smiling happy person",
  sad: "sad person face",
  angry: "angry person face",
  think: "person thinking",
  learn: "student studying books",
  teach: "teacher classroom",
  love: "couple holding hands",
  help: "helping hand support",
  break: "broken glass",
  open: "open door",
  close: "closed door",
  hot: "hot sunny weather",
  cold: "cold winter snow",
  big: "large elephant",
  small: "small kitten",
  fast: "fast car speed",
  slow: "snail slow",
  color: "colorful paint palette",
  time: "wall clock",
  money: "coins cash",
  work: "office desk laptop",
  make: "hands making pottery",
  home: "cozy house exterior",
  food: "healthy food plate",
  water: "clear water glass",
  fire: "campfire flames",
  light: "sunlight window",
  dark: "dark night sky",
  clean: "clean tidy room",
  dirty: "dirty muddy shoes",
};

export function hasCuratedVisualKeyword(word: string): boolean {
  return Boolean(CURATED_VISUAL_KEYWORDS[cleanPhrase(word)]);
}

const ABSTRACT_POS = new Set([
  "verb",
  "adjective",
  "adverb",
  "preposition",
  "conjunction",
  "determiner",
  "pronoun",
]);

function cleanPhrase(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function isConcretePhrase(phrase: string, word: string): boolean {
  const tokens = phrase.split(/\s+/).filter(Boolean);
  if (tokens.length >= 2) return true;
  return tokens.length === 1 && tokens[0] !== word;
}

type ImageKeywordOptions = {
  searchKeyword?: string | null;
  meaning?: string | null;
  pos?: string | null;
};

/**
 * Best single query for Unsplash / LoremFlickr.
 */
export function resolveImageSearchKeyword(
  word: string,
  options: ImageKeywordOptions = {},
): string {
  const normalizedWord = cleanPhrase(word) || "vocabulary";
  const curated = CURATED_VISUAL_KEYWORDS[normalizedWord];
  if (curated) return curated;

  const candidate = cleanPhrase(options.searchKeyword ?? "");
  if (candidate && isConcretePhrase(candidate, normalizedWord)) {
    return candidate;
  }

  const pos = options.pos?.trim().toLowerCase();
  if (pos && ABSTRACT_POS.has(pos)) {
    if (pos === "verb") return `${normalizedWord} action person`;
    if (pos === "adjective") return `${normalizedWord} everyday scene`;
    if (pos === "adverb") return `${normalizedWord} moment`;
  }

  if (candidate) return candidate;
  return normalizedWord;
}

/**
 * Ordered fallbacks when the first Unsplash query returns nothing useful.
 */
export function buildImageSearchQueries(
  word: string,
  options: ImageKeywordOptions = {},
): string[] {
  const primary = resolveImageSearchKeyword(word, options);
  const normalizedWord = cleanPhrase(word) || "vocabulary";
  const queries = new Set<string>([primary]);

  const pos = options.pos?.trim().toLowerCase();
  if (
    primary !== normalizedWord &&
    (!pos || !ABSTRACT_POS.has(pos))
  ) {
    queries.add(normalizedWord);
  }

  if (pos === "noun" && !primary.includes(" ")) {
    queries.add(`${primary} object`);
  }

  return [...queries];
}
