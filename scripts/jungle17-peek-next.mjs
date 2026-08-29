#!/usr/bin/env node
/** Print compact GenerateImage args for next pending job (batches 050-059). */
import { execSync } from "node:child_process";

const raw = execSync("node /workspace/scripts/jungle17-next-job.mjs 50 59", {
  encoding: "utf8",
}).trim();
const j = JSON.parse(raw);
console.log(
  JSON.stringify({
    word: j.word,
    filename: j.filename,
    aspect_ratio: j.aspect_ratio || "16:9",
    reference_image_paths: j.reference_image_paths,
    description_len: j.description.length,
  }),
);
// Full job on stderr for agent to read file
process.stderr.write(raw);
