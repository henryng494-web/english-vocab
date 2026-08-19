import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { hasQualityExamples } from "@/lib/example-fallback";
import { parseExamples } from "@/lib/parse-examples";

/** Bump when example quality rules or enrichment output shape changes. */
export const DISCOVER_WORD_CACHE_VERSION = 7;

const STORAGE_KEY = `discover-word-cache-v${DISCOVER_WORD_CACHE_VERSION}`;

const LEGACY_STORAGE_KEYS = [
  "discover-word-cache-v4",
  "discover-word-cache-v5",
  "discover-word-cache-v6",
];

const MAX_ENTRIES = 250;

export function isWordDetailComplete(
  data: DiscoverWordData | undefined,
  expectedWord?: string,
): boolean {
  if (!data?.phonetic?.trim()) return false;
  if (data.phonetic.trim() === `/${data.word}/`) return false;
  if (!data.vietnamese_meaning?.trim()) return false;
  if (!hasQualityExamples(data.word, parseExamples(data.examples))) {
    return false;
  }
  if (expectedWord && data.word.toLowerCase() !== expectedWord.toLowerCase()) {
    return false;
  }
  return true;
}

export function isCacheEntryValid(
  data: DiscoverWordData | undefined,
  expectedWord: string,
): boolean {
  if (!data) return false;
  if (data.word.toLowerCase() !== expectedWord.toLowerCase()) return false;
  return isWordDetailComplete(data, expectedWord);
}

/** Drop legacy sessionStorage keys so stale template examples cannot persist. */
export function purgeLegacyDiscoverWordCaches(): void {
  if (typeof window === "undefined") return;
  for (const key of LEGACY_STORAGE_KEYS) {
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}

export function loadPersistedWordCache(): Map<string, DiscoverWordData> {
  if (typeof window === "undefined") return new Map();
  purgeLegacyDiscoverWordCaches();
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return new Map();
    const parsed = JSON.parse(raw) as Record<string, DiscoverWordData>;
    const map = new Map<string, DiscoverWordData>();
    for (const [key, value] of Object.entries(parsed)) {
      if (isCacheEntryValid(value, key)) {
        map.set(key, value);
      }
    }
    return map;
  } catch {
    return new Map();
  }
}

export function persistWordCache(cache: Map<string, DiscoverWordData>): void {
  if (typeof window === "undefined") return;
  try {
    const complete = Array.from(cache.entries()).filter(([word, value]) =>
      isCacheEntryValid(value, word),
    );
    const entries = complete.slice(-MAX_ENTRIES);
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Object.fromEntries(entries)),
    );
  } catch {
    /* quota or private mode */
  }
}

export function preloadImageUrl(url: string | null | undefined): void {
  if (!url || typeof window === "undefined") return;
  const img = new window.Image();
  img.src = url;
}

/** Empty shell — no leaked fields from previous word. */
export function stubFromListItem(item: {
  word: string;
  rank: number;
  importance_tier: string;
}): DiscoverWordData {
  return {
    word: item.word,
    rank: item.rank,
    importance_tier: item.importance_tier,
    phonetic: null,
    word_type: null,
    vietnamese_meaning: null,
    english_definition: null,
    examples: null,
    image_url: null,
    collocations: null,
    search_keyword: null,
  };
}
