import PRESET_DETAILS_JSON from "@/data/preset-word-details.json";
import VI_EXTRA_JSON from "@/data/static-vietnamese-extra.json";

/** Quick Vietnamese lookup for preset / common words */
export const STATIC_VIETNAMESE_EXTRA: Record<string, string> =
  VI_EXTRA_JSON as Record<string, string>;

function ownTrimmedString(
  record: Record<string, unknown>,
  key: string,
): string | undefined {
  if (!Object.hasOwn(record, key)) return undefined;
  const value = record[key];
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed || undefined;
}

export function getStaticVietnamese(word: string): string | undefined {
  const key = word.toLowerCase();
  const detail = Object.hasOwn(PRESET_DETAILS_JSON, key)
    ? (PRESET_DETAILS_JSON as Record<string, { vietnamese?: unknown }>)[key]
    : undefined;
  const fromDetail =
    typeof detail?.vietnamese === "string" ? detail.vietnamese : undefined;
  if (fromDetail?.trim()) return fromDetail.trim();
  return ownTrimmedString(STATIC_VIETNAMESE_EXTRA, key);
}

export function hasStaticVietnamese(word: string): boolean {
  return Boolean(getStaticVietnamese(word));
}
