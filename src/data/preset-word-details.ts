import { getPresetRank as getInventoryRank } from "@/data/preset-vocabulary";
import PRESET_DETAILS_JSON from "@/data/preset-word-details.json";
import { getFullCorpusFrequencyRank } from "@/lib/full-word-frequency";

export type StaticWordDetail = {
  pos: string;
  ipa: string;
  vietnamese: string;
  definition: string;
  examples: string[];
  rank?: number;
};

export const PRESET_WORD_DETAILS: Record<string, StaticWordDetail> =
  PRESET_DETAILS_JSON as Record<string, StaticWordDetail>;

export function getStaticWordDetail(word: string): StaticWordDetail | undefined {
  const key = word.toLowerCase();
  if (!Object.hasOwn(PRESET_WORD_DETAILS, key)) return undefined;
  return PRESET_WORD_DETAILS[key];
}

/**
 * Real, corpus-derived frequency rank for any word — the app's curated
 * preset vocabulary/details first, then the full ~74k-word SUBTLEX-US corpus
 * so words typed into "Add word" that aren't in the inventory still get a
 * genuine rank instead of a flat made-up default. See
 * src/lib/full-word-frequency.ts.
 */
export function getPresetRank(word: string): number | undefined {
  const normalized = word.toLowerCase();
  const presetRank = getInventoryRank(normalized);
  if (presetRank !== undefined) return presetRank;
  if (Object.hasOwn(PRESET_WORD_DETAILS, normalized)) {
    const staticDetail = PRESET_WORD_DETAILS[normalized]?.rank;
    if (staticDetail !== undefined) return staticDetail;
  }
  return getFullCorpusFrequencyRank(normalized);
}

export function hasStaticWordDetail(word: string): boolean {
  return Object.hasOwn(PRESET_WORD_DETAILS, word.toLowerCase());
}
