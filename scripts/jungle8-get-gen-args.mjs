#!/usr/bin/env node
/** Print GenerateImage args JSON for one word. Usage: node scripts/jungle8-get-gen-args.mjs <word> */
import { readFileSync, existsSync } from "node:fs";

const word = process.argv[2]?.trim().toLowerCase();
if (!word) {
  console.error("Usage: jungle8-get-gen-args.mjs <word>");
  process.exit(1);
}

const paths = [
  `/tmp/gen-${word}-args.json`,
  `/tmp/gen-args/${word}.json`,
  `/tmp/invoke-${word}.json`,
];

for (const p of paths) {
  if (!existsSync(p)) continue;
  const raw = JSON.parse(readFileSync(p, "utf8"));
  const args = raw.arguments ?? raw;
  process.stdout.write(
    JSON.stringify({
      description: args.description,
      filename: args.filename ?? `jungle8-word-${word}`,
      reference_image_paths: args.reference_image_paths,
      aspect_ratio: args.aspect_ratio ?? "16:9",
    }),
  );
  process.exit(0);
}

console.error(`No args found for ${word}`);
process.exit(1);
