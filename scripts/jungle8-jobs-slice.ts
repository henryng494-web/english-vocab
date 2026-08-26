#!/usr/bin/env npx tsx
/** Print one JSON job per line for words [start, end) from manifest. */
import manifest from "./jungle8-manifest.json";

const start = Number(process.argv[2] ?? 0);
const end = Number(process.argv[3] ?? start + 10);

for (const entry of manifest.slice(start, end)) {
  process.stdout.write(
    JSON.stringify({
      word: entry.word,
      filename: `jungle8-word-${entry.word}`,
      description: entry.prompt,
      reference_image_paths: entry.refs,
      aspect_ratio: "16:9",
    }) + "\n",
  );
}
