import { translateCollocationsWithGemini } from "@/lib/gemini-core";
import { localizeWordContent } from "@/lib/localize-word-content";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import type { LearnerLocale } from "@/lib/learner-locale";
import {
  phraseNeedsLocaleTranslation,
  stripWrongLocalePhraseTranslations,
} from "@/lib/phrase-locale";
import {
  mergePhraseTranslationRows,
  parsePhraseTranslationsJson,
  phraseTranslationsNeedLocale,
} from "@/lib/phrase-translations";
import {
  dbPayloadFromMultilangRecord,
  migrateLegacyWordDetail,
  parseMeaningsJson,
  recordNeedsExampleTranslationsForLanguage,
  type MultilangWordRecord,
} from "@/lib/multilang-word-record";
import { alignmentMeaningLines } from "@/lib/word-meanings";
import type { WordDetail } from "@/types/database";
import type { PhraseTranslationsJson } from "@/types/word-content";

function learningChunkEntry(detail: WordDetail, record: MultilangWordRecord) {
  const gloss =
    record.meanings.es?.trim() ||
    record.meanings.vi?.trim() ||
    detail.vietnamese_meaning?.trim() ||
    null;
  return resolveLearningChunks(detail.word, {
    examples: record.examples,
    wordType: detail.word_type,
    meaning: gloss,
  });
}

export function wordDetailNeedsLocaleBackfill(
  detail: WordDetail,
  locale: LearnerLocale,
): boolean {
  if (locale === "vi") return false;
  const record = migrateLegacyWordDetail(detail);
  const meanings = parseMeaningsJson(detail.meanings);
  const storedPhrases = parsePhraseTranslationsJson(detail.phrase_translations);
  const missingMeaning = !meanings[locale]?.trim();
  const missingExamples = recordNeedsExampleTranslationsForLanguage(
    record,
    locale,
  );
  const entry = learningChunkEntry(detail, record);
  const missingPhrases =
    entry &&
    phraseTranslationsNeedLocale(entry, storedPhrases, locale);
  return missingMeaning || missingExamples || Boolean(missingPhrases);
}

export async function hydratePhraseTranslations(
  detail: WordDetail,
  record: MultilangWordRecord,
  locale: LearnerLocale,
  meaningForPrompt: string,
): Promise<PhraseTranslationsJson> {
  let stored = parsePhraseTranslationsJson(detail.phrase_translations);
  const entry = learningChunkEntry(detail, record);
  if (!entry) return stored;

  const translateGroup = async (
    kind: "collocations" | "chunks",
    items: typeof entry.collocations,
  ) => {
    const pending = items.filter((item) =>
      phraseNeedsLocaleTranslation(item, locale),
    );
    if (!pending.length) return;

    const meaningLines = alignmentMeaningLines(meaningForPrompt);
    const translations = await translateCollocationsWithGemini(
      detail.word,
      pending.map((item) => ({
        en: item.en,
        contextEn: item.en,
        contextVi: item.vi?.trim() || null,
        senseMeaning: meaningLines[0] ?? meaningForPrompt,
      })),
      detail.word_type,
      meaningForPrompt,
      {
        englishDefinition: detail.english_definition,
        learnerLocale: locale,
      },
    );
    if (!translations?.length) return;

    const translated = pending.map((item, index) => ({
      ...item,
      vi: translations[index]?.trim() ?? "",
    }));
    stored = mergePhraseTranslationRows(stored, kind, translated, locale);
  };

  await translateGroup("collocations", entry.collocations);
  await translateGroup("chunks", entry.chunks);
  return stored;
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

  const phrase_translations = await hydratePhraseTranslations(
    detail,
    merged,
    locale,
    patch.meanings[locale] ?? patch.meanings.vi ?? viMeaning,
  );

  const stillNeedsExamples = recordNeedsExampleTranslationsForLanguage(
    merged,
    locale,
  );
  const entry = learningChunkEntry(detail, merged);
  const stillNeedsPhrases =
    entry &&
    phraseTranslationsNeedLocale(
      {
        collocations: entry.collocations,
        chunks: entry.chunks,
      },
      phrase_translations,
      locale,
    );

  if (stillNeedsExamples || stillNeedsPhrases) {
    return null;
  }

  return {
    ...dbPayloadFromMultilangRecord(merged),
    phrase_translations,
  };
}
