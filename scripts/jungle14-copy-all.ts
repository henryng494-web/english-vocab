#!/usr/bin/env npx tsx
/** Copy all jungle14 artifacts → public/word-images/{word}.jpg */
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const BUNDLE = process.env.JUNGLE_BUNDLE ?? "jungle14";
const JOBS = process.env.JUNGLE_JOBS ?? "/tmp/jungle14-jobs.jsonl";
const ART = "/opt/cursor/artifacts/assets";

const jobs = readFileSync(JOBS, "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l) as { word: string });

let ok = 0;
let fail = 0;
for (const { word } of jobs) {
  const artifact = `${ART}/${BUNDLE}-word-${word}`;
  if (!existsSync(artifact)) {
    console.error(`MISSING ${word}`);
    fail++;
    continue;
  }
  try {
    execSync(`./scripts/jungle-copy-artifact.sh ${word} ${BUNDLE}`, {
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
