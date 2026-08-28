"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { ReviewQuestion } from "@/components/review/ReviewQuestion";
import { ReviewRecallQuestion } from "@/components/review/ReviewRecallQuestion";
import { ReviewReveal } from "@/components/review/ReviewReveal";
import { ReviewSenseQuestion } from "@/components/review/ReviewSenseQuestion";
import { JungleMascot } from "@/components/mascot/JungleMascot";
import {
  writeLocalLearning,
} from "@/lib/learning-storage";
import {
  buildReviewQuestionPlan,
  pickReviewRecallSentence,
  reviewClue,
  type ReviewChoice,
  type ReviewQuizKind,
} from "@/lib/review-quiz";
import {
  collectReviewQuestionImageTargets,
  prefetchReviewImages,
  prefetchReviewQuestionRange,
  preloadReviewImageBatch,
} from "@/lib/review-image-preload";
import { useAppBootstrap } from "@/context/AppBootstrapContext";
import {
  fetchReviewWords,
  buildDueReviewQueue,
  prepareReviewSession,
} from "@/lib/review-fetch";
import { hasQualityExamples } from "@/lib/example-quality";
import { parseExamples } from "@/lib/parse-examples";
import {
  advanceReviewInterval,
  getReviewSchedule,
  writeReviewSchedule,
  type ReviewIntervalDays,
} from "@/lib/review-schedule";
import { shouldRefreshImageUrl } from "@/lib/unsplash";
import { refreshAllStaleWordImages } from "@/lib/refresh-stale-word-images";
import type { LearningStatus, VocabWord } from "@/types/database";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "question" | "reveal";

const REVEAL_DELAY_MS = 850;
const REVIEW_PREFETCH_AHEAD = 6;
const REVIEW_WARM_COUNT = 20;

function mergeQueueWordData(
  queue: VocabWord[],
  fresh: VocabWord[],
): VocabWord[] {
  const byWord = new Map(
    fresh.map((item) => [item.word.trim().toLowerCase(), item]),
  );
  return queue.map((item) => byWord.get(item.word.trim().toLowerCase()) ?? item);
}

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

export default function LearnPage() {
  const { review: bootstrapReview, updateReviewCache } = useAppBootstrap();
  const [allWords, setAllWords] = useState<VocabWord[]>([]);
  const [queue, setQueue] = useState<VocabWord[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [choices, setChoices] = useState<ReviewChoice[]>([]);
  const [quizKind, setQuizKind] = useState<ReviewQuizKind>("word");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [unsure, setUnsure] = useState(false);
  const [locked, setLocked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [intervalDays, setIntervalDays] = useState<ReviewIntervalDays>(1);
  const [timesReviewed, setTimesReviewed] = useState(0);
  const [loading, setLoading] = useState(!bootstrapReview);
  const [confirming, setConfirming] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionDone, setSessionDone] = useState(false);
  const hydratedRef = useRef(false);
  const revealDelayRef = useRef(REVEAL_DELAY_MS);
  const phaseRef = useRef<Phase>("question");
  const lockedRef = useRef(false);
  const indexRef = useRef(0);
  const queueRef = useRef<VocabWord[]>([]);
  const allWordsRef = useRef<VocabWord[]>([]);
  const prefetchedChoicesRef = useRef<Map<number, ReviewChoice[]>>(new Map());
  const prefetchInflightRef = useRef<Map<number, Promise<void>>>(new Map());

  const currentWord = queue[index];
  phaseRef.current = phase;
  lockedRef.current = locked;
  indexRef.current = index;
  queueRef.current = queue;
  allWordsRef.current = allWords;

  const mergePrefetchedSenseChoices = useCallback(
    (senseChoices: Map<number, ReviewChoice[]>) => {
      for (const [questionIndex, cachedChoices] of senseChoices.entries()) {
        prefetchedChoicesRef.current.set(questionIndex, cachedChoices);
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
        if (plan.kind === "sense" && plan.choices.length === 3) {
          prefetchedChoicesRef.current.set(questionIndex, plan.choices);
        }

        preloadReviewImageBatch(plan.targets);
        const updates = await prefetchReviewImages(plan.targets);
        applyImageUpdatesToState(updates, setAllWords, setQueue, setChoices);

        if (plan.kind === "sense" && Object.keys(updates).length > 0) {
          const cached =
            prefetchedChoicesRef.current.get(questionIndex) ?? plan.choices;
          prefetchedChoicesRef.current.set(
            questionIndex,
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
    const cachedSenseChoices = prefetchedChoicesRef.current.get(questionIndex);
    const planned = buildReviewQuestionPlan(word, pool, questionIndex);
    let kind = planned.kind;
    let nextChoices = planned.choices;

    if (cachedSenseChoices && planned.kind === "sense") {
      kind = "sense";
      nextChoices = cachedSenseChoices;
      prefetchedChoicesRef.current.delete(questionIndex);
    }

    setPhase("question");
    setQuizKind(kind);
    setChoices(nextChoices);
    setSelectedKey(null);
    setUnsure(false);
    setLocked(false);
    setCorrect(false);
    setIntervalDays(schedule.intervalDays);
    setTimesReviewed(schedule.timesReviewed);

    const { targets } = collectReviewQuestionImageTargets(word, pool, questionIndex);
    if (cachedSenseChoices) {
      preloadReviewImageBatch(
        cachedSenseChoices.map((choice) => ({
          word: choice.word,
          imageUrl: choice.imageUrl,
          searchKeyword: choice.searchKeyword,
          wordType: choice.wordType,
        })),
      );
    } else {
      preloadReviewImageBatch(targets);
      void prefetchReviewImages(targets).then((updates) => {
        applyImageUpdatesToState(updates, setAllWords, setQueue, setChoices);
        if (kind === "sense" && Object.keys(updates).length > 0) {
          setChoices((prev) =>
            prev.map((choice) => {
              const key = choice.word.trim().toLowerCase();
              return updates[key] ? { ...choice, imageUrl: updates[key] } : choice;
            }),
          );
        }
      });
    }

    prefetchQuestionsAhead(questionIndex);
  }, [prefetchQuestionsAhead]);

  const applyReviewSession = useCallback(
    (fetched: VocabWord[], due: VocabWord[], startFirst = true) => {
      setAllWords(fetched);
      setQueue(due);
      setIndex(0);
      setSessionDone(false);
      warmReviewImages(due, fetched);
      if (startFirst && due[0]) startQuestion(due[0], fetched, 0);

      void refreshAllStaleWordImages(
        fetched.map((word) => ({
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
    [startQuestion, warmReviewImages],
  );

  const fetchWords = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setLoading(true);
      }
      setError(null);
      try {
        const all = await fetchReviewWords();
        const due = buildDueReviewQueue(all);
        updateReviewCache({ allWords: all, dueQueue: due });
        if (options?.silent) {
          setAllWords(all);
          setQueue((prev) => {
            if (prev.length === 0) return due;
            return mergeQueueWordData(prev, due);
          });
          void prepareReviewSession(all);
          return;
        }
        applyReviewSession(all, due, true);
      } catch (err) {
        if (!options?.silent) {
          setError(err instanceof Error ? err.message : "Failed to load vocabulary");
        }
      } finally {
        if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    [applyReviewSession, updateReviewCache],
  );

  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    if (bootstrapReview) {
      applyReviewSession(
        bootstrapReview.allWords,
        bootstrapReview.dueQueue,
        true,
      );
      setLoading(false);
      void fetchWords({ silent: true });
    } else {
      void fetchWords();
    }
  }, [applyReviewSession, bootstrapReview, fetchWords]);

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
    if (!currentWord) return;
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
      !pickReviewRecallSentence(currentWord.word, currentWord.examples);
    const badExamples = !hasQualityExamples(
      currentWord.word,
      parseExamples(currentWord.examples),
      currentWord.word_type,
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
    setLocked(true);
    setCorrect(isCorrect);
    setSelectedKey(key);
    setUnsure(wasUnsure);
    setIntervalDays(
      isCorrect ? advanceReviewInterval(schedule.intervalDays) : schedule.intervalDays,
    );
    setTimesReviewed(
      isCorrect ? schedule.timesReviewed + 1 : schedule.timesReviewed,
    );
    revealDelayRef.current = immediate ? 0 : REVEAL_DELAY_MS;
    if (immediate) {
      setPhase("reveal");
    }
  }

  function handleChoose(choice: ReviewChoice) {
    const isCorrect =
      choice.word.trim().toLowerCase() === currentWord?.word.trim().toLowerCase();
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
      await fetchWords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setAdding(false);
    }
  }

  async function confirmReview() {
    if (!currentWord || confirming) return;
    setConfirming(true);
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

    const nextIndex = index + 1;
    setConfirming(false);
    if (nextIndex >= queue.length) {
      setSessionDone(true);
      setQueue([]);
      setIndex(0);
      return;
    }
    setIndex(nextIndex);
    startQuestion(queue[nextIndex], allWords, nextIndex);
  }

  const inSession = Boolean(currentWord) && !sessionDone;

  return (
    <div className={`app-screen${inSession ? " app-screen--journey" : " app-screen--home"}`}>
      <AppHeader
        title={inSession ? `Review ${index + 1}/${queue.length}` : "Review"}
      />

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
        </div>
      ) : inSession && currentWord && phase === "question" && quizKind === "sense" ? (
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
          clue={reviewClue(currentWord)}
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
          onIntervalChange={setIntervalDays}
          onConfirm={() => {
            void confirmReview();
          }}
          confirming={confirming}
        />
      ) : (
        <div className="page-scroll px-4">
          <div className="mx-auto flex max-w-sm flex-col items-center pt-6 text-center">
            <JungleMascot character={sessionDone ? "monkey" : "crocodile"} size={88} />
            <h2 className="mt-3 text-xl font-bold text-foreground">
              {sessionDone ? "You're all caught up!" : "No words due"}
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              {sessionDone
                ? "Come back when the next review interval is due, or add a new word."
                : "Learn words on Home or add one below to start reviewing."}
            </p>
          </div>

          <form onSubmit={handleAddWord} className="mt-6 flex gap-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              placeholder="Add a new word..."
              className="flex-1 rounded-xl border border-primary-200 bg-surface px-4 py-3 text-base text-foreground shadow-sm placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={adding || !newWord.trim()}
              className="rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white shadow-sm transition active:bg-primary-hover disabled:opacity-50"
            >
              {adding ? "..." : "Add"}
            </button>
          </form>

          {error ? (
            <p className="mt-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
              {error}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
