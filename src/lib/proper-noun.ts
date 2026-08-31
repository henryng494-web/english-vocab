import { isContractionStem } from "@/data/contraction-stems";
import { isForeignSubtitleToken } from "@/data/foreign-subtitle-tokens";
import { isInvalidVocabWord } from "@/data/invalid-vocab-words";
import { isLowValueInterjection } from "@/data/low-value-interjections";
import { isValidTwoLetterWord } from "@/data/valid-two-letter-words";
import { isVocabAbbreviation } from "@/data/vocab-abbreviations";
import { PROPER_NOUNS } from "@/data/proper-nouns";
import { isProfaneWord } from "@/lib/safe-image-search";

export function isProperNoun(word: string): boolean {
  const key = word.trim().toLowerCase();
  return key.length > 0 && PROPER_NOUNS.has(key);
}

/** Names, titles, fillers, foreign subtitle tokens, profanity, and broken tokens. */
export function isExcludedVocabWord(word: string): boolean {
  const key = word.trim().toLowerCase();
  if (!key) return true;
  if (key.length === 2 && !isValidTwoLetterWord(key)) return true;
  return (
    isProfaneWord(key) ||
    isProperNoun(key) ||
    isLowValueInterjection(key) ||
    isContractionStem(key) ||
    isInvalidVocabWord(key) ||
    isForeignSubtitleToken(key) ||
    isVocabAbbreviation(key)
  );
}
