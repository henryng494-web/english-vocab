/**
 * User native / explanation language for an English-learning course.
 * (Legacy name in settings: `learnerLocale`.)
 */
import {
  DEFAULT_LEARNER_LOCALE,
  isLearnerLocale,
  type LearnerLocale,
} from "@/lib/learner-locale";
import type { CourseId, LearningLanguageId } from "@/types/word-content";
import { LEARNING_LANGUAGE_ID } from "@/types/word-content";

export type UserLanguage = LearnerLocale;

export const USER_LANGUAGE_OPTIONS = ["vi", "es"] as const satisfies readonly UserLanguage[];

export const DEFAULT_USER_LANGUAGE: UserLanguage = DEFAULT_LEARNER_LOCALE;

export function isUserLanguage(value: unknown): value is UserLanguage {
  return isLearnerLocale(value);
}

export function parseUserLanguage(value: string | null | undefined): UserLanguage {
  return isUserLanguage(value) ? value : DEFAULT_USER_LANGUAGE;
}

export function learningLanguageId(): LearningLanguageId {
  return LEARNING_LANGUAGE_ID;
}

export function courseIdFor(userLanguage: UserLanguage): CourseId {
  return `en-${userLanguage}`;
}

/** @deprecated Use `UserLanguage` — kept for gradual migration. */
export type { LearnerLocale };
