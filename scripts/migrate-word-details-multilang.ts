/**
 * Backfill word_details.meanings + example_translations from legacy columns.
 *
 * Usage:
 *   npm run migrate:word-details-multilang
 *   npm run migrate:word-details-multilang -- --dry-run
 *   npm run migrate:word-details-multilang -- --limit=500
 *   npm run migrate:word-details-multilang -- --word=hole
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  migrateLegacyWordDetail,
  splitLegacyExamples,
} from "../src/lib/multilang-word-record";
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
    console.warn("Warning: .env.local not found — set Supabase keys manually.");
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let dryRun = false;
  let word: string | null = null;
  for (const arg of args) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg.startsWith("--limit=")) limit = Number(arg.slice(8)) || 0;
    else if (arg.startsWith("--word=")) word = arg.slice(7).trim().toLowerCase();
  }
  return { limit, dryRun, word };
}

type Row = Pick<
  WordDetail,
  | "word"
  | "phonetic"
  | "word_type"
  | "vietnamese_meaning"
  | "english_definition"
  | "examples"
  | "meanings"
  | "example_translations"
  | "collocations"
  | "image_url"
>;

async function main() {
  loadEnv();
  const { limit, dryRun, word } = parseArgs();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  let query = supabase
    .from("word_details")
    .select(
      "word, phonetic, word_type, vietnamese_meaning, english_definition, examples, meanings, example_translations, collocations, image_url",
    )
    .order("word");

  if (word) query = query.eq("word", word);

  const pageSize = limit > 0 ? Math.min(limit, 500) : 500;
  let offset = 0;
  let updated = 0;
  let scanned = 0;

  while (true) {
    const { data, error } = await query.range(offset, offset + pageSize - 1);
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
    const rows = (data ?? []) as Row[];
    if (!rows.length) break;

    for (const row of rows) {
      scanned += 1;
      const detail = row as WordDetail;
      const record = migrateLegacyWordDetail({
        ...detail,
        id: "",
      });
      const split = splitLegacyExamples(record.examples);
      const examples = split.examples ?? record.examples ?? "";
      const example_translations =
        record.example_translations.length > 0
          ? record.example_translations
          : split.example_translations;

      const payload = {
        examples,
        meanings: record.meanings,
        example_translations,
        vietnamese_meaning: record.meanings.vi?.trim() ?? row.vietnamese_meaning ?? "",
      };

      const needsUpdate =
        JSON.stringify(row.meanings ?? {}) !== JSON.stringify(payload.meanings) ||
        JSON.stringify(row.example_translations ?? []) !==
          JSON.stringify(payload.example_translations) ||
        (row.examples ?? "") !== examples;

      if (!needsUpdate) continue;

      updated += 1;
      if (dryRun) {
        console.log(`[dry-run] ${row.word}`);
        continue;
      }

      const { error: upErr } = await supabase
        .from("word_details")
        .update(payload)
        .eq("word", row.word);
      if (upErr) {
        console.warn(`Failed ${row.word}:`, upErr.message);
      }
    }

    if (limit > 0 && scanned >= limit) break;
    if (rows.length < pageSize) break;
    offset += pageSize;
  }

  console.log(
    `Done. scanned=${scanned} updated=${updated}${dryRun ? " (dry-run)" : ""}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
