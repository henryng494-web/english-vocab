/**
 * Live audit of word_details multilang / Spanish leftovers (Cloud Agent or local).
 *
 *   SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... \
 *     npx tsx scripts/audit-word-details-locale.ts
 */
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

if (!url || !key) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

type Row = {
  word: string;
  vietnamese_meaning: string | null;
  examples: string | null;
  meanings?: unknown;
  example_translations?: unknown;
  phrase_translations?: unknown;
};

async function probeColumns(): Promise<string[]> {
  const candidates = [
    "word",
    "vietnamese_meaning",
    "examples",
    "meanings",
    "example_translations",
    "phrase_translations",
  ];
  const present: string[] = [];
  for (const col of candidates) {
    const { error } = await supabase.from("word_details").select(col).limit(1);
    if (!error) present.push(col);
  }
  return present;
}

function phraseHasEs(raw: unknown): boolean {
  if (!raw || typeof raw !== "object") return false;
  const text = JSON.stringify(raw);
  if (!text.includes('"es"')) return false;
  return !/\"es\"\s*:\s*""/.test(text.replace(/\s/g, "")) || /\"es\"\s*:\s*\"[^\"]+\"/.test(text);
}

async function main(): Promise<void> {
  const columns = await probeColumns();
  console.log("Columns present:", columns.join(", "));

  const selectCols = columns.join(", ");
  let offset = 0;
  const page = 1000;
  let total = 0;
  let esInPhrases = 0;
  let esInMeanings = 0;
  let esInExamples = 0;
  let jsonMeanings = 0;

  while (true) {
    const { data, error } = await supabase
      .from("word_details")
      .select(selectCols)
      .range(offset, offset + page - 1);
    if (error) {
      console.error(error.message);
      process.exit(1);
    }
    if (!data?.length) break;

    for (const row of data as Row[]) {
      total += 1;
      const m = row.vietnamese_meaning?.trim() ?? "";
      if (m.startsWith("{") && m.includes('"vi"')) jsonMeanings += 1;

      if (row.meanings && typeof row.meanings === "object") {
        const o = row.meanings as Record<string, unknown>;
        if (typeof o.es === "string" && o.es.trim()) esInMeanings += 1;
      }

      if (Array.isArray(row.example_translations)) {
        for (const elem of row.example_translations) {
          if (elem && typeof elem === "object" && "es" in elem) {
            const es = (elem as { es?: string }).es?.trim();
            if (es) {
              esInExamples += 1;
              break;
            }
          }
        }
      }

      if (phraseHasEs(row.phrase_translations)) esInPhrases += 1;
    }

    if (data.length < page) break;
    offset += page;
  }

  console.log(
    JSON.stringify(
      {
        total_rows: total,
        vietnamese_meaning_looks_like_json: jsonMeanings,
        rows_with_meanings_es: esInMeanings,
        rows_with_example_translations_es: esInExamples,
        rows_with_phrase_translations_es: esInPhrases,
      },
      null,
      2,
    ),
  );
}

void main();
