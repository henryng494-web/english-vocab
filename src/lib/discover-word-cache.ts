import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { hasQualityExamples } from "@/lib/example-quality";
import { hasQualityMeanings } from "@/lib/meaning-quality";
import { parseExamples } from "@/lib/parse-examples";
import {
  containsForeignScript,
  hasCorruptedVietnameseText,
} from "@/lib/sanitize-vi";
import {
  hasEmbeddedRegisterHints,
  isLegacyRegisterCollocation,
  resolveWordRegister,
} from "@/lib/word-meanings";

/** Bump when Gemini/Unsplash pipeline or image quality rules change. */
export const DISCOVER_WORD_CACHE_VERSION = 101;

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
  "discover-word-cache-v40",
  "discover-word-cache-v41",
  "discover-word-cache-v42",
  "discover-word-cache-v43",
  "discover-word-cache-v44",
  "discover-word-cache-v52",
  "discover-word-cache-v53",
  "discover-word-cache-v54",
  "discover-word-cache-v55",
  "discover-word-cache-v56",
  "discover-word-cache-v57",
  "discover-word-cache-v58",
  "discover-word-cache-v59",
  "discover-word-cache-v60",
  "discover-word-cache-v61",
  "discover-word-cache-v62",
  "discover-word-cache-v63",
  "discover-word-cache-v64",
  "discover-word-cache-v65",
  "discover-word-cache-v66",
  "discover-word-cache-v67",
  "discover-word-cache-v68",
  "discover-word-cache-v72",
  "discover-word-cache-v73",
  "discover-word-cache-v74",
  "discover-word-cache-v75",
  "discover-word-cache-v76",
  "discover-word-cache-v77",
  "discover-word-cache-v78",
  "discover-word-cache-v80",
  "discover-word-cache-v81",
  "discover-word-cache-v88",
  "discover-word-cache-v89",
  "discover-word-cache-v90",
  "discover-word-cache-v91",
  "discover-word-cache-v92",
  "discover-word-cache-v93",
  "discover-word-cache-v94",
  "discover-word-cache-v95",
];

const MAX_ENTRIES = 250;

export function isWordDetailComplete(
  data: DiscoverWordData | undefined,
  expectedWord?: string,
): boolean {
  if (!data?.vietnamese_meaning?.trim()) return false;
  if (containsForeignScript(data.vietnamese_meaning)) return false;
  if (hasCorruptedVietnameseText(data.vietnamese_meaning)) return false;
  if (
    !hasQualityMeanings(
      data.word,
      data.vietnamese_meaning,
      data.word_type,
      parseExamples(data.examples),
      data.english_definition,
    )
  ) {
    return false;
  }
  if (
    !hasQualityExamples(
      data.word,
      parseExamples(data.examples),
      data.word_type,
      data.vietnamese_meaning,
    )
  ) {
    return false;
  }
  if (expectedWord && data.word.toLowerCase() !== expectedWord.toLowerCase()) {
    return false;
  }
  if (!resolveWordRegister(data)) return false;
  if (isLegacyRegisterCollocation(data.collocations)) return false;
  if (hasEmbeddedRegisterHints(data.vietnamese_meaning)) return false;
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

export { preloadImageUrlDeduped as preloadImageUrl } from "@/lib/image-preload";

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
