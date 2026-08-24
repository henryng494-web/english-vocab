import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
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
export const BOOTSTRAP_PRELOAD_WORDS = 4;
export const MIN_WELCOME_MS = 1400;

export type BootstrapProgress = {
  progress: number;
  message: string;
};

export type AppBootstrapSnapshot = {
  rangeId: string;
  queue: DiscoverListItem[];
  stats: DiscoverRangeStats;
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

/** Warm caches and fetch discover data before the main UI mounts. */
export async function runAppBootstrap(
  onProgress: (progress: BootstrapProgress) => void,
): Promise<AppBootstrapSnapshot> {
  report(onProgress, 8, "Welcome! Getting things ready…");

  purgeLegacyDiscoverWordCaches();
  const wordCache = loadPersistedWordCache();

  preloadAsset("/mascot/fox-happy.png");
  preloadAsset("/mascot/fox-wave.png");

  report(onProgress, 22, "Loading your word bank…");

  const { words: queue, stats } = await fetchDiscoverRange(
    DEFAULT_BOOTSTRAP_RANGE,
  );

  report(onProgress, 55, "Preparing flashcards…");

  const preloadItems = queue.slice(0, BOOTSTRAP_PRELOAD_WORDS);
  let completed = 0;

  await Promise.all(
    preloadItems.map(async (item) => {
      const cached = wordCache.get(item.word);
      if (isWordDetailComplete(cached, item.word)) {
        preloadImageUrl(cached!.image_url);
        completed += 1;
        report(
          onProgress,
          55 + Math.round((completed / Math.max(preloadItems.length, 1)) * 35),
          "Preparing flashcards…",
        );
        return;
      }

      try {
        const loaded = await fetchDiscoverWordDetail(item);
        if (isCacheEntryValid(loaded, item.word)) {
          wordCache.set(item.word, loaded);
          preloadImageUrl(loaded.image_url);
        }
      } catch {
        /* best-effort — home can fetch later */
      } finally {
        completed += 1;
        report(
          onProgress,
          55 + Math.round((completed / Math.max(preloadItems.length, 1)) * 35),
          "Preparing flashcards…",
        );
      }
    }),
  );

  persistWordCache(wordCache);

  report(onProgress, 100, "Ready to learn!");

  const snapshot: AppBootstrapSnapshot = {
    rangeId: DEFAULT_BOOTSTRAP_RANGE,
    queue,
    stats,
    wordCache: Object.fromEntries(wordCache.entries()),
  };

  return snapshot;
}

export async function waitForWelcomeMinimum(startedAt: number) {
  const elapsed = Date.now() - startedAt;
  const remaining = MIN_WELCOME_MS - elapsed;
  if (remaining > 0) {
    await new Promise((resolve) => window.setTimeout(resolve, remaining));
  }
}
