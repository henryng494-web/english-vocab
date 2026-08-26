#!/usr/bin/env npx tsx
/** Build jungle8 cast-generation-report.json from artifact presence. */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";

const ART = "/opt/cursor/artifacts/assets";
const OUT = resolve(process.cwd(), "public/word-images");
const words = getWordsInRange(1, 100).map((e) => e.word);

const okWords: string[] = [];
const failed: string[] = [];

for (const word of words) {
  const jpg = resolve(OUT, `${word}.jpg`);
  const art = `${ART}/jungle8-word-${word}`;
  const ok =
    existsSync(jpg) &&
    readFileSync(jpg).length > 10_000 &&
    existsSync(art);
  if (ok) okWords.push(word);
  else failed.push(word);
}

const report = {
  bundle: "jungle8",
  target: 100,
  ok: okWords.length,
  fail: failed.length,
  failed: failed.sort(),
  okWords: okWords.sort(),
  at: new Date().toISOString(),
};

writeFileSync(
  resolve(OUT, "cast-generation-report.json"),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(JSON.stringify(report, null, 2));
