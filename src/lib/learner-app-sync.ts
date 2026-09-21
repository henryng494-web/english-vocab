import type { AppLocale } from "@/lib/i18n/messages";
import type { LearnerLocale } from "@/lib/learner-locale";

/** App UI locale matches learner gloss locale (vi | es). */
export function learnerLocaleToAppLocale(locale: LearnerLocale): AppLocale {
  return locale;
}

export function appLocaleToLearnerLocale(locale: AppLocale): LearnerLocale {
  return locale;
}

export function pairedLanguageSettings(
  locale: LearnerLocale,
): { appLanguage: AppLocale; learnerLocale: LearnerLocale } {
  return {
    appLanguage: learnerLocaleToAppLocale(locale),
    learnerLocale: locale,
  };
}
