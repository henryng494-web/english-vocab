import {
  translateCollocationToLearnerLocaleWithGemini,
  translateExampleToLearnerLocaleWithGemini,
  translateMeaningToLearnerLocaleWithGemini,
} from "@/lib/gemini-core";
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
} from "@/lib/multilang-record";
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
  let example_translations = exampleRowsFromDetail(detail);
  const parsed = parseExamples(detail.examples).slice(
    0,
    MAX_EXAMPLES_TO_TRANSLATE,
  );

  const glossForPrompt =
    meanings[locale]?.trim() ||
    meanings.vi?.trim() ||
    detail.vietnamese_meaning;

  if (
    learnerLocaleNeedsHydration(locale) &&
    !hasStoredLocaleMeaning(meanings, locale)
  ) {
    const localized = await translateMeaningToLearnerLocaleWithGemini(
      locale,
      detail.word,
      meanings.vi ?? detail.vietnamese_meaning,
      detail.english_definition,
    );
    if (localized?.trim()) meanings[locale] = localized.trim();
  }

  if (
    learnerLocaleNeedsHydration(locale) &&
    parsed.length &&
    exampleTranslationsNeedLocale(example_translations, parsed.length, locale)
  ) {
    const next = [...example_translations];
    for (let i = 0; i < parsed.length; i += 1) {
      if (next[i]?.[locale]?.trim()) continue;
      const line = await translateExampleToLearnerLocaleWithGemini(
        locale,
        parsed[i].en,
        detail.word,
        detail.word_type,
        glossForPrompt,
      );
      next[i] = { ...(next[i] ?? {}), ...(next[i]?.vi ? { vi: next[i].vi } : {}) };
      if (parsed[i].vi?.trim() && !next[i].vi) next[i].vi = parsed[i].vi.trim();
      if (line?.trim()) next[i][locale] = line.trim();
    }
    example_translations = next;
  }

  const chunkEntry = resolveLearningChunks(detail.word, {
    examples: detail.examples,
    wordType: detail.word_type,
    meaning: detail.vietnamese_meaning,
  });
  const parsedAll = parseExamples(detail.examples);
  let phrase_translations = parsePhraseTranslationsJson(detail.phrase_translations);

  if (chunkEntry && learnerLocaleNeedsHydration(locale)) {
    const collocations = mergePhraseRowsFromEntry(
      chunkEntry.collocations,
      phrase_translations.collocations,
    );
    const chunks = mergePhraseRowsFromEntry(
      chunkEntry.chunks,
      phrase_translations.chunks,
    );

    for (let i = 0; i < collocations.length; i += 1) {
      if (collocations[i][locale]?.trim()) continue;
      const localized = await translateCollocationToLearnerLocaleWithGemini(
        locale,
        collocations[i].en ?? chunkEntry.collocations[i].en,
        detail.word,
        collocations[i].vi ?? chunkEntry.collocations[i].vi,
      );
      if (localized?.trim()) {
        collocations[i] = { ...collocations[i], [locale]: localized.trim() };
      }
    }

    for (let i = 0; i < chunks.length; i += 1) {
      if (chunks[i][locale]?.trim()) continue;
      const en = chunks[i].en ?? chunkEntry.chunks[i].en;
      const exIdx = parsedAll.findIndex(
        (row) => row.en.trim().toLowerCase() === en.trim().toLowerCase(),
      );
      const fromExample =
        exIdx >= 0 ? example_translations[exIdx]?.[locale]?.trim() : null;
      if (fromExample) {
        chunks[i] = { ...chunks[i], [locale]: fromExample };
        continue;
      }
      const line = await translateExampleToLearnerLocaleWithGemini(
        locale,
        en,
        detail.word,
        detail.word_type,
        glossForPrompt,
      );
      if (line?.trim()) chunks[i] = { ...chunks[i], [locale]: line.trim() };
    }

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
