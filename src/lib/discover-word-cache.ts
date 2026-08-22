import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { hasQualityExamples } from "@/lib/example-quality";
import { parseExamples } from "@/lib/parse-examples";
import { containsForeignScript } from "@/lib/sanitize-vi";
import { shouldRefreshImageUrl } from "@/lib/unsplash";

/** Bump when ranking, image quality, or enrichment output shape changes. */
export const DISCOVER_WORD_CACHE_VERSION = 40;

const STORAGE_KEY = `discover-word-cache-v${DISCOVER_WORD_CACHE_VERSION}`;

const LEGACY_STORAGE_KEYS = [
  "discover-word-cache-v4",
  "discover-word-cache-v5",
  "discover-word-cache-v6",
  "discover-word-cache-v7",
  "discover-word-cache-v8",
  "discover-word-cache-v9",
  "discover-word-cache-v10",
  "discover-word-cache-v11",
  "discover-word-cache-v12",
  "discover-word-cache-v13",
  "discover-word-cache-v14",
  "discover-word-cache-v15",
  "discover-word-cache-v16",
  "discover-word-cache-v17",
  "discover-word-cache-v18",
  "discover-word-cache-v19",
  "discover-word-cache-v20",
  "discover-word-cache-v21",
  "discover-word-cache-v22",
  "discover-word-cache-v23",
  "discover-word-cache-v24",
  "discover-word-cache-v25",
  "discover-word-cache-v26",
  "discover-word-cache-v27",
  "discover-word-cache-v28",
  "discover-word-cache-v29",
  "discover-word-cache-v30",
  "discover-word-cache-v31",
  "discover-word-cache-v32",
  "discover-word-cache-v33",
  "discover-word-cache-v34",
  "discover-word-cache-v35",
  "discover-word-cache-v36",
  "discover-word-cache-v37",
  "discover-word-cache-v38",
  "discover-word-cache-v39",
];

const MAX_ENTRIES = 250;

export function isWordDetailComplete(
  data: DiscoverWordData | undefined,
  expectedWord?: string,
): boolean {
  if (!data?.vietnamese_meaning?.trim()) return false;
  if (containsForeignScript(data.vietnamese_meaning)) return false;
  if (!data.image_url?.trim()) return false;
  if (shouldRefreshImageUrl(data.image_url, data.word)) return false;
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
    word_family: null,
  };
}
