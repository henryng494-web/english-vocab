#!/usr/bin/env node
/** Load one pending job by word from batches 050-059, or next if no word arg. */
import fs from "node:fs";
import path from "node:path";

const ART = "/opt/cursor/artifacts/assets";
const wordArg = process.argv[2];

function has(filename) {
  try {
    return fs.statSync(path.join(ART, filename)).size > 0;
  } catch {
    return false;
  }
}

function allPending() {
  const jobs = [];
  for (let b = 50; b <= 59; b++) {
    const n = String(b).padStart(3, "0");
    for (const line of fs.readFileSync(`/tmp/jungle17-batches/batch-${n}.jsonl`, "utf8").trim().split("\n")) {
      const job = JSON.parse(line);
      if (!has(job.filename)) jobs.push(job);
    }
  }
  return jobs;
}

const pending = allPending();
const job = wordArg ? pending.find((j) => j.word === wordArg) : pending[0];
if (!job) process.exit(1);
console.log(JSON.stringify(job));
