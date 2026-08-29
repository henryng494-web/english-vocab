#!/usr/bin/env node
/**
 * Emit next N pending jungle17 jobs (batches 011-019) as compact JSON for GenerateImage.
 * Skips artifacts that already exist in /opt/cursor/artifacts/assets/
 */
import fs from "node:fs";
import path from "node:path";

const ART = "/opt/cursor/artifacts/assets";
const BATCHES = [11, 12, 13, 14, 15, 16, 17, 18, 19];

function hasArtifact(filename) {
  try {
    return fs.statSync(path.join(ART, filename)).size > 0;
  } catch {
    return false;
  }
}

function loadPending() {
  const jobs = [];
  for (const b of BATCHES) {
    const file = `/tmp/jungle17-batches/batch-${String(b).padStart(3, "0")}.jsonl`;
    for (const line of fs.readFileSync(file, "utf8").trim().split("\n")) {
      const j = JSON.parse(line);
      if (!hasArtifact(j.filename)) jobs.push(j);
    }
  }
  return jobs;
}

const n = parseInt(process.argv[2] ?? "2", 10);
const jobs = loadPending().slice(0, n);
console.log(JSON.stringify(jobs));
