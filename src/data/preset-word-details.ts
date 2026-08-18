import { PRESET_WORDS } from "@/data/preset-vocabulary";
import PRESET_DETAILS_JSON from "@/data/preset-word-details.json";

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
  return PRESET_WORD_DETAILS[word.toLowerCase()];
}

export function getPresetRank(word: string): number | undefined {
  const staticRank = PRESET_WORD_DETAILS[word.toLowerCase()]?.rank;
  if (staticRank) return staticRank;
  const preset = PRESET_WORDS.find((w) => w.word === word.toLowerCase());
  return preset?.rank;
}

export function hasStaticWordDetail(word: string): boolean {
  return Boolean(PRESET_WORD_DETAILS[word.toLowerCase()]);
}
