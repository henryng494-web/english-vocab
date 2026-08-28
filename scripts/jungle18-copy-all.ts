#!/usr/bin/env npx tsx
/** Copy bundle artifacts → public/word-images/{word}.jpg (default jungle18). */
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const BUNDLE = process.env.JUNGLE_BUNDLE ?? "jungle18";
const JOBS = process.env.JUNGLE_JOBS ?? "/tmp/jungle18-jobs.jsonl";
const ART = "/opt/cursor/artifacts/assets";

const jobs = readFileSync(JOBS, "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l) as { word: string });

let ok = 0;
let fail = 0;
for (const { word } of jobs) {
  const artifact = `${ART}/${BUNDLE}-word-${word}`;
  const hasArt =
    existsSync(artifact) ||
    existsSync(`${artifact}.png`) ||
    existsSync(`${artifact}.jpg`) ||
    existsSync(`${artifact}.jpeg`);
  if (!hasArt) {
    console.error(`MISSING ${word}`);
    fail++;
    continue;
  }
  try {
    execSync(`./scripts/jungle18-copy.sh ${word} ${BUNDLE}`, {
      stdio: "pipe",
    });
    ok++;
  } catch {
    console.error(`FAIL copy ${word}`);
    fail++;
  }
}
console.log(`COPY DONE ok=${ok} fail=${fail}`);
process.exit(fail > 0 ? 1 : 0);
