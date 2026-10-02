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
  const key = word.toLowerCase();
  if (!Object.hasOwn(PRESET_WORD_DETAILS, key)) return undefined;
  return PRESET_WORD_DETAILS[key];
}

export function hasStaticWordDetail(word: string): boolean {
  return Object.hasOwn(PRESET_WORD_DETAILS, word.toLowerCase());
}
