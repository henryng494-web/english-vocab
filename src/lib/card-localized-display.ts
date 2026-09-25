import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import {
  exampleRowsFromDetail,
  hasStoredEsMeaning,
  mergeLegacyViIntoMeanings,
  exampleTranslationsNeedEs,
  parsePhraseTranslationsJson,
  phraseTranslationsNeedEs,
} from "@/lib/multilang-record";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import {
  pickExampleTranslationForLocale,
  pickLocalizedMeaning,
} from "@/lib/localized-gloss";
import type { LearnerLocale } from "@/lib/learner-locale";
import { parseExamples } from "@/lib/parse-examples";
import type { VocabExample } from "@/lib/parse-examples";

export function discoverDataNeedsSpanishHydration(
  data: DiscoverWordData,
): boolean {
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
    !hasStoredEsMeaning(meanings) ||
    (count > 0 && exampleTranslationsNeedEs(rows, count)) ||
    (chunkEntry != null && phraseTranslationsNeedEs(phrases, chunkEntry))
  );
}

export function primaryGlossForCard(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale,
  strictEs = false,
): string | null {
  const meanings = mergeLegacyViIntoMeanings({
    meanings: data.meanings,
    vietnamese_meaning: data.vietnamese_meaning ?? "",
  });
  return pickLocalizedMeaning(
    meanings,
    learnerLocale,
    data.vietnamese_meaning,
    data.english_definition,
    { strictEs },
  );
}

export function examplesForCard(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale,
  strictEs = false,
): VocabExample[] {
  const examples = data.examples ?? "";
  const parsed = parseExamples(examples);
  const rows = exampleRowsFromDetail({
    examples,
    example_translations: data.example_translations,
  });
  return parsed.slice(0, 2).map((item, index) => ({
    en: item.en,
    vi:
      pickExampleTranslationForLocale(rows, index, learnerLocale, {
        strictEs,
      }) ?? (learnerLocale === "vi" ? item.vi : ""),
    senseIndex: item.senseIndex,
  }));
}
