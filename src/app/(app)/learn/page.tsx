"use client";

import { AppHeader } from "@/components/layout/AppHeader";
import { ReviewQuestion } from "@/components/review/ReviewQuestion";
import { ReviewReveal } from "@/components/review/ReviewReveal";
import { CoachDog } from "@/components/mascot/CoachDog";
import {
  mergeLocalLearning,
  writeLocalLearning,
} from "@/lib/learning-storage";
import { buildReviewChoices, reviewClue, type ReviewChoice } from "@/lib/review-quiz";
import {
  advanceReviewInterval,
  getReviewSchedule,
  isReviewDue,
  writeReviewSchedule,
  type ReviewIntervalDays,
} from "@/lib/review-schedule";
import { getImportanceTier } from "@/lib/word-rank";
import type { LearningStatus, VocabWord } from "@/types/database";
import { useCallback, useEffect, useRef, useState } from "react";

type Phase = "question" | "reveal";

export default function LearnPage() {
  const [allWords, setAllWords] = useState<VocabWord[]>([]);
  const [queue, setQueue] = useState<VocabWord[]>([]);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("question");
  const [choices, setChoices] = useState<ReviewChoice[]>([]);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [unsure, setUnsure] = useState(false);
  const [locked, setLocked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [intervalDays, setIntervalDays] = useState<ReviewIntervalDays>(1);
  const [timesReviewed, setTimesReviewed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionDone, setSessionDone] = useState(false);
  const resultTimer = useRef<number | null>(null);

  const currentWord = queue[index];

  const startQuestion = useCallback((word: VocabWord, pool: VocabWord[]) => {
    if (resultTimer.current) {
      window.clearTimeout(resultTimer.current);
      resultTimer.current = null;
    }
    const schedule = getReviewSchedule(word.word);
    setPhase("question");
    setChoices(buildReviewChoices(word.word, pool.map((item) => item.word)));
    setSelectedKey(null);
    setUnsure(false);
    setLocked(false);
    setCorrect(false);
    setIntervalDays(schedule.intervalDays);
    setTimesReviewed(schedule.timesReviewed);
  }, []);

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSessionDone(false);
    try {
      const res = await fetch("/api/words?sort=recent");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to load word list");
      }
      const fetched = mergeLocalLearning(
        ((data.words ?? []) as VocabWord[]).map((word) => ({
          ...word,
          importance_tier: word.importance_tier ?? getImportanceTier(word.rank),
        })),
      );
      const due = fetched.filter(
        (word) => word.learning_status !== "mastered" && isReviewDue(word.word),
      );
      setAllWords(fetched);
      setQueue(due);
      setIndex(0);
      if (due[0]) startQuestion(due[0], fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load vocabulary");
    } finally {
      setLoading(false);
    }
  }, [startQuestion]);

  useEffect(() => {
    void fetchWords();
    return () => {
      if (resultTimer.current) window.clearTimeout(resultTimer.current);
    };
  }, [fetchWords]);

  useEffect(() => {
    if (!currentWord) return;
    const missingImage = !currentWord.image_url?.trim();
    const badVi =
      currentWord.vietnamese_meaning?.trim() &&
      currentWord.english_definition?.trim() &&
      currentWord.vietnamese_meaning.trim().toLowerCase() ===
        currentWord.english_definition.trim().toLowerCase();
    if (!missingImage && !badVi) return;

    let cancelled = false;
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
  ]);

  function lockAnswer(isCorrect: boolean, key: string | null, wasUnsure: boolean) {
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
    resultTimer.current = window.setTimeout(() => {
      setPhase("reveal");
    }, 850);
  }

  function handleChoose(choice: ReviewChoice) {
    const isCorrect =
      choice.word.trim().toLowerCase() === currentWord?.word.trim().toLowerCase();
    lockAnswer(isCorrect, choice.key, false);
  }

  function handleUnsure() {
    lockAnswer(false, null, true);
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
    startQuestion(queue[nextIndex], allWords);
  }

  const inSession = Boolean(currentWord) && !sessionDone;

  return (
    <div className={`app-screen${inSession ? " app-screen--journey" : " app-screen--home"}`}>
      <AppHeader
        title={inSession ? `Review ${index + 1}/${queue.length}` : "Review"}
        peekFox
        foxPose="think"
      />

      {loading ? (
        <div className="flex flex-1 items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
        </div>
      ) : inSession && currentWord && phase === "question" ? (
        <ReviewQuestion
          word={currentWord.word}
          imageUrl={currentWord.image_url}
          wordType={currentWord.word_type}
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
            <CoachDog pose={sessionDone ? "happy" : "think"} size={88} />
            <h2 className="mt-3 text-xl font-bold text-foreground">
              {sessionDone ? "You're all caught up" : "No words due"}
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
