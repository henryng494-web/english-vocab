/**
 * Cast mascot word images — Jungle Jokers cast delivery:
 * full-scene bundled JPEGs in /public/word-images/{word}.jpg
 */

import { requiresSafeImageOnly } from "@/lib/safe-image-search";
import {
  CAST_WORD_IMAGE_BUNDLE,
  CAST_WORD_IMAGE_TOP_RANK,
} from "@/data/jungle-cast-image-framework";
import { JUNGLE_WORD_IMAGE_ENTRIES } from "@/data/jungle-cast-word-image-prompts";
import { getFamilyHeadword } from "@/lib/word-family";

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

const CAST_WORDS = new Set(Object.keys(JUNGLE_WORD_IMAGE_ENTRIES));

/** British / variant spellings → bundled preset headword with a cast JPEG. */
const CAST_SPELLING_ALIASES: Readonly<Record<string, string>> = {
  counsellor: "counsel",
  counselor: "counsel",
  counselling: "counsel",
  counseling: "counsel",
  labelled: "label",
  labeled: "label",
  favourite: "favorite",
  colour: "color",
  honour: "honor",
  behaviour: "behavior",
  centre: "center",
  theatre: "theater",
  metre: "meter",
  defence: "defense",
  offence: "offense",
  licence: "license",
  practise: "practice",
};

const STATIC_PATH_RE =
  /^\/word-images\/[a-z]+\.jpg(?:\?v=(?:cast[\w-]+|jungle[\w-]+))?$/;

function normalize(word: string): string {
  return word.trim().toLowerCase();
}

/** Resolve the on-disk cast JPEG key for any surface form (inflection, alias). */
export function resolveCastWordImageKey(word: string): string | null {
  const key = normalize(word);
  if (!key || requiresSafeImageOnly(key)) return null;

  const candidates = new Set<string>();
  candidates.add(key);
  const alias = CAST_SPELLING_ALIASES[key];
  if (alias) candidates.add(alias);
  const head = getFamilyHeadword(key);
  if (head) {
    candidates.add(head);
    const headAlias = CAST_SPELLING_ALIASES[head];
    if (headAlias) candidates.add(headAlias);
  }

  for (const candidate of candidates) {
    if (CAST_WORDS.has(candidate)) return candidate;
  }
  return null;
}

export function isCastWordImageWord(word: string): boolean {
  return resolveCastWordImageKey(word) !== null;
}

export function getStaticCastWordImagePath(word: string): string | null {
  const key = resolveCastWordImageKey(word);
  if (!key) return null;
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

/**
 * Bundled cast JPEG for review quizzes — always prefer mascot art over stale stock.
 */
export function resolveCastPreferredImagePath(word: string): string | null {
  return getStaticCastWordImagePath(word);
}
