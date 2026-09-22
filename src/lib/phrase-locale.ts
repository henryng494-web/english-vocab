import { isLikelyVietnameseGloss } from "@/lib/example-quality";
import {
  DEFAULT_LEARNER_LOCALE,
  type LearnerLocale,
} from "@/lib/learner-locale";
import type { UserLanguage } from "@/lib/user-language";
import type { LearningChunkPhrase } from "@/data/demo-learning-chunks";

/** Legacy `vi` field holds the active learner gloss (vi or es). */
export function phraseTranslationForLocale(
  phrase: Pick<LearningChunkPhrase, "vi">,
  locale: LearnerLocale,
): string | null {
  const text = phrase.vi?.trim() ?? "";
  if (!text) return null;
  if (locale === DEFAULT_LEARNER_LOCALE) {
    return isLikelyVietnameseGloss(text) ? text : null;
  }
  return isLikelyVietnameseGloss(text) ? null : text;
}

export function phraseNeedsLocaleTranslation(
  phrase: Pick<LearningChunkPhrase, "en" | "vi">,
  locale: LearnerLocale = DEFAULT_LEARNER_LOCALE,
): boolean {
  if (!phrase.en?.trim()) return false;
  if (locale === DEFAULT_LEARNER_LOCALE) {
    return !phrase.vi?.trim();
  }
  const tr = phrase.vi?.trim() ?? "";
  if (!tr) return true;
  return isLikelyVietnameseGloss(tr);
}

export function stripWrongLocalePhraseTranslations<
  T extends LearningChunkPhrase,
>(items: T[], locale: LearnerLocale): T[] {
  if (locale === DEFAULT_LEARNER_LOCALE) return items;
  return items.map((item) => ({
    ...item,
    vi: phraseTranslationForLocale(item, locale) ?? "",
  }));
}

export function learnerLocaleToUserLanguage(
  locale: LearnerLocale,
): UserLanguage {
  return locale;
}
