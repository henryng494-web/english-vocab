#!/usr/bin/env node
/**
 * List missing jungle17 artifacts for batch JSONL files and emit GenerateImage-ready JSON lines.
 * Usage: node scripts/jungle17-batch-generate.mjs pending 050 059
 *        node scripts/jungle17-batch-generate.mjs count 050 059
 */
import fs from "node:fs";
import path from "node:path";

const ART = "/opt/cursor/artifacts/assets";
const BATCH_DIR = "/tmp/jungle17-batches";

function loadJobs(from, to) {
  const jobs = [];
  for (let i = from; i <= to; i++) {
    const n = String(i).padStart(3, "0");
    const file = path.join(BATCH_DIR, `batch-${n}.jsonl`);
    if (!fs.existsSync(file)) continue;
    for (const line of fs.readFileSync(file, "utf8").trim().split("\n")) {
      jobs.push(JSON.parse(line));
    }
  }
  return jobs;
}

function hasArtifact(filename) {
  const p = path.join(ART, filename);
  try {
    return fs.statSync(p).size > 0;
  } catch {
    return false;
  }
}

const [cmd, fromS, toS] = process.argv.slice(2);
const from = parseInt(fromS ?? "50", 10);
const to = parseInt(toS ?? "59", 10);
const jobs = loadJobs(from, to);

if (cmd === "count") {
  let have = 0;
  let miss = 0;
  for (const j of jobs) {
    if (hasArtifact(j.filename)) have++;
    else miss++;
  }
  console.log(JSON.stringify({ batches: `${String(from).padStart(3, "0")}-${String(to).padStart(3, "0")}`, total: jobs.length, have, miss }));
  process.exit(0);
}

if (cmd === "pending") {
  for (const j of jobs) {
    if (hasArtifact(j.filename)) continue;
    console.log(
      JSON.stringify({
        word: j.word,
        description: j.description,
        filename: j.filename,
        reference_image_paths: j.reference_image_paths,
        aspect_ratio: j.aspect_ratio,
      }),
    );
  }
  process.exit(0);
}

console.error("Usage: jungle17-batch-generate.mjs count|pending [from] [to]");
process.exit(1);
