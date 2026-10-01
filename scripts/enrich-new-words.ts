/**
 * Enrich English card content for PRESET_WORDS in a rank range that are not yet
 * in word_details, then persist them (translations are filled afterwards by
 * `npm run backfill:translations`).
 *
 *   RANK_MIN=1 RANK_MAX=5000 npm run enrich:new-words
 *
 * Env:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY (required)
 *   RANK_MIN=1 RANK_MAX=5000   — PRESET_WORDS rank window
 *   LIMIT=0                    — cap number of new words (0 = all)
 *   CONCURRENCY=16
 *   MAX_ATTEMPTS=2             — per word; then marked failed and skipped
 *   DRY_RUN=1                  — list missing words only
 *
 * Images are not fetched here: image_url stays null and /api/word-image fills
 * stock photos lazily (see AGENTS.md).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PRESET_WORDS } from "@/data/preset-vocabulary";
import { enrichWord } from "@/lib/enrich-word";
import { serializeExamples } from "@/lib/parse-examples";
import { isExcludedVocabWord } from "@/lib/proper-noun";

function loadEnv(): void {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      if (!process.env[key]) process.env[key] = trimmed.slice(eq + 1);
    }
  } catch {
    console.warn("Warning: .env.local not found — set env vars manually.");
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !serviceKey || !process.env.GEMINI_API_KEY?.trim()) {
  console.error(
    "Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey);
const rankMin = Number(process.env.RANK_MIN ?? "1");
const rankMax = Number(process.env.RANK_MAX ?? "5000");
const limit = Number(process.env.LIMIT ?? "0");
const concurrency = Math.max(1, Number(process.env.CONCURRENCY ?? "16"));
const maxAttempts = Math.max(1, Number(process.env.MAX_ATTEMPTS ?? "2"));
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const MAX_CONSECUTIVE_BILLING_ERRORS = 8;

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function existingWords(): Promise<Set<string>> {
  const have = new Set<string>();
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("word_details")
      .select("word")
      .range(from, from + 999);
    if (error) throw error;
    for (const row of data ?? []) have.add(row.word as string);
    if ((data ?? []).length < 1000) break;
    from += 1000;
  }
  return have;
}

function isBillingError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return /402|401|payment required|credits are depleted|API key not valid/i.test(
    msg,
  );
}

async function main(): Promise<void> {
  const have = await existingWords();
  let todo = PRESET_WORDS.filter(
    (w) =>
      w.rank >= rankMin &&
      w.rank <= rankMax &&
      !have.has(w.word) &&
      !isExcludedVocabWord(w.word),
  );
  if (limit > 0) todo = todo.slice(0, limit);

  console.log(
    `rank ${rankMin}-${rankMax}: ${todo.length} new words to enrich (concurrency=${concurrency}, maxAttempts=${maxAttempts}, dryRun=${dryRun})`,
  );
  if (dryRun || todo.length === 0) return;

  let cursor = 0;
  let done = 0;
  let inserted = 0;
  let failed = 0;
  let consecutiveBilling = 0;
  let abort = false;
  const failedWords: string[] = [];

  async function processWord(word: string, rank: number): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const e = await enrichWord(word, { rank });
        if (e.source === "basic" || e.fromFallback) {
          throw new Error("enrichment fell back to basic (Gemini unavailable)");
        }
        const { error } = await supabase.from("word_details").upsert(
          {
            word,
            phonetic: e.phonetic,
            word_type: e.wordType,
            english_definition: e.englishDefinition,
            vietnamese_meaning: e.vietnameseMeaning,
            examples: serializeExamples(e.examples),
            collocations: e.collocations,
            image_url: null,
          },
          { onConflict: "word" },
        );
        if (error) throw error;
        consecutiveBilling = 0;
        return true;
      } catch (err) {
        if (isBillingError(err)) {
          consecutiveBilling += 1;
          if (consecutiveBilling >= MAX_CONSECUTIVE_BILLING_ERRORS) abort = true;
        }
        if (attempt === maxAttempts || abort) {
          console.warn(
            `failed '${word}' after ${attempt} attempt(s):`,
            err instanceof Error ? err.message : err,
          );
          return false;
        }
        await sleep(800 * attempt);
      }
    }
    return false;
  }

  async function worker(): Promise<void> {
    while (!abort && cursor < todo.length) {
      const item = todo[cursor];
      cursor += 1;
      const ok = await processWord(item.word, item.rank);
      done += 1;
      if (ok) {
        inserted += 1;
        console.log(`[${done}/${todo.length}] enriched '${item.word}' (rank ${item.rank})`);
      } else {
        failed += 1;
        failedWords.push(item.word);
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));

  if (abort) {
    console.error(
      "Aborted: repeated Gemini billing/auth errors (402/401) — stopping instead of spinning.",
    );
  }
  console.log(
    JSON.stringify(
      { requested: todo.length, inserted, failed, aborted: abort, failedWords },
      null,
      2,
    ),
  );
  if (abort) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
