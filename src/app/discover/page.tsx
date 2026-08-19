"use client";

import {
  DiscoverCard,
  type DiscoverWordData,
} from "@/components/discover/DiscoverCard";
import { AppNav } from "@/components/layout/AppNav";
import { WORD_RANGES } from "@/data/preset-vocabulary";
import {
  isCacheEntryValid,
  isWordDetailComplete,
  loadPersistedWordCache,
  persistWordCache,
  preloadImageUrl,
  stubFromListItem,
} from "@/lib/discover-word-cache";
import { resolveWordImageUrl } from "@/lib/unsplash";
import {
  getLocallyMasteredWords,
  writeLocalLearning,
} from "@/lib/learning-storage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type DiscoverListItem = {
  word: string;
  rank: number;
  importance_tier: string;
  from_static?: boolean;
  has_vietnamese?: boolean;
  needs_fetch?: boolean;
};

const PRELOAD_AHEAD = 3;

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
    image_url: resolveWordImageUrl(
      item.word,
      apiWord.image_url as string | null | undefined,
      apiWord.search_keyword as string | null | undefined,
    ),
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
        skipGemini: "true",
      });
      const res = await fetch(`/api/discover/word?${params}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Không thể tải từ");
      }
      return mapApiWord(item, data.word);
    },
    [],
  );

  const ensureWordFetched = useCallback(
    async (item: DiscoverListItem): Promise<DiscoverWordData> => {
      const cached = wordCache.current.get(item.word);
      if (isWordDetailComplete(cached, item.word)) {
        return cached!;
      }

      const pending = inflight.current.get(item.word);
      if (pending) return pending;

      const promise = fetchWordFromApi(item)
        .then((loaded) => {
          if (!isCacheEntryValid(loaded, item.word)) {
            throw new Error(`Dữ liệu không khớp cho "${item.word}"`);
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

      const cleanStub = stubFromListItem(item);
      setCurrentWord(cleanStub);
      setLoadingWord(true);

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
            setError(err instanceof Error ? err.message : "Lỗi tải chi tiết từ");
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
      const res = await fetch(`/api/discover?range=${rangeId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Không thể tải kho từ");
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
      setError(err instanceof Error ? err.message : "Lỗi tải dữ liệu");
      setQueue([]);
      setCurrentWord(null);
    } finally {
      setLoadingList(false);
    }
  }, [rangeId, filterLocalMastered]);

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
              addData.details ?? addData.error ?? "Không thể thêm từ",
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
        setError(err instanceof Error ? err.message : "Lỗi cập nhật");
      }
    })();
  }

  const rangeLabel = useMemo(
    () => WORD_RANGES.find((r) => r.id === rangeId)?.label ?? rangeId,
    [rangeId],
  );

  return (
    <main className="min-h-screen bg-black">
      <header className="border-b border-neutral-800 bg-black/80 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-white">Knowledge Map</h1>
              <p className="text-sm text-neutral-400">
                Khám phá từ — tải trước để chuyển thẻ mượt hơn
              </p>
            </div>
            <AppNav active="discover" />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-medium text-neutral-400" htmlFor="range">
            Dải từ:
          </label>
          <select
            id="range"
            value={rangeId}
            onChange={(e) => setRangeId(e.target.value)}
            className="rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm font-medium text-neutral-300 shadow-sm focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20"
          >
            {WORD_RANGES.map((range) => (
              <option key={range.id} value={range.id}>
                {range.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-neutral-400">
            {rangeLabel} · {queue.length} từ còn lại
            {stats.hidden > 0 && ` · ${stats.hidden} đã biết`}
          </span>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-neutral-300">
            {error}
          </p>
        )}

        {loadingList ? (
          <div className="mt-12 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-700 border-t-white" />
          </div>
        ) : queue.length === 0 ? (
          <div className="mt-12 text-center">
            <p className="text-neutral-300">
              Đã xem hết từ trong dải này hoặc bạn đã đánh dấu tất cả là &ldquo;Đã biết&rdquo;.
            </p>
            <p className="mt-2 text-sm text-neutral-500">
              Hãy chọn dải từ khác hoặc sang trang Học từ để ôn tập.
            </p>
          </div>
        ) : (
          <div className="mt-8">
            <p className="mb-4 text-center text-sm text-neutral-400">
              Từ {currentIndex + 1} / {queue.length} trong dải
            </p>

            <DiscoverCard
              key={currentItem.word}
              data={currentWord ?? stubFromListItem(currentItem)}
              loading={loadingWord}
            />

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateStatus("new")}
                className="rounded-xl bg-white py-3.5 font-semibold text-black shadow-sm transition hover:bg-neutral-200"
              >
                Nên học
              </button>
              <button
                type="button"
                onClick={() => updateStatus("mastered")}
                className="rounded-xl border-2 border-neutral-600 bg-neutral-900 py-3.5 font-semibold text-white transition hover:bg-neutral-800"
              >
                Đã biết
              </button>
            </div>

            <div className="mt-4 flex justify-center gap-3">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => goToIndex(currentIndex - 1)}
                className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 disabled:opacity-40"
              >
                ← Trước
              </button>
              <button
                type="button"
                disabled={currentIndex >= queue.length - 1}
                onClick={() => goToIndex(currentIndex + 1)}
                className="rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm text-neutral-300 disabled:opacity-40"
              >
                Sau →
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
