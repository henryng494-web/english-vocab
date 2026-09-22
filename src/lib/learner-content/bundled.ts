import type { LearnerLocale } from "@/lib/learner-locale";
import { DEFAULT_LEARNER_LOCALE } from "@/lib/learner-locale";
import { getBundledEsContent, hasBundledEsGloss } from "@/lib/learner-content/bundled-es";
import { getBundledViContent, hasBundledViGloss } from "@/lib/learner-content/bundled-vi";
import type { LearnerContentSlice } from "@/lib/learner-content/types";

export function getBundledLearnerContent(
  word: string,
  locale: LearnerLocale,
): LearnerContentSlice | null {
  return locale === DEFAULT_LEARNER_LOCALE
    ? getBundledViContent(word)
    : getBundledEsContent(word);
}

export function hasBundledLearnerGloss(
  word: string,
  locale: LearnerLocale,
): boolean {
  return locale === DEFAULT_LEARNER_LOCALE
    ? hasBundledViGloss(word)
    : hasBundledEsGloss(word);
}
