/**
 * Backfill word_details.image_url with Pexels/Unsplash stock photos.
 *
 * Usage:
 *   npm run backfill:images
 *   npm run backfill:images -- --limit=100
 *   npm run backfill:images -- --dry-run
 *   npm run backfill:images -- --word=night
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { resolveImageSearchKeyword } from "../src/lib/image-keyword";
import {
  fetchWordImageUrl,
  isRealCardImageUrl,
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
  image_url: string | null;
};

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let dryRun = false;
  let word: string | null = null;
  for (const arg of args) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg.startsWith("--limit=")) {
      limit = Number.parseInt(arg.slice("--limit=".length), 10) || 0;
    } else if (arg.startsWith("--word=")) {
      word = arg.slice("--word=".length).trim().toLowerCase() || null;
    }
  }
  return { limit, dryRun, word };
}

async function sleep(ms: number) {
  await new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function main() {
  loadEnv();
  const { limit, dryRun, word } = parseArgs();

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
    .select("word, word_type, vietnamese_meaning, image_url")
    .order("word", { ascending: true });

  if (word) {
    query = query.eq("word", word);
  }

  const { data, error } = await query;
  if (error) throw error;

  const rows = (data ?? []) as WordDetailRow[];
  const targets = rows.filter((row) =>
    shouldRefreshImageUrl(row.image_url, row.word),
  );
  const batch = limit > 0 ? targets.slice(0, limit) : targets;

  console.log(
    `Stock image backfill: ${batch.length}/${targets.length} stale rows` +
      (word ? ` (word=${word})` : "") +
      (dryRun ? " [dry-run]" : ""),
  );

  let updated = 0;
  let stock = 0;
  let svg = 0;
  let failed = 0;

  for (const row of batch) {
    const keyword = resolveImageSearchKeyword(row.word, {
      pos: row.word_type,
      meaning: row.vietnamese_meaning,
    });

    try {
      const resolved = await fetchWordImageUrl(row.word, keyword, row.word_type);
      const isStock = isRealCardImageUrl(resolved, row.word);
      if (isStock) stock += 1;
      else svg += 1;

      if (!dryRun && resolved !== row.image_url) {
        const { error: updateError } = await supabase
          .from("word_details")
          .update({ image_url: resolved })
          .eq("word", row.word);
        if (updateError) throw updateError;
        updated += 1;
      }

      console.log(
        `${isStock ? "✓ stock" : "· svg "} ${row.word} → ${resolved.slice(0, 72)}${resolved.length > 72 ? "…" : ""}`,
      );
    } catch (err) {
      failed += 1;
      console.warn(`✗ ${row.word}:`, err instanceof Error ? err.message : err);
    }

    await sleep(350);
  }

  console.log(
    `\nDone. updated=${updated} stock=${stock} svg=${svg} failed=${failed}`,
  );
}

void main();
