#!/usr/bin/env npx tsx
/** Emit GenerateImage job specs for jungle9 bundle. Usage: jungle9-gen-args.ts [start] [count] */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";
import {
  buildJungleCastWordImagePrompt,
  getJungleCastWordReferences,
} from "@/data/jungle-cast-word-image-prompts";

const ART = "/opt/cursor/artifacts/assets";
const start = Number(process.argv[2] ?? 0);
const count = Number(process.argv[3] ?? 100);
const onlyPending = process.argv.includes("--pending");

const words = getWordsInRange(1, 100).map((e) => e.word);
const slice = words.slice(start, start + count);

let shown = 0;
for (const word of slice) {
  const artifact = `${ART}/jungle9-word-${word}`;
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
      filename: `jungle9-word-${word}`,
      description: prompt,
      reference_image_paths: refs.map((r) => resolve(process.cwd(), r)),
      aspect_ratio: "16:9",
    }),
  );
  shown++;
}

console.error(`words=${slice.length} emitted=${shown} start=${start}`);
