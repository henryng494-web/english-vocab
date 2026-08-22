/**
 * SUBTLEX subtitle tokens from split contractions (don't → don, I'll → ll).
 * They inherit huge spoken ranks and crowd 1–100 even though they are not
 * real headwords. The literary verb "don" (put on clothes) is not in NGSL
 * and must not inherit don't's rank.
 *
 * Keep real words that look similar: won, can, haven.
 */
export const CONTRACTION_STEMS: ReadonlySet<string> = new Set([
  "don",
  "didn",
  "doesn",
  "isn",
  "wasn",
  "aren",
  "wouldn",
  "couldn",
  "shouldn",
  "hasn",
  "hadn",
  "ain",
  "mustn",
  "needn",
  "mightn",
  "daren",
  "oughtn",
  "dont",
  "re",
  "ll",
  "ve",
  "em",
  "nt",
]);

export function isContractionStem(word: string): boolean {
  return CONTRACTION_STEMS.has(word.trim().toLowerCase());
}
