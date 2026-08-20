"use client";

import {
  DiscoverCard,
  type DiscoverWordData,
} from "@/components/discover/DiscoverCard";
import { MobileTopBar } from "@/components/layout/MobileTopBar";
import { WORD_RANGES } from "@/data/word-ranges";
import {
  DISCOVER_WORD_CACHE_VERSION,
  isCacheEntryValid,
  isWordDetailComplete,
  loadPersistedWordCache,
  persistWordCache,
  preloadImageUrl,
  purgeLegacyDiscoverWordCaches,
  stubFromListItem,
} from "@/lib/discover-word-cache";
import {
  getLocallyMasteredWords,
  writeLocalLearning,
} from "@/lib/learning-storage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type DiscoverListPreview = {
  phonetic?: string | null;
  word_type?: string | null;
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
  examples?: string | null;
  search_keyword?: string | null;
};

type DiscoverListItem = {
  word: string;
  rank: number;
  importance_tier: string;
  from_static?: boolean;
  has_vietnamese?: boolean;
  needs_fetch?: boolean;
  preview?: DiscoverListPreview | null;
};

const PRELOAD_AHEAD = 5;

function listItemToDiscoverData(item: DiscoverListItem): DiscoverWordData {
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

function mapApiWord(
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
    search_keyword: (apiWord.search_keyword as string | null | undefined) ?? item.word,
  };
}

export default function DiscoverPage() {
  const [rangeId, setRangeId] = useState("1-100");
  const [queue, setQueue] = useState<DiscoverListItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<DiscoverWordData | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingWord, setLoadingWord] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, hidden: 0 });

  const wordCache = useRef<Map<string, DiscoverWordData>>(
    loadPersistedWordCache(),
  );
  const inflight = useRef<Map<string, Promise<DiscoverWordData>>>(new Map());
  const activeWordRef = useRef<string | null>(null);

  const currentItem = queue[currentIndex];

  const filterLocalMastered = useCallback((items: DiscoverListItem[]) => {
    const localMastered = new Set(getLocallyMasteredWords());
    return items.filter((w) => !localMastered.has(w.word));
  }, []);

  const fetchWordFromApi = useCallback(
    async (item: DiscoverListItem): Promise<DiscoverWordData> => {
      const params = new URLSearchParams({
        word: item.word,
        rank: String(item.rank),
        skipGemini: item.from_static ? "true" : "false",
        cacheVersion: String(DISCOVER_WORD_CACHE_VERSION),
      });
      const res = await fetch(`/api/discover/word?${params}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to load word");
      }
      const loaded = mapApiWord(item, data.word);
      if (!isCacheEntryValid(loaded, item.word)) {
        throw new Error(
          `Data for "${item.word}" is incomplete — try again later.`,
        );
      }
      return loaded;
    },
    [],
  );

  const ensureWordFetched = useCallback(
    async (item: DiscoverListItem): Promise<DiscoverWordData> => {
      const cached = wordCache.current.get(item.word);
      if (isWordDetailComplete(cached, item.word)) {
        return cached!;
      }
      wordCache.current.delete(item.word);

      const pending = inflight.current.get(item.word);
      if (pending) return pending;

      const promise = fetchWordFromApi(item)
        .then((loaded) => {
          if (!isCacheEntryValid(loaded, item.word)) {
            throw new Error(`Data mismatch for "${item.word}"`);
          }
          wordCache.current.set(item.word, loaded);
          persistWordCache(wordCache.current);
          preloadImageUrl(loaded.image_url);
          inflight.current.delete(item.word);
          return loaded;
        })
        .catch((err) => {
          inflight.current.delete(item.word);
          throw err;
        });

      inflight.current.set(item.word, promise);
      return promise;
    },
    [fetchWordFromApi],
  );

  const preloadWords = useCallback(
    (startIndex: number, items: DiscoverListItem[]) => {
      for (let offset = 1; offset <= PRELOAD_AHEAD; offset++) {
        const item = items[startIndex + offset];
        if (!item) break;
        const cached = wordCache.current.get(item.word);
        if (isWordDetailComplete(cached, item.word)) {
          preloadImageUrl(cached!.image_url);
          continue;
        }
        ensureWordFetched(item).catch(() => {});
      }
    },
    [ensureWordFetched],
  );

  const applyWordToView = useCallback(
    (item: DiscoverListItem, options?: { fetchIfNeeded?: boolean }) => {
      activeWordRef.current = item.word;

      const cleanStub = listItemToDiscoverData(item);
      setCurrentWord(cleanStub);
      const hasTextPreview = Boolean(cleanStub.vietnamese_meaning?.trim());
      setLoadingWord(!hasTextPreview);

      const cached = wordCache.current.get(item.word);
      if (cached && !isCacheEntryValid(cached, item.word)) {
        wordCache.current.delete(item.word);
      }

      if (isWordDetailComplete(cached, item.word)) {
        setCurrentWord(cached!);
        setLoadingWord(false);
        preloadImageUrl(cached!.image_url);
        return;
      }

      if (options?.fetchIfNeeded) {
        ensureWordFetched(item)
          .then((loaded) => {
            if (activeWordRef.current !== item.word) return;
            setCurrentWord(loaded);
            setLoadingWord(false);
          })
          .catch((err) => {
            if (activeWordRef.current !== item.word) return;
            setError(err instanceof Error ? err.message : "Failed to load word details");
            setLoadingWord(false);
          });
      }
    },
    [ensureWordFetched],
  );

  const fetchRange = useCallback(async () => {
    setLoadingList(true);
    setError(null);
    inflight.current.clear();
    try {
      const params = new URLSearchParams({
        range: rangeId,
        cacheVersion: String(DISCOVER_WORD_CACHE_VERSION),
      });
      const res = await fetch(`/api/discover?${params}`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to load word bank");
      }

      const filtered = filterLocalMastered(data.words ?? []);
      setQueue(filtered);
      setCurrentIndex(0);
      setStats({
        total: data.total_in_range ?? filtered.length,
        hidden:
          (data.hidden_mastered ?? 0) +
          ((data.words?.length ?? 0) - filtered.length),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setQueue([]);
      setCurrentWord(null);
    } finally {
      setLoadingList(false);
    }
  }, [rangeId, filterLocalMastered]);

  useEffect(() => {
    purgeLegacyDiscoverWordCaches();
    wordCache.current = loadPersistedWordCache();
  }, []);

  useEffect(() => {
    fetchRange();
  }, [fetchRange]);

  useEffect(() => {
    if (!currentItem) {
      activeWordRef.current = null;
      setCurrentWord(null);
      setLoadingWord(false);
      return;
    }

    applyWordToView(currentItem, { fetchIfNeeded: true });
    preloadWords(currentIndex, queue);
  }, [currentItem, currentIndex, queue, applyWordToView, preloadWords]);

  const goToIndex = useCallback(
    (index: number) => {
      if (index < 0 || index >= queue.length) return;
      setCurrentIndex(index);
    },
    [queue.length],
  );

  function advanceAfterAction(removedWord: string) {
    const nextQueue = queue.filter((w) => w.word !== removedWord);
    const nextIndex =
      nextQueue.length === 0
        ? 0
        : Math.min(currentIndex, nextQueue.length - 1);

    setQueue(nextQueue);

    if (nextQueue.length === 0) {
      setCurrentIndex(0);
      activeWordRef.current = null;
      setCurrentWord(null);
      setLoadingWord(false);
    } else {
      setCurrentIndex(nextIndex);
    }
  }

  function updateStatus(status: "mastered" | "new") {
    if (!currentItem) return;

    const word = currentItem.word;
    setError(null);
    advanceAfterAction(word);

    void (async () => {
      try {
        if (status === "new") {
          const addRes = await fetch("/api/words/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word }),
          });
          if (!addRes.ok) {
            const addData = await addRes.json();
            throw new Error(
              addData.details ?? addData.error ?? "Failed to add word",
            );
          }
        }

        const statusRes = await fetch("/api/words/status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word,
            status: status === "mastered" ? "mastered" : "new",
          }),
        });

        if (!statusRes.ok) {
          writeLocalLearning(
            word,
            status === "mastered" ? "mastered" : "new",
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Update failed");
      }
    })();
  }

  const rangeLabel = useMemo(
    () => WORD_RANGES.find((r) => r.id === rangeId)?.label ?? rangeId,
    [rangeId],
  );

  return (
    <div className="app-screen">
      <MobileTopBar
        title="Vocab Journey"
        subtitle={`${rangeLabel} · ${queue.length} words left`}
        trailing={
          <select
            id="range"
            value={rangeId}
            onChange={(e) => setRangeId(e.target.value)}
            aria-label="Select word range"
            className="mobile-top-bar__control"
          >
            {WORD_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
        }
      />

      <div className="page-scroll px-4">
        {stats.hidden > 0 && (
          <p className="text-xs text-foreground/55">
            {stats.hidden} words marked &ldquo;Already know&rdquo;
          </p>
        )}

        {error && (
          <p className="mt-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
            {error}
          </p>
        )}

        {loadingList ? (
          <div className="mt-16 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
          </div>
        ) : queue.length === 0 ? (
          <div className="mt-16 px-2 text-center">
            <p className="text-foreground/80">
              You&apos;ve finished this range or marked every word as
              &ldquo;Already know&rdquo;.
            </p>
            <p className="mt-2 text-sm text-foreground/60">
              Choose another range or switch to the Review tab.
            </p>
          </div>
        ) : (
          <>
            <div className="mt-2">
              <p className="mb-3 text-center text-xs font-medium text-foreground/55">
                Word {currentIndex + 1} / {queue.length}
              </p>

              <DiscoverCard
                key={currentItem.word}
                data={currentWord ?? stubFromListItem(currentItem)}
                loading={loadingWord}
              />
            </div>

            <div className="card-actions">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => updateStatus("new")}
                  className="rounded-xl bg-primary py-4 text-base font-semibold text-white shadow-sm transition active:bg-primary-hover"
                >
                  Learn this
                </button>
                <button
                  type="button"
                  onClick={() => updateStatus("mastered")}
                  className="rounded-xl border-2 border-secondary bg-surface py-4 text-base font-semibold text-secondary transition active:bg-primary-50"
                >
                  Already know
                </button>
              </div>

              <div className="mt-2.5 flex justify-center gap-2">
                <button
                  type="button"
                  disabled={currentIndex === 0}
                  onClick={() => goToIndex(currentIndex - 1)}
                  className="flex-1 rounded-lg border border-primary-200 bg-surface py-3 text-base font-medium text-foreground/80 disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  disabled={currentIndex >= queue.length - 1}
                  onClick={() => goToIndex(currentIndex + 1)}
                  className="flex-1 rounded-lg border border-primary-200 bg-surface py-3 text-base font-medium text-foreground/80 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
