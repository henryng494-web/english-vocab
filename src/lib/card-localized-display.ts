import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import {
  exampleRowsFromDetail,
  hasStoredEsMeaning,
  mergeLegacyViIntoMeanings,
  exampleTranslationsNeedEs,
} from "@/lib/multilang-record";
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
  const detailLike = {
    meanings: data.meanings,
    vietnamese_meaning: data.vietnamese_meaning ?? "",
    examples: data.examples ?? "",
    example_translations: data.example_translations,
  };
  const meanings = mergeLegacyViIntoMeanings(detailLike);
  const parsed = parseExamples(data.examples);
  const rows = exampleRowsFromDetail(detailLike);
  const count = Math.min(parsed.length, 2);
  return (
    !hasStoredEsMeaning(meanings) ||
    (count > 0 && exampleTranslationsNeedEs(rows, count))
  );
}

export function primaryGlossForCard(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale,
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
  );
}

export function examplesForCard(
  data: DiscoverWordData,
  learnerLocale: LearnerLocale,
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
      pickExampleTranslationForLocale(rows, index, learnerLocale) ??
      (learnerLocale === "vi" ? item.vi : ""),
    senseIndex: item.senseIndex,
  }));
}
