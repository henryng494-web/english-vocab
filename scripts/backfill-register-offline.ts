/**
 * Migrate register metadata without Gemini — safe when API quota is exhausted.
 *
 * - missing_register → __register:v3:neutral
 * - outdated_register (v2) → __register:v3:{same value}
 * - legacy_register → __register:v3:neutral (or parsed legacy value)
 *
 * Usage: npm run backfill:register
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  decodeRegisterFromCollocation,
  encodeRegisterCollocation,
  type WordRegister,
} from "../src/lib/word-meanings";
import {
  getStaleWordDetailReason,
  type StaleWordDetailReason,
} from "../src/lib/persisted-word-detail";
import { createServiceSupabase } from "../src/lib/supabase/admin";
import type { WordDetail } from "../src/types/database";

const BATCH_SIZE = 100;
const DB_PAGE_SIZE = 1000;

async function fetchAllWordDetails(supabase: ReturnType<typeof createServiceSupabase>) {
  const all: WordDetail[] = [];
  let pageOffset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("word_details")
      .select("word, collocations, vietnamese_meaning, word_type, examples, english_definition")
      .order("word", { ascending: true })
      .range(pageOffset, pageOffset + DB_PAGE_SIZE - 1);

    if (error) throw error;
    if (!data?.length) break;

    all.push(...(data as WordDetail[]));
    if (data.length < DB_PAGE_SIZE) break;
    pageOffset += DB_PAGE_SIZE;
  }

  return all;
}

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
    /* cloud agent secrets */
  }
}

function targetRegister(
  row: WordDetail,
  reason: StaleWordDetailReason,
): WordRegister {
  if (reason === "missing_register") return "neutral";
  const decoded = decodeRegisterFromCollocation(row.collocations);
  if (decoded) return decoded;
  return "neutral";
}

async function main() {
  loadEnv();
  const supabase = createServiceSupabase();

  const rows = await fetchAllWordDetails(supabase);

  const counts: Record<string, number> = {};
  const pending: Array<{ word: string; collocations: string }> = [];

  for (const row of rows) {
    const reason = getStaleWordDetailReason(row);
    if (!reason) continue;
    if (
      reason !== "missing_register" &&
      reason !== "outdated_register" &&
      reason !== "legacy_register"
    ) {
      continue;
    }

    const register = targetRegister(row, reason);
    const collocations = encodeRegisterCollocation(register);
    if (!collocations || collocations === row.collocations) continue;

    pending.push({ word: row.word, collocations });
    counts[reason] = (counts[reason] ?? 0) + 1;
  }

  for (let index = 0; index < pending.length; index += BATCH_SIZE) {
    const batch = pending.slice(index, index + BATCH_SIZE);
    await Promise.all(
      batch.map(async (item) => {
        const { error: updateError } = await supabase
          .from("word_details")
          .update({ collocations: item.collocations })
          .eq("word", item.word);
        if (updateError) throw updateError;
      }),
    );
  }

  console.log(
    JSON.stringify(
      {
        total_rows: rows.length,
        updated: pending.length,
        skipped: rows.length - pending.length,
        by_reason: counts,
      },
      null,
      2,
    ),
  );
}

void main();
