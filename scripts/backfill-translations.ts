/**
 * Backfill learner gloss JSONB for all word_details (12 non-Vietnamese locales).
 *
 *   npm run backfill:translations
 *
 * Env:
 *   NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY (required)
 *   GEMINI_TRANSLATION_MODEL=gemini-1.5-flash  (default if unset; if 404, try
 *     gemini-2.0-flash-lite or gemini-flash-lite-latest on your API key)
 *   LOCALES=es,pt,ja   — subset (default: all 12 below)
 *   WORD=apple         — single word only
 *   LIMIT=100 OFFSET=0 — paginate words (0 = all)
 *   PAGE_SIZE=500      — Supabase fetch page size
 *   BATCH_SIZE=15      — words per batch before batch delay
 *   BATCH_DELAY_MS=2000
 *   LOCALE_DELAY_MS=400 — pause after each word×locale hydrate
 *   CONCURRENCY=2      — parallel words (keep low for Gemini quota)
 *   DRY_RUN=1          — scan + log only, no Gemini / DB writes
 */
import { createClient } from "@supabase/supabase-js";
import {
  hydrateLearnerLocaleWordContent,
  wordDetailNeedsLocaleHydration,
} from "@/lib/localize-word-content";
import type { LearnerLocale } from "@/lib/learner-locale";
import { ON_DEMAND_LEARNER_LOCALES } from "@/lib/learner-locale";
import { persistMultilangPatch } from "@/lib/persist-multilang-patch";
import type { WordDetail } from "@/types/database";

if (!process.env.GEMINI_TRANSLATION_MODEL?.trim()) {
  process.env.GEMINI_TRANSLATION_MODEL = "gemini-1.5-flash";
}

const TARGET_LOCALES: readonly LearnerLocale[] = ON_DEMAND_LEARNER_LOCALES;

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const gemini = process.env.GEMINI_API_KEY?.trim();

if (!url || !key || !gemini) {
  console.error(
    "Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY",
  );
  process.exit(1);
}

const supabase = createClient(url, key);

const singleWord = process.env.WORD?.trim().toLowerCase();
const limit = Number(process.env.LIMIT ?? "0");
const offset = Number(process.env.OFFSET ?? "0");
const pageSize = Math.max(50, Number(process.env.PAGE_SIZE ?? "500"));
const batchSize = Math.max(1, Number(process.env.BATCH_SIZE ?? "15"));
const batchDelayMs = Math.max(0, Number(process.env.BATCH_DELAY_MS ?? "2000"));
const localeDelayMs = Math.max(0, Number(process.env.LOCALE_DELAY_MS ?? "400"));
const concurrency = Math.max(1, Number(process.env.CONCURRENCY ?? "2"));
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

function parseLocales(): LearnerLocale[] {
  const raw = process.env.LOCALES?.trim();
  if (!raw) return [...TARGET_LOCALES];
  const wanted = new Set(
    raw.split(/[,;\s]+/).map((s) => s.trim().toLowerCase()),
  );
  return TARGET_LOCALES.filter((l) => wanted.has(l));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWordDetails(): Promise<WordDetail[]> {
  if (singleWord) {
    const { data, error } = await supabase
      .from("word_details")
      .select("*")
      .eq("word", singleWord);
    if (error) throw error;
    return (data ?? []) as WordDetail[];
  }

  if (limit > 0) {
    const { data, error } = await supabase
      .from("word_details")
      .select("*")
      .order("word")
      .range(offset, offset + limit - 1);
    if (error) throw error;
    return (data ?? []) as WordDetail[];
  }

  const all: WordDetail[] = [];
  let from = 0;
  while (true) {
    const to = from + pageSize - 1;
    const { data, error } = await supabase
      .from("word_details")
      .select("*")
      .order("word")
      .range(from, to);
    if (error) throw error;
    const page = (data ?? []) as WordDetail[];
    all.push(...page);
    if (page.length < pageSize) break;
    from += pageSize;
  }
  return all;
}

function localesNeeded(
  detail: WordDetail,
  locales: LearnerLocale[],
): LearnerLocale[] {
  return locales.filter((locale) =>
    wordDetailNeedsLocaleHydration(detail, locale),
  );
}

function mergeDetail(
  detail: WordDetail,
  patch: Awaited<ReturnType<typeof hydrateLearnerLocaleWordContent>>,
): WordDetail {
  return {
    ...detail,
    meanings: patch.meanings,
    example_translations: patch.example_translations,
    phrase_translations: patch.phrase_translations,
  };
}

type Counters = { updated: number; skipped: number; failed: number };

async function processOneWord(
  detail: WordDetail,
  locales: LearnerLocale[],
  progress: { done: number; total: number },
  counters: Counters,
): Promise<void> {
  const word = detail.word.trim().toLowerCase();
  if (!word) return;

  let current = detail;
  const queue = localesNeeded(current, locales);
  if (queue.length === 0) {
    counters.skipped += 1;
    return;
  }

  for (const locale of queue) {
    progress.done += 1;
    const label = `[${progress.done}/${progress.total}]`;

    if (dryRun) {
      console.log(`${label} (dry-run) would translate '${word}' → '${locale}'`);
      continue;
    }

    try {
      const patch = await hydrateLearnerLocaleWordContent(current, locale);
      const merged = mergeDetail(current, patch);
      if (wordDetailNeedsLocaleHydration(merged, locale)) {
        console.warn(
          `${label} incomplete '${word}' for '${locale}' (Gemini empty?)`,
        );
        counters.failed += 1;
        current = merged;
        continue;
      }
      const persist = await persistMultilangPatch(supabase, word, patch);
      if (!persist.ok) {
        console.warn(
          `${label} persist failed '${word}' '${locale}':`,
          persist.error,
        );
        counters.failed += 1;
        continue;
      }
      current = merged;
      counters.updated += 1;
      console.log(
        `${label} Processed word '${word}' for '${locale}' [${persist.persisted.join(", ")}]`,
      );
      if (localeDelayMs > 0) await sleep(localeDelayMs);
    } catch (err) {
      console.warn(`${label} failed '${word}' '${locale}':`, err);
      counters.failed += 1;
    }
  }
}

async function runWordPool(
  words: WordDetail[],
  locales: LearnerLocale[],
  progress: { done: number; total: number },
  counters: Counters,
): Promise<void> {
  let cursor = 0;
  async function worker(): Promise<void> {
    while (cursor < words.length) {
      const index = cursor;
      cursor += 1;
      const detail = words[index];
      if (!detail) continue;
      await processOneWord(detail, locales, progress, counters);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, words.length) }, () => worker()),
  );
}

function countTasks(rows: WordDetail[], locales: LearnerLocale[]): number {
  let n = 0;
  for (const detail of rows) {
    n += localesNeeded(detail, locales).length;
  }
  return n;
}

async function main(): Promise<void> {
  const locales = parseLocales();
  console.log(
    `Model: ${process.env.GEMINI_TRANSLATION_MODEL} | locales: ${locales.join(", ")} | concurrency=${concurrency} | dryRun=${dryRun}`,
  );

  console.log("Loading word_details…");
  const rows = await fetchWordDetails();
  console.log(`Loaded ${rows.length} rows.`);

  const totalTasks = countTasks(rows, locales);
  console.log(`${totalTasks} word×locale tasks need hydration.`);

  if (totalTasks === 0) {
    console.log("Nothing to do.");
    return;
  }

  const progress = { done: 0, total: totalTasks };
  const counters: Counters = { updated: 0, skipped: 0, failed: 0 };

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    console.log(
      `\n--- Batch ${Math.floor(i / batchSize) + 1} (words ${i + 1}-${i + batch.length} of ${rows.length}) ---`,
    );
    await runWordPool(batch, locales, progress, counters);
    if (i + batchSize < rows.length && batchDelayMs > 0) {
      console.log(`Batch delay ${batchDelayMs}ms…`);
      await sleep(batchDelayMs);
    }
  }

  console.log(
    JSON.stringify(
      {
        ...counters,
        totalTasks,
        wordsScanned: rows.length,
        dryRun,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
