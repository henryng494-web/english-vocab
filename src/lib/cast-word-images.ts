/**
 * Cast mascot word images — fox-trial delivery:
 * full-scene bundled JPEGs in /public/word-images/{word}.jpg
 * Generated via: npm run generate:cast-word-images
 */

import { getWordsInRange } from "@/data/preset-vocabulary";
import { requiresSafeImageOnly } from "@/lib/safe-image-search";

export { buildCastWordImagePrompt } from "@/data/cast-word-image-prompts";

/** Bump when replacing bundled cast JPEGs in public/word-images. */
export const CAST_WORD_IMAGE_BUNDLE = "cast2";
export const CAST_WORD_IMAGE_TOP_RANK = 100;

const CAST_WORDS = new Set(
  getWordsInRange(1, CAST_WORD_IMAGE_TOP_RANK).map((entry) => entry.word),
);

const STATIC_PATH_RE =
  /^\/word-images\/[a-z]+\.jpg(?:\?v=cast[\w-]+)?$/;

export function isCastWordImageWord(word: string): boolean {
  const normalized = word.trim().toLowerCase();
  if (!normalized || requiresSafeImageOnly(normalized)) return false;
  return CAST_WORDS.has(normalized);
}

export function getStaticCastWordImagePath(word: string): string | null {
  const key = word.trim().toLowerCase();
  if (!CAST_WORDS.has(key)) return null;
  return `/word-images/${key}.jpg?v=${CAST_WORD_IMAGE_BUNDLE}`;
}

export function isStaticCastWordImageUrl(
  url: string | null | undefined,
): boolean {
  return STATIC_PATH_RE.test(url?.trim() ?? "");
}

/** @deprecated Old SVG/API mascot URLs — force refresh to bundled JPEGs. */
export function isLegacyMascotPipelineUrl(
  url: string | null | undefined,
): boolean {
  const trimmed = url?.trim();
  if (!trimmed) return false;
  return (
    trimmed.includes("/api/mascot-image") ||
    trimmed.includes("mascot-cast-v")
  );
}
