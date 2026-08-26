#!/usr/bin/env npx tsx
/** Copy all available jungle8 artifacts and print pending words. */
import { existsSync } from "node:fs";
import { execSync } from "node:child_process";
import manifest from "./jungle8-manifest.json";

const ART = "/opt/cursor/artifacts/assets";
const copied: string[] = [];
const missing: string[] = [];

for (const { word } of manifest) {
  const src = `${ART}/jungle8-word-${word}`;
  if (!existsSync(src)) {
    missing.push(word);
    continue;
  }
  try {
    execSync(`./scripts/jungle8-copy-artifact.sh ${word}`, { stdio: "pipe" });
    copied.push(word);
  } catch {
    missing.push(word);
  }
}

console.log(JSON.stringify({ copied: copied.length, missing: missing.length, pending: missing }, null, 2));
