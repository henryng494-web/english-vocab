import { LEARNER_LOCALE_OPTIONS, type LearnerLocale } from "@/lib/learner-locale";
import { parseExamples } from "@/lib/parse-examples";
import type { WordDetail } from "@/types/database";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
  PhraseTranslationRow,
  PhraseTranslationsJson,
} from "@/types/word-content";
import type { LearningChunkEntry } from "@/data/demo-learning-chunks";

function parseLocaleStringRecord(raw: unknown): Partial<Record<LearnerLocale, string>> {
  if (!raw || typeof raw !== "object") return {};
  const out: Partial<Record<LearnerLocale, string>> = {};
  for (const lang of LEARNER_LOCALE_OPTIONS) {
    const value = (raw as Record<string, unknown>)[lang];
    if (typeof value === "string" && value.trim()) out[lang] = value.trim();
  }
  return out;
}

export function parseMeaningsJson(raw: unknown): LocalizedMeaningsJson {
  return parseLocaleStringRecord(raw);
}

export function parseExampleTranslationsJson(
  raw: unknown,
): ExampleTranslationsJson {
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => parseLocaleStringRecord(row));
}

export function mergeLegacyViIntoMeanings(
  detail: Pick<WordDetail, "meanings" | "vietnamese_meaning">,
): LocalizedMeaningsJson {
  const meanings = parseMeaningsJson(detail.meanings);
  if (!meanings.vi?.trim() && detail.vietnamese_meaning?.trim()) {
    meanings.vi = detail.vietnamese_meaning.trim();
  }
  return meanings;
}

export function exampleRowsFromDetail(
  detail: Pick<WordDetail, "examples" | "example_translations">,
): ExampleTranslationsJson {
  const parsed = parseExamples(detail.examples);
  const rows = parseExampleTranslationsJson(detail.example_translations);
  return parsed.map((item, index) => {
    const row = { ...(rows[index] ?? {}) };
    if (!row.vi?.trim() && item.vi?.trim()) row.vi = item.vi.trim();
    return row;
  });
}

export function hasStoredLocaleMeaning(
  meanings: LocalizedMeaningsJson | null | undefined,
  locale: LearnerLocale,
): boolean {
  if (locale === "vi") {
    return Boolean(meanings?.vi?.trim());
  }
  return Boolean(meanings?.[locale]?.trim());
}

/** @deprecated Use `hasStoredLocaleMeaning(meanings, "es")`. */
export function hasStoredEsMeaning(
  meanings: LocalizedMeaningsJson | null | undefined,
): boolean {
  return hasStoredLocaleMeaning(meanings, "es");
}

export function exampleTranslationsNeedLocale(
  rows: ExampleTranslationsJson,
  exampleCount: number,
  locale: LearnerLocale,
): boolean {
  if (locale === "vi") return false;
  for (let i = 0; i < exampleCount; i += 1) {
    if (!rows[i]?.[locale]?.trim()) return true;
  }
  return false;
}

/** @deprecated Use `exampleTranslationsNeedLocale(rows, count, "es")`. */
export function exampleTranslationsNeedEs(
  rows: ExampleTranslationsJson,
  exampleCount: number,
): boolean {
  return exampleTranslationsNeedLocale(rows, exampleCount, "es");
}

function normalizePhraseEn(en: string): string {
  return en.trim().toLowerCase();
}

export function parsePhraseTranslationsJson(
  raw: unknown,
): PhraseTranslationsJson {
  if (!raw || typeof raw !== "object") return {};
  const source = raw as Record<string, unknown>;
  const parseRows = (value: unknown): PhraseTranslationRow[] => {
    if (!Array.isArray(value)) return [];
    return value.map((row) => {
      if (!row || typeof row !== "object") return {};
      const out: PhraseTranslationRow = {};
      const en = (row as Record<string, unknown>).en;
      if (typeof en === "string" && en.trim()) out.en = en.trim();
      for (const lang of LEARNER_LOCALE_OPTIONS) {
        const gloss = (row as Record<string, unknown>)[lang];
        if (typeof gloss === "string" && gloss.trim()) out[lang] = gloss.trim();
      }
      return out;
    });
  };
  const similar = Array.isArray(source.similar)
    ? source.similar.filter((item): item is string => typeof item === "string")
    : [];
  return {
    collocations: parseRows(source.collocations),
    chunks: parseRows(source.chunks),
    ...(similar.length ? { similar } : {}),
  };
}

export function findPhraseRow(
  rows: PhraseTranslationRow[] | undefined,
  englishPhrase: string,
): PhraseTranslationRow | undefined {
  const key = normalizePhraseEn(englishPhrase);
  if (!key) return undefined;
  return rows?.find((row) => normalizePhraseEn(row.en ?? "") === key);
}

export function phraseListNeedsLocale(
  items: { en: string }[],
  rows: PhraseTranslationRow[] | undefined,
  locale: LearnerLocale,
): boolean {
  if (locale === "vi") return false;
  for (const item of items) {
    const row = findPhraseRow(rows, item.en);
    if (!row?.[locale]?.trim()) return true;
  }
  return false;
}

/** Vietnamese gloss missing for a collocation/chunk (no stored row.vi and no curated item.vi). */
export function phraseListNeedsVi(
  items: { en: string; vi?: string }[],
  rows: PhraseTranslationRow[] | undefined,
): boolean {
  for (const item of items) {
    const row = findPhraseRow(rows, item.en);
    if (!row?.vi?.trim() && !item.vi?.trim()) return true;
  }
  return false;
}

export function phraseTranslationsNeedVi(
  phrases: PhraseTranslationsJson,
  entry: LearningChunkEntry,
): boolean {
  return (
    phraseListNeedsVi(entry.collocations, phrases.collocations) ||
    phraseListNeedsVi(entry.chunks, phrases.chunks)
  );
}

export function phraseTranslationsNeedLocale(
  phrases: PhraseTranslationsJson,
  entry: LearningChunkEntry,
  locale: LearnerLocale,
): boolean {
  if (locale === "vi") return false;
  if (phraseListNeedsLocale(entry.collocations, phrases.collocations, locale)) {
    return true;
  }
  if (phraseListNeedsLocale(entry.chunks, phrases.chunks, locale)) {
    return true;
  }
  return false;
}

/** @deprecated Use `phraseTranslationsNeedLocale(phrases, entry, "es")`. */
export function phraseTranslationsNeedEs(
  phrases: PhraseTranslationsJson,
  entry: LearningChunkEntry,
): boolean {
  return phraseTranslationsNeedLocale(phrases, entry, "es");
}

export function mergePhraseRowsFromEntry(
  items: { en: string; vi: string }[],
  existing: PhraseTranslationRow[] | undefined,
): PhraseTranslationRow[] {
  return items.map((item, index) => {
    const en = item.en.trim();
    const row =
      findPhraseRow(existing, en) ??
      (existing?.[index]?.en ? existing[index] : undefined) ??
      {};
    return {
      ...row,
      en: row.en?.trim() || en,
      vi: row.vi?.trim() || item.vi.trim() || undefined,
    };
  });
}
