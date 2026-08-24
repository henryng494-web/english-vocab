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
  type DiscoverListItem,
  type DiscoverRangeStats,
} from "@/lib/discover-fetch";

export const DEFAULT_BOOTSTRAP_RANGE = "1-100";
/** First band — enough for home + journey preload-ahead. */
export const BOOTSTRAP_PRELOAD_DEFAULT = 4;
/** Other bands — first card ready when learner switches rank. */
export const BOOTSTRAP_PRELOAD_OTHER = 2;
export const BOOTSTRAP_WORD_CONCURRENCY = 4;
export const MIN_WELCOME_MS = 1600;

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

/** Warm caches and fetch all discover bands before the main UI mounts. */
export async function runAppBootstrap(
  onProgress: (progress: BootstrapProgress) => void,
): Promise<AppBootstrapSnapshot> {
  report(onProgress, 6, "Welcome! Getting things ready…");

  purgeLegacyDiscoverWordCaches();
  const wordCache = loadPersistedWordCache();

  preloadAsset("/mascot/fox-happy.png");
  preloadAsset("/mascot/fox-wave.png");

  const ranges: Record<string, RangeBootstrapData> = {};
  let rangesDone = 0;

  await Promise.all(
    WORD_RANGES.map(async (range) => {
      try {
        const { words, stats } = await fetchDiscoverRange(range.id);
        ranges[range.id] = { queue: words, stats };
      } catch {
        ranges[range.id] = { queue: [], stats: { total: 0, hidden: 0 } };
      } finally {
        rangesDone += 1;
        report(
          onProgress,
          10 + Math.round((rangesDone / WORD_RANGES.length) * 48),
          `Loading rank ${range.compactLabel}…`,
        );
      }
    }),
  );

  report(onProgress, 62, "Preparing flashcards…");

  const preloadTargets = collectPreloadTargets(ranges);
  let wordsDone = 0;

  await mapWithConcurrency(
    preloadTargets,
    BOOTSTRAP_WORD_CONCURRENCY,
    async (item) => {
      const cached = wordCache.get(item.word);
      if (isWordDetailComplete(cached, item.word)) {
        preloadImageUrl(cached!.image_url);
      } else {
        try {
          const loaded = await fetchDiscoverWordDetail(item);
          if (isCacheEntryValid(loaded, item.word)) {
            wordCache.set(item.word, loaded);
            preloadImageUrl(loaded.image_url);
          }
        } catch {
          /* home/journey can fetch later */
        }
      }
      wordsDone += 1;
      report(
        onProgress,
        62 + Math.round((wordsDone / Math.max(preloadTargets.length, 1)) * 34),
        "Preparing flashcards…",
      );
    },
  );

  persistWordCache(wordCache);

  report(onProgress, 100, "Ready to learn!");

  return {
    defaultRangeId: DEFAULT_BOOTSTRAP_RANGE,
    ranges,
    wordCache: Object.fromEntries(wordCache.entries()),
  };
}

export async function waitForWelcomeMinimum(startedAt: number) {
  const elapsed = Date.now() - startedAt;
  const remaining = MIN_WELCOME_MS - elapsed;
  if (remaining > 0) {
    await new Promise((resolve) => window.setTimeout(resolve, remaining));
  }
}
