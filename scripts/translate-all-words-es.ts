/**
 * Batch Spanish glosses for all word_details (meanings, example_translations, phrase_translations).
 *
 *   GEMINI_API_KEY=... SUPABASE_SERVICE_ROLE_KEY=... NEXT_PUBLIC_SUPABASE_URL=... \
 *     npx tsx scripts/translate-all-words-es.ts
 *
 * Optional: LIMIT=50 OFFSET=0  (paginate)
 * Optional: WORD=anyone         (single word)
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

async function main(): Promise<void> {
  let query = supabase.from("word_details").select("*").order("word");
  if (singleWord) query = query.eq("word", singleWord);
  else if (limit > 0) query = query.range(offset, offset + limit - 1);

  const { data, error } = await query;
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  const rows = (data ?? []) as WordDetail[];
  console.log(`Processing ${rows.length} word(s)…`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const detail of rows) {
    const word = detail.word.trim().toLowerCase();
    if (!word) continue;
    if (!wordDetailNeedsSpanishHydration(detail)) {
      skipped += 1;
      continue;
    }
    try {
      const patch = await hydrateSpanishWordContent(detail);
      const persist = await persistMultilangPatch(supabase, word, patch);
      if (!persist.ok) {
        console.warn(`persist failed for "${word}":`, persist.error);
        failed += 1;
        continue;
      }
      updated += 1;
      console.log(`ok ${word} → persisted [${persist.persisted.join(", ")}]`);
    } catch (err) {
      failed += 1;
      console.warn(`hydrate failed for "${word}":`, err);
    }
  }

  console.log(JSON.stringify({ updated, skipped, failed, total: rows.length }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
