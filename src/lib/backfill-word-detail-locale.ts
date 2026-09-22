import { localizeWordContent } from "@/lib/localize-word-content";
import type { LearnerLocale } from "@/lib/learner-locale";
import {
  dbPayloadFromMultilangRecord,
  migrateLegacyWordDetail,
  parseMeaningsJson,
  recordNeedsExampleTranslationsForLanguage,
  type MultilangWordRecord,
} from "@/lib/multilang-word-record";
import type { WordDetail } from "@/types/database";

export function wordDetailNeedsLocaleBackfill(
  detail: WordDetail,
  locale: LearnerLocale,
): boolean {
  if (locale === "vi") return false;
  const record = migrateLegacyWordDetail(detail);
  const meanings = parseMeaningsJson(detail.meanings);
  const missingMeaning = !meanings[locale]?.trim();
  const missingExamples = recordNeedsExampleTranslationsForLanguage(
    record,
    locale,
  );
  return missingMeaning || missingExamples;
}

export async function buildLocaleBackfillPayload(
  detail: WordDetail,
  locale: LearnerLocale,
): Promise<Partial<WordDetail> | null> {
  const record = migrateLegacyWordDetail(detail);
  const viMeaning =
    record.meanings.vi?.trim() || detail.vietnamese_meaning?.trim() || "";
  if (!viMeaning && !detail.english_definition?.trim()) {
    return null;
  }

  const patch = await localizeWordContent(
    {
      word: detail.word,
      vietnamese_meaning: viMeaning || detail.word,
      examples: record.examples,
      word_type: detail.word_type,
      english_definition: detail.english_definition,
      meanings: record.meanings,
      example_translations: record.example_translations,
    },
    locale,
  );

  const merged: MultilangWordRecord = {
    ...record,
    meanings: patch.meanings,
    example_translations: patch.example_translations,
    examples: patch.examples ?? record.examples,
  };

  const hasEsMeaning = Boolean(patch.meanings[locale]?.trim());
  const stillNeedsExamples = recordNeedsExampleTranslationsForLanguage(
    merged,
    locale,
  );
  if (!hasEsMeaning && stillNeedsExamples) {
    return null;
  }

  return dbPayloadFromMultilangRecord(merged);
}
