/**
 * Jungle Jokers — locked image-generation framework (rank 1–150).
 * Single source of truth for cast word-image pipeline v9.
 *
 * DO NOT change without bumping FRAMEWORK_VERSION and CAST_WORD_IMAGE_BUNDLE.
 */
export const CAST_WORD_IMAGE_BUNDLE = "jungle10";
export const CAST_WORD_IMAGE_TOP_RANK = 150;

import {
  JUNGLE_CAST_CHARACTER_REFS,
  JUNGLE_CAST_LINEUP_PATH,
} from "@/data/jungle-cast-refs";
import {
  JUNGLE_CAST_NAME,
  JUNGLE_CAST_DESIGN_ONLY,
  JUNGLE_CAST_SHAPE_LOCK,
  JUNGLE_CAST_BACKGROUND_RULE,
  JUNGLE_CAST_SEMANTIC_RULE,
  JUNGLE_CAST_FRAMING_RULE,
  JUNGLE_CAST_CAST_SIZE_RULE,
} from "@/data/jungle-cast-samples";

/** Bump when framework rules or pipeline change (independent of image bundle). */
export const JUNGLE_CAST_FRAMEWORK_VERSION = "jungle10-v1";

export const JUNGLE_CAST_IMAGE_FRAMEWORK = {
  version: JUNGLE_CAST_FRAMEWORK_VERSION,
  bundle: CAST_WORD_IMAGE_BUNDLE,
  castName: JUNGLE_CAST_NAME,
  wordRankRange: { from: 1, to: CAST_WORD_IMAGE_TOP_RANK },

  /** Character reference PNGs — use per-character only in generation. */
  characterRefs: JUNGLE_CAST_CHARACTER_REFS,
  /** NEVER pass lineup to GenerateImage (causes extra limbs + all-four casts). */
  lineupPath: JUNGLE_CAST_LINEUP_PATH,
  useLineupInGeneration: false,

  aspectRatio: "16:9" as const,
  outputFormat: "jpeg" as const,
  outputPathPattern: "/word-images/{word}.jpg?v={bundle}",
  minWidth: 1536,

  castPolicy: {
    soloRotation: "even across monkey, elephant, crocodile, tiger (~15–16 each)",
    duoDefault: 14,
    allFourMaxPercent: 25,
    allFourWords: [
      "we", "all", "yes", "people", "love", "help", "with", "because", "two",
      "okay", "they", "some", "come", "give", "thank", "please", "sure",
      "never", "more", "well", "good", "know", "think", "see", "want",
    ],
  },

  promptLayers: {
    design: JUNGLE_CAST_DESIGN_ONLY,
    shapeLock: JUNGLE_CAST_SHAPE_LOCK,
    semantic: JUNGLE_CAST_SEMANTIC_RULE,
    background: JUNGLE_CAST_BACKGROUND_RULE,
    framing: JUNGLE_CAST_FRAMING_RULE,
    castSize: JUNGLE_CAST_CAST_SIZE_RULE,
  },

  /** Source files — edit prompts here, then rebuild/regenerate. */
  sourceFiles: {
    wordEntries: "src/data/jungle-cast-word-image-prompts.ts",
    samples: "src/data/jungle-cast-samples.ts",
    refs: "src/data/jungle-cast-refs.ts",
    brand: "src/data/jungle-cast-brand.ts",
    semanticRebuild: "scripts/rebuild-jungle-semantic-prompts.ts",
    castRebalance: "scripts/rebalance-jungle-casts.ts",
  },

  /** Generation pipeline — order matters. */
  pipeline: [
    "buildJungleCastWordImagePrompt(word) from jungle-cast-word-image-prompts.ts",
    "getJungleCastWordReferences(word) — per-character PNGs only, NEVER lineup",
    "GenerateImage (Cursor) or Gemini image API with reference_image_paths, 16:9",
    "Save artifact as {bundle}-word-{word}",
    "scripts/jungle-copy-artifact.sh {word} — copy + ffmpeg PNG→JPEG + reject Pollinations",
    "npx tsx scripts/detect-pollinations-cast-images.ts — must report bad: 0",
    "Bump CAST_WORD_IMAGE_BUNDLE in src/lib/cast-word-images.ts",
    "Update public/word-images/cast-generation-report.json",
  ],

  npmScripts: {
    generate: "npm run generate:cast-word-images",
    scan: "npm run scan:jungle-word-images",
    fix: "npm run fix:jungle-word-images",
    qa: "npm run qa:jungle-word-images",
    rebuildPrompts: "npm run rebuild:jungle-semantic-prompts",
    exportFramework: "npm run export:jungle-cast-framework",
    detectBad: "npm run detect:pollinations-cast-images",
    genArgs: "npm run jungle:gen-args",
  },

  forbidden: [
    "Pollinations / Flux without reference PNGs (produces wrong humans at 1024×576)",
    "jungle-jokers-lineup.png in GenerateImage reference_image_paths",
    "PNG saved as .jpg without ffmpeg conversion",
    "Generic scenes like 'acting out meaning of word' with no teaching props",
    "Full-room backgrounds — white canvas + grounded props only",
  ],

  validation: {
    detectScript: "scripts/detect-pollinations-cast-images.ts",
    rejectExif: "manufacturer=sana",
    rejectDimensions: "1024x576",
    qaReport: "public/word-images/jungle-qa-report.json",
    generationReport: "public/word-images/cast-generation-report.json",
  },
} as const;

export type JungleCastImageFramework = typeof JUNGLE_CAST_IMAGE_FRAMEWORK;
