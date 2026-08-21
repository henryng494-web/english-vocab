"use client";

import { Flashcard } from "@/components/flashcard/Flashcard";
import { AppHeader } from "@/components/layout/AppHeader";
import { CoachDog } from "@/components/mascot/CoachDog";
import { capitalizeFirst } from "@/lib/format-text";
import {
  mergeLocalLearning,
  writeLocalLearning,
} from "@/lib/learning-storage";
import { getImportanceTier } from "@/lib/word-rank";
import type { LearningStatus, VocabWord } from "@/types/database";
import { useCallback, useEffect, useMemo, useState } from "react";

type SortOption = "importance" | "alphabetical" | "recent";
type FilterOption = "all" | LearningStatus;
type ViewMode = "card" | "list";

const STATUS_LABELS: Record<LearningStatus, string> = {
  new: "New",
  learning: "Learning",
  need_review: "Needs review",
  mastered: "Mastered",
};

export default function LearnPage() {
  const [words, setWords] = useState<VocabWord[]>([]);
  const [newWord, setNewWord] = useState("");
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("importance");
  const [filterStatus, setFilterStatus] = useState<FilterOption>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("card");

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ sort: sortBy });
      if (filterStatus !== "all") params.set("status", filterStatus);

      const res = await fetch(`/api/words?${params}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Failed to load word list");
      }

      const wordsFromApi = (data.words ?? []) as VocabWord[];
      const fetched = mergeLocalLearning(
        wordsFromApi.map((w) => ({
          ...w,
          importance_tier: w.importance_tier ?? getImportanceTier(w.rank),
        })),
      );

      setWords(fetched);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load vocabulary",
      );
    } finally {
      setLoading(false);
    }
  }, [sortBy, filterStatus]);

  useEffect(() => {
    fetchWords();
  }, [fetchWords]);

  const currentWord = words[currentIndex];
  const studyQueue = useMemo(
    () =>
      words.filter(
        (w) => w.learning_status !== "mastered",
      ),
    [words],
  );

  /** Lazy enrich — image + Vietnamese for the visible flashcard only */
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
        setWords((prev) =>
          prev.map((w) =>
            w.word === currentWord.word
              ? {
                  ...w,
                  image_url: data.word.image_url ?? w.image_url,
                  vietnamese_meaning:
                    data.word.vietnamese_meaning ?? w.vietnamese_meaning,
                  english_definition:
                    data.word.english_definition ?? w.english_definition,
                  phonetic: data.word.phonetic ?? w.phonetic,
                  word_type: data.word.word_type ?? w.word_type,
                  examples: data.word.examples ?? w.examples,
                }
              : w,
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

  async function updateStatus(status: LearningStatus) {
    if (!currentWord) return;

    setUpdating(true);
    setError(null);
    writeLocalLearning(currentWord.word, status);
    try {
      const res = await fetch("/api/words/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word: currentWord.word, status }),
      });

      const data = await res.json();
      if (!res.ok) {
        writeLocalLearning(currentWord.word, status);
        setWords((prev) =>
          prev.map((w) =>
            w.word === currentWord.word
              ? {
                  ...w,
                  learning_status: status,
                  last_reviewed_at: new Date().toISOString(),
                }
              : w,
          ),
        );
        setIsFlipped(false);
        if (status === "mastered" || filterStatus !== "all") {
          await fetchWords();
        }
        if (currentIndex >= words.length - 1 && currentIndex > 0) {
          setCurrentIndex((i) => Math.max(0, i - 1));
        }
        setError(
          "Saved locally. Run supabase/user-learning-anon.sql to sync to Supabase.",
        );
        return;
      }

      setIsFlipped(false);

      if (status === "mastered" || filterStatus !== "all") {
        await fetchWords();
      } else {
        setWords((prev) =>
          prev.map((w) =>
            w.word === currentWord.word
              ? {
                  ...w,
                  learning_status: status,
                  last_reviewed_at: new Date().toISOString(),
                }
              : w,
          ),
        );
      }

      if (currentIndex >= words.length - 1 && currentIndex > 0) {
        setCurrentIndex((i) => Math.max(0, i - 1));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setUpdating(false);
    }
  }

  function goTo(index: number) {
    setCurrentIndex(index);
    setIsFlipped(false);
  }

  function goPrev() {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }

  function goNext() {
    if (currentIndex < words.length - 1) goTo(currentIndex + 1);
  }

  return (
    <div className="app-screen">
      <AppHeader
        title="Review"
        leading={<CoachDog pose="wink" size={32} />}
      />

      <div className="page-scroll px-4">
        <form onSubmit={handleAddWord} className="flex gap-2">
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
            className="rounded-xl bg-primary px-4 py-3 text-base font-semibold text-foreground shadow-sm transition active:bg-primary-hover disabled:opacity-50"
          >
            {adding ? "..." : "Add"}
          </button>
        </form>

        <div className="mt-3 mobile-segment">
          <button
            type="button"
            data-active={viewMode === "card"}
            onClick={() => setViewMode("card")}
          >
            Cards
          </button>
          <button
            type="button"
            data-active={viewMode === "list"}
            onClick={() => setViewMode("list")}
          >
            List
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="flex-1 rounded-lg border border-primary-200 bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm"
          >
            <option value="importance">Importance</option>
            <option value="alphabetical">A → Z</option>
            <option value="recent">Recent</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterOption)}
            className="flex-1 rounded-lg border border-primary-200 bg-surface px-3 py-2.5 text-sm text-foreground shadow-sm"
          >
            <option value="all">All</option>
            <option value="new">New</option>
            <option value="need_review">Needs review</option>
            <option value="learning">Learning</option>
            <option value="mastered">Mastered</option>
          </select>
        </div>

        {error && (
          <p className="mt-3 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
            {error}
          </p>
        )}

        {loading ? (
          <div className="mt-16 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
          </div>
        ) : words.length === 0 ? (
          <p className="mt-16 text-center text-sm text-foreground/60">
            No vocabulary yet. Add your first word!
          </p>
        ) : viewMode === "list" ? (
          <ul className="mt-4 space-y-2 pb-4">
            {words.map((item, index) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    goTo(index);
                    setViewMode("card");
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition active:scale-[0.99] ${
                    index === currentIndex
                      ? "border-primary bg-primary-50 shadow-sm"
                      : "border-primary-100 bg-surface"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-semibold text-foreground">
                      {capitalizeFirst(item.word)}
                    </span>
                    <span className="text-xs text-foreground/45">
                      #{item.rank.toLocaleString()}
                    </span>
                  </div>
                  <span className="shrink-0 rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-800">
                    {STATUS_LABELS[item.learning_status]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <div className="mt-4">
              <div className="mb-3 flex items-center justify-between text-sm font-medium text-foreground/55">
                <span>
                  Card {currentIndex + 1} / {words.length}
                </span>
                {currentWord && (
                  <span className="rounded-full bg-primary-50 px-3 py-1 text-primary-800">
                    {STATUS_LABELS[currentWord.learning_status]}
                  </span>
                )}
              </div>

              {currentWord && (
                <Flashcard
                  key={currentWord.word}
                  word={currentWord}
                  isFlipped={isFlipped}
                  onFlip={() => setIsFlipped((f) => !f)}
                />
              )}
            </div>

            <div className="card-actions">
              <div className="mb-2.5 flex gap-2">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  className="flex-1 rounded-lg border border-primary-200 bg-surface py-3 text-base font-medium text-foreground/80 disabled:opacity-40"
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={currentIndex >= words.length - 1}
                  className="flex-1 rounded-lg border border-primary-200 bg-surface py-3 text-base font-medium text-foreground/80 disabled:opacity-40"
                >
                  Next →
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  disabled={updating || !currentWord}
                  onClick={() => updateStatus("need_review")}
                  className="rounded-xl border-2 border-primary-200 bg-primary-50 py-4 text-base font-semibold text-primary-800 transition active:bg-primary-100 disabled:opacity-50"
                >
                  Needs review
                </button>
                <button
                  type="button"
                  disabled={updating || !currentWord}
                  onClick={() => updateStatus("mastered")}
                  className="rounded-xl bg-accent py-4 text-base font-semibold text-white shadow-sm transition active:bg-accent-hover disabled:opacity-50"
                >
                  Mastered
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
