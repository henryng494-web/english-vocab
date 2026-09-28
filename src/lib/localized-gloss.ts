import {
  DEFAULT_LEARNER_LOCALE,
  type LearnerLocale,
  learnerLocaleNeedsHydration,
} from "@/lib/learner-locale";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
  PhraseTranslationRow,
} from "@/types/word-content";

export type LocalePickOptions = {
  /**
   * When true, non-VI locales return null until `meanings[locale]` exists
   * (no immediate VI fallback while on-demand hydrate is in flight).
   */
  strictLearnerLocale?: boolean;
  /** @deprecated Use `strictLearnerLocale`. */
  strictEs?: boolean;
};

function strictMode(options?: LocalePickOptions): boolean {
  return Boolean(options?.strictLearnerLocale ?? options?.strictEs);
}

function fallbackGloss(
  meanings: LocalizedMeaningsJson | null | undefined,
  legacyVietnameseMeaning?: string | null,
  englishDefinition?: string | null,
): string | null {
  const vi =
    meanings?.vi?.trim() || legacyVietnameseMeaning?.trim() || null;
  if (vi) return vi;
  return englishDefinition?.trim() || null;
}

/** When Gemini leaves `meanings[locale]` empty — never show a blank card header. */
export function fallbackLearnerMeaningGloss(
  meanings: LocalizedMeaningsJson | null | undefined,
  legacyVietnameseMeaning?: string | null,
  englishDefinition?: string | null,
): string {
  const en = englishDefinition?.trim();
  if (en) return en;
  return (
    fallbackGloss(meanings, legacyVietnameseMeaning, englishDefinition) ?? ""
  );
}

export function pickLocalizedMeaning(
  meanings: LocalizedMeaningsJson | null | undefined,
  learnerLocale: LearnerLocale,
  legacyVietnameseMeaning?: string | null,
  englishDefinition?: string | null,
  options?: LocalePickOptions,
): string | null {
  if (learnerLocale === DEFAULT_LEARNER_LOCALE) {
    return fallbackGloss(meanings, legacyVietnameseMeaning, englishDefinition);
  }

  const localized = meanings?.[learnerLocale]?.trim();
  if (localized) return localized;
  if (strictMode(options)) return null;
  const enDef = englishDefinition?.trim();
  if (enDef) return enDef;
  return fallbackGloss(meanings, legacyVietnameseMeaning, englishDefinition);
}

export function pickExampleTranslationForLocale(
  rows: ExampleTranslationsJson | null | undefined,
  index: number,
  learnerLocale: LearnerLocale,
  options?: LocalePickOptions,
): string | null {
  const row = rows?.[index];
  if (!row) return null;
  if (learnerLocale === DEFAULT_LEARNER_LOCALE) {
    return row.vi?.trim() || null;
  }
  const localized = row[learnerLocale]?.trim();
  if (localized) return localized;
  if (strictMode(options)) return null;
  return row.vi?.trim() || null;
}

/** Secondary gloss for Goes-with / useful-phrase rows (matched by `en`). */
export function pickPhraseTranslationForLocale(
  row: PhraseTranslationRow | null | undefined,
  learnerLocale: LearnerLocale,
  legacyVietnamese?: string | null,
  options?: LocalePickOptions,
): string | null {
  if (learnerLocale === DEFAULT_LEARNER_LOCALE) {
    return row?.vi?.trim() || legacyVietnamese?.trim() || null;
  }
  const localized = row?.[learnerLocale]?.trim();
  if (localized) return localized;
  if (strictMode(options)) return null;
  const vi = row?.vi?.trim() || legacyVietnamese?.trim();
  if (vi) return vi;
  return null;
}

export function isNonDefaultLearnerLocale(
  locale: LearnerLocale,
): locale is Exclude<LearnerLocale, "vi"> {
  return learnerLocaleNeedsHydration(locale);
}
