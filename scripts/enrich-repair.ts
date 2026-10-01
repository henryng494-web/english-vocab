/**
 * Repair word_details rows with missing core English card data
 * (phonetic, word_type, definition, Vietnamese meaning, examples, collocations),
 * filling ONLY the missing fields. If examples are regenerated, stale
 * example/phrase translations are cleared so `npm run backfill:translations`
 * rebuilds them for the new sentences.
 *
 *   DRY_RUN=1 npm run enrich:repair      # audit only
 *   npm run enrich:repair
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY
 *   CONCURRENCY=8  MAX_ATTEMPTS=2  LIMIT=0  WORD=loud  DRY_RUN=1
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { PRESET_RANK_BY_WORD } from "@/data/preset-vocabulary";
import { enrichWord } from "@/lib/enrich-word";
import { parseExamples, serializeExamples } from "@/lib/parse-examples";

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
if (!url || !serviceKey || !process.env.GEMINI_API_KEY?.trim()) {
  console.error("Need NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY");
  process.exit(1);
}
const supabase = createClient(url, serviceKey);
const concurrency = Math.max(1, Number(process.env.CONCURRENCY ?? "8"));
const maxAttempts = Math.max(1, Number(process.env.MAX_ATTEMPTS ?? "2"));
const limit = Number(process.env.LIMIT ?? "0");
const onlyWord = process.env.WORD?.trim().toLowerCase();
const dryRun = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const MAX_CONSECUTIVE_BILLING_ERRORS = 8;

type Row = {
  word: string;
  phonetic: string | null;
  word_type: string | null;
  english_definition: string | null;
  vietnamese_meaning: string | null;
  examples: string | null;
  collocations: string | null;
};

function missingFields(r: Row): string[] {
  const m: string[] = [];
  if (!/^\/.+\/$/.test((r.phonetic ?? "").trim())) m.push("phonetic");
  if (!r.word_type?.trim()) m.push("word_type");
  if (!r.english_definition?.trim()) m.push("english_definition");
  if (!r.vietnamese_meaning?.trim()) m.push("vietnamese_meaning");
  if (!r.collocations?.trim()) m.push("collocations");
  const ex = parseExamples(r.examples);
  if (ex.length === 0 || ex.some((e) => !e.en.trim() || !e.vi?.trim())) m.push("examples");
  return m;
}

async function fetchRows(): Promise<Row[]> {
  const rows: Row[] = [];
  for (let from = 0; ; from += 1000) {
    let q = supabase
      .from("word_details")
      .select("word,phonetic,word_type,english_definition,vietnamese_meaning,examples,collocations")
      .order("word")
      .range(from, from + 999);
    if (onlyWord) q = q.eq("word", onlyWord);
    const { data, error } = await q;
    if (error) throw error;
    rows.push(...((data ?? []) as Row[]));
    if ((data ?? []).length < 1000) break;
  }
  return rows;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const isBilling = (e: unknown) =>
  /402|401|payment required|credits are depleted|API key not valid/i.test(
    e instanceof Error ? e.message : String(e),
  );

async function main(): Promise<void> {
  let todo = (await fetchRows())
    .map((r) => ({ r, missing: missingFields(r) }))
    .filter((x) => x.missing.length > 0);
  const tally: Record<string, number> = {};
  for (const x of todo) for (const f of x.missing) tally[f] = (tally[f] ?? 0) + 1;
  console.log(`${todo.length} rows need repair`, tally);
  if (limit > 0) todo = todo.slice(0, limit);
  if (dryRun || todo.length === 0) {
    console.log(todo.slice(0, 20).map((x) => `${x.r.word}: ${x.missing.join(",")}`).join("\n"));
    return;
  }

  let cursor = 0, repaired = 0, failed = 0, billing = 0, abort = false;
  const failedWords: string[] = [];

  async function fix(r: Row, missing: string[]): Promise<boolean> {
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const e = await enrichWord(r.word, { rank: PRESET_RANK_BY_WORD[r.word] });
        if (e.source === "basic" || e.fromFallback) throw new Error("enrichment fell back to basic");
        const patch: Record<string, unknown> = {};
        if (missing.includes("phonetic")) patch.phonetic = e.phonetic;
        if (missing.includes("word_type")) patch.word_type = e.wordType;
        if (missing.includes("english_definition")) patch.english_definition = e.englishDefinition;
        if (missing.includes("vietnamese_meaning")) patch.vietnamese_meaning = e.vietnameseMeaning;
        if (missing.includes("collocations")) patch.collocations = e.collocations;
        if (missing.includes("examples")) {
          const ser = serializeExamples(e.examples);
          if (!parseExamples(ser).length) throw new Error("enrichment returned no examples");
          patch.examples = ser;
          patch.example_translations = null;
          patch.phrase_translations = null;
        }
        const { error } = await supabase.from("word_details").update(patch).eq("word", r.word);
        if (error) throw error;
        billing = 0;
        return true;
      } catch (err) {
        if (isBilling(err) && ++billing >= MAX_CONSECUTIVE_BILLING_ERRORS) abort = true;
        if (attempt === maxAttempts || abort) {
          console.warn(`failed '${r.word}':`, err instanceof Error ? err.message : err);
          return false;
        }
        await sleep(800 * attempt);
      }
    }
    return false;
  }

  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (!abort && cursor < todo.length) {
        const { r, missing } = todo[cursor++];
        if (await fix(r, missing)) {
          repaired += 1;
          console.log(`[${repaired + failed}/${todo.length}] repaired '${r.word}' (${missing.join(",")})`);
        } else {
          failed += 1;
          failedWords.push(r.word);
        }
      }
    }),
  );
  if (abort) console.error("Aborted: repeated Gemini 402/401 — stopping instead of spinning.");
  console.log(JSON.stringify({ requested: todo.length, repaired, failed, aborted: abort, failedWords }, null, 2));
  if (abort) process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(1); });
