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
import { preloadWordPronunciations } from "@/lib/pronunciation-preload";
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
import { readOnboarding, shouldShowOnboarding } from "@/lib/onboarding";
import { countDueReviewWords } from "@/lib/review-schedule";
import { fetchLearningSummary } from "@/lib/review-fetch";
import { OnboardingModal } from "@/components/onboarding/OnboardingModal";
import {
  DailySessionSummary,
} from "@/components/study/DailySessionSummary";
import { useI18n } from "@/hooks/use-i18n";
import {
  dailySessionQuery,
  dailySessionRoute,
  readDailySession,
  recordDailyNewWord,
  resumeOrStartDailySession,
  type DailySession,
} from "@/lib/daily-session";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const PRELOAD_AHEAD = 10;
const IMAGE_WARM_COUNT = 12;

function formatJourneyBadge(index: number, total: number): string {
  return `${index + 1} / ${total}`;
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
  const searchParams = useSearchParams();
  const { t } = useI18n();
  const { ranges: bootstrapRanges, wordCache: bootstrapWordCache, patchRangeAfterSave } =
    useAppBootstrap();
  const inSession = pathname.startsWith("/journey");
  const isDailyJourney =
    inSession &&
    (searchParams.get("daily") === "1" || readDailySession()?.phase === "journey");
  const [dailySession, setDailySession] = useState<DailySession | null>(null);
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
  const [dueReviewCount, setDueReviewCount] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const inflightSaves = useRef(new Set<string>());
  const onboardingChecked = useRef(false);

  const todayGoalMinutes = dailyGoalMinutes;

  useEffect(() => {
    const refreshSession = () => setDailySession(readDailySession());
    refreshSession();
    window.addEventListener("daily-session-changed", refreshSession);
    return () => window.removeEventListener("daily-session-changed", refreshSession);
  }, []);

  useEffect(() => {
    if (onboardingChecked.current) return;
    onboardingChecked.current = true;
    const state = readOnboarding();
    setShowOnboarding(shouldShowOnboarding());
    if (state.completed) setRangeId(state.preferredRangeId);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const refreshDue = async () => {
      let count = countDueReviewWords();
      try {
        const summary = await fetchLearningSummary();
        count = countDueReviewWords(summary);
      } catch {
        /* keep local count */
      }
      if (!cancelled) setDueReviewCount(count);
    };
    void refreshDue();
    window.addEventListener("vocab-learning-changed", refreshDue);
    window.addEventListener("storage", refreshDue);
    return () => {
      cancelled = true;
      window.removeEventListener("vocab-learning-changed", refreshDue);
      window.removeEventListener("storage", refreshDue);
    };
  }, []);

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
      if (loaded.vietnamese_meaning?.trim()) {
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
      const pronunciationWords: string[] = [];
      for (let offset = 0; offset <= PRELOAD_AHEAD; offset++) {
        const item = items[startIndex + offset];
        if (!item) break;
        imageTargets.push(listItemImageTarget(item));
        pronunciationWords.push(item.word);

        const cached = wordCache.current.get(item.word);
        if (isWordDetailComplete(cached, item.word)) {
          continue;
        }
        if (offset === 0) continue;
        ensureWordFetched(item).catch(() => {});
      }
      preloadWordImagesFromCache(imageTargets);
      preloadWordPronunciations(pronunciationWords);
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
      if (isDailyJourney) {
        const result = recordDailyNewWord();
        if (result.reached) {
          router.push("/discover");
        }
      }
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
          title={t("home.title")}
          hideTitle
          leading={
            <div className="app-header__actions">
              <AppMenuButton />
              <Link href="/search" className="app-header__icon-btn" aria-label={t("home.searchAria")}>
                🔍
              </Link>
              <CoinBadge value={wordsKnown + wordsReviewing} />
            </div>
          }
        />

        {showOnboarding ? (
          <OnboardingModal
            onComplete={(preferredRangeId) => {
              setShowOnboarding(false);
              setRangeId(preferredRangeId);
            }}
          />
        ) : null}

        {loadingList ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
          </div>
        ) : dailySession?.phase === "summary" ? (
          <DailySessionSummary session={dailySession} />
        ) : (
          <DiscoverDashboard
            rangeLabel={rangeLabel}
            queueLength={queue.length}
            currentIndex={currentIndex}
            dueReviewCount={dueReviewCount}
            wordsKnown={wordsKnown}
            wordsReviewing={wordsReviewing}
            streakDays={todayStudySeconds >= todayGoalMinutes * 60 ? 1 : 0}
            todayStudySeconds={todayStudySeconds}
            todayGoalMinutes={todayGoalMinutes}
            todayWordsLearned={todayLearned}
            sessionInProgress={dailySession != null}
            onStartToday={() => {
              const session = resumeOrStartDailySession(dueReviewCount);
              router.push(`${dailySessionRoute(session)}${dailySessionQuery(session)}`);
            }}
            onStartJourney={() => router.push("/journey")}
            onStartReview={() => router.push("/learn")}
            onOpenLibrary={() => router.push("/words")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="app-screen app-screen--journey">
      <AppHeader
        title={t("journey.title")}
        leading={
          <button
            type="button"
            className="app-header__icon-btn"
            aria-label={t("journey.backHome")}
            onClick={() => router.push("/discover")}
          >
            ←
          </button>
        }
        trailing={
          <HeaderSelect
            value={rangeId}
            onChange={setRangeId}
            aria-label={t("journey.selectBand")}
            options={WORD_RANGES.map((range) => ({
              id: range.id,
              label: range.compactLabel,
            }))}
          />
        }
      />

      <div className="journey-panel px-4">
        <p className="journey-note">
          {t("journey.hiddenWords", { count: stats.hidden, band: rangeCompact })}
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
                {allRangesFinished ? t("journey.allFinished") : t("journey.rangeFinished")}
              </p>
              {allRangesFinished && (
                <button
                  type="button"
                  onClick={() => router.push("/discover")}
                  className="btn-pill-primary mt-4 px-6 py-3"
                >
                  {t("journey.backHomeBtn")}
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
                {t("journey.learnThis")}
              </button>
              <button
                type="button"
                onClick={() => updateStatus("mastered")}
                className="btn-pill-outline-secondary w-full"
              >
                {t("journey.alreadyKnow")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
