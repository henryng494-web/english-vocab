#!/usr/bin/env node
/** Append generation progress for jungle17 batches 050-059. */
import fs from "node:fs";
import { execSync } from "node:child_process";

const LOG = "/tmp/jungle17-batch-050-059-progress.jsonl";
const counts = JSON.parse(
  execSync("python3 /workspace/scripts/jungle17-emit-050-059.py count", { encoding: "utf8" }),
);
const entry = { ts: new Date().toISOString(), ...counts, note: process.argv.slice(2).join(" ") };
fs.appendFileSync(LOG, JSON.stringify(entry) + "\n");
console.log(JSON.stringify(entry));
