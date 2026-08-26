#!/usr/bin/env npx tsx
/** List cast word images generated via Pollinations (no ref PNGs → wrong style). */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";
import { CAST_WORD_IMAGE_TOP_RANK } from "@/data/jungle-cast-image-framework";

const OUT = resolve(process.cwd(), "public/word-images");

function probe(word: string): { w: number; h: number; bad: boolean; reason: string } {
  const path = resolve(OUT, `${word}.jpg`);
  if (!existsSync(path)) return { w: 0, h: 0, bad: true, reason: "missing" };
  const info = execSync(`file -b "${path}"`, { encoding: "utf8" }).trim();
  const dim = info.match(/(\d+)x(\d+)/);
  const w = dim ? Number(dim[1]) : 0;
  const h = dim ? Number(dim[2]) : 0;
  if (info.includes("manufacturer=sana")) {
    return { w, h, bad: true, reason: "pollinations-exif" };
  }
  if (w === 1024 && h === 576) {
    return { w, h, bad: true, reason: "pollinations-1024x576" };
  }
  if (w < 1200) {
    return { w, h, bad: true, reason: "low-resolution" };
  }
  return { w, h, bad: false, reason: "ok" };
}

const words = getWordsInRange(1, CAST_WORD_IMAGE_TOP_RANK).map((e) => e.word);
const bad: Array<{ word: string; reason: string; w: number; h: number }> = [];
const ok: string[] = [];

for (const word of words) {
  const p = probe(word);
  if (p.bad) bad.push({ word, reason: p.reason, w: p.w, h: p.h });
  else ok.push(word);
}

console.log(JSON.stringify({ bad: bad.length, ok: ok.length, words: bad.map((b) => b.word), details: bad }, null, 2));
