import {
  buildLocaleBackfillPayload,
  wordDetailNeedsLocaleBackfill,
} from "@/lib/backfill-word-detail-locale";
import {
  DEFAULT_LEARNER_LOCALE,
  parseLearnerLocale,
  type LearnerLocale,
} from "@/lib/learner-locale";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { PREFETCH_NEXT_WORDS_MAX } from "@/lib/prefetch-next-word-locale-shared";
import type { WordDetail } from "@/types/database";

/** Delay between Gemini-backed words in one prefetch batch (ms). */
const INTER_WORD_DELAY_MS = 400;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function normalizeWordList(words: unknown): string[] {
  if (!Array.isArray(words)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of words) {
    if (typeof raw !== "string") continue;
    const key = raw.trim().toLowerCase();
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(key);
    if (out.length >= PREFETCH_NEXT_WORDS_MAX) break;
  }
  return out;
}

async function loadWordDetail(
  supabase: ReturnType<typeof createServiceSupabase>,
  word: string,
): Promise<WordDetail | null> {
  const { data, error } = await supabase
    .from("word_details")
    .select("*")
    .eq("word", word)
    .maybeSingle();
  if (error || !data) return null;
  return { ...(data as WordDetail), id: (data as WordDetail).id ?? "" };
}

export type PrefetchWordsLocaleResult = {
  queued: number;
  hydrated: number;
  skipped: number;
  failed: number;
};

/**
 * Background hydration: persist `example_translations.es` (+ gloss) for words
 * that still need locale content. Sequential to reduce Gemini rate spikes.
 */
export async function prefetchWordsLocaleInBackground(
  words: unknown,
  localeInput: unknown,
): Promise<PrefetchWordsLocaleResult> {
  const locale = parseLearnerLocale(
    typeof localeInput === "string" ? localeInput : null,
  );
  const wordsList = normalizeWordList(words);
  const result: PrefetchWordsLocaleResult = {
    queued: wordsList.length,
    hydrated: 0,
    skipped: 0,
    failed: 0,
  };

  if (locale === DEFAULT_LEARNER_LOCALE || wordsList.length === 0) {
    result.skipped = wordsList.length;
    return result;
  }
  if (!process.env.GEMINI_API_KEY?.trim()) {
    result.skipped = wordsList.length;
    return result;
  }

  let supabase: ReturnType<typeof createServiceSupabase>;
  try {
    supabase = createServiceSupabase();
  } catch {
    result.failed = wordsList.length;
    return result;
  }

  for (const word of wordsList) {
    try {
      const detail = await loadWordDetail(supabase, word);
      if (!detail || !wordDetailNeedsLocaleBackfill(detail, locale)) {
        result.skipped += 1;
        continue;
      }

      const payload = await buildLocaleBackfillPayload(detail, locale);
      if (!payload) {
        result.failed += 1;
        continue;
      }

      const { error } = await supabase
        .from("word_details")
        .update({
          examples: payload.examples,
          meanings: payload.meanings,
          example_translations: payload.example_translations,
          phrase_translations: payload.phrase_translations ?? undefined,
          vietnamese_meaning: payload.vietnamese_meaning,
        })
        .eq("word", word);

      if (error) {
        result.failed += 1;
      } else {
        result.hydrated += 1;
      }
    } catch {
      result.failed += 1;
    }

    if (INTER_WORD_DELAY_MS > 0) {
      await wait(INTER_WORD_DELAY_MS);
    }
  }

  return result;
}
