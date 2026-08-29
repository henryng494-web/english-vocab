import type { SupabaseClient } from "@supabase/supabase-js";
import { getPresetRank } from "@/data/preset-word-details";
import { enrichWord } from "@/lib/enrich-word";
import { enrichmentToDiscoverWord } from "@/lib/enrichment-helpers";
import {
  getStaleWordDetailReason,
  type StaleWordDetailReason,
} from "@/lib/persisted-word-detail";
import {
  examplesNeedRegeneration,
  repairWordExamples,
} from "@/lib/repair-word-examples";
import { meaningsNeedRegeneration } from "@/lib/meaning-quality";
import { repairWordMeanings } from "@/lib/repair-word-meanings";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";
import { encodeRegisterCollocation } from "@/lib/word-meanings";
import { isPersistableWordImageUrl } from "@/lib/unsplash";
import type { WordDetail } from "@/types/database";

const DB_PAGE_SIZE = 1000;
const DEFAULT_BATCH_DELAY_MS = 2500;

export type ReEnrichBatchOptions = {
  limit?: number;
  offset?: number;
  word?: string | null;
  dryRun?: boolean;
  delayMs?: number;
};

export type ReEnrichBatchResult = {
  processed: number;
  updated: number;
  repairedExamplesOnly: number;
  skipped: number;
  failed: number;
  totalCached: number;
  totalStale: number;
  remaining: number;
  nextOffset: number | null;
  failures: Array<{ word: string; error: string }>;
  reasonCounts: Record<StaleWordDetailReason, number>;
};

type WordDetailRow = {
  word: string;
  word_type: string | null;
  vietnamese_meaning: string | null;
  english_definition: string | null;
  collocations: string | null;
  image_url: string | null;
  examples: string | null;
};

type StaleTarget = {
  word: string;
  reason: StaleWordDetailReason;
  row: WordDetailRow;
};

async function sleep(ms: number) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchAllWordDetails(
  supabase: SupabaseClient,
): Promise<WordDetailRow[]> {
  const all: WordDetailRow[] = [];
  let pageOffset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("word_details")
      .select(
        "word, word_type, vietnamese_meaning, english_definition, collocations, image_url, examples",
      )
      .order("word", { ascending: true })
      .range(pageOffset, pageOffset + DB_PAGE_SIZE - 1);

    if (error) throw new Error(error.message ?? "Failed to load word_details");
    if (!data?.length) break;

    all.push(...(data as WordDetailRow[]));
    if (data.length < DB_PAGE_SIZE) break;
    pageOffset += DB_PAGE_SIZE;
  }

  return all;
}

async function resolveStaleTargets(
  supabase: SupabaseClient,
  options: ReEnrichBatchOptions,
): Promise<{ targets: StaleTarget[]; totalCached: number; totalStale: number }> {
  if (options.word) {
    const { data } = await supabase
      .from("word_details")
      .select(
        "word, word_type, vietnamese_meaning, english_definition, collocations, image_url, examples",
      )
      .eq("word", options.word)
      .maybeSingle();
    const row = (data ?? null) as WordDetailRow | null;
    const reason = row ? getStaleWordDetailReason(row as WordDetail) : null;
    return {
      targets: reason && row ? [{ word: options.word, reason, row }] : [],
      totalCached: row ? 1 : 0,
      totalStale: reason ? 1 : 0,
    };
  }

  const rows = await fetchAllWordDetails(supabase);
  const stale = rows.flatMap((row) => {
    const reason = getStaleWordDetailReason(row as WordDetail);
    return reason ? [{ word: row.word, reason, row }] : [];
  });

  const limit = options.limit ?? 0;
  const offset = options.offset ?? 0;
  const sliced =
    limit > 0 ? stale.slice(offset, offset + limit) : offset > 0 ? stale.slice(offset) : stale;

  return {
    targets: sliced,
    totalCached: rows.length,
    totalStale: stale.length,
  };
}

async function tryRepairMeaningsOnly(
  supabase: SupabaseClient,
  target: StaleTarget,
  dryRun: boolean,
): Promise<boolean> {
  if (target.reason !== "bad_meaning") return false;

  const repaired = await repairWordMeanings(
    target.word,
    target.row.vietnamese_meaning,
    target.row.word_type,
    target.row.examples,
    target.row.english_definition,
  );

  if (
    meaningsNeedRegeneration(
      target.word,
      repaired,
      target.row.word_type,
      target.row.examples,
      target.row.english_definition,
    )
  ) {
    return false;
  }

  if (dryRun) return true;

  const { error } = await supabase
    .from("word_details")
    .update({ vietnamese_meaning: repaired })
    .eq("word", target.word);
  if (error) throw error;
  return true;
}

async function tryRepairExamplesOnly(
  supabase: SupabaseClient,
  target: StaleTarget,
  dryRun: boolean,
): Promise<boolean> {
  if (target.reason !== "misaligned_examples") return false;

  const repaired = await repairWordExamples(
    target.word,
    target.row.examples,
    target.row.word_type,
    target.row.vietnamese_meaning,
  );

  if (
    examplesNeedRegeneration(
      target.word,
      repaired,
      target.row.word_type,
      target.row.vietnamese_meaning,
    )
  ) {
    return false;
  }

  if (dryRun) return true;

  const { error } = await supabase
    .from("word_details")
    .update({ examples: repaired })
    .eq("word", target.word);
  if (error) throw error;
  return true;
}

async function tryRepairRegisterOnly(
  supabase: SupabaseClient,
  target: StaleTarget,
  dryRun: boolean,
): Promise<boolean> {
  if (target.reason !== "outdated_register") return false;

  const rank = getPresetRank(target.word) ?? 5000;
  const enrichment = await enrichWord(target.word, { rank, forceGemini: true });
  const collocations =
    enrichment.collocations ?? encodeRegisterCollocation(enrichment.register);
  if (!collocations) return false;

  if (dryRun) return true;

  const { error } = await supabase
    .from("word_details")
    .update({ collocations })
    .eq("word", target.word);
  if (error) throw error;
  return true;
}

/** Process one batch of stale word_details rows (shared by CLI + cron API). */
export async function runStaleReEnrichBatch(
  supabase: SupabaseClient,
  options: ReEnrichBatchOptions = {},
): Promise<ReEnrichBatchResult> {
  if (!process.env.GEMINI_API_KEY?.trim()) {
    throw new Error("Missing GEMINI_API_KEY — required for re-enrich.");
  }

  const delayMs = options.delayMs ?? DEFAULT_BATCH_DELAY_MS;
  const { targets, totalCached, totalStale } = await resolveStaleTargets(
    supabase,
    options,
  );

  const reasonCounts: Record<StaleWordDetailReason, number> = {
    missing_meaning: 0,
    missing_register: 0,
    legacy_register: 0,
    outdated_register: 0,
    embedded_register_hint: 0,
    bad_meaning: 0,
    misaligned_examples: 0,
  };

  let updated = 0;
  let repairedExamplesOnly = 0;
  let skipped = 0;
  let failed = 0;
  const failures: Array<{ word: string; error: string }> = [];

  for (const target of targets) {
    reasonCounts[target.reason] += 1;
  }

  for (let index = 0; index < targets.length; index += 1) {
    const target = targets[index]!;
    try {
      if (options.dryRun) {
        skipped += 1;
        continue;
      }

      const repairedRegisterOnly = await tryRepairRegisterOnly(
        supabase,
        target,
        false,
      );
      if (repairedRegisterOnly) {
        repairedExamplesOnly += 1;
        updated += 1;
        if (index < targets.length - 1) await sleep(delayMs);
        continue;
      }

      const repairedMeaningsOnly = await tryRepairMeaningsOnly(
        supabase,
        target,
        false,
      );
      if (repairedMeaningsOnly) {
        repairedExamplesOnly += 1;
        updated += 1;
        if (index < targets.length - 1) await sleep(delayMs);
        continue;
      }

      const repairedOnly = await tryRepairExamplesOnly(
        supabase,
        target,
        false,
      );
      if (repairedOnly) {
        repairedExamplesOnly += 1;
        updated += 1;
        if (index < targets.length - 1) await sleep(delayMs);
        continue;
      }

      const rank = getPresetRank(target.word) ?? 5000;
      const enrichment = await enrichWord(target.word, { rank, forceGemini: true });
      const mapped = enrichmentToDiscoverWord(
        target.word,
        enrichment,
        target.row.image_url ?? null,
      );

      const payload = {
        phonetic: mapped.phonetic ?? `/${target.word}/`,
        word_type: mapped.word_type ?? "unknown",
        vietnamese_meaning:
          sanitizeVietnameseText(mapped.vietnamese_meaning) || target.word,
        english_definition: mapped.english_definition ?? "",
        examples: mapped.examples ?? "",
        collocations: mapped.collocations ?? null,
        image_url:
          target.row.image_url &&
          isPersistableWordImageUrl(target.row.image_url, target.word)
            ? target.row.image_url
            : null,
      };

      const { error: upsertError } = await supabase
        .from("word_details")
        .upsert({ word: target.word, ...payload }, { onConflict: "word" });
      if (upsertError) throw upsertError;

      updated += 1;
    } catch (err) {
      failed += 1;
      failures.push({
        word: target.word,
        error: err instanceof Error ? err.message : String(err),
      });
    }

    if (index < targets.length - 1) {
      await sleep(delayMs);
    }
  }

  const offset = options.offset ?? 0;
  const remaining = Math.max(0, totalStale - offset - targets.length);

  return {
    processed: targets.length,
    updated,
    repairedExamplesOnly,
    skipped,
    failed,
    totalCached,
    totalStale,
    remaining,
    nextOffset: remaining > 0 ? offset + targets.length : null,
    failures,
    reasonCounts,
  };
}
