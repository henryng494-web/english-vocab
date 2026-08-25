/** Closed-class headwords where literal stock search returns misleading photos. */
export const FUNCTION_WORD_IMAGE_MARKER = "fw1";

export const HIGH_TRAFFIC_FUNCTION_WORDS = new Set([
  "the",
  "a",
  "an",
  "to",
  "of",
  "in",
  "on",
  "for",
  "and",
  "or",
  "but",
  "not",
  "as",
  "at",
  "by",
  "from",
  "with",
  "that",
  "this",
  "these",
  "those",
  "it",
  "its",
  "i",
  "me",
  "my",
  "we",
  "us",
  "our",
  "you",
  "your",
  "he",
  "him",
  "his",
  "she",
  "her",
  "they",
  "them",
  "their",
  "what",
  "which",
  "who",
  "whom",
  "whose",
  "when",
  "where",
  "why",
  "how",
  "be",
  "is",
  "am",
  "are",
  "was",
  "were",
  "been",
  "being",
  "do",
  "did",
  "does",
  "have",
  "has",
  "had",
  "will",
  "would",
  "can",
  "could",
  "should",
  "may",
  "might",
  "if",
  "than",
  "then",
  "so",
  "too",
  "also",
  "just",
  "only",
  "no",
  "yes",
]);

export function isHighTrafficFunctionWord(word: string): boolean {
  return HIGH_TRAFFIC_FUNCTION_WORDS.has(word.trim().toLowerCase());
}

/** Stock photo approved for a closed-class word (tagged after curated pipeline). */
export function isApprovedFunctionWordStockUrl(
  url: string | null | undefined,
  word?: string | null,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed?.startsWith("https://")) return false;
  if (word && !isHighTrafficFunctionWord(word)) return false;
  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();
    if (host !== "images.pexels.com" && host !== "images.unsplash.com") {
      return false;
    }
    return parsed.searchParams.get("fw") === FUNCTION_WORD_IMAGE_MARKER;
  } catch {
    return false;
  }
}
