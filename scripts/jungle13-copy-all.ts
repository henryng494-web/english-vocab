#!/usr/bin/env npx tsx
/** Copy all jungle13 artifacts → public/word-images/{word}.jpg */
import { existsSync, readFileSync } from "node:fs";
import { execSync } from "node:child_process";

const ART = "/opt/cursor/artifacts/assets";
const jobs = readFileSync("/tmp/jungle13-jobs.jsonl", "utf8")
  .trim()
  .split("\n")
  .map((l) => JSON.parse(l) as { word: string });

let ok = 0;
let fail = 0;
for (const { word } of jobs) {
  const artifact = `${ART}/jungle13-word-${word}`;
  if (!existsSync(artifact)) {
    console.error(`MISSING ${word}`);
    fail++;
    continue;
  }
  try {
    execSync(`./scripts/jungle-copy-artifact.sh ${word} jungle13`, {
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
