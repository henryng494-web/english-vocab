/**
 * Re-enrich cached word_details rows that predate register + dual-meaning layout.
 *
 * Usage:
 *   npm run re-enrich:stale
 *   npm run re-enrich:stale -- --limit=100
 *   npm run re-enrich:stale -- --offset=100 --limit=100
 *   npm run re-enrich:stale -- --word=draw
 *   npm run re-enrich:stale -- --dry-run
 *
 * Production batch (after deploy, set CRON_SECRET):
 *   curl -H "Authorization: Bearer $CRON_SECRET" \
 *     "https://YOUR_APP/api/cron/re-enrich-stale?limit=25&offset=0"
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
  let limit = 0;
  let offset = 0;
  let dryRun = false;
  let word: string | null = null;

  for (const arg of args) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg.startsWith("--limit=")) {
      limit = Number.parseInt(arg.slice("--limit=".length), 10) || 0;
    } else if (arg.startsWith("--offset=")) {
      offset = Number.parseInt(arg.slice("--offset=".length), 10) || 0;
    } else if (arg.startsWith("--word=")) {
      word = arg.slice("--word=".length).trim().toLowerCase() || null;
    }
  }

  return { limit, offset, dryRun, word };
}

async function main() {
  loadEnv();
  const options = parseArgs();

  const supabase = createServiceSupabase();
  const result = await runStaleReEnrichBatch(supabase, {
    limit: options.word ? 1 : options.limit || 0,
    offset: options.word ? 0 : options.offset,
    word: options.word,
    dryRun: options.dryRun,
  });

  console.log(
    `Stale re-enrich: processed=${result.processed} updated=${result.updated}` +
      ` examples_only=${result.repairedExamplesOnly} failed=${result.failed}` +
      ` cached=${result.totalCached} stale=${result.totalStale} remaining=${result.remaining}` +
      (options.dryRun ? " [dry-run]" : ""),
  );
  console.log(
    `Reasons: bad_meaning=${result.reasonCounts.bad_meaning}` +
      ` misaligned_examples=${result.reasonCounts.misaligned_examples}` +
      ` missing_register=${result.reasonCounts.missing_register}` +
      ` legacy_register=${result.reasonCounts.legacy_register}` +
      ` outdated_register=${result.reasonCounts.outdated_register}` +
      ` embedded_hint=${result.reasonCounts.embedded_register_hint}` +
      ` missing_meaning=${result.reasonCounts.missing_meaning}`,
  );

  if (result.failures.length) {
    console.log("Failures:");
    for (const item of result.failures) {
      console.log(`  ${item.word}: ${item.error}`);
    }
  }

  if (result.nextOffset !== null) {
    console.log(
      `\nNext batch: npm run re-enrich:stale -- --limit=${options.limit || 25} --offset=${result.nextOffset}`,
    );
  }
}

void main();
