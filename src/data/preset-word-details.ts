import { getPresetRank as getInventoryRank } from "@/data/preset-vocabulary";
import { PRESET_WORD_DETAILS } from "@/data/preset-word-details-static";
import { getFullCorpusFrequencyRank } from "@/lib/full-word-frequency";

export {
  getStaticWordDetail,
  hasStaticWordDetail,
  PRESET_WORD_DETAILS,
  type StaticWordDetail,
} from "@/data/preset-word-details-static";

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

