/**
 * OPTIONAL batch backfill (can hit Gemini quota). Prefer runtime prefetch:
 * POST /api/words/prefetch-locale from Journey/Review (next 10 words).
 *
 * AI backfill Spanish glosses + example_translations.es for existing word_details.
 * (Structural migrate only copies VI — run `npm run migrate:word-details-multilang` first.)
 *
 * Usage:
 *   npm run backfill:word-details-es
 *   npm run backfill:word-details-es -- --dry-run
 *   npm run backfill:word-details-es -- --limit=50
 *   npm run backfill:word-details-es -- --word=velvet
 *   npm run backfill:word-details-es -- --delay=800
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  buildLocaleBackfillPayload,
  wordDetailNeedsLocaleBackfill,
} from "../src/lib/backfill-word-detail-locale";
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
    console.warn("Warning: .env.local not found — set keys manually.");
  }
}

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let dryRun = false;
  let word: string | null = null;
  let delayMs = 600;
  for (const arg of args) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg.startsWith("--limit=")) limit = Number(arg.slice(8)) || 0;
    else if (arg.startsWith("--word=")) word = arg.slice(7).trim().toLowerCase();
    else if (arg.startsWith("--delay=")) delayMs = Number(arg.slice(8)) || 600;
  }
  return { limit, dryRun, word, delayMs };
}

function wait(ms: number): Promise<void> {
  return new Promise((resolveWait) => setTimeout(resolveWait, ms));
}

type Row = WordDetail;

async function main() {
  loadEnv();
  const { limit, dryRun, word, delayMs } = parseArgs();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    process.exit(1);
  }
  if (!process.env.GEMINI_API_KEY?.trim()) {
    console.error("Missing GEMINI_API_KEY — ES example backfill requires Gemini.");
    process.exit(1);
  }

  const supabase = createClient(url, key);
  let query = supabase
    .from("word_details")
    .select("*")
    .order("word");

  if (word) query = query.eq("word", word);

  const pageSize = 100;
  let offset = 0;
  let scanned = 0;
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  while (true) {
    const { data, error } = await query.range(offset, offset + pageSize - 1);
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
    const rows = (data ?? []) as Row[];
    if (!rows.length) break;

    for (const row of rows) {
      if (limit > 0 && scanned >= limit) break;
      scanned += 1;

      const detail: WordDetail = { ...row, id: row.id ?? "" };
      if (!wordDetailNeedsLocaleBackfill(detail, "es")) {
        skipped += 1;
        continue;
      }

      if (dryRun) {
        console.log(`[dry-run] would backfill es: ${row.word}`);
        updated += 1;
        continue;
      }

      try {
        const payload = await buildLocaleBackfillPayload(detail, "es");
        if (!payload) {
          console.warn(`No ES payload for "${row.word}" — skipped`);
          failed += 1;
          continue;
        }

        const { error: upErr } = await supabase
          .from("word_details")
          .update({
            examples: payload.examples,
            meanings: payload.meanings,
            example_translations: payload.example_translations,
            vietnamese_meaning: payload.vietnamese_meaning,
          })
          .eq("word", row.word);

        if (upErr) {
          console.warn(`Update failed ${row.word}:`, upErr.message);
          failed += 1;
        } else {
          updated += 1;
          console.log(`Updated es: ${row.word}`);
        }
      } catch (err) {
        console.warn(`Backfill failed ${row.word}:`, err);
        failed += 1;
      }

      if (delayMs > 0) await wait(delayMs);
    }

    if (limit > 0 && scanned >= limit) break;
    if (rows.length < pageSize) break;
    offset += pageSize;
  }

  console.log(
    `Done. scanned=${scanned} updated=${updated} skipped=${skipped} failed=${failed}${dryRun ? " (dry-run)" : ""}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
