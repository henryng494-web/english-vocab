#!/usr/bin/env npx tsx
/** Export GenerateImage jobs for preset headwords missing public JPGs. */
import { writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";
import { CAST_WORD_IMAGE_BUNDLE } from "@/data/jungle-cast-image-framework";
import {
  buildJungleCastWordImagePrompt,
  getJungleCastWordReferences,
  JUNGLE_WORD_IMAGE_ENTRIES,
} from "@/data/jungle-cast-word-image-prompts";

const missing = getWordsInRange(1, 6000)
  .map((e) => e.word)
  .filter((w) => !existsSync(`public/word-images/${w}.jpg`));

const jobs = [];
for (const word of missing) {
  if (!(word in JUNGLE_WORD_IMAGE_ENTRIES)) continue;
  const prompt = buildJungleCastWordImagePrompt(word);
  const refs = getJungleCastWordReferences(word);
  if (!prompt || !refs) continue;
  jobs.push({
    word,
    filename: `${CAST_WORD_IMAGE_BUNDLE}-word-${word}`,
    description: prompt,
    reference_image_paths: refs.map((r) => resolve(process.cwd(), r)),
    aspect_ratio: "16:9",
  });
}

writeFileSync(
  "/tmp/jungle18-missing-jobs.jsonl",
  jobs.map((j) => JSON.stringify(j)).join("\n") + "\n",
);
console.log(`Exported ${jobs.length} missing jobs`);
