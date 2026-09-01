import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { isCardContentReady } from "@/lib/discover-word-cache";
import { resolveWordRegister } from "@/lib/word-meanings";
import { DISCOVER_WORD_CACHE_VERSION, stubFromListItem } from "@/lib/discover-word-cache";
import { meaningsNeedRegeneration } from "@/lib/meaning-quality";
import { examplesNeedRegeneration } from "@/lib/repair-word-examples";
import { getLocallyTakenWords } from "@/lib/learning-storage";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { getFamilyHeadword } from "@/lib/word-family";

export type DiscoverListPreview = {
  phonetic?: string | null;
  word_type?: string | null;
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
  examples?: string | null;
  search_keyword?: string | null;
};

export type DiscoverListItem = {
  word: string;
  rank: number;
  importance_tier: string;
  from_static?: boolean;
  has_vietnamese?: boolean;
  needs_fetch?: boolean;
  family_members?: string[] | null;
  preview?: DiscoverListPreview | null;
};

export type DiscoverRangeStats = {
  total: number;
  hidden: number;
};

export function filterDiscoverQueue(
  items: DiscoverListItem[],
  takenWords?: string[],
): DiscoverListItem[] {
  const taken = new Set(
    (takenWords ?? getLocallyTakenWords()).map((word) =>
      word.trim().toLowerCase(),
    ),
  );
  return items.filter((item) => {
    if (
      isExcludedVocabWord(item.word) ||
      isExcludedVocabWord(getFamilyHeadword(item.word))
    ) {
      return false;
    }
    const family = item.family_members?.length
      ? item.family_members
      : [item.word];
    return !family.some((member) => taken.has(member.trim().toLowerCase()));
  });
}

export function listItemToDiscoverData(item: DiscoverListItem): DiscoverWordData {
  const base = stubFromListItem(item);
  const preview = item.preview;
  if (!preview?.vietnamese_meaning?.trim()) {
    return base;
  }
  return {
    ...base,
    phonetic: preview.phonetic,
    word_type: preview.word_type ?? null,
    vietnamese_meaning: preview.vietnamese_meaning,
    english_definition: preview.english_definition ?? null,
    examples: preview.examples ?? null,
    search_keyword: preview.search_keyword ?? item.word,
  };
}

export function mapApiWordToDiscoverData(
  item: DiscoverListItem,
  apiWord: Record<string, unknown>,
): DiscoverWordData {
  return {
    word: item.word,
    rank: Number(apiWord.rank ?? item.rank),
    importance_tier: String(apiWord.importance_tier ?? item.importance_tier),
    phonetic: apiWord.phonetic as string | null | undefined,
    word_type: apiWord.word_type as string | null | undefined,
    vietnamese_meaning: apiWord.vietnamese_meaning as string | null | undefined,
    english_definition: apiWord.english_definition as string | null | undefined,
    examples: apiWord.examples as string | null | undefined,
    image_url: (apiWord.image_url as string | null | undefined) ?? null,
    collocations: apiWord.collocations as string | null | undefined,
    register: resolveWordRegister({
      register: apiWord.register as DiscoverWordData["register"],
      collocations: apiWord.collocations as string | null | undefined,
    }),
    search_keyword:
      (apiWord.search_keyword as string | null | undefined) ?? item.word,
    word_family: Array.isArray(apiWord.word_family)
      ? (apiWord.word_family as DiscoverWordData["word_family"])
      : null,
    similar_words: Array.isArray(apiWord.similar_words)
      ? (apiWord.similar_words as string[])
      : null,
  };
}

export async function fetchDiscoverRange(
  rangeId: string,
): Promise<{
  words: DiscoverListItem[];
  stats: DiscoverRangeStats;
}> {
  const params = new URLSearchParams({
    range: rangeId,
    cacheVersion: String(DISCOVER_WORD_CACHE_VERSION),
  });
  const res = await fetch(`/api/discover?${params}`, { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.details ?? data.error ?? "Failed to load word bank");
  }

  const allWords = (data.words ?? []) as DiscoverListItem[];
  const filtered = filterDiscoverQueue(allWords);

  return {
    words: filtered,
    stats: {
      total: data.total_in_range ?? filtered.length,
      hidden:
        (data.hidden_mastered ?? 0) + (allWords.length - filtered.length),
    },
  };
}

const DISCOVER_WORD_FETCH_TIMEOUT_MS = 25000;
const DISCOVER_WORD_MAX_ATTEMPTS = 3;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function fetchDiscoverWordResponse(
  params: URLSearchParams,
): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(
    () => controller.abort(),
    DISCOVER_WORD_FETCH_TIMEOUT_MS,
  );
  try {
    return await fetch(`/api/discover/word?${params}`, {
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    window.clearTimeout(timer);
  }
}

function needsContentRepair(
  word: string,
  loaded: DiscoverWordData,
): boolean {
  return (
    examplesNeedRegeneration(
      word,
      loaded.examples,
      loaded.word_type,
      loaded.vietnamese_meaning,
    ) ||
    meaningsNeedRegeneration(
      word,
      loaded.vietnamese_meaning,
      loaded.word_type,
      loaded.examples,
      loaded.english_definition,
    )
  );
}

export async function fetchDiscoverWordDetail(
  item: DiscoverListItem,
  options?: { forceRepair?: boolean; bootstrap?: boolean },
): Promise<DiscoverWordData> {
  const fetchOnce = async (forceRepair: boolean): Promise<DiscoverWordData> => {
    const params = new URLSearchParams({
      word: item.word,
      rank: String(item.rank),
      skipGemini: item.from_static && !forceRepair ? "true" : "false",
      cacheVersion: String(DISCOVER_WORD_CACHE_VERSION),
    });
    if (forceRepair) {
      params.set("forceRepair", "true");
    }
    const res = await fetchDiscoverWordResponse(params);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.details ?? data.error ?? "Failed to load word");
    }
    return mapApiWordToDiscoverData(item, data.word);
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt < DISCOVER_WORD_MAX_ATTEMPTS; attempt += 1) {
    try {
      const forceRepair = (options?.forceRepair ?? false) || attempt > 0;
      const loaded = await fetchOnce(forceRepair);
      const needsRepair =
        !options?.bootstrap &&
        !forceRepair &&
        needsContentRepair(item.word, loaded);

      if (!needsRepair || options?.forceRepair) {
        return loaded;
      }

      if (isCardContentReady(loaded, item.word)) {
        return loaded;
      }

      return fetchOnce(true);
    } catch (error) {
      lastError =
        error instanceof Error ? error : new Error("Failed to load word");
      if (attempt + 1 >= DISCOVER_WORD_MAX_ATTEMPTS) break;
      await wait(400 * (attempt + 1));
    }
  }

  throw lastError ?? new Error(`Failed to load "${item.word}"`);
}

/** Repair examples/meanings in the background; resolves when enriched or unchanged. */
export async function repairDiscoverWordDetail(
  item: DiscoverListItem,
): Promise<DiscoverWordData> {
  return fetchDiscoverWordDetail(item, { forceRepair: true });
}
