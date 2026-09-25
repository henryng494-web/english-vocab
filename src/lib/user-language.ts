import type { LearnerLocale } from "@/lib/learner-locale";

/** Same as `learnerLocale` — language of glosses on cards. */
export type UserLanguage = LearnerLocale;

export function userLanguageFromLearnerLocale(
  locale: LearnerLocale,
): UserLanguage {
  return locale;
}
