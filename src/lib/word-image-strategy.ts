/**
 * Central routing for vocabulary card images.
 *
 * ## Optimal resolution order (by tier)
 *
 * | Tier            | Words                         | Gemini? | Stock fallback      | On miss   |
 * |-----------------|-------------------------------|---------|---------------------|-----------|
 * | safe-svg        | profanity / adult             | ✗       | ✗                   | SVG       |
 * | function-word   | the, and, that, of, what…     | ✗       | curated + strict    | SVG       |
 * | homonym         | bank, bat, mole…              | ✓       | meaning disambiguate| stock/SVG |
 * | abstract-lexical| adj, adv, opaque verbs        | ✓       | abstract scenes     | stock/SVG |
 * | concrete-lexical| nouns, action verbs           | ✓       | curated + meaning   | stock/SVG |
 *
 * Function words never use Gemini or random hash fallbacks — stock search
 * cannot reliably depict closed-class grammar, so curated scenes + SVG win.
 */

import { isHomonymWord } from "@/lib/homonym-image-keywords";
import { isAbstractImagePos } from "@/lib/image-keyword";
import { isHighTrafficFunctionWord } from "@/lib/function-word-images";
import { requiresSafeImageOnly } from "@/lib/safe-image-search";

export type WordImageTier =
  | "safe-svg"
  | "function-word"
  | "homonym"
  | "abstract-lexical"
  | "concrete-lexical";

export type WordImageResolutionPlan = {
  tier: WordImageTier;
  /** Skip Gemini phrase generation — curated/SVG is more reliable. */
  skipGemini: boolean;
  /** Never pick a random safe photo when metadata scoring fails. */
  skipHashFallback: boolean;
  /** Minimum scoreImageMetadata threshold for accepting a stock photo. */
  minMetadataScore: number;
  /** Prefer local SVG illustration instead of legacy/wrong stock on total miss. */
  preferSvgOnMiss: boolean;
  /** Tag successful stock URLs with fw=1 for cache invalidation. */
  tagFunctionWord: boolean;
};

const CLOSED_CLASS_POS = new Set([
  "preposition",
  "conjunction",
  "pronoun",
  "determiner",
  "article",
]);

/** Closed-class grammar words — not general verbs/adjectives. */
export function isClosedClassWord(
  word: string,
  pos?: string | null,
): boolean {
  const normalizedPos = pos?.trim().toLowerCase();
  return (
    isHighTrafficFunctionWord(word) ||
    Boolean(normalizedPos && CLOSED_CLASS_POS.has(normalizedPos))
  );
}

export function classifyWordImageTier(
  word: string,
  pos?: string | null,
): WordImageTier {
  if (requiresSafeImageOnly(word)) return "safe-svg";
  if (isClosedClassWord(word, pos)) return "function-word";
  if (isHomonymWord(word)) return "homonym";
  if (isAbstractImagePos(pos)) return "abstract-lexical";
  return "concrete-lexical";
}

const PLANS: Record<WordImageTier, WordImageResolutionPlan> = {
  "safe-svg": {
    tier: "safe-svg",
    skipGemini: true,
    skipHashFallback: true,
    minMetadataScore: Infinity,
    preferSvgOnMiss: true,
    tagFunctionWord: false,
  },
  "function-word": {
    tier: "function-word",
    skipGemini: true,
    skipHashFallback: true,
    minMetadataScore: 4,
    preferSvgOnMiss: true,
    tagFunctionWord: true,
  },
  homonym: {
    tier: "homonym",
    skipGemini: false,
    skipHashFallback: true,
    minMetadataScore: 2,
    preferSvgOnMiss: false,
    tagFunctionWord: false,
  },
  "abstract-lexical": {
    tier: "abstract-lexical",
    skipGemini: false,
    skipHashFallback: true,
    minMetadataScore: 2,
    preferSvgOnMiss: false,
    tagFunctionWord: false,
  },
  "concrete-lexical": {
    tier: "concrete-lexical",
    skipGemini: false,
    skipHashFallback: false,
    minMetadataScore: 0,
    preferSvgOnMiss: false,
    tagFunctionWord: false,
  },
};

export function resolveWordImagePlan(
  word: string,
  pos?: string | null,
): WordImageResolutionPlan {
  return PLANS[classifyWordImageTier(word, pos)];
}

/** @deprecated Use isClosedClassWord — kept for existing imports. */
export function prefersCuratedFunctionWordImage(
  word: string,
  pos?: string | null,
): boolean {
  return isClosedClassWord(word, pos);
}
