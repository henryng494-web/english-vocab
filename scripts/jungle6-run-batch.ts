#!/usr/bin/env npx tsx
/** Print generation jobs from jungle6-manifest.json for a slice [start, end). */
import manifest from "./jungle6-manifest.json";

const start = Number(process.argv[2] ?? 0);
const end = Number(process.argv[3] ?? manifest.length);

for (const entry of manifest.slice(start, end)) {
  console.log(JSON.stringify(entry));
}
