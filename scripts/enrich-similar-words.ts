/**
 * Generate similar words offline and store them in
 * word_details.phrase_translations.similar (read by /api/word/similar).
 *
 *   DRY_RUN=1 npm run enrich:similar-words
 *   npm run enrich:similar-words
 *
 * Env: BATCH_SIZE=25  CONCURRENCY=4  LIMIT=0  WORD=loud  DRY_RUN=1
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";

function loadEnv(): void {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq === -1) continue;
      const k = t.slice(0, eq);
      if (!process.env[k]) process.env[k] = t.slice(eq + 1);
    }
  } catch {
    console.warn("Warning: .env.local not found — set env vars manually.");
  }
}
loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !serviceKey) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}
const supabase = createClient(url, serviceKey);
const batchSize = Math.max(1, Number(process.env.BATCH_SIZE ?? "25"));
const concurrency = Math.max(1, Number(process.env.CONCURRENCY ?? "4"));
const limit = Number(process.env.LIMIT ?? "0");
const onlyWord = process.env.WORD?.trim().toLowerCase();
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";

type Row = {
  word: string;
  word_type: string | null;
  vietnamese_meaning: string | null;
  english_definition: string | null;
  phrase_translations: Record<string, unknown> | null;
};

async function main() {
  const { generateSimilarWordsBatchWithGemini } = await import("@/lib/gemini-core");
  const { normalizeSimilarWords } = await import("@/lib/word-synonyms");
  const { getFamilyDisplayWords } = await import("@/lib/word-family");

  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    let q = supabase
      .from("word_details")
      .select("word, word_type, vietnamese_meaning, english_definition, phrase_translations")
      .order("word")
      .range(from, from + 999);
    if (onlyWord) q = q.eq("word", onlyWord);
    const { data, error } = await q;
    if (error) throw new Error(error.message);
    rows.push(...((data ?? []) as Row[]));
    if (!data || data.length < 1000) break;
  }

  const hasSimilar = (r: Row) =>
    Array.isArray(r.phrase_translations?.similar) &&
    (r.phrase_translations.similar as unknown[]).length > 0;
  let todo = rows.filter((r) => !hasSimilar(r));
  if (limit > 0) todo = todo.slice(0, limit);
  console.log(`rows=${rows.length} todo=${todo.length} dryRun=${dryRun}`);
  if (dryRun) return;

  const batches: Row[][] = [];
  for (let i = 0; i < todo.length; i += batchSize) batches.push(todo.slice(i, i + batchSize));

  let done = 0;
  let saved = 0;
  let failed = 0;
  let next = 0;
  let consecutiveFail = 0;

  async function worker() {
    while (next < batches.length && consecutiveFail < 6) {
      const batch = batches[next++];
      const result = await generateSimilarWordsBatchWithGemini(
        batch.map((r) => ({
          word: r.word,
          pos: r.word_type,
          meaning: r.vietnamese_meaning?.split(/[\n,;]/)[0],
          definition: r.english_definition,
        })),
      );
      if (!result) {
        consecutiveFail++;
        failed += batch.length;
        console.warn(`batch failed (${batch[0].word}…)`);
        continue;
      }
      consecutiveFail = 0;
      for (const row of batch) {
        const similar = normalizeSimilarWords(
          result[row.word.toLowerCase()],
          row.word,
          getFamilyDisplayWords(row.word),
          4,
        );
        done++;
        if (!similar.length) {
          failed++;
          continue;
        }
        const { error } = await supabase
          .from("word_details")
          .update({
            phrase_translations: { ...(row.phrase_translations ?? {}), similar },
          })
          .eq("word", row.word);
        if (error) {
          failed++;
          console.warn(`update failed ${row.word}: ${error.message}`);
        } else saved++;
      }
      console.log(`progress ${done}/${todo.length} saved=${saved} failed=${failed}`);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  console.log(`finished saved=${saved} failed=${failed}`);
  if (consecutiveFail >= 6) console.error("stopped: too many consecutive failures");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
