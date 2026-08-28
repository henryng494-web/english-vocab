/**
 * Real English two-letter words allowed in the discover inventory.
 * SUBTLEX subtitle tokens (th, ls, de, ho, …) are rejected — only NGSL
 * headwords plus a small spoken-English supplement pass through.
 */
const NGSL_TWO_LETTER_WORDS: readonly string[] = [
  "ad",
  "am",
  "an",
  "as",
  "at",
  "be",
  "by",
  "do",
  "go",
  "he",
  "hi",
  "if",
  "in",
  "is",
  "it",
  "me",
  "my",
  "no",
  "of",
  "ok",
  "on",
  "or",
  "so",
  "to",
  "up",
  "us",
  "we",
];

/** Spoken-frequency 2-letter words that are real vocabulary (not OCR scraps). */
const SPOKEN_TWO_LETTER_WORDS: readonly string[] = [
  "la",
  "ma",
  "ox",
  "tv",
  "ya",
];

export const VALID_TWO_LETTER_WORDS: ReadonlySet<string> = new Set([
  ...NGSL_TWO_LETTER_WORDS,
  ...SPOKEN_TWO_LETTER_WORDS,
]);

export function isValidTwoLetterWord(word: string): boolean {
  return VALID_TWO_LETTER_WORDS.has(word.trim().toLowerCase());
}
