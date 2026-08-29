"use client";

import { VocabWordCard } from "@/components/discover/VocabWordCard";
import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import {
  CoinBadge,
  DiscoverDashboard,
} from "@/components/discover/DiscoverDashboard";
import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { HeaderSelect } from "@/components/layout/HeaderSelect";
import { JungleMascot } from "@/components/mascot/JungleMascot";
import { useAppBootstrap } from "@/context/AppBootstrapContext";
import {
  findNearestRangeWithWords,
  WORD_RANGES,
} from "@/data/word-ranges";
import { DEFAULT_BOOTSTRAP_RANGE } from "@/lib/app-bootstrap";
import {
  fetchDiscoverRange,
  fetchDiscoverWordDetail,
  filterDiscoverQueue,
  listItemToDiscoverData,
  type DiscoverListItem,
} from "@/lib/discover-fetch";
import {
  isCacheEntryValid,
  isWordDetailComplete,
  loadPersistedWordCache,
  persistWordCache,
  preloadImageUrl,
  stubFromListItem,
} from "@/lib/discover-word-cache";
import {
  prefetchWordImages,
  preloadWordImagesFromCache,
  type WordImagePrefetchTarget,
} from "@/lib/image-preload";
import { getTodayStudySeconds } from "@/lib/study-time";
import { useAppSettings } from "@/context/AppSettingsContext";
import {
  getTodayWordsLearned,
  incrementTodayWordsLearned,
} from "@/lib/daily-goal";
import {
  countLearningWords,
  countMasteredWords,
  writeLocalLearning,
} from "@/lib/learning-storage";
import { seedWordImageCacheFromEntries } from "@/lib/word-image-cache";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PRELOAD_AHEAD = 10;
const IMAGE_WARM_COUNT = 12;

function formatJourneyBadge(index: number, total: number): string {
  const position = index + 1;
  if (total <= 999) return `${position} / ${total}`;
  const compact =
    total >= 10000
      ? `${Math.round(total / 1000)}k`
      : `${(total / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${position} / ${compact}`;
}

function listItemImageTarget(item: DiscoverListItem): WordImagePrefetchTarget {
  return {
    word: item.word,
    searchKeyword: item.preview?.search_keyword ?? item.word,
    wordType: item.preview?.word_type ?? null,
    meaning: item.preview?.vietnamese_meaning ?? null,
  };
}

export default function DiscoverPage() {
  const pathname = usePathname();
  const router = useRouter();
  const { ranges: bootstrapRanges, wordCache: bootstrapWordCache, patchRangeAfterSave } =
    useAppBootstrap();
  const inSession = pathname.startsWith("/journey");
  const [rangeId, setRangeId] = useState(DEFAULT_BOOTSTRAP_RANGE);
  const [queue, setQueue] = useState<DiscoverListItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentWord, setCurrentWord] = useState<DiscoverWordData | null>(null);
  const [loadingList, setLoadingList] = useState(false);
  const [loadingWord, setLoadingWord] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, hidden: 0 });
  const [wordsKnown, setWordsKnown] = useState(0);
  const [wordsReviewing, setWordsReviewing] = useState(0);
  const [todayLearned, setTodayLearned] = useState(0);
  const { dailyGoalMinutes } = useAppSettings();
  const [todayStudySeconds, setTodayStudySeconds] = useState(0);
  const inflightSaves = useRef(new Set<string>());

  const todayGoalMinutes = dailyGoalMinutes;

  useEffect(() => {
    const refreshStudyTime = () => setTodayStudySeconds(getTodayStudySeconds());
    refreshStudyTime();
    window.addEventListener("study-time-changed", refreshStudyTime);
    window.addEventListener("focus", refreshStudyTime);
    return () => {
      window.removeEventListener("study-time-changed", refreshStudyTime);
      window.removeEventListener("focus", refreshStudyTime);
    };
  }, []);
  const rangeMeta = useMemo(
    () => WORD_RANGES.find((r) => r.id === rangeId),
    [rangeId],
  );
  const rangeLabel = rangeMeta?.label ?? rangeId;
  const rangeCompact = rangeMeta?.compactLabel ?? rangeId;

  useEffect(() => {
    setWordsKnown(countMasteredWords());
    setWordsReviewing(countLearningWords());
    setTodayLearned(getTodayWordsLearned());
  }, [queue.length, currentIndex]);

  const wordCache = useRef<Map<string, DiscoverWordData>>(new Map());
  const inflight = useRef<Map<string, Promise<DiscoverWordData>>>(new Map());
  const activeWordRef = useRef<string | null>(null);
  const initializedRangeRef = useRef<string | null>(null);
  const wordCacheHydratedRef = useRef(false);
  const autoJumpingRef = useRef(false);

  const queueLengthsByRange = useMemo(() => {
    const lengths: Record<string, number> = {};
    for (const range of WORD_RANGES) {
      const cached = bootstrapRanges?.[range.id];
      if (!cached) {
        lengths[range.id] = 0;
        continue;
      }
      lengths[range.id] = filterDiscoverQueue(cached.queue).length;
    }
    if (bootstrapRanges) {
      lengths[rangeId] = queue.length;
    }
    return lengths;
  }, [bootstrapRanges, rangeId, queue.length]);

  const allRangesFinished = useMemo(
    () =>
      bootstrapRanges
        ? WORD_RANGES.every((range) => (queueLengthsByRange[range.id] ?? 0) === 0)
        : false,
    [bootstrapRanges, queueLengthsByRange],
  );

  const warmRangeImages = useCallback((items: DiscoverListItem[]) => {
    const batch = items.slice(0, IMAGE_WARM_COUNT).map(listItemImageTarget);
    preloadWordImagesFromCache(batch);
    void prefetchWordImages(batch, 4);
  }, []);

  const fetchWordFromApi = useCallback(
    async (item: DiscoverListItem): Promise<DiscoverWordData> => {
      const loaded = await fetchDiscoverWordDetail(item);
      if (isCacheEntryValid(loaded, item.word)) {
        return loaded;
      }
      // Text is usable even when the photo still needs a background refresh.
      if (
        loaded.vietnamese_meaning?.trim() &&
        loaded.word.toLowerCase() === item.word.toLowerCase()
      ) {
        return loaded;
      }
      throw new Error(
        `Data for "${item.word}" is incomplete — try again later.`,
      );
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
          if (
            !isCacheEntryValid(loaded, item.word) &&
            !loaded.vietnamese_meaning?.trim()
          ) {
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
      const imageTargets: WordImagePrefetchTarget[] = [];
      for (let offset = 0; offset <= PRELOAD_AHEAD; offset++) {
        const item = items[startIndex + offset];
        if (!item) break;
        imageTargets.push(listItemImageTarget(item));

        const cached = wordCache.current.get(item.word);
        if (isWordDetailComplete(cached, item.word)) {
          continue;
        }
        if (offset === 0) continue;
        ensureWordFetched(item).catch(() => {});
      }
      preloadWordImagesFromCache(imageTargets);
      void prefetchWordImages(imageTargets, 4);
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
            const fallback = listItemToDiscoverData(item);
            if (fallback.vietnamese_meaning?.trim()) {
              setCurrentWord(fallback);
              setLoadingWord(false);
              setError(null);
              return;
            }
            setError(
              err instanceof Error ? err.message : "Failed to load word details",
            );
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
      const { words: filtered, stats: nextStats } =
        await fetchDiscoverRange(rangeId);
      setQueue(filtered);
      setCurrentIndex(0);
      setStats(nextStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setQueue([]);
      setCurrentWord(null);
    } finally {
      setLoadingList(false);
    }
  }, [rangeId]);

  const currentItem = queue[currentIndex];

  useEffect(() => {
    if (!wordCacheHydratedRef.current) {
      wordCache.current = loadPersistedWordCache();
      if (bootstrapWordCache) {
        for (const [word, entry] of Object.entries(bootstrapWordCache)) {
          if (isCacheEntryValid(entry, word)) {
            wordCache.current.set(word, entry);
          }
        }
        persistWordCache(wordCache.current);
        seedWordImageCacheFromEntries(wordCache.current.entries());
      } else {
        seedWordImageCacheFromEntries(wordCache.current.entries());
      }
      wordCacheHydratedRef.current = true;
    }
  }, [bootstrapWordCache]);

  useEffect(() => {
    if (queue.length === 0) return;
    warmRangeImages(queue);
  }, [queue, warmRangeImages]);

  useEffect(() => {
    if (!bootstrapRanges || loadingList) return;
    if (queue.length > 0) {
      autoJumpingRef.current = false;
      return;
    }

    const nextRangeId = findNearestRangeWithWords(rangeId, queueLengthsByRange);
    if (!nextRangeId || nextRangeId === rangeId || autoJumpingRef.current) return;

    autoJumpingRef.current = true;
    initializedRangeRef.current = null;
    setRangeId(nextRangeId);
  }, [
    bootstrapRanges,
    loadingList,
    queue.length,
    queueLengthsByRange,
    rangeId,
  ]);

  useEffect(() => {
    if (initializedRangeRef.current === rangeId) return;

    const cachedRange = bootstrapRanges?.[rangeId];
    if (cachedRange) {
      initializedRangeRef.current = rangeId;
      const filtered = filterDiscoverQueue(cachedRange.queue);
      setQueue(filtered);
      setStats({
        total: cachedRange.stats.total,
        hidden: cachedRange.stats.total - filtered.length,
      });
      setCurrentIndex(0);
      setLoadingList(false);
      setError(null);
      return;
    }

    if (!bootstrapRanges) return;

    initializedRangeRef.current = rangeId;
    void fetchRange();
  }, [bootstrapRanges, fetchRange, rangeId]);

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

  function queueWithoutItem(
    items: DiscoverListItem[],
    item: DiscoverListItem,
  ): DiscoverListItem[] {
    const taken = new Set(
      (item.family_members?.length ? item.family_members : [item.word]).map(
        (member) => member.trim().toLowerCase(),
      ),
    );
    return items.filter((entry) => {
      const family = entry.family_members?.length
        ? entry.family_members
        : [entry.word];
      return !family.some((member) => taken.has(member.trim().toLowerCase()));
    });
  }

  function advanceAfterAction(item: DiscoverListItem) {
    const nextQueue = queueWithoutItem(queue, item);
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

    const word = currentItem.word.trim().toLowerCase();
    if (!word || inflightSaves.current.has(word)) return;

    const snapshot = {
      queue,
      currentIndex,
      stats,
      todayLearned: getTodayWordsLearned(),
      wordsKnown: countMasteredWords(),
      wordsReviewing: countLearningWords(),
    };

    inflightSaves.current.add(word);
    setError(null);
    writeLocalLearning(currentItem.word, status === "mastered" ? "mastered" : "new");
    setStats((current) => ({
      total: current.total,
      hidden: Math.min(current.total, current.hidden + 1),
    }));
    if (status === "new") {
      setTodayLearned(incrementTodayWordsLearned());
    }
    setWordsKnown(countMasteredWords());
    setWordsReviewing(countLearningWords());
    advanceAfterAction(currentItem);
    patchRangeAfterSave(rangeId, currentItem.word, currentItem.family_members);

    void (async () => {
      const saveWord = currentItem.word;
      try {
        if (status === "new") {
          const addRes = await fetch("/api/words/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word: saveWord }),
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
            word: saveWord,
            status: status === "mastered" ? "mastered" : "new",
          }),
        });
        if (!statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.local_only) {
            setWordsKnown(countMasteredWords());
            setWordsReviewing(countLearningWords());
            return;
          }
          throw new Error(
            statusData.details ??
              statusData.error ??
              "Failed to update word status",
          );
        }
        setWordsKnown(countMasteredWords());
        setWordsReviewing(countLearningWords());
      } catch (err) {
        setQueue(snapshot.queue);
        setCurrentIndex(snapshot.currentIndex);
        setStats(snapshot.stats);
        setTodayLearned(snapshot.todayLearned);
        setWordsKnown(snapshot.wordsKnown);
        setWordsReviewing(snapshot.wordsReviewing);
        setError(err instanceof Error ? err.message : "Update failed");
      } finally {
        inflightSaves.current.delete(word);
      }
    })();
  }

  if (!inSession) {
    return (
      <div className="app-screen app-screen--home">
        <AppHeader
          title="Home"
          hideTitle
          leading={
            <div className="app-header__actions">
              <AppMenuButton />
              <Link href="/search" className="app-header__icon-btn" aria-label="Search words">
                🔍
              </Link>
              <CoinBadge value={wordsKnown + wordsReviewing} />
            </div>
          }
        />

        {loadingList ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
          </div>
        ) : (
          <DiscoverDashboard
            rangeLabel={rangeLabel}
            queueLength={queue.length}
            currentIndex={currentIndex}
            wordsKnown={wordsKnown}
            wordsReviewing={wordsReviewing}
            streakDays={todayStudySeconds >= todayGoalMinutes * 60 ? 1 : 0}
            todayStudySeconds={todayStudySeconds}
            todayGoalMinutes={todayGoalMinutes}
            todayWordsLearned={todayLearned}
            onStartLearning={() => router.push("/journey")}
            onOpenKnown={() => router.push("/words?filter=known")}
            onOpenReview={() => router.push("/words?filter=review")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app-screen app-screen--journey">
      <AppHeader
        title="Vocab Journey"
        leading={
          <button
            type="button"
            className="app-header__icon-btn"
            aria-label="Back to home"
            onClick={() => router.push("/discover")}
          >
            ←
          </button>
        }
        trailing={
          <HeaderSelect
            value={rangeId}
            onChange={setRangeId}
            aria-label="Select word range"
            options={WORD_RANGES.map((range) => ({
              id: range.id,
              label: range.compactLabel,
            }))}
          />
        }
      />

      <div className="journey-panel px-4">
        <p className="journey-note">
          {stats.hidden} {stats.hidden === 1 ? "word" : "words"} known or in
          review in this rank ({rangeCompact})
        </p>

        {error && (
          <p className="shrink-0 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
            {error}
          </p>
        )}

        {loadingList ? (
          <div className="journey-main journey-main--center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
          </div>
        ) : queue.length === 0 ? (
          <div className="journey-main journey-main--center px-2 text-center">
            <JungleMascot character="crocodile" size={72} className="mb-3" />
            <div className="w-full">
              <p className="text-foreground/80">
                {allRangesFinished
                  ? "You've finished every rank. Words you learned or marked as known no longer appear here."
                  : "You've finished this range. Jumping to the nearest rank with new words…"}
              </p>
              {allRangesFinished && (
                <button
                  type="button"
                  onClick={() => router.push("/discover")}
                  className="btn-pill-primary mt-4 px-6 py-3"
                >
                  Back to Home
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="journey-main">
            <VocabWordCard
              key={currentItem.word}
              data={currentWord ?? stubFromListItem(currentItem)}
              loading={loadingWord}
              imageBadge={formatJourneyBadge(currentIndex, queue.length)}
            />

            <div className="journey-actions">
              <button
                type="button"
                onClick={() => updateStatus("new")}
                className="btn-pill-primary w-full"
              >
                Learn this
              </button>
              <button
                type="button"
                onClick={() => updateStatus("mastered")}
                className="btn-pill-outline-secondary w-full"
              >
                Already know
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
