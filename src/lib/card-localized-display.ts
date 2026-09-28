import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import {
  exampleRowsFromDetail,
  hasStoredLocaleMeaning,
  mergeLegacyViIntoMeanings,
  exampleTranslationsNeedLocale,
  parsePhraseTranslationsJson,
  phraseTranslationsNeedLocale,
} from "@/lib/multilang-record";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import {
  fallbackLearnerMeaningGloss,
  pickExampleTranslationForLocale,
  pickLocalizedMeaning,
} from "@/lib/localized-gloss";
import type { LearnerLocale } from "@/lib/learner-locale";
import { learnerLocaleNeedsHydration } from "@/lib/learner-locale";
import { parseExamples } from "@/lib/parse-examples";
import type { VocabExample } from "@/lib/parse-examples";

export function hasCompleteLocaleCardContent(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale,
): boolean {
  return !discoverDataNeedsLocaleHydration(data, learnerLocale);
}

/** Journey cache / fetch: VI baseline plus learner gloss when locale ≠ vi. */
export function isDiscoverWordReadyForLocale(
  data: DiscoverWordData | undefined,
  expectedWord: string,
  learnerLocale: LearnerLocale,
): boolean {
  if (!data?.word?.trim()) return false;
  if (
    expectedWord &&
    data.word.trim().toLowerCase() !== expectedWord.trim().toLowerCase()
  ) {
    return false;
  }
  if (!data.vietnamese_meaning?.trim() && !data.meanings?.vi?.trim()) {
    return false;
  }
  return hasCompleteLocaleCardContent(data, learnerLocale);
}

/** @deprecated Use `hasCompleteLocaleCardContent(data, "es")`. */
export function hasCompleteEsCardContent(data: DiscoverWordData): boolean {
  return hasCompleteLocaleCardContent(data, "es");
}

export function discoverDataNeedsLocaleHydration(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale,
): boolean {
  if (!learnerLocaleNeedsHydration(learnerLocale)) return false;
  const examples = data.examples ?? "";
  const detailLike = {
    word: data.word,
    meanings: data.meanings,
    vietnamese_meaning: data.vietnamese_meaning ?? "",
    examples,
    example_translations: data.example_translations,
    phrase_translations: data.phrase_translations,
    word_type: data.word_type,
  };
  const meanings = mergeLegacyViIntoMeanings(detailLike);
  const parsed = parseExamples(examples);
  const rows = exampleRowsFromDetail(detailLike);
  const count = Math.min(parsed.length, 2);
  const chunkEntry = resolveLearningChunks(data.word, {
    examples,
    wordType: data.word_type,
    meaning: data.vietnamese_meaning,
  });
  const phrases = parsePhraseTranslationsJson(data.phrase_translations);
  return (
    !hasStoredLocaleMeaning(meanings, learnerLocale) ||
    (count > 0 && exampleTranslationsNeedLocale(rows, count, learnerLocale)) ||
    (chunkEntry != null &&
      phraseTranslationsNeedLocale(phrases, chunkEntry, learnerLocale))
  );
}

/** @deprecated Use `discoverDataNeedsLocaleHydration(data, "es")`. */
export function discoverDataNeedsSpanishHydration(
  data: DiscoverWordData,
): boolean {
  return discoverDataNeedsLocaleHydration(data, "es");
}

export function primaryGlossForCard(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale,
  strictLearnerLocale = false,
): string | null {
  const meanings = mergeLegacyViIntoMeanings({
    meanings: data.meanings,
    vietnamese_meaning: data.vietnamese_meaning ?? "",
  });
  const picked = pickLocalizedMeaning(
    meanings,
    learnerLocale,
    data.vietnamese_meaning,
    data.english_definition,
    { strictLearnerLocale },
  );
  if (picked?.trim()) return picked.trim();
  if (learnerLocale === "vi" || strictLearnerLocale) return picked;
  const fallback = fallbackLearnerMeaningGloss(
    meanings,
    data.vietnamese_meaning,
    data.english_definition,
  );
  return fallback.trim() || null;
}

export function examplesForCard(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale,
  strictLearnerLocale = false,
): VocabExample[] {
  const parsed = parseExamples(data.examples ?? "");
  const rows = exampleRowsFromDetail({
    examples: data.examples ?? "",
    example_translations: data.example_translations,
  });
  return parsed.slice(0, 2).map((item, index) => ({
    en: item.en,
    vi:
      pickExampleTranslationForLocale(rows, index, learnerLocale, {
        strictLearnerLocale,
      }) ?? (learnerLocale === "vi" ? item.vi : ""),
    senseIndex: item.senseIndex,
  }));
}
