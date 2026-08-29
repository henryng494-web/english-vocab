/**
 * Count word_details rows with bad Vietnamese glosses (no Gemini calls).
 *
 * Usage:
 *   npm run audit:meanings
 *   npm run audit:meanings -- --limit=20
 *   npm run audit:meanings -- --sample
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { isEncyclopedicGloss } from "../src/lib/meaning-quality";
import {
  getStaleWordDetailReason,
  type StaleWordDetailReason,
} from "../src/lib/persisted-word-detail";
import { parseVietnameseMeanings } from "../src/lib/word-meanings";
import { createServiceSupabase } from "../src/lib/supabase/admin";
import type { WordDetail } from "../src/types/database";

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
    console.warn("Warning: .env.local not found — set Supabase env vars manually.");
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let sample = false;
  for (const arg of args) {
    if (arg === "--sample") sample = true;
    else if (arg.startsWith("--limit=")) {
      limit = Number.parseInt(arg.slice("--limit=".length), 10) || 0;
    }
  }
  return { limit, sample };
}

async function main() {
  loadEnv();
  const { limit, sample } = parseArgs();
  const supabase = createServiceSupabase();

  const rows: WordDetail[] = [];
  let pageOffset = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("word_details")
      .select("*")
      .order("word", { ascending: true })
      .range(pageOffset, pageOffset + pageSize - 1);
    if (error) throw new Error(error.message);
    if (!data?.length) break;
    rows.push(...(data as WordDetail[]));
    if (data.length < pageSize) break;
    pageOffset += pageSize;
  }

  const reasonCounts: Record<StaleWordDetailReason, number> = {
    missing_meaning: 0,
    missing_register: 0,
    legacy_register: 0,
    outdated_register: 0,
    embedded_register_hint: 0,
    bad_meaning: 0,
    misaligned_examples: 0,
  };

  const encyclopedicSamples: string[] = [];
  let encyclopedicLines = 0;

  for (const row of rows) {
    const reason = getStaleWordDetailReason(row);
    if (reason) reasonCounts[reason] += 1;

    for (const line of parseVietnameseMeanings(row.vietnamese_meaning)) {
      if (isEncyclopedicGloss(line)) {
        encyclopedicLines += 1;
        if (encyclopedicSamples.length < (limit || 15)) {
          encyclopedicSamples.push(`${row.word}: ${line}`);
        }
      }
    }
  }

  const totalStale = Object.values(reasonCounts).reduce((sum, n) => sum + n, 0);
  const pct = rows.length
    ? ((reasonCounts.bad_meaning / rows.length) * 100).toFixed(1)
    : "0";

  console.log(`word_details rows: ${rows.length}`);
  console.log(`stale total: ${totalStale}`);
  console.log(
    JSON.stringify(
      {
        bad_meaning: reasonCounts.bad_meaning,
        bad_meaning_pct: `${pct}%`,
        misaligned_examples: reasonCounts.misaligned_examples,
        missing_register: reasonCounts.missing_register,
        legacy_register: reasonCounts.legacy_register,
        embedded_register_hint: reasonCounts.embedded_register_hint,
        missing_meaning: reasonCounts.missing_meaning,
        encyclopedic_gloss_lines: encyclopedicLines,
      },
      null,
      2,
    ),
  );

  if (sample || encyclopedicSamples.length) {
    console.log("\nEncyclopedic gloss samples:");
    for (const line of encyclopedicSamples) {
      console.log(`  ${line}`);
    }
  }
}

void main();
