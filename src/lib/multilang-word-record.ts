import { isLikelyVietnameseGloss } from "@/lib/example-quality";
import type { UserLanguage } from "@/lib/user-language";
import {
  parseExamples,
  serializeExamples,
  type VocabExample,
} from "@/lib/parse-examples";
import type { WordDetail } from "@/types/database";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
} from "@/types/word-content";

export type MultilangWordRecord = {
  word: string;
  phonetic: string | null;
  word_type: string | null;
  english_definition: string | null;
  /** English-only example sentences (serialized). */
  examples: string | null;
  meanings: LocalizedMeaningsJson;
  example_translations: ExampleTranslationsJson;
  collocations: string | null;
  image_url: string | null;
};

const EMPTY_MEANINGS: LocalizedMeaningsJson = {};
const EMPTY_TRANSLATIONS: ExampleTranslationsJson = [];

export function parseMeaningsJson(raw: unknown): LocalizedMeaningsJson {
  if (!raw || typeof raw !== "object") return { ...EMPTY_MEANINGS };
  const out: LocalizedMeaningsJson = {};
  for (const lang of ["vi", "es"] as const) {
    const value = (raw as Record<string, unknown>)[lang];
    if (typeof value === "string" && value.trim()) {
      out[lang] = value.trim();
    }
  }
  return out;
}

export function parseExampleTranslationsJson(
  raw: unknown,
): ExampleTranslationsJson {
  if (!Array.isArray(raw)) return [...EMPTY_TRANSLATIONS];
  return raw.map((row) => {
    if (!row || typeof row !== "object") return {};
    const out: Partial<Record<UserLanguage, string>> = {};
    for (const lang of ["vi", "es"] as const) {
      const value = (row as Record<string, unknown>)[lang];
      if (typeof value === "string" && value.trim()) {
        out[lang] = value.trim();
      }
    }
    return out;
  });
}

/** Split legacy `examples` string (en + vi pairs) into EN-only + per-locale translations. */
export function splitLegacyExamples(serialized: string | null | undefined): {
  examples: string | null;
  example_translations: ExampleTranslationsJson;
} {
  const parsed = parseExamples(serialized);
  if (!parsed.length) {
    return { examples: null, example_translations: [] };
  }

  const example_translations: ExampleTranslationsJson = parsed.map((item) => {
    const row: Partial<Record<UserLanguage, string>> = {};
    const gloss = item.vi?.trim();
    if (!gloss) return row;
    if (isLikelyVietnameseGloss(gloss)) row.vi = gloss;
    else row.es = gloss;
    return row;
  });

  const enOnly: VocabExample[] = parsed.map((item) => ({
    en: item.en,
    vi: "",
    senseIndex: item.senseIndex,
  }));

  return {
    examples: serializeExamples(enOnly) || null,
    example_translations,
  };
}

export function mergeExampleTranslationRows(
  base: ExampleTranslationsJson,
  incoming: ExampleTranslationsJson,
): ExampleTranslationsJson {
  const max = Math.max(base.length, incoming.length);
  const next: ExampleTranslationsJson = [];
  for (let i = 0; i < max; i++) {
    next.push({
      ...(base[i] ?? {}),
      ...(incoming[i] ?? {}),
    });
  }
  return next;
}

export function mergeExampleTranslationRow(
  rows: ExampleTranslationsJson,
  index: number,
  userLanguage: UserLanguage,
  translation: string,
): ExampleTranslationsJson {
  const next = rows.map((row) => ({ ...row }));
  while (next.length <= index) next.push({});
  next[index] = { ...next[index], [userLanguage]: translation.trim() };
  return next;
}

export function migrateLegacyWordDetail(detail: WordDetail): MultilangWordRecord {
  let meanings = parseMeaningsJson(detail.meanings);
  let example_translations = parseExampleTranslationsJson(
    detail.example_translations,
  );
  let examples: string | null = detail.examples ?? null;

  if (!meanings.vi && detail.vietnamese_meaning?.trim()) {
    meanings = { ...meanings, vi: detail.vietnamese_meaning.trim() };
  }

  const parsedExamples = parseExamples(examples);
  const embeddedTranslations = parsedExamples.some((item) => item.vi?.trim());
  if (embeddedTranslations && examples) {
    const split = splitLegacyExamples(examples);
    examples = split.examples ?? null;
    if (split.example_translations.length) {
      example_translations = mergeExampleTranslationRows(
        example_translations,
        split.example_translations,
      );
    }
  }

  return {
    word: detail.word,
    phonetic: detail.phonetic ?? null,
    word_type: detail.word_type ?? null,
    english_definition: detail.english_definition ?? null,
    examples,
    meanings,
    example_translations,
    collocations: detail.collocations ?? null,
    image_url: detail.image_url ?? null,
  };
}

/**
 * Primary gloss for UI — never cross-fallback vi→es.
 * Missing ES → English definition or null.
 */
export function pickPrimaryMeaning(
  record: Pick<
    MultilangWordRecord,
    "meanings" | "english_definition"
  >,
  userLanguage: UserLanguage,
): string | null {
  const direct = record.meanings[userLanguage]?.trim();
  if (direct) return direct;
  const enDef = record.english_definition?.trim();
  if (userLanguage === "es" && enDef) return enDef;
  if (userLanguage === "vi" && enDef) return enDef;
  return null;
}

export function pickExampleTranslation(
  record: Pick<MultilangWordRecord, "example_translations">,
  exampleIndex: number,
  userLanguage: UserLanguage,
): string | null {
  const row = record.example_translations[exampleIndex];
  const direct = row?.[userLanguage]?.trim();
  return direct || null;
}

export function vocabExamplesFromRecord(
  record: MultilangWordRecord,
  userLanguage: UserLanguage,
): VocabExample[] {
  const parsed = parseExamples(record.examples);
  return parsed.map((item, index) => ({
    en: item.en,
    vi:
      pickExampleTranslation(record, index, userLanguage) ??
      "",
    senseIndex: item.senseIndex,
  }));
}

export function serializedExamplesForUserLanguage(
  record: MultilangWordRecord,
  userLanguage: UserLanguage,
): string | null {
  const rows = vocabExamplesFromRecord(record, userLanguage).filter(
    (item) => item.en.trim(),
  );
  if (!rows.length) {
    return englishOnlyExamplesSerialized(record.examples);
  }
  const withTranslations = rows.filter((item) => item.vi.trim());
  if (!withTranslations.length) {
    return serializeExamples(rows) || null;
  }
  return serializeExamples(withTranslations) || null;
}

/** Strip legacy `|||vi` / `---` pairs so chunk UI cannot leak Vietnamese when locale is es. */
export function englishOnlyExamplesSerialized(
  serialized: string | null | undefined,
): string | null {
  if (!serialized?.trim()) return null;
  const parsed = parseExamples(serialized);
  if (!parsed.some((item) => item.vi?.trim())) return serialized;
  const split = splitLegacyExamples(serialized);
  return (
    split.examples ??
    (serializeExamples(parsed.map((item) => ({ en: item.en, vi: "" }))) || null)
  );
}

export function hasValidExampleTranslationForLanguage(
  record: Pick<MultilangWordRecord, "examples" | "example_translations">,
  index: number,
  userLanguage: UserLanguage,
): boolean {
  if (userLanguage === "vi") {
    const tr = record.example_translations[index]?.vi?.trim();
    return Boolean(tr && isLikelyVietnameseGloss(tr));
  }
  const tr = record.example_translations[index]?.[userLanguage]?.trim();
  if (tr && !isLikelyVietnameseGloss(tr)) return true;
  return false;
}

export function recordNeedsExampleTranslationsForLanguage(
  record: Pick<MultilangWordRecord, "examples" | "example_translations">,
  userLanguage: UserLanguage,
): boolean {
  if (userLanguage === "vi") return false;
  const parsed = parseExamples(record.examples);
  if (!parsed.length) return false;
  for (let index = 0; index < parsed.length; index += 1) {
    if (!hasValidExampleTranslationForLanguage(record, index, userLanguage)) {
      return true;
    }
  }
  return false;
}

export function setMeaningForLanguage(
  meanings: LocalizedMeaningsJson,
  userLanguage: UserLanguage,
  gloss: string,
): LocalizedMeaningsJson {
  return { ...meanings, [userLanguage]: gloss.trim() };
}

export function dbPayloadFromMultilangRecord(
  record: MultilangWordRecord,
): Partial<WordDetail> {
  return {
    phonetic: record.phonetic ?? "",
    word_type: record.word_type ?? "unknown",
    english_definition: record.english_definition ?? "",
    examples: record.examples ?? "",
    meanings: record.meanings as WordDetail["meanings"],
    example_translations:
      record.example_translations as WordDetail["example_translations"],
    vietnamese_meaning: record.meanings.vi?.trim() ?? "",
    collocations: record.collocations,
    image_url: record.image_url,
  };
}

export function hasMeaningForLanguage(
  record: Pick<MultilangWordRecord, "meanings" | "english_definition">,
  userLanguage: UserLanguage,
): boolean {
  return Boolean(pickPrimaryMeaning(record, userLanguage)?.trim());
}
