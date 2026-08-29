#!/usr/bin/env node
/** Print next N pending call JSON objects from /tmp/jungle17-calls-011-019 */
import fs from "node:fs";
import path from "node:path";

const ART = "/opt/cursor/artifacts/assets";
const DIR = "/tmp/jungle17-calls-011-019";
const n = parseInt(process.argv[2] ?? "2", 10);

function ok(fn) {
  try {
    return fs.statSync(path.join(ART, fn)).size > 0;
  } catch {
    return false;
  }
}

const pending = [];
for (const f of fs.readdirSync(DIR).sort()) {
  const j = JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8"));
  if (!ok(j.filename)) pending.push(j);
  if (pending.length >= n) break;
}
console.log(JSON.stringify(pending));
