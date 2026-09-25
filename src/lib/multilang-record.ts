import { parseExamples } from "@/lib/parse-examples";
import type { WordDetail } from "@/types/database";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
} from "@/types/word-content";

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
