/**
 * Run stale re-enrich in a loop until all rows match the new word card structure:
 * - everyday Vietnamese glosses (not encyclopedic)
 * - register badge (informal / neutral / formal)
 * - aligned bilingual examples
 *
 * NEVER paste API keys in chat — put them in .env.local only.
 *
 * Usage:
 *   npm run re-enrich:all
 *   npm run re-enrich:all -- --limit=20 --max-batches=10
 *   npm run re-enrich:all -- --dry-run
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runStaleReEnrichBatch } from "../src/lib/re-enrich-stale-batch";
import { createServiceSupabase } from "../src/lib/supabase/admin";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(envPath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const val = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    console.warn("Warning: .env.local not found — set Supabase + GEMINI_API_KEY manually.");
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 25;
  let maxBatches = 0;
  let dryRun = false;
  let delayMs = 2500;

  for (const arg of args) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg.startsWith("--limit=")) {
      limit = Number.parseInt(arg.slice("--limit=".length), 10) || 25;
    } else if (arg.startsWith("--max-batches=")) {
      maxBatches = Number.parseInt(arg.slice("--max-batches=".length), 10) || 0;
    } else if (arg.startsWith("--delay-ms=")) {
      delayMs = Number.parseInt(arg.slice("--delay-ms=".length), 10) || 2500;
    }
  }

  return { limit, maxBatches, dryRun, delayMs };
}

async function main() {
  loadEnv();

  if (!process.env.GEMINI_API_KEY?.trim()) {
    console.error("Missing GEMINI_API_KEY — add it to .env.local (do NOT paste keys in chat).");
    process.exit(1);
  }

  const { limit, maxBatches, dryRun, delayMs } = parseArgs();
  const supabase = createServiceSupabase();

  let batch = 0;
  let totalUpdated = 0;
  let totalFailed = 0;
  let previousStale = Number.POSITIVE_INFINITY;

  console.log(
    `Re-enrich all stale rows${dryRun ? " [dry-run]" : ""} — batch size ${limit}`,
  );

  while (true) {
    batch += 1;
    if (maxBatches > 0 && batch > maxBatches) {
      console.log(`Stopped after ${maxBatches} batches (--max-batches).`);
      break;
    }

    const result = await runStaleReEnrichBatch(supabase, {
      limit,
      offset: 0,
      dryRun,
      delayMs,
    });

    totalUpdated += result.updated;
    totalFailed += result.failed;

    const remaining = Math.max(0, result.totalStale - result.processed);

    console.log(
      `[batch ${batch}] processed=${result.processed} updated=${result.updated}` +
        ` failed=${result.failed} stale=${result.totalStale} remaining=${remaining}`,
    );
    console.log(
      `  bad_meaning=${result.reasonCounts.bad_meaning}` +
        ` misaligned_examples=${result.reasonCounts.misaligned_examples}` +
        ` missing_register=${result.reasonCounts.missing_register}` +
        ` outdated_register=${result.reasonCounts.outdated_register}`,
    );

    if (result.failures.length) {
      for (const item of result.failures) {
        console.log(`  FAIL ${item.word}: ${item.error}`);
      }
    }

    if (dryRun || result.totalStale === 0 || result.processed === 0) {
      break;
    }

    if (result.totalStale >= previousStale) {
      console.log(
        `Stale count unchanged at ${result.totalStale} — stopping to avoid a retry loop.`,
      );
      break;
    }

    previousStale = result.totalStale;
  }

  console.log(
    `\nDone. batches=${batch} total_updated=${totalUpdated} total_failed=${totalFailed}`,
  );
}

void main();
