import PRESET_DETAILS_JSON from "@/data/preset-word-details.json";
import VI_EXTRA_JSON from "@/data/static-vietnamese-extra.json";

/** Quick Vietnamese lookup for preset / common words */
export const STATIC_VIETNAMESE_EXTRA: Record<string, string> =
  VI_EXTRA_JSON as Record<string, string>;

export function getStaticVietnamese(word: string): string | undefined {
  const key = word.toLowerCase();
  const fromDetail = (PRESET_DETAILS_JSON as Record<string, { vietnamese?: string }>)[
    key
  ]?.vietnamese;
  if (fromDetail?.trim()) return fromDetail.trim();
  return STATIC_VIETNAMESE_EXTRA[key]?.trim() || undefined;
}

export function hasStaticVietnamese(word: string): boolean {
  return Boolean(getStaticVietnamese(word));
}
