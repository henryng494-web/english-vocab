import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import {
  migrateLegacyWordDetail,
  pickPrimaryMeaning,
  type MultilangWordRecord,
  serializedExamplesForUserLanguage,
  setMeaningForLanguage,
  splitLegacyExamples,
} from "@/lib/multilang-word-record";
import type { UserLanguage } from "@/lib/user-language";
import type { WordDetail } from "@/types/database";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
} from "@/types/word-content";

export function coerceMultilangRecord(
  source: Pick<
    DiscoverWordData,
    | "word"
    | "phonetic"
    | "word_type"
    | "english_definition"
    | "examples"
    | "vietnamese_meaning"
    | "meanings"
    | "example_translations"
    | "collocations"
    | "image_url"
  >,
): MultilangWordRecord {
  const base: WordDetail = {
    id: "",
    word: source.word,
    phonetic: source.phonetic ?? "",
    word_type: source.word_type ?? "",
    vietnamese_meaning: source.vietnamese_meaning ?? "",
    english_definition: source.english_definition ?? "",
    examples: source.examples ?? "",
    meanings: source.meanings ?? null,
    example_translations: source.example_translations ?? null,
    collocations: source.collocations ?? null,
    image_url: source.image_url ?? null,
  };
  return migrateLegacyWordDetail(base);
}

export function applyMultilangToDiscoverWord(
  data: DiscoverWordData,
  userLanguage: UserLanguage,
): DiscoverWordData {
  const record = coerceMultilangRecord(data);
  const primaryMeaning = pickPrimaryMeaning(record, userLanguage);
  return {
    ...data,
    meanings: record.meanings,
    example_translations: record.example_translations,
    examples: serializedExamplesForUserLanguage(record, userLanguage),
    vietnamese_meaning: primaryMeaning,
  };
}

export function mergeLocaleIntoMultilangRecord(
  record: MultilangWordRecord,
  userLanguage: UserLanguage,
  gloss: string,
  examplesSerialized: string | null,
): MultilangWordRecord {
  let meanings = setMeaningForLanguage(record.meanings, userLanguage, gloss);
  let example_translations = record.example_translations;
  let examples = record.examples;

  if (examplesSerialized) {
    const split = splitLegacyExamples(examplesSerialized);
    if (split.examples) examples = split.examples;
    if (userLanguage === "vi" && split.example_translations.length) {
      example_translations = split.example_translations;
    } else if (userLanguage === "es" && split.example_translations.length) {
      example_translations = mergeTranslationRows(
        example_translations,
        split.example_translations,
        "es",
      );
    }
  }

  if (userLanguage === "vi") {
    meanings = setMeaningForLanguage(meanings, "vi", gloss);
  }

  return {
    ...record,
    meanings,
    examples,
    example_translations,
  };
}

function mergeTranslationRows(
  base: ExampleTranslationsJson,
  incoming: ExampleTranslationsJson,
  lang: UserLanguage,
): ExampleTranslationsJson {
  const max = Math.max(base.length, incoming.length);
  const next: ExampleTranslationsJson = [];
  for (let i = 0; i < max; i++) {
    next.push({
      ...(base[i] ?? {}),
      ...(incoming[i]?.[lang]
        ? { [lang]: incoming[i]![lang] }
        : {}),
    });
  }
  return next;
}

export function discoverWordFromMultilangRecord(
  record: MultilangWordRecord,
  userLanguage: UserLanguage,
  extra: Omit<
    DiscoverWordData,
    | "word"
    | "phonetic"
    | "word_type"
    | "english_definition"
    | "examples"
    | "vietnamese_meaning"
    | "meanings"
    | "example_translations"
    | "collocations"
    | "image_url"
  >,
): DiscoverWordData {
  const primaryMeaning = pickPrimaryMeaning(record, userLanguage);
  return {
    ...extra,
    word: record.word,
    phonetic: record.phonetic,
    word_type: record.word_type,
    english_definition: record.english_definition,
    examples: serializedExamplesForUserLanguage(record, userLanguage),
    meanings: record.meanings,
    example_translations: record.example_translations,
    collocations: record.collocations,
    image_url: record.image_url,
    vietnamese_meaning: primaryMeaning,
  };
}

export function meaningsForPersist(
  record: MultilangWordRecord,
): LocalizedMeaningsJson {
  return { ...record.meanings };
}
