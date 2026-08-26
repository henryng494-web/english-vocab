#!/usr/bin/env npx tsx
/** Update cast-generation-report.json after jungle9 batch. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";

const REPORT = resolve(process.cwd(), "public/word-images/cast-generation-report.json");
const OUT_DIR = resolve(process.cwd(), "public/word-images");

type Report = {
  bundle: string;
  target: number;
  ok: number;
  fail: number;
  failed: string[];
  at: string;
  okWords?: string[];
};

const allWords = getWordsInRange(1, 100).map((e) => e.word);
const okWords: string[] = [];
const failed: string[] = [];

for (const word of allWords) {
  const jpg = resolve(OUT_DIR, `${word}.jpg`);
  if (existsSync(jpg) && readFileSync(jpg).length > 10_000) {
    okWords.push(word);
  } else {
    failed.push(word);
  }
}

const report: Report = {
  bundle: "jungle9",
  target: 100,
  ok: okWords.length,
  fail: failed.length,
  failed: failed.sort(),
  okWords: okWords.sort(),
  at: new Date().toISOString(),
};

writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
console.log(`jungle9 report: ok=${report.ok} fail=${report.fail}`);
