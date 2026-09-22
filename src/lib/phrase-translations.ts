import type { LearningChunkPhrase } from "@/data/demo-learning-chunks";
import { isLikelyVietnameseGloss } from "@/lib/example-quality";
import type { LearnerLocale } from "@/lib/learner-locale";
import { DEFAULT_LEARNER_LOCALE } from "@/lib/learner-locale";
import { phraseNeedsLocaleTranslation } from "@/lib/phrase-locale";
import type { UserLanguage } from "@/lib/user-language";
import type {
  PhraseTranslationRow,
  PhraseTranslationsJson,
} from "@/types/word-content";

export function parsePhraseTranslationsJson(
  raw: unknown,
): PhraseTranslationsJson {
  if (!raw || typeof raw !== "object") return {};
  const obj = raw as PhraseTranslationsJson;
  const normalize = (rows: unknown): PhraseTranslationRow[] => {
    if (!Array.isArray(rows)) return [];
    return rows
      .map((row) => {
        if (!row || typeof row !== "object") return null;
        const en = String((row as PhraseTranslationRow).en ?? "").trim();
        if (!en) return null;
        const out: PhraseTranslationRow = { en };
        for (const lang of ["vi", "es"] as const) {
          const value = (row as PhraseTranslationRow)[lang]?.trim();
          if (value) out[lang] = value;
        }
        return out;
      })
      .filter((row): row is PhraseTranslationRow => Boolean(row));
  };
  return {
    collocations: normalize(obj.collocations),
    chunks: normalize(obj.chunks),
  };
}

function rowForPhrase(
  stored: PhraseTranslationsJson,
  kind: "collocations" | "chunks",
  en: string,
): PhraseTranslationRow | undefined {
  const key = en.trim().toLowerCase();
  return stored[kind]?.find((row) => row.en.trim().toLowerCase() === key);
}

export function storedPhraseGloss(
  stored: PhraseTranslationsJson | null | undefined,
  kind: "collocations" | "chunks",
  phrase: Pick<LearningChunkPhrase, "en">,
  locale: LearnerLocale,
): string | null {
  if (locale === DEFAULT_LEARNER_LOCALE) return null;
  const row = rowForPhrase(stored ?? {}, kind, phrase.en);
  const tr = row?.[locale as UserLanguage]?.trim();
  if (!tr || isLikelyVietnameseGloss(tr)) return null;
  return tr;
}

export function applyStoredPhraseTranslations(
  entry: { collocations: LearningChunkPhrase[]; chunks: LearningChunkPhrase[] },
  stored: PhraseTranslationsJson | null | undefined,
  locale: LearnerLocale,
): { collocations: LearningChunkPhrase[]; chunks: LearningChunkPhrase[] } {
  if (locale === DEFAULT_LEARNER_LOCALE || !stored) {
    return entry;
  }
  const apply = (
    items: LearningChunkPhrase[],
    kind: "collocations" | "chunks",
  ): LearningChunkPhrase[] =>
    items.map((item) => {
      const es = storedPhraseGloss(stored, kind, item, locale);
      return es ? { ...item, vi: es } : item;
    });

  return {
    collocations: apply(entry.collocations, "collocations"),
    chunks: apply(entry.chunks, "chunks"),
  };
}

export function phraseTranslationsNeedLocale(
  entry: { collocations: LearningChunkPhrase[]; chunks: LearningChunkPhrase[] },
  stored: PhraseTranslationsJson | null | undefined,
  locale: LearnerLocale,
): boolean {
  if (locale === DEFAULT_LEARNER_LOCALE) return false;
  const needs = (
    items: LearningChunkPhrase[],
    kind: "collocations" | "chunks",
  ) =>
    items.some((phrase) => {
      if (!phraseNeedsLocaleTranslation(phrase, locale)) return false;
      return !storedPhraseGloss(stored, kind, phrase, locale);
    });
  return (
    needs(entry.collocations, "collocations") ||
    needs(entry.chunks, "chunks")
  );
}

export function mergePhraseTranslationRows(
  base: PhraseTranslationsJson,
  kind: "collocations" | "chunks",
  phrases: LearningChunkPhrase[],
  locale: LearnerLocale,
): PhraseTranslationsJson {
  const next: PhraseTranslationsJson = {
    collocations: [...(base.collocations ?? [])],
    chunks: [...(base.chunks ?? [])],
  };
  const list = next[kind] ?? [];
  const byEn = new Map(
    list.map((row) => [row.en.trim().toLowerCase(), { ...row }]),
  );
  for (const phrase of phrases) {
    const key = phrase.en.trim().toLowerCase();
    if (!key) continue;
    const gloss = phrase.vi?.trim();
    if (!gloss || isLikelyVietnameseGloss(gloss)) continue;
    const row = byEn.get(key) ?? { en: phrase.en.trim() };
    row[locale as UserLanguage] = gloss;
    byEn.set(key, row);
  }
  next[kind] = [...byEn.values()];
  return next;
}
