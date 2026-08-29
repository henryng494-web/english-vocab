import {
  FOREIGN_SUBTITLE_TOKENS,
  isForeignSubtitleToken,
} from "@/data/foreign-subtitle-tokens";
import { NGSL_FREQUENCY_RANKS } from "@/data/ngsl-frequency-ranks";

/** English homographs that must never be blocked by the foreign-token filter. */
const ENGLISH_HOMOGRAPH_ALLOWLIST: ReadonlySet<string> = new Set([
  "bin",
  "con",
  "die",
  "fur",
  "gut",
  "man",
  "nous",
  "para",
  "plus",
  "pour",
  "sin",
  "son",
  "tout",
  "war",
  "was",
]);

/**
 * SUBTLEX-only tokens that are known foreign subtitle noise (not in NGSL).
 * Used for audits; runtime exclusion uses {@link isForeignSubtitleToken} directly.
 */
export function isSubtlexOnlyForeignNoise(word: string): boolean {
  const key = word.trim().toLowerCase();
  if (!key || ENGLISH_HOMOGRAPH_ALLOWLIST.has(key)) return false;
  if (key in NGSL_FREQUENCY_RANKS) return false;
  return isForeignSubtitleToken(key);
}

export function listForeignSubtitleTokens(): string[] {
  return [...FOREIGN_SUBTITLE_TOKENS].sort();
}
