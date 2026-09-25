import type { LearnerLocale } from "@/lib/learner-locale";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
  PhraseTranslationRow,
} from "@/types/word-content";

/**
 * Primary gloss for display — Step 1: `es` when set, else safe fallback to `vi`
 * / legacy `vietnamese_meaning` (no Gemini, no prefetch).
 */
export type LocalePickOptions = {
  /** When true, `es` locale returns null until `meanings.es` exists (no immediate VI fallback). */
  strictEs?: boolean;
};

export function pickLocalizedMeaning(
  meanings: LocalizedMeaningsJson | null | undefined,
  learnerLocale: LearnerLocale,
  legacyVietnameseMeaning?: string | null,
  englishDefinition?: string | null,
  options?: LocalePickOptions,
): string | null {
  const vi =
    meanings?.vi?.trim() ||
    legacyVietnameseMeaning?.trim() ||
    null;
  if (learnerLocale === "es") {
    const es = meanings?.es?.trim();
    if (es) return es;
    if (options?.strictEs) return null;
    if (vi) return vi;
    return englishDefinition?.trim() || null;
  }
  return vi || englishDefinition?.trim() || null;
}

export function pickExampleTranslationForLocale(
  rows: ExampleTranslationsJson | null | undefined,
  index: number,
  learnerLocale: LearnerLocale,
  options?: LocalePickOptions,
): string | null {
  const row = rows?.[index];
  if (!row) return null;
  if (learnerLocale === "es") {
    const es = row.es?.trim();
    if (es) return es;
    if (options?.strictEs) return null;
    return row.vi?.trim() || null;
  }
  return row.vi?.trim() || null;
}

/** Secondary gloss for Goes-with / useful-phrase rows (matched by `en`). */
export function pickPhraseTranslationForLocale(
  row: PhraseTranslationRow | null | undefined,
  learnerLocale: LearnerLocale,
  legacyVietnamese?: string | null,
  options?: LocalePickOptions,
): string | null {
  if (learnerLocale === "es") {
    const es = row?.es?.trim();
    if (es) return es;
    if (options?.strictEs) return null;
    const vi = row?.vi?.trim() || legacyVietnamese?.trim();
    if (vi) return vi;
    return null;
  }
  return row?.vi?.trim() || legacyVietnamese?.trim() || null;
}
