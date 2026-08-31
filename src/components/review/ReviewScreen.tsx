"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { ReviewQuestion } from "@/components/review/ReviewQuestion";
import { ReviewRecallQuestion } from "@/components/review/ReviewRecallQuestion";
import { ReviewReveal } from "@/components/review/ReviewReveal";
import { ReviewSenseQuestion } from "@/components/review/ReviewSenseQuestion";
import { JungleMascot } from "@/components/mascot/JungleMascot";
import { writeLocalLearning } from "@/lib/learning-storage";
import {
  buildReviewChoices,
  buildReviewQuestionPlan,
  pickReviewRecallSentence,
  reviewClue,
  reviewSenseCacheKey,
  resolveReviewSenseChoices,
  senseChoicesAreValidForPrompt,
  type ReviewChoice,
  type ReviewQuizKind,
} from "@/lib/review-quiz";
import {
  collectReviewQuestionImageTargets,
  prefetchReviewImages,
  prefetchReviewQuestionRange,
  preloadReviewImageBatch,
} from "@/lib/review-image-preload";
import { useReviewSession } from "@/hooks/useReviewSession";
import { hasQualityExamples } from "@/lib/example-quality";
import { parseExamples } from "@/lib/parse-examples";
import {
  advanceReviewInterval,
  getReviewSchedule,
  writeReviewSchedule,
  type ReviewIntervalDays,
} from "@/lib/review-schedule";
import {
  clearReviewSessionSnapshot,
  markReviewSessionCompleted,
  readReviewSessionSnapshot,
  saveReviewSessionInProgress,
} from "@/lib/review-session-storage";
import { shouldRefreshImageUrl } from "@/lib/unsplash";
import { refreshAllStaleWordImages } from "@/lib/refresh-stale-word-images";
import {
  fetchReviewWordDetails,
  hasReviewClueFields,
  hydrateReviewWordLocal,
  prefetchReviewClues,
} from "@/lib/review-word-hydrate";
import type { LearningStatus, VocabWord } from "@/types/database";
import { useI18n } from "@/hooks/use-i18n";
import {
  finishReviewPhase,
  isDailySessionPhase,
  readDailySession,
  setDailySessionReviewPlanned,
} from "@/lib/daily-session";
import { DailySessionProgressBanner } from "@/components/study/DailySessionSummary";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "question" | "reveal";

const REVEAL_DELAY_MS = 850;
const REVIEW_PREFETCH_AHEAD = 6;
const REVIEW_WARM_COUNT = 20;

function patchImageUpdates(
  updates: Record<string, string>,
): {
  patchWord: (item: VocabWord) => VocabWord;
  patchChoice: (choice: ReviewChoice) => ReviewChoice;
} {
  const patchWord = (item: VocabWord) => {
    const key = item.word.trim().toLowerCase();
    return updates[key] ? { ...item, image_url: updates[key] } : item;
  };
  const patchChoice = (choice: ReviewChoice) => {
    const key = choice.word.trim().toLowerCase();
    return updates[key] ? { ...choice, imageUrl: updates[key] } : choice;
  };
  return { patchWord, patchChoice };
}

function applyImageUpdatesToState(
  updates: Record<string, string>,
  setAllWords: (value: VocabWord[] | ((prev: VocabWord[]) => VocabWord[])) => void,
  setQueue: (value: VocabWord[] | ((prev: VocabWord[]) => VocabWord[])) => void,
  setChoices: (value: ReviewChoice[] | ((prev: ReviewChoice[]) => ReviewChoice[])) => void,
) {
  if (Object.keys(updates).length === 0) return;
  const { patchWord, patchChoice } = patchImageUpdates(updates);
  setAllWords((prev) => prev.map(patchWord));
  setQueue((prev) => prev.map(patchWord));
  setChoices((prev) => prev.map(patchChoice));
}

export function ReviewScreen() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDailySession = searchParams.get("daily") === "1";
  const {
    loading,
    enriching,
    dueCount,
    queue,
    pool: allWords,
    error: loadError,
    reload,
    patchQueue,
    patchBoth,
  } = useReviewSession();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [choices, setChoices] = useState<ReviewChoice[]>([]);
  const [quizKind, setQuizKind] = useState<ReviewQuizKind>("word");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [unsure, setUnsure] = useState(false);
  const [locked, setLocked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [intervalDays, setIntervalDays] = useState<ReviewIntervalDays>(1);
  const [markMastered, setMarkMastered] = useState(false);
  const [timesReviewed, setTimesReviewed] = useState(0);
  const [confirming, setConfirming] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionDone, setSessionDone] = useState(false);
  const [dailySession, setDailySession] = useState(readDailySession());
  const reviewInitialCountRef = useRef(0);
  const dailyRedirectRef = useRef(false);
  const sessionStartedRef = useRef(false);
  const revealDelayRef = useRef(REVEAL_DELAY_MS);
  const phaseRef = useRef<Phase>("question");
  const lockedRef = useRef(false);
  const indexRef = useRef(0);
  const queueRef = useRef<VocabWord[]>([]);
  const allWordsRef = useRef<VocabWord[]>([]);
  const prefetchedChoicesRef = useRef<Map<string, ReviewChoice[]>>(new Map());
  const prefetchInflightRef = useRef<Map<number, Promise<void>>>(new Map());
  const activeQuestionRef = useRef<{ word: string; index: number } | null>(null);

  const currentWord = queue[index];
  phaseRef.current = phase;
  lockedRef.current = locked;
  indexRef.current = index;
  queueRef.current = queue;
  allWordsRef.current = allWords;

  useEffect(() => {
    const refresh = () => setDailySession(readDailySession());
    refresh();
    window.addEventListener("daily-session-changed", refresh);
    return () => window.removeEventListener("daily-session-changed", refresh);
  }, []);

  useEffect(() => {
    if (!isDailySession || !isDailySessionPhase("review")) return;
    if (queue.length === 0) return;
    if (reviewInitialCountRef.current === 0) {
      reviewInitialCountRef.current = queue.length;
      setDailySessionReviewPlanned(queue.length);
    }
  }, [isDailySession, queue.length]);

  useEffect(() => {
    if (!isDailySession || loading) return;
    if (!isDailySessionPhase("review")) return;
    if (queue.length > 0 || !sessionDone) return;
    if (dailyRedirectRef.current) return;
    dailyRedirectRef.current = true;
    finishReviewPhase(reviewInitialCountRef.current);
    router.replace("/journey?daily=1");
  }, [isDailySession, loading, queue.length, sessionDone, router]);

  useEffect(() => {
    if (!sessionDone || dailyRedirectRef.current) return;
    if (!isDailySession || !isDailySessionPhase("review")) return;
    if (queue.length === 0) return;
    dailyRedirectRef.current = true;
    finishReviewPhase(reviewInitialCountRef.current);
    router.replace("/journey?daily=1");
  }, [sessionDone, isDailySession, queue.length, router]);

  const mergePrefetchedSenseChoices = useCallback(
    (senseChoices: Map<number, ReviewChoice[]>) => {
      const q = queueRef.current;
      const pool = allWordsRef.current.length > 0 ? allWordsRef.current : q;
      for (const [questionIndex, cachedChoices] of senseChoices.entries()) {
        const word = q[questionIndex];
        if (!word) continue;
        if (!senseChoicesAreValidForPrompt(cachedChoices, word.word, pool)) {
          continue;
        }
        prefetchedChoicesRef.current.set(
          reviewSenseCacheKey(questionIndex, word.word),
          cachedChoices,
        );
      }
    },
    [],
  );

  const warmReviewImages = useCallback(
    (due: VocabWord[], pool: VocabWord[], startIndex = 0) => {
      void prefetchReviewQuestionRange(
        due,
        pool,
        startIndex,
        REVIEW_WARM_COUNT,
      ).then(mergePrefetchedSenseChoices);
    },
    [mergePrefetchedSenseChoices],
  );

  const prefetchQuestionAt = useCallback(
    (questionIndex: number) => {
      const pending = prefetchInflightRef.current.get(questionIndex);
      if (pending) return;

      const promise = (async () => {
        const q = queueRef.current;
        const pool = allWordsRef.current;
        const word = q[questionIndex];
        if (!word) return;

        const plan = collectReviewQuestionImageTargets(word, pool, questionIndex);
        if (
          plan.kind === "sense" &&
          senseChoicesAreValidForPrompt(plan.choices, word.word, pool)
        ) {
          prefetchedChoicesRef.current.set(
            reviewSenseCacheKey(questionIndex, word.word),
            plan.choices,
          );
        }

        preloadReviewImageBatch(plan.targets);
        const updates = await prefetchReviewImages(plan.targets);
        applyImageUpdatesToState(updates, setAllWords, setQueue, setChoices);

        if (plan.kind === "sense" && Object.keys(updates).length > 0) {
          const cacheKey = reviewSenseCacheKey(questionIndex, word.word);
          const cached =
            prefetchedChoicesRef.current.get(cacheKey) ?? plan.choices;
          prefetchedChoicesRef.current.set(
            cacheKey,
            cached.map((choice) => {
              const key = choice.word.trim().toLowerCase();
              return updates[key] ? { ...choice, imageUrl: updates[key] } : choice;
            }),
          );
        }
      })().finally(() => {
        prefetchInflightRef.current.delete(questionIndex);
      });

      prefetchInflightRef.current.set(questionIndex, promise);
    },
    [],
  );

  const prefetchQuestionsAhead = useCallback(
    (fromIndex: number, count = REVIEW_PREFETCH_AHEAD) => {
      for (let offset = 1; offset <= count; offset++) {
        prefetchQuestionAt(fromIndex + offset);
      }
    },
    [prefetchQuestionAt],
  );

  const startQuestion = useCallback((word: VocabWord, pool: VocabWord[], questionIndex = 0) => {
    const schedule = getReviewSchedule(word.word);
    const cacheKey = reviewSenseCacheKey(questionIndex, word.word);
    const cachedSenseChoices = prefetchedChoicesRef.current.get(cacheKey);
    const planned = buildReviewQuestionPlan(word, pool, questionIndex);
    let kind = planned.kind;
    let nextChoices = planned.choices;

    if (planned.kind === "sense") {
      nextChoices = resolveReviewSenseChoices(
        word.word,
        pool,
        cachedSenseChoices,
      );
      if (!senseChoicesAreValidForPrompt(nextChoices, word.word, pool)) {
        kind = "word";
        nextChoices = buildReviewChoices(
          word.word,
          pool.filter(
            (item) =>
              /^[a-z]+$/i.test(item.word) &&
              item.word.length >= 3 &&
              Boolean(item.english_definition?.trim()),
          ),
          word.rank,
        );
      } else {
        kind = "sense";
      }
      prefetchedChoicesRef.current.delete(cacheKey);
    } else if (cachedSenseChoices) {
      prefetchedChoicesRef.current.delete(cacheKey);
    }

    setPhase("question");
    setQuizKind(kind);
    setChoices(nextChoices);
    setSelectedKey(null);
    setUnsure(false);
    setLocked(false);
    setCorrect(false);
    setIntervalDays(schedule.intervalDays);
    setMarkMastered(false);
    setTimesReviewed(schedule.timesReviewed);
    activeQuestionRef.current = { word: word.word, index: questionIndex };

    const { targets } = collectReviewQuestionImageTargets(word, pool, questionIndex);
    if (kind === "sense") {
      const senseTargets = nextChoices.map((choice) => ({
        word: choice.word,
        imageUrl: choice.imageUrl,
        searchKeyword: choice.searchKeyword,
        wordType: choice.wordType,
        meaning: choice.meaning,
      }));
      preloadReviewImageBatch(senseTargets);
      void prefetchReviewImages(senseTargets).then((updates) => {
        applyImageUpdatesToState(updates, setAllWords, setQueue, setChoices);
        if (Object.keys(updates).length > 0) {
          setChoices((prev) =>
            prev.map((choice) => {
              const key = choice.word.trim().toLowerCase();
              return updates[key] ? { ...choice, imageUrl: updates[key] } : choice;
            }),
          );
        }
      });
    } else {
      preloadReviewImageBatch(targets);
      void prefetchReviewImages(targets).then((updates) => {
        applyImageUpdatesToState(updates, setAllWords, setQueue, setChoices);
      });
    }

    prefetchQuestionsAhead(questionIndex);
  }, [prefetchQuestionsAhead]);

  useEffect(() => {
    if (phase !== "question" || quizKind !== "sense" || !currentWord || locked) {
      return;
    }
    if (senseChoicesAreValidForPrompt(choices, currentWord.word, allWords)) {
      return;
    }
    const rebuilt = resolveReviewSenseChoices(currentWord.word, allWords);
    if (senseChoicesAreValidForPrompt(rebuilt, currentWord.word, allWords)) {
      setChoices(rebuilt);
      return;
    }
    setQuizKind("word");
    setChoices(
      buildReviewChoices(
        currentWord.word,
        allWords.filter(
          (item) =>
            /^[a-z]+$/i.test(item.word) &&
            item.word.length >= 3 &&
            Boolean(item.english_definition?.trim()),
        ),
        currentWord.rank,
      ),
    );
  }, [phase, quizKind, currentWord, locked, choices, allWords]);

  useEffect(() => {
    if (phase !== "question" || locked) return;
    const active = activeQuestionRef.current;
    if (!active) return;

    const promptKey = active.word.trim().toLowerCase();
    const atIndexKey = queue[index]?.word.trim().toLowerCase();
    if (atIndexKey === promptKey) return;

    const newIndex = queue.findIndex(
      (item) => item.word.trim().toLowerCase() === promptKey,
    );
    if (newIndex < 0) return;
    setIndex(newIndex);
    startQuestion(queue[newIndex]!, allWords, newIndex);
  }, [queue, index, phase, locked, allWords, startQuestion]);

  const setAllWords = useCallback(
    (value: VocabWord[] | ((prev: VocabWord[]) => VocabWord[])) => {
      const next =
        typeof value === "function" ? value(allWordsRef.current) : value;
      patchBoth(queueRef.current, next);
    },
    [patchBoth],
  );

  const setQueue = useCallback(
    (value: VocabWord[] | ((prev: VocabWord[]) => VocabWord[])) => {
      const next = typeof value === "function" ? value(queueRef.current) : value;
      patchBoth(next, allWordsRef.current);
    },
    [patchBoth],
  );

  const beginSession = useCallback(
    (sessionQueue: VocabWord[], sessionPool: VocabWord[]) => {
      if (sessionQueue.length === 0) {
        sessionStartedRef.current = false;
        setSessionDone(true);
        return;
      }

      setSessionDone(false);
      const pool = sessionPool.length > 0 ? sessionPool : sessionQueue;
      warmReviewImages(sessionQueue, pool);

      const first = sessionQueue[0]!;
      const { targets } = collectReviewQuestionImageTargets(first, pool, 0);
      void prefetchReviewImages(targets).then((updates) => {
        if (Object.keys(updates).length === 0) return;
        patchBoth(
          sessionQueue.map((item) => {
            const key = item.word.trim().toLowerCase();
            return updates[key] ? { ...item, image_url: updates[key] } : item;
          }),
          pool.map((item) => {
            const key = item.word.trim().toLowerCase();
            return updates[key] ? { ...item, image_url: updates[key] } : item;
          }),
        );
      });

      void prefetchReviewClues(sessionQueue, 0, 16).then((clueUpdates) => {
        if (Object.keys(clueUpdates).length === 0) return;
        const patchWord = (item: VocabWord) => {
          const key = item.word.trim().toLowerCase();
          const patch = clueUpdates[key];
          if (!patch) return item;
          return {
            ...item,
            vietnamese_meaning:
              patch.vietnamese_meaning ?? item.vietnamese_meaning,
            english_definition:
              patch.english_definition ?? item.english_definition,
            phonetic: patch.phonetic ?? item.phonetic,
            word_type: patch.word_type ?? item.word_type,
            examples: patch.examples ?? item.examples,
            search_keyword: patch.search_keyword ?? item.search_keyword,
            image_url: patch.image_url ?? item.image_url,
          };
        };
        patchBoth(sessionQueue.map(patchWord), pool.map(patchWord));
      });

      const inProgress = readReviewSessionSnapshot()?.inProgress;
      if (inProgress) {
        const resumeIndex = sessionQueue.findIndex(
          (item) =>
            item.word.trim().toLowerCase() ===
            inProgress.word.trim().toLowerCase(),
        );
        if (resumeIndex >= 0) {
          setIndex(resumeIndex);
          setPhase("reveal");
          setQuizKind(
            buildReviewQuestionPlan(
              sessionQueue[resumeIndex]!,
              pool,
              resumeIndex,
            ).kind,
          );
          setLocked(true);
          setCorrect(inProgress.correct);
          setIntervalDays(inProgress.intervalDays);
          setTimesReviewed(inProgress.timesReviewed);
          setMarkMastered(inProgress.markMastered);
          prefetchQuestionsAhead(resumeIndex);
          return;
        }
      }

      setIndex(0);
      startQuestion(hydrateReviewWordLocal(sessionQueue[0]!), pool, 0);

      void refreshAllStaleWordImages(
        pool.map((word) => ({
          word: word.word,
          imageUrl: word.image_url,
          meaning: word.vietnamese_meaning,
          wordType: word.word_type,
          searchKeyword: word.search_keyword,
        })),
        3,
      ).then((updates) => {
        applyImageUpdatesToState(updates, setAllWords, setQueue, setChoices);
      });
    },
    [
      patchBoth,
      prefetchQuestionsAhead,
      setAllWords,
      setQueue,
      startQuestion,
      warmReviewImages,
    ],
  );

  useEffect(() => {
    if (loading || queue.length === 0) {
      if (!loading && queue.length === 0) {
        sessionStartedRef.current = false;
      }
      return;
    }
    if (sessionStartedRef.current && activeQuestionRef.current) return;

    sessionStartedRef.current = true;
    beginSession(queue, allWords.length > 0 ? allWords : queue);
  }, [loading, queue, allWords, beginSession]);

  useEffect(() => {
    if (!locked || phase !== "question") return;
    const delay = revealDelayRef.current;
    const timer = window.setTimeout(() => {
      setPhase("reveal");
    }, delay);
    return () => {
      window.clearTimeout(timer);
    };
  }, [locked, phase]);

  useEffect(() => {
    if (phase !== "reveal" || !currentWord) return;
    saveReviewSessionInProgress(
      {
        word: currentWord.word,
        correct,
        intervalDays,
        timesReviewed,
        markMastered,
      },
      queue,
    );
  }, [
    phase,
    currentWord,
    correct,
    intervalDays,
    timesReviewed,
    markMastered,
    queue,
  ]);

  useEffect(() => {
    if (!currentWord) return;

    if (!hasReviewClueFields(currentWord)) {
      const hydrated = hydrateReviewWordLocal(currentWord);
      if (hasReviewClueFields(hydrated)) {
        const patch = {
          vietnamese_meaning: hydrated.vietnamese_meaning,
          english_definition: hydrated.english_definition,
          phonetic: hydrated.phonetic,
          word_type: hydrated.word_type,
          examples: hydrated.examples,
          search_keyword: hydrated.search_keyword,
          image_url: hydrated.image_url ?? currentWord.image_url,
        };
        setQueue((prev) =>
          prev.map((word) =>
            word.word === currentWord.word ? { ...word, ...patch } : word,
          ),
        );
        setAllWords((prev) =>
          prev.map((word) =>
            word.word === currentWord.word ? { ...word, ...patch } : word,
          ),
        );
        return;
      }

      let cancelled = false;
      void fetchReviewWordDetails(currentWord.word).then((details) => {
        if (cancelled || !details || !hasReviewClueFields(details)) return;
        const patch = {
          vietnamese_meaning:
            details.vietnamese_meaning ?? currentWord.vietnamese_meaning,
          english_definition:
            details.english_definition ?? currentWord.english_definition,
          phonetic: details.phonetic ?? currentWord.phonetic,
          word_type: details.word_type ?? currentWord.word_type,
          examples: details.examples ?? currentWord.examples,
          search_keyword: details.search_keyword ?? currentWord.search_keyword,
          image_url: details.image_url ?? currentWord.image_url,
        };
        setQueue((prev) =>
          prev.map((word) =>
            word.word === currentWord.word ? { ...word, ...patch } : word,
          ),
        );
        setAllWords((prev) =>
          prev.map((word) =>
            word.word === currentWord.word ? { ...word, ...patch } : word,
          ),
        );
      });
      return () => {
        cancelled = true;
      };
    }

    const missingImage = shouldRefreshImageUrl(
      currentWord.image_url,
      currentWord.word,
    );
    const badVi =
      currentWord.vietnamese_meaning?.trim() &&
      currentWord.english_definition?.trim() &&
      currentWord.vietnamese_meaning.trim().toLowerCase() ===
        currentWord.english_definition.trim().toLowerCase();
    const missingExamples =
      quizKind === "recall" &&
      !pickReviewRecallSentence(
        currentWord.word,
        currentWord.examples,
        currentWord.vietnamese_meaning,
        currentWord.word_type,
      );
    const badExamples = !hasQualityExamples(
      currentWord.word,
      parseExamples(currentWord.examples),
      currentWord.word_type,
      currentWord.vietnamese_meaning,
    );
    if (!missingImage && !badVi && !missingExamples && !badExamples) return;

    let cancelled = false;
    if (missingImage && !badVi && !missingExamples && !badExamples) {
      const params = new URLSearchParams({ word: currentWord.word });
      if (currentWord.vietnamese_meaning?.trim()) {
        params.set("meaning", currentWord.vietnamese_meaning.trim());
      }
      if (currentWord.word_type?.trim()) {
        params.set("pos", currentWord.word_type.trim());
      }
      fetch(`/api/word-image?${params}`)
        .then((res) => res.json())
        .then((data: { image_url?: string | null }) => {
          if (cancelled || !data.image_url) return;
          const patch = { image_url: data.image_url };
          setQueue((prev) =>
            prev.map((word) =>
              word.word === currentWord.word ? { ...word, ...patch } : word,
            ),
          );
          setAllWords((prev) =>
            prev.map((word) =>
              word.word === currentWord.word ? { ...word, ...patch } : word,
            ),
          );
        })
        .catch(() => {});
      return () => {
        cancelled = true;
      };
    }

    const params = new URLSearchParams({
      word: currentWord.word,
      rank: String(currentWord.rank),
      skipGemini: "false",
    });
    fetch(`/api/discover/word?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.word) return;
        const patch = {
          image_url: data.word.image_url ?? currentWord.image_url,
          vietnamese_meaning:
            data.word.vietnamese_meaning ?? currentWord.vietnamese_meaning,
          english_definition:
            data.word.english_definition ?? currentWord.english_definition,
          phonetic: data.word.phonetic ?? currentWord.phonetic,
          word_type: data.word.word_type ?? currentWord.word_type,
          examples: data.word.examples ?? currentWord.examples,
        };
        setQueue((prev) =>
          prev.map((word) =>
            word.word === currentWord.word ? { ...word, ...patch } : word,
          ),
        );
        setAllWords((prev) =>
          prev.map((word) =>
            word.word === currentWord.word ? { ...word, ...patch } : word,
          ),
        );
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [
    currentWord?.word,
    currentWord?.image_url,
    currentWord?.vietnamese_meaning,
    currentWord?.english_definition,
    currentWord?.examples,
    quizKind,
  ]);

  function lockAnswer(
    isCorrect: boolean,
    key: string | null,
    wasUnsure: boolean,
    immediate = false,
  ) {
    if (locked || !currentWord) return;
    const schedule = getReviewSchedule(currentWord.word);
    const nextInterval = isCorrect
      ? advanceReviewInterval(schedule.intervalDays)
      : schedule.intervalDays;
    const nextTimes = isCorrect
      ? schedule.timesReviewed + 1
      : schedule.timesReviewed;
    setLocked(true);
    setCorrect(isCorrect);
    setSelectedKey(key);
    setUnsure(wasUnsure);
    setIntervalDays(nextInterval);
    setTimesReviewed(nextTimes);
    saveReviewSessionInProgress(
      {
        word: currentWord.word,
        correct: isCorrect,
        intervalDays: nextInterval,
        timesReviewed: nextTimes,
        markMastered: false,
      },
      queueRef.current,
    );
    revealDelayRef.current = immediate ? 0 : REVEAL_DELAY_MS;
    if (immediate) {
      setPhase("reveal");
    }
  }

  function handleChoose(choice: ReviewChoice) {
    const promptWord = currentWord?.word.trim().toLowerCase() ?? "";
    const isCorrect =
      quizKind === "sense"
        ? choice.isCorrect === true &&
          choice.word.trim().toLowerCase() === promptWord
        : choice.word.trim().toLowerCase() === promptWord;
    lockAnswer(isCorrect, choice.key, false);
  }

  function handleUnsure() {
    lockAnswer(false, null, true);
  }

  function handleLookUp() {
    lockAnswer(false, "lookup", true, true);
  }

  function handleRemember() {
    lockAnswer(true, "remember", false, true);
  }

  async function handleAddWord(e: React.FormEvent) {
    e.preventDefault();
    if (!newWord.trim()) return;
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/words/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: newWord.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to add word");
      }
      setNewWord("");
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setAdding(false);
    }
  }

  async function confirmReview() {
    if (!currentWord || confirming) return;
    setConfirming(true);
    try {
      if (markMastered) {
        writeLocalLearning(currentWord.word, "mastered");
        try {
          await fetch("/api/words/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word: currentWord.word, status: "mastered" }),
          });
        } catch {
          /* local status already saved */
        }
      } else {
        writeReviewSchedule(currentWord.word, intervalDays, timesReviewed);
        const status: LearningStatus = correct ? "learning" : "need_review";
        writeLocalLearning(currentWord.word, status);
        try {
          await fetch("/api/words/status", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ word: currentWord.word, status }),
          });
        } catch {
          /* local schedule already saved */
        }
      }

      const nextIndex = index + 1;
      const remaining = queue.slice(nextIndex);
      markReviewSessionCompleted(currentWord.word, remaining);
      patchQueue(remaining);

      if (nextIndex >= queue.length) {
        setSessionDone(true);
        patchQueue([]);
        setIndex(0);
        sessionStartedRef.current = false;
        clearReviewSessionSnapshot();
        return;
      }
      setIndex(nextIndex);
      startQuestion(queue[nextIndex], allWords, nextIndex);
    } finally {
      setConfirming(false);
    }
  }

  const showSpinner = loading && queue.length === 0;
  const syncMismatch = !showSpinner && queue.length === 0 && dueCount > 0;
  const allCaughtUp = !showSpinner && queue.length === 0 && dueCount === 0;
  const displayError = error ?? loadError;
  const inSession = Boolean(currentWord) && queue.length > 0;

  return (
    <div className={`app-screen${inSession ? " app-screen--journey" : " app-screen--home"}`}>
      <AppHeader
        title={
          inSession
            ? t("review.sessionTitle", { current: index + 1, total: queue.length })
            : t("review.title")
        }
        leading={<AppMenuButton />}
      />

      {showSpinner ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
        </div>
      ) : inSession && isDailySession && dailySession?.phase === "review" ? (
        <div className="px-4 pt-2">
          <DailySessionProgressBanner
            phase="review"
            newCompleted={0}
            newTarget={dailySession.newWordsTarget}
            reviewCompleted={Math.min(index + 1, reviewInitialCountRef.current || queue.length)}
            reviewPlanned={reviewInitialCountRef.current || dailySession.reviewsPlanned}
          />
        </div>
      ) : null}

      {!showSpinner && inSession && currentWord && phase === "question" && quizKind === "sense" ? (
        <ReviewSenseQuestion
          word={currentWord.word}
          choices={choices}
          selectedKey={selectedKey}
          unsure={unsure}
          correctWord={currentWord.word}
          locked={locked}
          onChoose={handleChoose}
          onUnsure={handleUnsure}
        />
      ) : inSession && currentWord && phase === "question" && quizKind === "recall" ? (
        <ReviewRecallQuestion
          word={currentWord.word}
          imageUrl={currentWord.image_url}
          searchKeyword={currentWord.search_keyword}
          wordType={currentWord.word_type}
          meaning={currentWord.vietnamese_meaning}
          sentence={pickReviewRecallSentence(
            currentWord.word,
            currentWord.examples,
            currentWord.vietnamese_meaning,
            currentWord.word_type,
          )}
          locked={locked}
          remembered={
            selectedKey === "remember"
              ? true
              : selectedKey === "lookup"
                ? false
                : null
          }
          onLookUp={handleLookUp}
          onRemember={handleRemember}
        />
      ) : inSession && currentWord && phase === "question" ? (
        <ReviewQuestion
          word={currentWord.word}
          imageUrl={currentWord.image_url}
          searchKeyword={currentWord.search_keyword}
          wordType={currentWord.word_type}
          meaning={currentWord.vietnamese_meaning}
          clue={
            reviewClue(currentWord) === "Choose the matching word."
              ? t("review.chooseMatching")
              : reviewClue(currentWord)
          }
          choices={choices}
          selectedKey={selectedKey}
          unsure={unsure}
          correctWord={currentWord.word}
          locked={locked}
          onChoose={handleChoose}
          onUnsure={handleUnsure}
        />
      ) : inSession && currentWord && phase === "reveal" ? (
        <ReviewReveal
          word={currentWord}
          correct={correct}
          timesReviewed={timesReviewed}
          intervalDays={intervalDays}
          markMastered={markMastered}
          onIntervalChange={setIntervalDays}
          onMarkMasteredChange={setMarkMastered}
          onConfirm={() => {
            void confirmReview();
          }}
          confirming={confirming}
        />
      ) : (
        <div className="page-scroll px-4">
          <div className="mx-auto flex max-w-sm flex-col items-center pt-6 text-center">
            <JungleMascot character={allCaughtUp ? "monkey" : "crocodile"} size={88} />
            <h2 className="mt-3 text-xl font-bold text-foreground">
              {syncMismatch
                ? t("review.syncMismatch")
                : allCaughtUp
                  ? t("review.allCaughtUp")
                  : t("review.noWordsDue")}
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              {syncMismatch
                ? t("review.syncMismatchHint", { count: dueCount })
                : allCaughtUp
                  ? t("review.comeBackLater")
                  : t("review.learnOnHome")}
            </p>
            {syncMismatch ? (
              <button
                type="button"
                onClick={() => {
                  sessionStartedRef.current = false;
                  void reload();
                }}
                className="mt-4 rounded-xl bg-primary px-5 py-3 text-base font-semibold text-white shadow-sm"
              >
                {t("review.retryLoad")}
              </button>
            ) : null}
          </div>

          <form onSubmit={handleAddWord} className="mt-6 flex gap-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder={t("review.addWordPlaceholder")}
              className="flex-1 rounded-xl border border-primary-200 bg-surface px-4 py-3 text-base text-foreground shadow-sm placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={adding || !newWord.trim()}
              className="rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white shadow-sm transition active:bg-primary-hover disabled:opacity-50"
            >
              {adding ? "..." : t("review.add")}
            </button>
          </form>

          {displayError ? (
            <p className="mt-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
              {displayError}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
