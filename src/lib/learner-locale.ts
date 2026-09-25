/** Gloss language for word cards (Vietnamese only — Spanish removed). */
export type LearnerLocale = "vi";

export const DEFAULT_LEARNER_LOCALE: LearnerLocale = "vi";

/** Shown in Menu → Learning language (single option). */
export const LEARNER_LOCALE_MENU_OPTIONS: readonly LearnerLocale[] = ["vi"] as const;

export function isLearnerLocale(value: unknown): value is LearnerLocale {
  return value === "vi";
}

export function parseLearnerLocale(value: unknown): LearnerLocale {
  if (value === "es") return DEFAULT_LEARNER_LOCALE;
  return isLearnerLocale(value) ? value : DEFAULT_LEARNER_LOCALE;
}
