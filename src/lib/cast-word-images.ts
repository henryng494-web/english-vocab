/**
 * Cast mascot word images — Jungle Jokers cast delivery:
 * full-scene bundled JPEGs in /public/word-images/{word}.jpg
 * Jungle Jokers cast (jungle10 bundle — rank 1–150 semantic scenes + teaching props).
 */

import { getWordsInRange } from "@/data/preset-vocabulary";
import { requiresSafeImageOnly } from "@/lib/safe-image-search";
import {
  CAST_WORD_IMAGE_BUNDLE,
  CAST_WORD_IMAGE_TOP_RANK,
} from "@/data/jungle-cast-image-framework";

export {
  buildJungleCastWordImagePrompt as buildCastWordImagePrompt,
  getJungleCastWordReferences,
  JUNGLE_WORD_IMAGE_ENTRIES as CAST_WORD_IMAGE_ENTRIES,
  JUNGLE_WORD_IMAGE_SCENES as CAST_WORD_IMAGE_SCENES,
} from "@/data/jungle-cast-word-image-prompts";
export {
  CAST_WORD_IMAGE_BUNDLE,
  CAST_WORD_IMAGE_TOP_RANK,
  JUNGLE_CAST_FRAMEWORK_VERSION,
  JUNGLE_CAST_IMAGE_FRAMEWORK,
} from "@/data/jungle-cast-image-framework";
export {
  APP_MASCOT_BRAND,
  MASCOT_BRAND_COLORS,
  MASCOT_PUBLIC_PATHS,
  MASCOT_SHAPE_SPEC,
  WELCOME_HERO_IMAGES,
  WELCOME_SPLASH_ART,
  WELCOME_SPLASH_IMAGE,
  getMascotPublicPath,
  getWelcomeHeroByIndex,
  getWelcomeHeroPath,
} from "@/data/jungle-cast-brand";

const CAST_WORDS = new Set(
  getWordsInRange(1, CAST_WORD_IMAGE_TOP_RANK).map((entry) => entry.word),
);

const STATIC_PATH_RE =
  /^\/word-images\/[a-z]+\.jpg(?:\?v=(?:cast[\w-]+|jungle[\w-]+))?$/;

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
    trimmed.includes("mascot-cast-v") ||
    /[?&]v=cast\d/.test(trimmed)
  );
}
