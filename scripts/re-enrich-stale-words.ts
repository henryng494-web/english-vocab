/**
 * Re-enrich cached word_details rows that predate register + dual-meaning layout.
 *
 * Usage:
 *   npm run re-enrich:stale
 *   npm run re-enrich:stale -- --all-cached --limit=100
 *   npm run re-enrich:stale -- --all-cached --offset=100 --limit=100
 *   npm run re-enrich:stale -- --word=hereby
 *   npm run re-enrich:stale -- --words=scripts/formal-words.txt
 *   npm run re-enrich:stale -- --dry-run
 *
 * Formal/legal seed list (legacy shortcut):
 *   npm run re-enrich:formal
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getPresetRank } from "../src/data/preset-word-details";
import { enrichWord } from "../src/lib/enrich-word";
import { enrichmentToDiscoverWord } from "../src/lib/enrichment-helpers";
import {
  getStaleWordDetailReason,
  type StaleWordDetailReason,
} from "../src/lib/persisted-word-detail";
import { sanitizeVietnameseText } from "../src/lib/sanitize-vi";
import {
  decodeRegisterFromCollocation,
  parseVietnameseMeanings,
} from "../src/lib/word-meanings";
import { isPersistableWordImageUrl } from "../src/lib/unsplash";
import type { WordDetail } from "../src/types/database";

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

/** Legal connectives that were often mistranslated before register-aware prompts. */
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
  examples: string | null;
};

const DEFAULT_BATCH_DELAY_MS = 2500;
const DB_PAGE_SIZE = 1000;

function parseArgs() {
  const args = process.argv.slice(2);
  let limit = 0;
  let offset = 0;
  let dryRun = false;
  let allCached = false;
  let formalOnly = false;
  let word: string | null = null;
  let wordsFile: string | null = null;
  let delayMs = DEFAULT_BATCH_DELAY_MS;

  for (const arg of args) {
    if (arg === "--dry-run") dryRun = true;
    else if (arg === "--all-cached" || arg === "--from-db") allCached = true;
    else if (arg === "--formal-only") formalOnly = true;
    else if (arg.startsWith("--limit=")) {
      limit = Number.parseInt(arg.slice("--limit=".length), 10) || 0;
    } else if (arg.startsWith("--offset=")) {
      offset = Number.parseInt(arg.slice("--offset=".length), 10) || 0;
    } else if (arg.startsWith("--word=")) {
      word = arg.slice("--word=".length).trim().toLowerCase() || null;
    } else if (arg.startsWith("--words=")) {
      wordsFile = arg.slice("--words=".length).trim() || null;
    } else if (arg.startsWith("--delay=")) {
      delayMs = Number.parseInt(arg.slice("--delay=".length), 10) || DEFAULT_BATCH_DELAY_MS;
    }
  }

  // Default for re-enrich:stale — scan cached rows missing the new layout.
  if (!word && !wordsFile && !formalOnly) {
    allCached = true;
  }

  return { limit, offset, dryRun, allCached, formalOnly, word, wordsFile, delayMs };
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

async function fetchAllWordDetails(
  supabase: SupabaseClient,
): Promise<WordDetailRow[]> {
  const all: WordDetailRow[] = [];
  let pageOffset = 0;

  while (true) {
    const { data, error } = await supabase
      .from("word_details")
      .select("word, vietnamese_meaning, collocations, image_url, examples")
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

type StaleTarget = {
  word: string;
  reason: StaleWordDetailReason;
  row: WordDetailRow;
};

async function resolveStaleTargets(
  supabase: SupabaseClient,
  options: ReturnType<typeof parseArgs>,
): Promise<{ targets: StaleTarget[]; totalCached: number; totalStale: number }> {
  if (options.word) {
    const { data } = await supabase
      .from("word_details")
      .select("word, vietnamese_meaning, collocations, image_url, examples")
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

  if (options.wordsFile) {
    const words = loadWordsFromFile(options.wordsFile);
    const { data, error } = await supabase
      .from("word_details")
      .select("word, vietnamese_meaning, collocations, image_url, examples")
      .in("word", words);
    if (error) throw new Error(error.message ?? "Failed to load word_details");

    const byWord = new Map(
      ((data ?? []) as WordDetailRow[]).map((row) => [row.word, row]),
    );
    const stale: StaleTarget[] = [];
    for (const word of words) {
      const row = byWord.get(word);
      if (!row) continue;
      const reason = getStaleWordDetailReason(row as WordDetail);
      if (reason) stale.push({ word, reason, row });
    }
    return {
      targets: stale,
      totalCached: byWord.size,
      totalStale: stale.length,
    };
  }

  if (options.formalOnly) {
    const { data, error } = await supabase
      .from("word_details")
      .select("word, vietnamese_meaning, collocations, image_url, examples")
      .in("word", DEFAULT_FORMAL_WORDS);
    if (error) throw new Error(error.message ?? "Failed to load word_details");

    const byWord = new Map(
      ((data ?? []) as WordDetailRow[]).map((row) => [row.word, row]),
    );
    const targets: StaleTarget[] = DEFAULT_FORMAL_WORDS.filter((word) => byWord.has(word)).map(
      (word) => ({
        word,
        reason: getStaleWordDetailReason(byWord.get(word) as WordDetail) ?? "missing_register",
        row: byWord.get(word)!,
      }),
    );
    const missingInDb = DEFAULT_FORMAL_WORDS.filter((word) => !byWord.has(word));
    for (const word of missingInDb) {
      targets.push({
        word,
        reason: "missing_register",
        row: {
          word,
          vietnamese_meaning: null,
          collocations: null,
          image_url: null,
          examples: "",
        },
      });
    }
    return {
      targets,
      totalCached: byWord.size,
      totalStale: targets.length,
    };
  }

  if (options.allCached) {
    const rows = await fetchAllWordDetails(supabase);
    const stale = rows.flatMap((row) => {
      const reason = getStaleWordDetailReason(row as WordDetail);
      return reason ? [{ word: row.word, reason, row }] : [];
    });
    const sliced =
      options.limit > 0
        ? stale.slice(options.offset, options.offset + options.limit)
        : options.offset > 0
          ? stale.slice(options.offset)
          : stale;

    return {
      targets: sliced,
      totalCached: rows.length,
      totalStale: stale.length,
    };
  }

  return { targets: [], totalCached: 0, totalStale: 0 };
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
  const { targets, totalCached, totalStale } = await resolveStaleTargets(
    supabase,
    options,
  );

  const mode = options.formalOnly
    ? "formal-only"
    : options.word
      ? "single-word"
      : options.wordsFile
        ? "words-file"
        : "all-cached";

  console.log(
    `Stale re-enrich [${mode}]: processing ${targets.length} word(s)` +
      (options.allCached && !options.formalOnly
        ? ` · cached=${totalCached} stale=${totalStale}` +
          (options.offset > 0 ? ` offset=${options.offset}` : "")
        : "") +
      (options.dryRun ? " [dry-run]" : "") +
      ` · delay=${options.delayMs}ms`,
  );

  if (targets.length === 0) {
    console.log("Nothing to re-enrich.");
    return;
  }

  const reasonCounts: Record<StaleWordDetailReason, number> = {
    missing_meaning: 0,
    missing_register: 0,
    legacy_register: 0,
    embedded_register_hint: 0,
    misaligned_examples: 0,
  };
  for (const target of targets) {
    reasonCounts[target.reason] += 1;
  }
  console.log(
    `Stale reasons: missing_register=${reasonCounts.missing_register}` +
      ` legacy_register=${reasonCounts.legacy_register}` +
      ` embedded_hint=${reasonCounts.embedded_register_hint}` +
      ` misaligned_examples=${reasonCounts.misaligned_examples}` +
      ` missing_meaning=${reasonCounts.missing_meaning}`,
  );

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (let index = 0; index < targets.length; index += 1) {
    const { word, reason, row: existing } = targets[index]!;
    try {
      console.log(`\n→ ${word} (${reason})`);
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

      console.log(
        `  after:  ${summarizeRow({
          word,
          vietnamese_meaning: payload.vietnamese_meaning,
          collocations: payload.collocations,
          image_url: payload.image_url,
          examples: payload.examples,
        })}`,
      );
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

    if (index < targets.length - 1) {
      await sleep(options.delayMs);
    }
  }

  const remaining =
    options.allCached && !options.formalOnly
      ? Math.max(0, totalStale - options.offset - targets.length)
      : 0;

  console.log(
    `\nDone. updated=${updated} dry-run=${skipped} failed=${failed}` +
      (remaining > 0
        ? `\nNext batch: npm run re-enrich:stale -- --limit=${options.limit || 100} --offset=${options.offset + targets.length}`
        : ""),
  );
}

void main();
