#!/usr/bin/env npx tsx
/** Update cast-generation-report.json after jungle8 batch. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

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

const words = process.argv.slice(2);
if (words.length === 0) {
  console.error("Usage: jungle8-update-report.ts <word> [word...]");
  process.exit(1);
}

let report: Report = {
  bundle: "jungle8",
  target: 100,
  ok: 0,
  fail: 0,
  failed: [],
  okWords: [],
  at: new Date().toISOString(),
};

if (existsSync(REPORT)) {
  try {
    const prev = JSON.parse(readFileSync(REPORT, "utf8")) as Report;
    if (prev.bundle === "jungle8") report = { ...report, ...prev, okWords: prev.okWords ?? [] };
  } catch {
    /* fresh report */
  }
}

const okSet = new Set(report.okWords ?? []);
const failSet = new Set(report.failed);

for (const word of words) {
  const key = word.trim().toLowerCase();
  const jpg = resolve(OUT_DIR, `${key}.jpg`);
  if (existsSync(jpg) && readFileSync(jpg).length > 10_000) {
    okSet.add(key);
    failSet.delete(key);
  } else {
    failSet.add(key);
    okSet.delete(key);
  }
}

report.okWords = [...okSet].sort();
report.failed = [...failSet].sort();
report.ok = report.okWords.length;
report.fail = report.failed.length;
report.at = new Date().toISOString();

writeFileSync(REPORT, JSON.stringify(report, null, 2) + "\n");
console.log(`jungle8 report: ok=${report.ok} fail=${report.fail}`);
