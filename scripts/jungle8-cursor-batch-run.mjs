#!/usr/bin/env node
/**
 * Copy jungle8 GenerateImage artifacts and track progress.
 * Usage: node scripts/jungle8-cursor-batch-run.mjs copy <word> [word...]
 *        node scripts/jungle8-cursor-batch-run.mjs status
 *        node scripts/jungle8-cursor-batch-run.mjs pending
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const ART = "/opt/cursor/artifacts/assets";
const OUT = resolve(process.cwd(), "public/word-images");
const BAD_WORDS =
  "if at now come one how well want think good see let why who as will from when back okay yes time look take an man where would some hey tell or say something down then little way make too never by over more mean very off sorry give thank love people please sure any only because two much sir maybe help".split(
    " ",
  );

function probe(word) {
  const path = resolve(OUT, `${word}.jpg`);
  if (!existsSync(path)) return { word, status: "missing" };
  const info = execSync(`file -b "${path}"`, { encoding: "utf8" }).trim();
  const dim = info.match(/(\d+)x(\d+)/);
  const w = dim ? Number(dim[1]) : 0;
  const h = dim ? Number(dim[2]) : 0;
  if (info.includes("manufacturer=sana") || (w === 1024 && h === 576)) {
    return { word, status: "bad-pollinations", w, h };
  }
  if (w >= 1200) return { word, status: "ok", w, h };
  return { word, status: "low-res", w, h };
}

const cmd = process.argv[2];

if (cmd === "copy") {
  const words = process.argv.slice(3);
  let ok = 0;
  let fail = 0;
  for (const word of words) {
    try {
      execSync(`./scripts/jungle8-copy-artifact.sh ${word}`, {
        stdio: "inherit",
        cwd: process.cwd(),
      });
      ok++;
    } catch {
      console.error(`FAIL copy ${word}`);
      fail++;
    }
  }
  console.log(`copy: ok=${ok} fail=${fail}`);
  process.exit(fail > 0 ? 1 : 0);
}

if (cmd === "status") {
  const results = BAD_WORDS.map(probe);
  const ok = results.filter((r) => r.status === "ok");
  const bad = results.filter((r) => r.status !== "ok");
  console.log(JSON.stringify({ ok: ok.length, bad: bad.length, badWords: bad.map((b) => b.word) }, null, 2));
  process.exit(bad.length > 0 ? 1 : 0);
}

if (cmd === "pending") {
  const pending = BAD_WORDS.filter((w) => {
    const p = probe(w);
    return p.status !== "ok";
  });
  for (const word of pending) {
    const argsPath = `/tmp/gen-args/${word}.json`;
    if (!existsSync(argsPath)) continue;
    const args = JSON.parse(readFileSync(argsPath, "utf8"));
    console.log(JSON.stringify({ word, ...args }));
  }
  console.error(`pending=${pending.length}`);
  process.exit(0);
}

console.error("Usage: jungle8-cursor-batch-run.mjs copy|status|pending");
process.exit(1);
