#!/usr/bin/env npx tsx
/** Generate cast images for a rank range. Usage: generate-cast-word-images-rank-range.ts 101 150 */
import { spawnSync } from "node:child_process";
import { getWordsInRange } from "@/data/preset-vocabulary";

const from = Number(process.argv[2] ?? 101);
const to = Number(process.argv[3] ?? 150);
const words = getWordsInRange(from, to).map((e) => e.word);

if (words.length === 0) {
  console.error(`No words in rank ${from}-${to}`);
  process.exit(1);
}

console.error(`Generating ${words.length} cast images (rank ${from}-${to})…`);
const result = spawnSync(
  "npx",
  ["tsx", "scripts/generate-cast-word-images.ts", ...words],
  { stdio: "inherit", cwd: process.cwd(), env: process.env },
);
process.exit(result.status ?? 1);
