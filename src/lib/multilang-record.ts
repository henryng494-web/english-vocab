import { parseExamples } from "@/lib/parse-examples";
import type { WordDetail } from "@/types/database";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
  PhraseTranslationRow,
  PhraseTranslationsJson,
} from "@/types/word-content";
import type { LearningChunkEntry } from "@/data/demo-learning-chunks";

export function parseMeaningsJson(raw: unknown): LocalizedMeaningsJson {
  if (!raw || typeof raw !== "object") return {};
  const out: LocalizedMeaningsJson = {};
  for (const lang of ["vi", "es"] as const) {
    const value = (raw as Record<string, unknown>)[lang];
    if (typeof value === "string" && value.trim()) out[lang] = value.trim();
  }
  return out;
}

export function parseExampleTranslationsJson(
  raw: unknown,
): ExampleTranslationsJson {
  if (!Array.isArray(raw)) return [];
  return raw.map((row) => {
    if (!row || typeof row !== "object") return {};
    const out: Partial<Record<"vi" | "es", string>> = {};
    for (const lang of ["vi", "es"] as const) {
      const value = (row as Record<string, unknown>)[lang];
      if (typeof value === "string" && value.trim()) out[lang] = value.trim();
    }
    return out;
  });
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

export function hasStoredEsMeaning(
  meanings: LocalizedMeaningsJson | null | undefined,
): boolean {
  return Boolean(meanings?.es?.trim());
}

export function exampleTranslationsNeedEs(
  rows: ExampleTranslationsJson,
  exampleCount: number,
): boolean {
  for (let i = 0; i < exampleCount; i += 1) {
    if (!rows[i]?.es?.trim()) return true;
  }
  return false;
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
      for (const lang of ["vi", "es"] as const) {
        const gloss = (row as Record<string, unknown>)[lang];
        if (typeof gloss === "string" && gloss.trim()) out[lang] = gloss.trim();
      }
      return out;
    });
  };
  return {
    collocations: parseRows(source.collocations),
    chunks: parseRows(source.chunks),
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

export function phraseListNeedsEs(
  items: { en: string }[],
  rows: PhraseTranslationRow[] | undefined,
): boolean {
  for (const item of items) {
    const row = findPhraseRow(rows, item.en);
    if (!row?.es?.trim()) return true;
  }
  return false;
}

export function phraseTranslationsNeedEs(
  phrases: PhraseTranslationsJson,
  entry: LearningChunkEntry,
): boolean {
  if (phraseListNeedsEs(entry.collocations, phrases.collocations)) return true;
  if (phraseListNeedsEs(entry.chunks, phrases.chunks)) return true;
  return false;
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
