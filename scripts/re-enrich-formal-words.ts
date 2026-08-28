/**
 * Re-enrich formal/legal words via Gemini and upsert word_details
 * (dual meanings, register badge, sense-matched examples).
 *
 * Usage:
 *   npm run re-enrich:formal
 *   npm run re-enrich:formal -- --word=hereby
 *   npm run re-enrich:formal -- --words=scripts/formal-words.txt
 *   npm run re-enrich:formal -- --from-db --limit=50
 *   npm run re-enrich:formal -- --dry-run --delay=2000
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPresetRank } from "../src/data/preset-word-details";
import { enrichWord } from "../src/lib/enrich-word";
import { enrichmentToDiscoverWord } from "../src/lib/enrichment-helpers";
import { sanitizeVietnameseText } from "../src/lib/sanitize-vi";
import {
  decodeRegisterFromCollocation,
  parseVietnameseMeanings,
} from "../src/lib/word-meanings";
import { isPersistableWordImageUrl } from "../src/lib/unsplash";

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

/** Common formal/legal function words that need register + trang trọng glosses. */
const DEFAULT_FORMAL_WORDS = [
  "hereby",
  "thereby",
  "whereby",
  "henceforth",
  "hitherto",
  "heretofore",
  "pursuant",
  "aforesaid",
  "aforementioned",
  "notwithstanding",
  "forthwith",
  "herein",
  "hereof",
  "thereof",
  "wherein",
  "whereof",
  "therein",
  "wherefore",
  "hereinafter",
  "thereinafter",
  "hereunder",
  "thereunder",
  "whereupon",
  "herewith",
  "therewith",
  "whereafter",
  "hereafter",
  "thereafter",
];

type WordDetailRow = {
  word: string;
  vietnamese_meaning: string | null;
  collocations: string | null;
  image_url: string | null;
};

const DEFAULT_BATCH_DELAY_MS = 2500;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let dryRun = false;
  let fromDb = false;
  let word: string | null = null;
  let wordsFile: string | null = null;
  let delayMs = DEFAULT_BATCH_DELAY_MS;
  for (const arg of args) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--from-db") fromDb = true;
    else if (arg.startsWith("--limit=")) {
      limit = Number.parseInt(arg.slice("--limit=".length), 10) || 0;
    } else if (arg.startsWith("--word=")) {
      word = arg.slice("--word=".length).trim().toLowerCase() || null;
    } else if (arg.startsWith("--words=")) {
      wordsFile = arg.slice("--words=".length).trim() || null;
    } else if (arg.startsWith("--delay=")) {
      delayMs = Number.parseInt(arg.slice("--delay=".length), 10) || DEFAULT_BATCH_DELAY_MS;
    }
  }
  return { limit, dryRun, fromDb, word, wordsFile, delayMs };
}

function loadWordsFromFile(path: string): string[] {
  const content = readFileSync(resolve(process.cwd(), path), "utf8");
  return content
    .split(/\r?\n/)
    .map((line) => line.trim().toLowerCase())
    .filter(Boolean);
}

function summarizeRow(row: WordDetailRow | null | undefined) {
  if (!row) return "(no row)";
  const meanings = parseVietnameseMeanings(row.vietnamese_meaning);
  const register = decodeRegisterFromCollocation(row.collocations);
  return `meanings=${meanings.length} [${meanings.join(" | ")}] register=${register ?? "—"}`;
}

async function sleep(ms: number) {
  await new Promise((resolveSleep) => setTimeout(resolveSleep, ms));
}

async function resolveTargetWords(
  supabase: SupabaseClient,
  options: ReturnType<typeof parseArgs>,
): Promise<string[]> {
  if (options.word) return [options.word];
  if (options.wordsFile) return loadWordsFromFile(options.wordsFile);

  if (options.fromDb) {
    const { data, error } = await supabase
      .from("word_details")
      .select("word, vietnamese_meaning, collocations, image_url")
      .order("word", { ascending: true });
    if (error) throw new Error(error.message ?? "Failed to load word_details");

    const stale = ((data ?? []) as WordDetailRow[]).filter((row) => {
      const register = decodeRegisterFromCollocation(row.collocations);
      const meaningCount = parseVietnameseMeanings(row.vietnamese_meaning).length;
      return !register || meaningCount === 0;
    });
    const words = stale.map((row) => row.word);
    return options.limit > 0 ? words.slice(0, options.limit) : words;
  }

  const words = [...DEFAULT_FORMAL_WORDS];
  return options.limit > 0 ? words.slice(0, options.limit) : words;
}

async function main() {
  loadEnv();
  const options = parseArgs();

  if (!process.env.GEMINI_API_KEY?.trim()) {
    throw new Error("Missing GEMINI_API_KEY — required for re-enrich.");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!supabaseUrl || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or Supabase key in env.");
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const targets = await resolveTargetWords(supabase, options);

  console.log(
    `Formal re-enrich: ${targets.length} word(s)` +
      (options.dryRun ? " [dry-run]" : "") +
      ` · delay=${options.delayMs}ms`,
  );

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const word of targets) {
    try {
      const { data: existingRow } = await supabase
        .from("word_details")
        .select("word, vietnamese_meaning, collocations, image_url")
        .eq("word", word)
        .maybeSingle();

      const existing = (existingRow ?? null) as WordDetailRow | null;
      console.log(`\n→ ${word}`);
      console.log(`  before: ${summarizeRow(existing)}`);

      const rank = getPresetRank(word) ?? 5000;
      const enrichment = await enrichWord(word, { rank, forceGemini: true });
      const mapped = enrichmentToDiscoverWord(
        word,
        enrichment,
        existing?.image_url ?? null,
      );

      const payload = {
        phonetic: mapped.phonetic ?? `/${word}/`,
        word_type: mapped.word_type ?? "unknown",
        vietnamese_meaning:
          sanitizeVietnameseText(mapped.vietnamese_meaning) || word,
        english_definition: mapped.english_definition ?? "",
        examples: mapped.examples ?? "",
        collocations: mapped.collocations ?? null,
        image_url:
          existing?.image_url &&
          isPersistableWordImageUrl(existing.image_url, word)
            ? existing.image_url
            : null,
      };

      const afterSummary = summarizeRow({
        word,
        vietnamese_meaning: payload.vietnamese_meaning,
        collocations: payload.collocations,
        image_url: payload.image_url,
      });
      console.log(`  after:  ${afterSummary}`);
      console.log(`  source: ${enrichment.source ?? "gemini"}`);

      if (options.dryRun) {
        skipped += 1;
        continue;
      }

      const { error: upsertError } = await supabase
        .from("word_details")
        .upsert({ word, ...payload }, { onConflict: "word" });
      if (upsertError) throw upsertError;

      updated += 1;
      console.log("  ✓ upserted");
    } catch (err) {
      failed += 1;
      console.warn(
        `  ✗ ${word}:`,
        err instanceof Error ? err.message : err,
      );
    }

    if (targets.indexOf(word) < targets.length - 1) {
      await sleep(options.delayMs);
    }
  }

  console.log(
    `\nDone. updated=${updated} dry-run=${skipped} failed=${failed}`,
  );
}

void main();
