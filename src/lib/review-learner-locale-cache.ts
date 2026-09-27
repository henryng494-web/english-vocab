import { discoverDataNeedsSpanishHydration } from "@/lib/card-localized-display";
import {
  loadPersistedWordCache,
  persistWordCache,
} from "@/lib/discover-word-cache";
import type { LearnerLocale } from "@/lib/learner-locale";
import {
  readReviewSessionSnapshot,
  writeReviewSessionSnapshot,
} from "@/lib/review-session-storage";

export const REVIEW_LEARNER_LOCALE_CHANGED = "review-learner-locale-changed";

/** Drop discover session entries that would show Vietnamese under `es`. */
export function purgeDiscoverCacheForSpanishLocale(): void {
  if (typeof window === "undefined") return;
  const cache = loadPersistedWordCache();
  let changed = false;
  for (const [key, value] of cache.entries()) {
    if (discoverDataNeedsSpanishHydration(value)) {
      cache.delete(key);
      changed = true;
    }
  }
  if (changed) persistWordCache(cache);
}

/**
 * Clear review quiz caches when gloss language changes so clues/options rebuild
 * from Supabase / discover instead of stale VI-only session data.
 */
export function clearReviewCachesForLearnerLocaleChange(
  nextLocale: LearnerLocale,
  previousLocale: LearnerLocale,
): void {
  if (typeof window === "undefined") return;
  if (nextLocale === previousLocale) return;

  if (nextLocale === "es") {
    purgeDiscoverCacheForSpanishLocale();
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
