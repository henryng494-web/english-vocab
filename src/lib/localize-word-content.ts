import {
  translateCollocationToLearnerLocaleWithGemini,
  translateExampleToLearnerLocaleWithGemini,
  translateMeaningToLearnerLocaleWithGemini,
  translateWordLocaleBatchWithGemini,
} from "@/lib/gemini-core";
import type { LearnerLocaleBatchItem } from "@/lib/gemini-prompts";
import type { LearnerLocale } from "@/lib/learner-locale";
import { learnerLocaleNeedsHydration } from "@/lib/learner-locale";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import {
  exampleRowsFromDetail,
  mergeLegacyViIntoMeanings,
  hasStoredLocaleMeaning,
  exampleTranslationsNeedLocale,
  mergePhraseRowsFromEntry,
  parsePhraseTranslationsJson,
  phraseTranslationsNeedLocale,
  phraseTranslationsNeedVi,
} from "@/lib/multilang-record";
import { fallbackLearnerMeaningGloss } from "@/lib/localized-gloss";
import { parseExamples } from "@/lib/parse-examples";
import type { WordDetail } from "@/types/database";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
  PhraseTranslationsJson,
} from "@/types/word-content";

const MAX_EXAMPLES_TO_TRANSLATE = 2;

export function wordDetailNeedsLocaleHydration(
  detail: Pick<
    WordDetail,
    | "word"
    | "meanings"
    | "vietnamese_meaning"
    | "examples"
    | "example_translations"
    | "phrase_translations"
    | "word_type"
  >,
  locale: LearnerLocale,
): boolean {
  if (!learnerLocaleNeedsHydration(locale)) return false;
  const meanings = mergeLegacyViIntoMeanings(detail);
  const parsed = parseExamples(detail.examples);
  const rows = exampleRowsFromDetail(detail);
  const count = Math.min(parsed.length, MAX_EXAMPLES_TO_TRANSLATE);
  const chunkEntry = resolveLearningChunks(detail.word, {
    examples: detail.examples,
    wordType: detail.word_type,
    meaning: detail.vietnamese_meaning,
  });
  const phrases = parsePhraseTranslationsJson(detail.phrase_translations);
  return (
    !hasStoredLocaleMeaning(meanings, locale) ||
    (count > 0 && exampleTranslationsNeedLocale(rows, count, locale)) ||
    (chunkEntry != null &&
      phraseTranslationsNeedLocale(phrases, chunkEntry, locale))
  );
}

/**
 * Vietnamese is the source gloss for meanings/examples, but generated
 * collocations ("Hay dùng với") ship without a `vi` gloss until translated.
 */
export function wordDetailNeedsViPhraseHydration(
  detail: Pick<
    WordDetail,
    "word" | "vietnamese_meaning" | "examples" | "phrase_translations" | "word_type"
  >,
): boolean {
  const chunkEntry = resolveLearningChunks(detail.word, {
    examples: detail.examples,
    wordType: detail.word_type,
    meaning: detail.vietnamese_meaning,
  });
  if (!chunkEntry) return false;
  return phraseTranslationsNeedVi(
    parsePhraseTranslationsJson(detail.phrase_translations),
    chunkEntry,
  );
}

/** Backfill predicate: phrase-only for `vi`, full check for other locales. */
export function wordDetailNeedsBackfillForLocale(
  detail: Parameters<typeof wordDetailNeedsLocaleHydration>[0],
  locale: LearnerLocale,
): boolean {
  return locale === "vi"
    ? wordDetailNeedsViPhraseHydration(detail)
    : wordDetailNeedsLocaleHydration(detail, locale);
}

/** @deprecated Use `wordDetailNeedsLocaleHydration(detail, "es")`. */
export function wordDetailNeedsSpanishHydration(
  detail: Parameters<typeof wordDetailNeedsLocaleHydration>[0],
): boolean {
  return wordDetailNeedsLocaleHydration(detail, "es");
}

export async function hydrateLearnerLocaleWordContent(
  detail: WordDetail,
  locale: LearnerLocale,
): Promise<{
  meanings: LocalizedMeaningsJson;
  example_translations: ExampleTranslationsJson;
  phrase_translations: PhraseTranslationsJson;
}> {
  const meanings = mergeLegacyViIntoMeanings(detail);
  const example_translations = exampleRowsFromDetail(detail);
  const parsed = parseExamples(detail.examples).slice(
    0,
    MAX_EXAMPLES_TO_TRANSLATE,
  );

  const glossForPrompt =
    meanings[locale]?.trim() ||
    meanings.vi?.trim() ||
    detail.vietnamese_meaning;

  const needsLocale = learnerLocaleNeedsHydration(locale);
  const needsMeaning = needsLocale && !hasStoredLocaleMeaning(meanings, locale);

  const needsExamples =
    needsLocale &&
    parsed.length > 0 &&
    exampleTranslationsNeedLocale(example_translations, parsed.length, locale);
  const missingExampleIdx = needsExamples
    ? parsed
        .map((_, i) => i)
        .filter((i) => !example_translations[i]?.[locale]?.trim())
    : [];

  const chunkEntry = resolveLearningChunks(detail.word, {
    examples: detail.examples,
    wordType: detail.word_type,
    meaning: detail.vietnamese_meaning,
  });
  const parsedAll = parseExamples(detail.examples);
  let phrase_translations = parsePhraseTranslationsJson(detail.phrase_translations);

  const hydrateChunks =
    Boolean(chunkEntry) && (needsLocale || locale === "vi");
  const collocations = hydrateChunks
    ? mergePhraseRowsFromEntry(
        chunkEntry!.collocations,
        phrase_translations.collocations,
      )
    : [];
  const chunks = hydrateChunks
    ? mergePhraseRowsFromEntry(chunkEntry!.chunks, phrase_translations.chunks)
    : [];

  const missingCollocationIdx: number[] = [];
  const missingChunkIdx: number[] = [];
  if (hydrateChunks) {
    for (let i = 0; i < collocations.length; i += 1) {
      if (!collocations[i][locale]?.trim()) missingCollocationIdx.push(i);
    }
    for (let i = 0; i < chunks.length; i += 1) {
      if (chunks[i][locale]?.trim()) continue;
      const en = chunks[i].en ?? chunkEntry!.chunks[i].en;
      const exIdx = parsedAll.findIndex(
        (row) => row.en.trim().toLowerCase() === en.trim().toLowerCase(),
      );
      const fromExample =
        exIdx >= 0 ? example_translations[exIdx]?.[locale]?.trim() : null;
      if (fromExample) {
        chunks[i] = { ...chunks[i], [locale]: fromExample };
      } else {
        missingChunkIdx.push(i);
      }
    }
  }

  // One combined Gemini call for everything still missing on this task
  // (meaning + examples + collocations + chunks) instead of up to ~7
  // separate calls — see `buildLearnerLocaleBatchPrompt`. Falls back to the
  // original per-item calls below if the batch call is unavailable or the
  // response doesn't parse cleanly, so correctness never depends on batching
  // succeeding.
  type BatchTarget =
    | { kind: "meaning" }
    | { kind: "example"; idx: number }
    | { kind: "collocation"; idx: number }
    | { kind: "chunk"; idx: number };

  const batchItems: LearnerLocaleBatchItem[] = [];
  const batchTargets: BatchTarget[] = [];

  if (needsMeaning) {
    batchItems.push({
      kind: "meaning",
      vietnameseMeaning: meanings.vi ?? detail.vietnamese_meaning,
      englishDefinition: detail.english_definition,
    });
    batchTargets.push({ kind: "meaning" });
  }
  for (const i of missingExampleIdx) {
    batchItems.push({
      kind: "example",
      englishSentence: parsed[i].en,
      pos: detail.word_type,
      meaning: glossForPrompt,
    });
    batchTargets.push({ kind: "example", idx: i });
  }
  for (const i of missingCollocationIdx) {
    batchItems.push({
      kind: "collocation",
      englishPhrase: collocations[i].en ?? chunkEntry!.collocations[i].en,
      vietnameseGloss: collocations[i].vi ?? chunkEntry!.collocations[i].vi,
    });
    batchTargets.push({ kind: "collocation", idx: i });
  }
  for (const i of missingChunkIdx) {
    batchItems.push({
      kind: "example",
      englishSentence: chunks[i].en ?? chunkEntry!.chunks[i].en,
      pos: detail.word_type,
      meaning: glossForPrompt,
    });
    batchTargets.push({ kind: "chunk", idx: i });
  }

  let batchHandled = false;
  if (batchItems.length > 0) {
    const results = await translateWordLocaleBatchWithGemini(
      locale,
      detail.word,
      batchItems,
    );
    if (results && results.length === batchItems.length) {
      batchHandled = true;
      results.forEach((value, i) => {
        const text = value?.trim();
        if (!text) return;
        const target = batchTargets[i];
        if (target.kind === "meaning") {
          meanings[locale] = text;
        } else if (target.kind === "example") {
          const next = { ...(example_translations[target.idx] ?? {}) };
          if (parsed[target.idx].vi?.trim() && !next.vi) {
            next.vi = parsed[target.idx].vi.trim();
          }
          next[locale] = text;
          example_translations[target.idx] = next;
        } else if (target.kind === "collocation") {
          collocations[target.idx] = {
            ...collocations[target.idx],
            [locale]: text,
          };
        } else {
          chunks[target.idx] = { ...chunks[target.idx], [locale]: text };
        }
      });
    }
  }

  if (!batchHandled) {
    if (needsMeaning) {
      let localized = await translateMeaningToLearnerLocaleWithGemini(
        locale,
        detail.word,
        meanings.vi ?? detail.vietnamese_meaning,
        detail.english_definition,
      );
      if (!localized?.trim()) {
        localized = fallbackLearnerMeaningGloss(
          meanings,
          detail.vietnamese_meaning,
          detail.english_definition,
        );
      }
      if (localized?.trim()) meanings[locale] = localized.trim();
    }

    for (const i of missingExampleIdx) {
      const line = await translateExampleToLearnerLocaleWithGemini(
        locale,
        parsed[i].en,
        detail.word,
        detail.word_type,
        glossForPrompt,
      );
      const next = { ...(example_translations[i] ?? {}) };
      if (parsed[i].vi?.trim() && !next.vi) next.vi = parsed[i].vi.trim();
      if (line?.trim()) next[locale] = line.trim();
      example_translations[i] = next;
    }

    if (hydrateChunks) {
      for (const i of missingCollocationIdx) {
        const localized = await translateCollocationToLearnerLocaleWithGemini(
          locale,
          collocations[i].en ?? chunkEntry!.collocations[i].en,
          detail.word,
          collocations[i].vi ?? chunkEntry!.collocations[i].vi,
        );
        if (localized?.trim()) {
          collocations[i] = { ...collocations[i], [locale]: localized.trim() };
        }
      }
      for (const i of missingChunkIdx) {
        const en = chunks[i].en ?? chunkEntry!.chunks[i].en;
        const line = await translateExampleToLearnerLocaleWithGemini(
          locale,
          en,
          detail.word,
          detail.word_type,
          glossForPrompt,
        );
        if (line?.trim()) chunks[i] = { ...chunks[i], [locale]: line.trim() };
      }
    }
  } else if (needsMeaning && !meanings[locale]?.trim()) {
    // Batch ran but the meaning slot came back empty — apply the same
    // offline fallback the granular path uses instead of leaving it blank.
    const localized = fallbackLearnerMeaningGloss(
      meanings,
      detail.vietnamese_meaning,
      detail.english_definition,
    );
    if (localized?.trim()) meanings[locale] = localized.trim();
  }

  if (hydrateChunks) {
    phrase_translations = { collocations, chunks };
  }

  return { meanings, example_translations, phrase_translations };
}

/** @deprecated Use `hydrateLearnerLocaleWordContent(detail, "es")`. */
export async function hydrateSpanishWordContent(
  detail: WordDetail,
): Promise<{
  meanings: LocalizedMeaningsJson;
  example_translations: ExampleTranslationsJson;
  phrase_translations: PhraseTranslationsJson;
}> {
  return hydrateLearnerLocaleWordContent(detail, "es");
}
