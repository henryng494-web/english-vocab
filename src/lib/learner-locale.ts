/** Gloss language for word cards (meanings / example translations). */
export type LearnerLocale = "vi" | "es";

export const LEARNER_LOCALE_OPTIONS: readonly LearnerLocale[] = ["vi", "es"] as const;

export const DEFAULT_LEARNER_LOCALE: LearnerLocale = "vi";

/** Menu chips under Learning → Learning language. */
export const LEARNER_LOCALE_MENU_OPTIONS: readonly LearnerLocale[] =
  LEARNER_LOCALE_OPTIONS;

export const LEARNER_LOCALE_LABELS: Record<LearnerLocale, string> = {
  vi: "Tiếng Việt",
  es: "Español",
};

export function isLearnerLocale(value: unknown): value is LearnerLocale {
  return value === "vi" || value === "es";
}

export function parseLearnerLocale(value: unknown): LearnerLocale {
  return isLearnerLocale(value) ? value : DEFAULT_LEARNER_LOCALE;
}
