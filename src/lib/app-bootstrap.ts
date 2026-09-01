import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { WORD_RANGES } from "@/data/word-ranges";
import {
  isCacheEntryValid,
  isWordDetailComplete,
  loadPersistedWordCache,
  persistWordCache,
  preloadImageUrl,
  purgeLegacyDiscoverWordCaches,
} from "@/lib/discover-word-cache";
import {
  fetchDiscoverRange,
  fetchDiscoverWordDetail,
  listItemToDiscoverData,
  type DiscoverListItem,
  type DiscoverRangeStats,
} from "@/lib/discover-fetch";
import {
  prefetchWordImages,
  preloadWordImagesFromCache,
  type WordImagePrefetchTarget,
} from "@/lib/image-preload";
import {
  loadReviewSessionFast,
  resolveReviewSessionFast,
  type ReviewSession,
} from "@/lib/review-session";
import { refreshAllStaleWordImages } from "@/lib/refresh-stale-word-images";
import { seedWordImageCacheFromEntries } from "@/lib/word-image-cache";

export const DEFAULT_BOOTSTRAP_RANGE = "1-100";
/** First band — enough for home + journey preload-ahead. */
export const BOOTSTRAP_PRELOAD_DEFAULT = 8;
/** Other bands — first card ready when learner switches rank. */
export const BOOTSTRAP_PRELOAD_OTHER = 5;
export const BOOTSTRAP_WORD_CONCURRENCY = 6;
export const MIN_WELCOME_MS = 1600;
/** Per-word detail fetch during splash — avoid blocking on Gemini repair. */
export const BOOTSTRAP_WORD_TIMEOUT_MS = 8000;
export const BOOTSTRAP_REVIEW_TIMEOUT_MS = 4000;
export const BOOTSTRAP_RANGE_TIMEOUT_MS = 12000;
export const BOOTSTRAP_FAILSAFE_MS = 14000;
/** Defer the multi-MB tail band — it can freeze mobile JSON parsing on splash. */
const DEFERRED_BOOTSTRAP_RANGE = "5001-plus";

export type BootstrapProgress = {
  progress: number;
  message: string;
};

export type RangeBootstrapData = {
  queue: DiscoverListItem[];
  stats: DiscoverRangeStats;
};

export type AppBootstrapSnapshot = {
  defaultRangeId: string;
  ranges: Record<string, RangeBootstrapData>;
  wordCache: Record<string, DiscoverWordData>;
  review: ReviewSession | null;
};

function report(
  onProgress: (progress: BootstrapProgress) => void,
  progress: number,
  message: string,
) {
  onProgress({ progress, message });
}

function preloadAsset(path: string) {
  if (typeof window === "undefined") return;
  const img = new window.Image();
  img.src = path;
}

async function mapWithConcurrency<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>,
) {
  let index = 0;
  async function run() {
    while (index < items.length) {
      const current = index;
      index += 1;
      await worker(items[current]!, current);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => run()),
  );
}

function collectPreloadTargets(
  ranges: Record<string, RangeBootstrapData>,
): DiscoverListItem[] {
  const seen = new Set<string>();
  const targets: DiscoverListItem[] = [];

  for (const range of WORD_RANGES) {
    const queue = ranges[range.id]?.queue ?? [];
    const take =
      range.id === DEFAULT_BOOTSTRAP_RANGE
        ? BOOTSTRAP_PRELOAD_DEFAULT
        : BOOTSTRAP_PRELOAD_OTHER;
    for (const item of queue.slice(0, take)) {
      if (seen.has(item.word)) continue;
      seen.add(item.word);
      targets.push(item);
    }
  }

  return targets;
}

function raceTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), ms);
    }),
  ]);
}

async function fetchWithTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T | null> {
  return raceTimeout(promise, ms);
}

async function loadBootstrapRange(
  rangeId: string,
): Promise<RangeBootstrapData> {
  try {
    const loaded = await fetchWithTimeout(
      fetchDiscoverRange(rangeId),
      BOOTSTRAP_RANGE_TIMEOUT_MS,
    );
    if (loaded) return { queue: loaded.words, stats: loaded.stats };
  } catch {
    /* fall through */
  }
  return { queue: [], stats: { total: 0, hidden: 0 } };
}

async function loadBootstrapWordDetail(
  item: DiscoverListItem,
  wordCache: Map<string, DiscoverWordData>,
): Promise<void> {
  const cached = wordCache.get(item.word);
  if (isWordDetailComplete(cached, item.word)) {
    preloadImageUrl(cached!.image_url);
    return;
  }

  try {
    const loaded = await raceTimeout(
      fetchDiscoverWordDetail(item, { bootstrap: true }),
      BOOTSTRAP_WORD_TIMEOUT_MS,
    );
    if (loaded && isCacheEntryValid(loaded, item.word)) {
      wordCache.set(item.word, loaded);
      preloadImageUrl(loaded.image_url);
      return;
    }
  } catch {
    /* use list preview below */
  }

  const preview = listItemToDiscoverData(item);
  if (preview.vietnamese_meaning?.trim()) {
    wordCache.set(item.word, preview);
    preloadImageUrl(preview.image_url);
  }
}

/** Warm caches and fetch all discover bands before the main UI mounts. */
export async function runAppBootstrap(
  onProgress: (progress: BootstrapProgress) => void,
): Promise<AppBootstrapSnapshot> {
  report(onProgress, 6, "");

  purgeLegacyDiscoverWordCaches();
  const wordCache = loadPersistedWordCache();
  seedWordImageCacheFromEntries(wordCache.entries());

  preloadAsset("/mascot/welcome/welcome-splash.png?v=jungle9");
  preloadAsset("/mascot/welcome/welcome-02-classroom.jpg?v=home2");

  const reviewPromise = fetchWithTimeout(
    loadReviewSessionFast(),
    BOOTSTRAP_REVIEW_TIMEOUT_MS,
  ).catch(() => null);

  const ranges: Record<string, RangeBootstrapData> = {};
  let rangesDone = 0;
  const bootstrapRanges = WORD_RANGES.filter(
    (range) => range.id !== DEFERRED_BOOTSTRAP_RANGE,
  );

  await Promise.all(
    bootstrapRanges.map(async (range) => {
      ranges[range.id] = await loadBootstrapRange(range.id);
      rangesDone += 1;
      report(
        onProgress,
        10 + Math.round((rangesDone / bootstrapRanges.length) * 48),
        "",
      );
    }),
  );

  void loadBootstrapRange(DEFERRED_BOOTSTRAP_RANGE).then((deferred) => {
    ranges[DEFERRED_BOOTSTRAP_RANGE] = deferred;
  });
  ranges[DEFERRED_BOOTSTRAP_RANGE] = { queue: [], stats: { total: 0, hidden: 0 } };

  report(onProgress, 62, "");

  const preloadTargets = collectPreloadTargets(ranges);
  const imageWarmTargets: WordImagePrefetchTarget[] = preloadTargets.map(
    (item) => ({
      word: item.word,
      searchKeyword: item.preview?.search_keyword ?? item.word,
      wordType: item.preview?.word_type ?? null,
      meaning: item.preview?.vietnamese_meaning ?? null,
    }),
  );
  preloadWordImagesFromCache(imageWarmTargets);
  void prefetchWordImages(imageWarmTargets, BOOTSTRAP_WORD_CONCURRENCY).catch(
    () => {},
  );

  let wordsDone = 0;

  await mapWithConcurrency(
    preloadTargets,
    BOOTSTRAP_WORD_CONCURRENCY,
    async (item) => {
      await loadBootstrapWordDetail(item, wordCache);
      wordsDone += 1;
      report(
        onProgress,
        62 + Math.round((wordsDone / Math.max(preloadTargets.length, 1)) * 30),
        "",
      );
    },
  );

  persistWordCache(wordCache);
  seedWordImageCacheFromEntries(wordCache.entries());

  report(onProgress, 94, "");
  const review =
    (await reviewPromise) ?? resolveReviewSessionFast();
  if (review?.pool?.length) {
    void refreshAllStaleWordImages(
      review.pool.map((word) => ({
        word: word.word,
        imageUrl: word.image_url,
        meaning: word.vietnamese_meaning,
        wordType: word.word_type,
        searchKeyword: word.search_keyword,
      })),
      2,
      15,
    );
  }

  report(onProgress, 100, "");

  return {
    defaultRangeId: DEFAULT_BOOTSTRAP_RANGE,
    ranges,
    wordCache: Object.fromEntries(wordCache.entries()),
    review,
  };
}

export async function waitForWelcomeMinimum(startedAt: number) {
  const elapsed = Date.now() - startedAt;
  const remaining = MIN_WELCOME_MS - elapsed;
  if (remaining > 0) {
    await new Promise((resolve) => window.setTimeout(resolve, remaining));
  }
}
