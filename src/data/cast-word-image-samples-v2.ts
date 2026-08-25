/**
 * Expression-flexible sample prompts (v2 preview) — re-exports from main prompt module.
 * Kept for preview scripts; rank 1–100 uses cast-word-image-prompts.ts (cast3).
 */

export {
  CAST_DESIGN_ONLY,
  buildCastWordImagePrompt as buildExpressionSamplePrompt,
} from "@/data/cast-word-image-prompts";

import { CAST_WORD_IMAGE_ENTRIES } from "@/data/cast-word-image-prompts";

const PREVIEW_WORDS = ["sorry", "yes", "no", "think", "love"] as const;

/** Five preview words with explicit per-character expression direction. */
export const CAST_EXPRESSION_SAMPLES = Object.fromEntries(
  PREVIEW_WORDS.map((word) => {
    const entry = CAST_WORD_IMAGE_ENTRIES[word]!;
    return [
      word,
      {
        label: word,
        scene: entry.scene,
        expressions: entry.expressions,
      },
    ];
  }),
) as Readonly<
  Record<
    (typeof PREVIEW_WORDS)[number],
    { label: string; scene: string; expressions: string }
  >
>;
