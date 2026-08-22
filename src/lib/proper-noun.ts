import { PROPER_NOUNS } from "@/data/proper-nouns";
import { isProfaneWord } from "@/lib/safe-image-search";

export function isProperNoun(word: string): boolean {
  const key = word.trim().toLowerCase();
  return key.length > 0 && PROPER_NOUNS.has(key);
}

/** Names, titles, and profanity — never show or add as learnable vocab. */
export function isExcludedVocabWord(word: string): boolean {
  return isProfaneWord(word) || isProperNoun(word);
}
