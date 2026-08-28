#!/usr/bin/env npx tsx
/**
 * Export all 1000 jobs (rank 5001-6000) for jungle18 into batch jsonl files.
 * Output: /tmp/jungle18-batches/batch-000.jsonl .. batch-099.jsonl (10 words each)
 * Total: 100 batches = 1000 jobs.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";
import {
  CAST_WORD_IMAGE_BUNDLE,
} from "@/data/jungle-cast-image-framework";
import {
  buildJungleCastWordImagePrompt,
  getJungleCastWordReferences,
} from "@/data/jungle-cast-word-image-prompts";

const OUT_DIR = "/tmp/jungle18-batches";
mkdirSync(OUT_DIR, { recursive: true });

const RANK_FROM = 5001;
const RANK_TO = 6000;
const BUNDLE = CAST_WORD_IMAGE_BUNDLE; // "jungle18"

const words = getWordsInRange(RANK_FROM, RANK_TO).map((e) => e.word);
console.log(`Exporting jobs for ${words.length} words (rank ${RANK_FROM}..${RANK_TO})`);

const allJobs: Array<{
  word: string;
  filename: string;
  description: string;
  reference_image_paths: string[];
  aspect_ratio: string;
}> = [];

for (const word of words) {
  const prompt = buildJungleCastWordImagePrompt(word);
  const refs = getJungleCastWordReferences(word);
  if (!prompt || !refs) {
    console.error(`Missing prompt or refs for ${word}`);
    continue;
  }

  allJobs.push({
    word,
    filename: `${BUNDLE}-word-${word}`,
    description: prompt,
    reference_image_paths: refs.map((r) => resolve(process.cwd(), r)),
    aspect_ratio: "16:9",
  });
}

const BATCH_SIZE = 10;
const batchCount = Math.ceil(allJobs.length / BATCH_SIZE);

for (let i = 0; i < batchCount; i++) {
  const slice = allJobs.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);
  const batchNum = String(i).padStart(3, "0");
  const filePath = `${OUT_DIR}/batch-${batchNum}.jsonl`;
  const content = slice.map((j) => JSON.stringify(j)).join("\n") + "\n";
  writeFileSync(filePath, content, "utf8");
}

console.log(`Wrote ${allJobs.length} jobs across ${batchCount} batches into ${OUT_DIR}`);
const summaryFile = "/tmp/jungle18-jobs.jsonl";
writeFileSync(summaryFile, allJobs.map((j) => JSON.stringify(j)).join("\n") + "\n", "utf8");
console.log(`Wrote full list to ${summaryFile}`);
