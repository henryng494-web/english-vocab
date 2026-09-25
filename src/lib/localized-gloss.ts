import type { LearnerLocale } from "@/lib/learner-locale";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
} from "@/types/word-content";

/**
 * Primary gloss for display — Step 1: `es` when set, else safe fallback to `vi`
 * / legacy `vietnamese_meaning` (no Gemini, no prefetch).
 */
export function pickLocalizedMeaning(
  meanings: LocalizedMeaningsJson | null | undefined,
  learnerLocale: LearnerLocale,
  legacyVietnameseMeaning?: string | null,
  englishDefinition?: string | null,
): string | null {
  const vi =
    meanings?.vi?.trim() ||
    legacyVietnameseMeaning?.trim() ||
    null;
  if (learnerLocale === "es") {
    const es = meanings?.es?.trim();
    if (es) return es;
    if (vi) return vi;
    return englishDefinition?.trim() || null;
  }
  return vi || englishDefinition?.trim() || null;
}

export function pickExampleTranslationForLocale(
  rows: ExampleTranslationsJson | null | undefined,
  index: number,
  learnerLocale: LearnerLocale,
): string | null {
  const row = rows?.[index];
  if (!row) return null;
  if (learnerLocale === "es") {
    const es = row.es?.trim();
    if (es) return es;
    return row.vi?.trim() || null;
  }
  return row.vi?.trim() || null;
}
