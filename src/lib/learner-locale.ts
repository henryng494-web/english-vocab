/** Gloss language for word cards (meanings / example translations). */
export const LEARNER_LOCALE_OPTIONS = [
  "vi",
  "es",
  "pt",
  "ja",
  "ko",
  "zh",
  "th",
  "id",
  "fr",
  "de",
  "it",
  "tr",
  "ar",
] as const;

export type LearnerLocale = (typeof LEARNER_LOCALE_OPTIONS)[number];

export const DEFAULT_LEARNER_LOCALE: LearnerLocale = "vi";

/** Menu chips under Learning → Learning language. */
export const LEARNER_LOCALE_MENU_OPTIONS: readonly LearnerLocale[] =
  LEARNER_LOCALE_OPTIONS;

/** Native / learner-facing labels for the language selector. */
export const LEARNER_LOCALE_LABELS: Record<LearnerLocale, string> = {
  vi: "Tiếng Việt",
  es: "Español",
  pt: "Português",
  ja: "日本語",
  ko: "한국어",
  zh: "中文",
  th: "ภาษาไทย",
  id: "Bahasa Indonesia",
  fr: "Français",
  de: "Deutsch",
  it: "Italiano",
  tr: "Türkçe",
  ar: "العربية",
};

/** Locales loaded via Gemini on demand (all except Vietnamese source gloss). */
export const ON_DEMAND_LEARNER_LOCALES = LEARNER_LOCALE_OPTIONS.filter(
  (locale): locale is Exclude<LearnerLocale, "vi"> => locale !== "vi",
);

export type OnDemandLearnerLocale = (typeof ON_DEMAND_LEARNER_LOCALES)[number];

export function learnerLocaleNeedsHydration(
  locale: LearnerLocale,
): locale is OnDemandLearnerLocale {
  return locale !== "vi";
}

export function isLearnerLocale(value: unknown): value is LearnerLocale {
  return (
    typeof value === "string" &&
    (LEARNER_LOCALE_OPTIONS as readonly string[]).includes(value)
  );
}

export function parseLearnerLocale(value: unknown): LearnerLocale {
  return isLearnerLocale(value) ? value : DEFAULT_LEARNER_LOCALE;
}
