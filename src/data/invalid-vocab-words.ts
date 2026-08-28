/**
 * Broken subtitle tokens, nicknames, and informal scraps that should never
 * appear in Journey / Review / word lists — even when SUBTLEX ranks them high.
 */
export const INVALID_VOCAB_WORDS: ReadonlySet<string> = new Set([
  // Given names / nicknames mis-tagged as common nouns
  "polly",
  "kelly",
  "von",

  // Informal reductions (not headwords)
  "kinda",
  "dunno",
  "gotta",
  "wanna",
  "lemme",
  "gimme",
  "coulda",
  "shoulda",
  "woulda",
  "musta",
  "outta",
  "sorta",
  "lotsa",

  // Mis-parsed or truncated SUBTLEX tokens (3+ chars)
  "abit",
  "alot",
]);

export function isInvalidVocabWord(word: string): boolean {
  return INVALID_VOCAB_WORDS.has(word.trim().toLowerCase());
}
