/**
 * Batch Spanish glosses for all word_details (meanings, example_translations, phrase_translations).
 *
 *   npm run translate:all-es
 *
 * Optional: LIMIT=50 OFFSET=0  (paginate one page)
 * Optional: WORD=sperm          (single word)
 * Optional: CONCURRENCY=4       (parallel Gemini calls, default 4)
 * Optional: PAGE_SIZE=500       (Supabase fetch page size when scanning all rows)
 */
import { createClient } from "@supabase/supabase-js";
import {
  hydrateSpanishWordContent,
  wordDetailNeedsSpanishHydration,
} from "@/lib/localize-word-content";
import { persistMultilangPatch } from "@/lib/persist-multilang-patch";
import type { WordDetail } from "@/types/database";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const gemini = process.env.GEMINI_API_KEY?.trim();

if (!url || !key || !gemini) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);
const limit = Number(process.env.LIMIT ?? "0");
const offset = Number(process.env.OFFSET ?? "0");
const singleWord = process.env.WORD?.trim().toLowerCase();
const concurrency = Math.max(1, Number(process.env.CONCURRENCY ?? "4"));
const pageSize = Math.max(50, Number(process.env.PAGE_SIZE ?? "500"));

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

async function processWord(detail: WordDetail): Promise<"updated" | "skipped" | "failed"> {
  const word = detail.word.trim().toLowerCase();
  if (!word) return "skipped";
  if (!wordDetailNeedsSpanishHydration(detail)) return "skipped";
  try {
    const patch = await hydrateSpanishWordContent(detail);
    const persist = await persistMultilangPatch(supabase, word, patch);
    if (!persist.ok) {
      console.warn(`persist failed for "${word}":`, persist.error);
      return "failed";
    }
    console.log(`ok ${word} → [${persist.persisted.join(", ")}]`);
    return "updated";
  } catch (err) {
    console.warn(`hydrate failed for "${word}":`, err);
    return "failed";
  }
}

async function runPool(rows: WordDetail[]): Promise<{
  updated: number;
  skipped: number;
  failed: number;
}> {
  let updated = 0;
  let skipped = 0;
  let failed = 0;
  let cursor = 0;

  async function worker(): Promise<void> {
    while (cursor < rows.length) {
      const index = cursor;
      cursor += 1;
      const detail = rows[index];
      if (!detail) continue;
      const result = await processWord(detail);
      if (result === "updated") updated += 1;
      else if (result === "skipped") skipped += 1;
      else failed += 1;
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, rows.length) }, () => worker()),
  );
  return { updated, skipped, failed };
}

async function main(): Promise<void> {
  const rows = await fetchWordDetails();
  const targets = rows.filter((row) =>
    wordDetailNeedsSpanishHydration(row),
  );
  console.log(
    `Loaded ${rows.length} word_details; ${targets.length} need Spanish hydration (concurrency=${concurrency})…`,
  );

  const { updated, skipped, failed } = await runPool(rows);
  console.log(
    JSON.stringify({ updated, skipped, failed, total: rows.length }, null, 2),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
