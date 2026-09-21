export type LearnerLocale = "vi" | "es";

export const LEARNER_LOCALE_OPTIONS: readonly LearnerLocale[] = ["vi", "es"] as const;

export const DEFAULT_LEARNER_LOCALE: LearnerLocale = "vi";

export const LEARNER_LOCALE_LABELS: Record<LearnerLocale, string> = {
  vi: "Tiếng Việt",
  es: "Español",
};

export function isLearnerLocale(value: unknown): value is LearnerLocale {
  return value === "vi" || value === "es";
}

export function parseLearnerLocale(
  value: string | null | undefined,
): LearnerLocale {
  return isLearnerLocale(value) ? value : DEFAULT_LEARNER_LOCALE;
}

/** Gemini prompt language name for glosses and example translations. */
export function learnerLanguageName(locale: LearnerLocale): string {
  return locale === "es" ? "Spanish" : "Vietnamese";
}

export function discoverWordCacheKey(
  word: string,
  locale: LearnerLocale = DEFAULT_LEARNER_LOCALE,
): string {
  return `${locale}:${word.trim().toLowerCase()}`;
}

/** Parse cache map keys (`vi:hello` or legacy `hello`). */
export function parseDiscoverCacheKey(cacheKey: string): {
  locale: LearnerLocale;
  word: string;
} {
  const trimmed = cacheKey.trim();
  const colon = trimmed.indexOf(":");
  if (colon > 0) {
    const maybeLocale = trimmed.slice(0, colon);
    if (isLearnerLocale(maybeLocale)) {
      return {
        locale: maybeLocale,
        word: trimmed.slice(colon + 1).trim().toLowerCase(),
      };
    }
  }
  return { locale: DEFAULT_LEARNER_LOCALE, word: trimmed.toLowerCase() };
}
