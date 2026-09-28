import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import {
  isDiscoverWordReadyForLocale,
} from "@/lib/card-localized-display";
import {
  mergeDiscoverWordCacheEntry,
} from "@/lib/discover-word-cache";
import { ensureCardLocaleContent } from "@/lib/ensure-card-locale-content";
import { readAppSettings } from "@/lib/app-settings";
import type { LearnerLocale } from "@/lib/learner-locale";
import {
  DEFAULT_LEARNER_LOCALE,
  learnerLocaleNeedsHydration,
} from "@/lib/learner-locale";
import type { VocabWord } from "@/types/database";
import { vocabWordToDiscoverData } from "@/lib/vocab-to-discover-data";

function localeCacheKey(locale: LearnerLocale, word: string): string {
  return `${locale}:${word.trim().toLowerCase()}`;
}

const hydratedSession = new Map<string, DiscoverWordData>();
const inflightLocale = new Map<string, Promise<DiscoverWordData | null>>();

export function peekLocaleHydratedCard(
  data: DiscoverWordData,
  locale: LearnerLocale = readAppSettings().learnerLocale,
): DiscoverWordData | null {
  if (!learnerLocaleNeedsHydration(locale)) return null;
  const key = localeCacheKey(locale, data.word);
  const hit = hydratedSession.get(key);
  if (hit && isDiscoverWordReadyForLocale(hit, data.word, locale)) {
    return hit;
  }
  return null;
}

type LocalePrefetchOptions = {
  locale?: LearnerLocale;
  onUpdated?: (updated: DiscoverWordData) => void;
};

/** Background locale hydrate for upcoming cards (Journey / Review). */
export function prefetchCardLocaleContent(
  data: DiscoverWordData,
  options?: LocalePrefetchOptions,
): void {
  const locale = options?.locale ?? readAppSettings().learnerLocale;
  if (!learnerLocaleNeedsHydration(locale)) return;
  if (isDiscoverWordReadyForLocale(data, data.word, locale)) {
    rememberLocaleHydrated(data, locale);
    return;
  }

  const dedupeKey = localeCacheKey(locale, data.word);
  if (inflightLocale.has(dedupeKey)) {
    void inflightLocale.get(dedupeKey)?.then((updated) => {
      if (updated) options?.onUpdated?.(updated);
    });
    return;
  }

  const task = ensureCardLocaleContent(data, locale)
    .then((updated) => {
      if (!updated) return null;
      rememberLocaleHydrated(updated, locale);
      options?.onUpdated?.(updated);
      return updated;
    })
    .finally(() => {
      inflightLocale.delete(dedupeKey);
    });

  inflightLocale.set(dedupeKey, task);
}

function rememberLocaleHydrated(
  data: DiscoverWordData,
  locale: LearnerLocale,
): void {
  hydratedSession.set(localeCacheKey(locale, data.word), data);
  mergeDiscoverWordCacheEntry(data.word, {
    meanings: data.meanings,
    example_translations: data.example_translations,
    phrase_translations: data.phrase_translations,
    vietnamese_meaning: data.vietnamese_meaning,
    examples: data.examples,
  });
}

/** Warm learner gloss for the next `count` queue slots after `startIndex`. */
export function prefetchReviewLocaleAhead(
  queue: VocabWord[],
  startIndex: number,
  count = 3,
  onUpdated?: (wordKey: string, patch: Partial<VocabWord>) => void,
): void {
  const locale = readAppSettings().learnerLocale;
  if (!learnerLocaleNeedsHydration(locale)) return;

  for (let offset = 1; offset <= count; offset += 1) {
    const item = queue[startIndex + offset];
    if (!item) break;
    const card = vocabWordToDiscoverData(item);
    prefetchCardLocaleContent(card, {
      locale,
      onUpdated: (updated) => {
        const key = item.word.trim().toLowerCase();
        onUpdated?.(key, {
          meanings: updated.meanings,
          example_translations: updated.example_translations,
          phrase_translations: updated.phrase_translations,
          vietnamese_meaning:
            updated.vietnamese_meaning ?? item.vietnamese_meaning,
          examples: updated.examples ?? item.examples,
        });
      },
    });
  }
}

export function clearLocalePrefetchSession(): void {
  hydratedSession.clear();
  inflightLocale.clear();
}

/** @internal tests */
export const __localePrefetchTestHooks = {
  hydratedSession,
  inflightLocale,
  defaultLocale: DEFAULT_LEARNER_LOCALE,
};
