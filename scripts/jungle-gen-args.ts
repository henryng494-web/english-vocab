#!/usr/bin/env npx tsx
/**
 * Emit GenerateImage job specs for Jungle cast bundle.
 * Usage: jungle-gen-args.ts [rankFrom] [rankTo] [start] [count] [--pending]
 * Example (next 50 words): jungle-gen-args.ts 101 150 0 50 --pending
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";
import {
  CAST_WORD_IMAGE_BUNDLE,
  CAST_WORD_IMAGE_TOP_RANK,
} from "@/data/jungle-cast-image-framework";
import {
  buildJungleCastWordImagePrompt,
  getJungleCastWordReferences,
} from "@/data/jungle-cast-word-image-prompts";

const ART = "/opt/cursor/artifacts/assets";
const rankFrom = Number(process.argv[2] ?? 1);
const rankTo = Number(process.argv[3] ?? CAST_WORD_IMAGE_TOP_RANK);
const start = Number(process.argv[4] ?? 0);
const count = Number(process.argv[5] ?? 9999);
const onlyPending = process.argv.includes("--pending");
const bundle = process.env.JUNGLE_BUNDLE ?? CAST_WORD_IMAGE_BUNDLE;

const words = getWordsInRange(rankFrom, rankTo).map((e) => e.word);
const slice = words.slice(start, start + count);

let shown = 0;
for (const word of slice) {
  const artifact = `${ART}/${bundle}-word-${word}`;
  if (onlyPending && existsSync(artifact)) continue;

  const prompt = buildJungleCastWordImagePrompt(word);
  const refs = getJungleCastWordReferences(word);
  if (!prompt || !refs) {
    console.error(`skip ${word}: missing prompt or refs`);
    continue;
  }

  console.log(
    JSON.stringify({
      word,
      filename: `${bundle}-word-${word}`,
      description: prompt,
      reference_image_paths: refs.map((r) => resolve(process.cwd(), r)),
      aspect_ratio: "16:9",
    }),
  );
  shown++;
}

console.error(
  `rank=${rankFrom}-${rankTo} words=${slice.length} emitted=${shown} start=${start} bundle=${bundle}`,
);
