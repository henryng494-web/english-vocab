#!/usr/bin/env npx tsx
/**
 * Emit GenerateImage job specs for pending jungle8 words.
 * Usage: jungle8-pending-jobs.ts [start] [count]
 */
import { existsSync } from "node:fs";
import manifest from "./jungle8-manifest.json";

const ART = "/opt/cursor/artifacts/assets";
const start = Number(process.argv[2] ?? 0);
const count = Number(process.argv[3] ?? 10);

const pending = manifest.filter(
  (e) => !existsSync(`${ART}/jungle8-word-${e.word}`),
);

for (const entry of pending.slice(start, start + count)) {
  console.log(
    JSON.stringify({
      word: entry.word,
      filename: `jungle8-word-${entry.word}`,
      description: entry.prompt,
      reference_image_paths: entry.refs,
      aspect_ratio: "16:9",
    }),
  );
}

console.error(`pending=${pending.length} showing=${Math.min(count, pending.length - start)}`);
