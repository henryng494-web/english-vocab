import { phraseTranslationForLocale } from "@/lib/phrase-locale";
import { coerceMultilangRecord } from "@/lib/discover-word-multilang";
import {
  pickExampleTranslation,
  pickPrimaryMeaning,
  vocabExamplesFromRecord,
} from "@/lib/multilang-word-record";
import type { UserLanguage } from "@/lib/user-language";
import { courseIdFor, learningLanguageId } from "@/lib/user-language";
import type {
  WordContentRecord,
  WordDisplayView,
} from "@/types/word-content";
import { formatMeaningsForDisplay } from "@/lib/word-meanings";
import type { VocabExample } from "@/lib/parse-examples";

/** Legacy API/DB shape — normalized through `coerceMultilangRecord`. */
export type WordDisplaySource = {
  word: string;
  phonetic?: string | null;
  word_type?: string | null;
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
  examples?: string | null;
  meanings?: import("@/types/word-content").LocalizedMeaningsJson | null;
  example_translations?:
    | import("@/types/word-content").ExampleTranslationsJson
    | null;
  collocations?: string | null;
  image_url?: string | null;
};

/** Legacy chunk lines until chunk cache is repopulated after language switch. */
export function translationLineForUserLanguage(
  text: string | null | undefined,
  userLanguage: UserLanguage,
): string | null {
  return phraseTranslationForLocale({ vi: text ?? "" }, userLanguage);
}

export function exampleTranslationForUserLanguage(
  example: VocabExample,
  userLanguage: UserLanguage,
  exampleIndex: number,
  source: WordDisplaySource,
): string | null {
  const record = coerceMultilangRecord(source);
  const fromJson = pickExampleTranslation(record, exampleIndex, userLanguage);
  if (fromJson) return fromJson;
  return null;
}

export function primaryMeaningForUserLanguage(
  source: WordDisplaySource,
  userLanguage: UserLanguage,
): string | null {
  const record = coerceMultilangRecord(source);
  return pickPrimaryMeaning(record, userLanguage);
}

export function resolveWordDisplay(
  source: WordDisplaySource,
  userLanguage: UserLanguage,
): WordDisplayView {
  const record = coerceMultilangRecord(source);
  const primaryMeaning = pickPrimaryMeaning(record, userLanguage);
  const primaryMeaningLines = primaryMeaning
    ? formatMeaningsForDisplay(primaryMeaning)
    : [];

  const parsed = vocabExamplesFromRecord(record, userLanguage);
  const examples = parsed.map((item, index) => ({
    sentence: item.en,
    translation:
      pickExampleTranslation(record, index, userLanguage) ||
      null,
  }));

  return {
    learningLanguage: learningLanguageId(),
    userLanguage,
    courseId: courseIdFor(userLanguage),
    targetWord: source.word,
    phonetic: source.phonetic?.trim() || null,
    wordType: source.word_type?.trim() || null,
    primaryMeaningLines,
    primaryMeaning,
    examples,
  };
}

export function wordContentFromLegacySource(
  source: WordDisplaySource,
  activeUserLanguage: UserLanguage,
): WordContentRecord {
  const record = coerceMultilangRecord(source);
  return {
    learningLanguage: learningLanguageId(),
    targetWord: record.word,
    phonetic: record.phonetic,
    wordType: record.word_type,
    englishDefinition: record.english_definition,
    primaryMeanings: { ...record.meanings },
    examples: record.example_translations.length
      ? vocabExamplesFromRecord(record, activeUserLanguage).map((item, index) => ({
          sentence: item.en,
          translations: {
            ...(record.example_translations[index]?.vi
              ? { vi: record.example_translations[index]!.vi! }
              : {}),
            ...(record.example_translations[index]?.es
              ? { es: record.example_translations[index]!.es! }
              : {}),
          },
        }))
      : [],
  };
}

export function applyUserLanguageToDiscoverData<
  T extends WordDisplaySource & { word: string },
>(data: T, userLanguage: UserLanguage): T {
  const display = resolveWordDisplay(data, userLanguage);
  return {
    ...data,
    vietnamese_meaning: display.primaryMeaning,
    examples: display.examples
      .map((item) =>
        item.translation
          ? `${item.sentence}\n---\n${item.translation}`
          : item.sentence,
      )
      .join("\n---\n"),
  };
}
