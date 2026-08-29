#!/usr/bin/env node
/** Next missing jungle17 job for batches 050-059 (stdout = one JSON line). */
import fs from "node:fs";
import path from "node:path";

const ART = "/opt/cursor/artifacts/assets";
const from = parseInt(process.argv[2] ?? "50", 10);
const to = parseInt(process.argv[3] ?? "59", 10);

function has(name) {
  try {
    return fs.statSync(path.join(ART, name)).size > 0;
  } catch {
    return false;
  }
}

for (let b = from; b <= to; b++) {
  const n = String(b).padStart(3, "0");
  const lines = fs.readFileSync(`/tmp/jungle17-batches/batch-${n}.jsonl`, "utf8").trim().split("\n");
  for (const line of lines) {
    const job = JSON.parse(line);
    if (has(job.filename)) continue;
    console.log(
      JSON.stringify({
        word: job.word,
        description: job.description,
        filename: job.filename,
        reference_image_paths: job.reference_image_paths,
        aspect_ratio: job.aspect_ratio,
      }),
    );
    process.exit(0);
  }
}
process.exit(1);
