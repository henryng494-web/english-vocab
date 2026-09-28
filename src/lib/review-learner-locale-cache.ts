import { discoverDataNeedsLocaleHydration } from "@/lib/card-localized-display";
import {
  loadPersistedWordCache,
  persistWordCache,
} from "@/lib/discover-word-cache";
import type { LearnerLocale } from "@/lib/learner-locale";
import { learnerLocaleNeedsHydration } from "@/lib/learner-locale";
import {
  readReviewSessionSnapshot,
  writeReviewSessionSnapshot,
} from "@/lib/review-session-storage";

export const REVIEW_LEARNER_LOCALE_CHANGED = "review-learner-locale-changed";

/** Drop discover session entries missing glosses for the active learner locale. */
export function purgeDiscoverCacheForLearnerLocale(
  locale: LearnerLocale,
): void {
  if (typeof window === "undefined") return;
  if (!learnerLocaleNeedsHydration(locale)) return;
  const cache = loadPersistedWordCache();
  let changed = false;
  for (const [key, value] of cache.entries()) {
    if (discoverDataNeedsLocaleHydration(value, locale)) {
      cache.delete(key);
      changed = true;
    }
  }
  if (changed) persistWordCache(cache);
}

/**
 * Clear review quiz caches when gloss language changes so clues/options rebuild
 * from Supabase / discover instead of stale session data.
 */
export function clearReviewCachesForLearnerLocaleChange(
  nextLocale: LearnerLocale,
  previousLocale: LearnerLocale,
): void {
  if (typeof window === "undefined") return;
  if (nextLocale === previousLocale) return;

  if (learnerLocaleNeedsHydration(nextLocale)) {
    purgeDiscoverCacheForLearnerLocale(nextLocale);
  }

  const snapshot = readReviewSessionSnapshot();
  if (snapshot?.inProgress) {
    writeReviewSessionSnapshot(
      { ...snapshot, inProgress: null },
      { notify: true },
    );
  }

  window.dispatchEvent(
    new CustomEvent(REVIEW_LEARNER_LOCALE_CHANGED, {
      detail: { nextLocale, previousLocale },
    }),
  );
}
