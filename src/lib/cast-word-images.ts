/**
 * Cast mascot word images — Jungle Jokers cast delivery:
 * full-scene bundled JPEGs in /public/word-images/{word}.jpg
 */

import { requiresSafeImageOnly } from "@/lib/safe-image-search";
import {
  CAST_WORD_IMAGE_BUNDLE,
  CAST_WORD_IMAGE_TOP_RANK,
} from "@/data/jungle-cast-image-framework";
import { CAST_WORD_KEYS } from "@/data/cast-word-keys";

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

const CAST_WORDS = new Set(CAST_WORD_KEYS);

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

/** Client-safe headword guesses (no frequency tables): strip common inflection/derivation suffixes. */
function inflectionStems(key: string): string[] {
  const out = new Set<string>();
  const add = (stem: string) => {
    if (stem.length >= 3 && stem !== key) out.add(stem);
  };
  const rules: [RegExp, string[]][] = [
    [/ies$/, ["y"]],
    [/ied$/, ["y"]],
    [/ier$/, ["y"]],
    [/iest$/, ["y"]],
    [/ily$/, ["y"]],
    [/(s|x|z|ch|sh)es$/, ["$1"]],
    [/s$/, [""]],
    [/ed$/, ["", "e"]],
    [/ing$/, ["", "e"]],
    [/er$/, ["", "e"]],
    [/est$/, ["", "e"]],
    [/ly$/, [""]],
    [/(.)\1(ed|ing|er|est)$/, ["$1"]],
  ];
  for (const [pattern, replacements] of rules) {
    if (!pattern.test(key)) continue;
    for (const rep of replacements) add(key.replace(pattern, rep));
  }
  return [...out];
}

/** Resolve the on-disk cast JPEG key for any surface form (inflection, alias). */
export function resolveCastWordImageKey(word: string): string | null {
  const key = normalize(word);
  if (!key || requiresSafeImageOnly(key)) return null;

  const candidates = new Set<string>();
  candidates.add(key);
  const alias = CAST_SPELLING_ALIASES[key];
  if (alias) candidates.add(alias);
  for (const head of inflectionStems(key)) {
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
