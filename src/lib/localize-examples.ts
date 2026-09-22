import { isLikelyVietnameseGloss } from "@/lib/example-quality";
import { fillExampleTranslations } from "@/lib/example-fallback";
import type { LearnerLocale } from "@/lib/learner-locale";
import { DEFAULT_LEARNER_LOCALE } from "@/lib/learner-locale";
import type { VocabExample } from "@/lib/parse-examples";
import { translateExampleWithGemini } from "@/lib/gemini-core";
import { fetchMyMemoryTranslation } from "@/lib/translate-vi";

export function examplesNeedLearnerLocaleRefresh(
  examples: VocabExample[],
  locale: LearnerLocale,
): boolean {
  if (locale === DEFAULT_LEARNER_LOCALE) return false;
  return examples.some(
    (item) => item.vi?.trim() && isLikelyVietnameseGloss(item.vi),
  );
}

/** Re-translate example gloss lines until they match the learner locale. */
export async function ensureExamplesForLearnerLocale(
  examples: VocabExample[],
  word: string,
  pos: string | null | undefined,
  meaning: string | null | undefined,
  locale: LearnerLocale,
): Promise<VocabExample[]> {
  if (locale === DEFAULT_LEARNER_LOCALE) return examples;

  let rows = await fillExampleTranslations(
    examples,
    word,
    pos,
    meaning,
    locale,
  );

  if (!examplesNeedLearnerLocaleRefresh(rows, locale)) {
    return rows;
  }

  const retried: VocabExample[] = [];
  for (const item of rows) {
    const en = item.en?.trim() ?? "";
    if (!en) continue;
    let vi = item.vi?.trim() ?? "";
    if (!vi || isLikelyVietnameseGloss(vi)) {
      vi =
        (await translateExampleWithGemini(en, word, pos, meaning, locale)) ||
        (await fetchMyMemoryTranslation(en, locale)) ||
        vi;
    }
    if (locale !== "vi" && isLikelyVietnameseGloss(vi)) continue;
    if (!vi) continue;
    retried.push({ en, vi, senseIndex: item.senseIndex });
  }

  return retried.length ? retried : rows;
}
