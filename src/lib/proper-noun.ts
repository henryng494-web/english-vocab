import { isContractionStem } from "@/data/contraction-stems";
import { isLowValueInterjection } from "@/data/low-value-interjections";
import { PROPER_NOUNS } from "@/data/proper-nouns";
import { isProfaneWord } from "@/lib/safe-image-search";

export function isProperNoun(word: string): boolean {
  const key = word.trim().toLowerCase();
  return key.length > 0 && PROPER_NOUNS.has(key);
}

/** Names, titles, fillers, contraction scraps, and profanity — never learnable. */
export function isExcludedVocabWord(word: string): boolean {
  return (
    isProfaneWord(word) ||
    isProperNoun(word) ||
    isLowValueInterjection(word) ||
    isContractionStem(word)
  );
}
