/**
 * Backfill word_details.image_url via Gemini→Unsplash (primary) with fallbacks.
 *
 * Usage:
 *   npm run backfill:images
 *   npm run backfill:images -- --limit=100
 *   npm run backfill:images -- --dry-run
 *   npm run backfill:images -- --force
 *   npm run backfill:images -- --word=night
 *   npm run backfill:images -- --delay=3000
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import {
  fetchWordImageUrlDetailed,
  isPersistableWordImageUrl,
  isPlaceholderIllustrationUrl,
  shouldRefreshImageUrl,
} from "../src/lib/unsplash";

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
    console.warn("Warning: .env.local not found — set Supabase + API keys manually.");
  }
}

type WordDetailRow = {
  word: string;
  word_type: string | null;
  vietnamese_meaning: string | null;
  english_definition: string | null;
  image_url: string | null;
};

/** Delay between words when batch-fetching images (ms). Override: --delay=3000 */
const DEFAULT_BATCH_DELAY_MS = 2500;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let dryRun = false;
  let force = false;
  let word: string | null = null;
  let delayMs = DEFAULT_BATCH_DELAY_MS;
  for (const arg of args) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--force") force = true;
    else if (arg.startsWith("--limit=")) {
      limit = Number.parseInt(arg.slice("--limit=".length), 10) || 0;
    } else if (arg.startsWith("--word=")) {
      word = arg.slice("--word=".length).trim().toLowerCase() || null;
    } else if (arg.startsWith("--delay=")) {
      delayMs = Number.parseInt(arg.slice("--delay=".length), 10) || DEFAULT_BATCH_DELAY_MS;
    }
  }
  return { limit, dryRun, force, word, delayMs };
}

async function sleep(ms: number) {
  await new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function main() {
  loadEnv();
  const { limit, dryRun, force, word, delayMs } = parseArgs();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or Supabase key in env.");
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  let query = supabase
    .from("word_details")
    .select(
      "word, word_type, vietnamese_meaning, english_definition, image_url",
    )
    .order("word", { ascending: true });

  if (word) {
    query = query.eq("word", word);
  }

  const { data, error } = await query;
  if (error) {
    console.error("Backfill query failed:", error);
    throw new Error(error.message ?? "Failed to load word_details");
  }

  const rows = (data ?? []) as WordDetailRow[];
  const targets = force
    ? rows
    : rows.filter(
        (row) =>
          shouldRefreshImageUrl(row.image_url, row.word) ||
          isPlaceholderIllustrationUrl(row.image_url),
      );
  const batch = limit > 0 ? targets.slice(0, limit) : targets;

  console.log(
    `Stock image backfill: ${batch.length}/${targets.length} stale rows` +
      (word ? ` (word=${word})` : "") +
      (dryRun ? " [dry-run]" : "") +
      ` · delay=${delayMs}ms`,
  );

  let updated = 0;
  let stock = 0;
  let svg = 0;
  let failed = 0;

  for (const row of batch) {
    try {
      const resolved = await fetchWordImageUrlDetailed(
        row.word,
        null,
        row.word_type,
        row.vietnamese_meaning,
        row.english_definition,
        row.image_url,
      );
      const imageUrl = resolved.url;
      const isStock = isPersistableWordImageUrl(imageUrl, row.word);
      if (isStock) stock += 1;
      else svg += 1;

      if (!dryRun && isStock && imageUrl !== row.image_url) {
        const { error: updateError } = await supabase
          .from("word_details")
          .update({ image_url: imageUrl })
          .eq("word", row.word);
        if (updateError) throw updateError;
        updated += 1;
      }

      console.log(
        `${isStock ? "✓ stock" : "· svg "} ${row.word} → ${imageUrl.slice(0, 72)}${imageUrl.length > 72 ? "…" : ""}`,
      );
    } catch (err) {
      failed += 1;
      console.warn(`✗ ${row.word}:`, err instanceof Error ? err.message : err);
    }

    if (batch.indexOf(row) < batch.length - 1) {
      await sleep(delayMs);
    }
  }

  console.log(
    `\nDone. updated=${updated} stock=${stock} svg=${svg} failed=${failed}`,
  );
}

void main();
