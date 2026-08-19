"use client";

import { Flashcard } from "@/components/flashcard/Flashcard";
import { AppNav } from "@/components/layout/AppNav";
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

const STATUS_LABELS: Record<LearningStatus, string> = {
  new: "Mới",
  learning: "Đang học",
  need_review: "Cần ôn",
  mastered: "Đã thuộc",
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

  const fetchWords = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ sort: sortBy });
      if (filterStatus !== "all") params.set("status", filterStatus);

      const res = await fetch(`/api/words?${params}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details ?? data.error ?? "Không thể tải danh sách từ");
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
        err instanceof Error ? err.message : "Không thể tải danh sách từ vựng",
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
        throw new Error(data.details ?? data.error ?? "Không thể thêm từ");
      }

      setNewWord("");
      await fetchWords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setAdding(false);
    }
  }

  async function updateStatus(status: LearningStatus) {
    if (!currentWord) return;

    setUpdating(true);
    setError(null);
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
          "Đã lưu tạm trên máy. Chạy supabase/user-learning-anon.sql để lưu lên Supabase.",
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
      setError(err instanceof Error ? err.message : "Lỗi không xác định");
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
    <main className="min-h-screen bg-background">
      <header className="border-b border-primary-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground">English Vocab</h1>
              <p className="text-sm text-foreground/60">WordUp-style flashcards</p>
            </div>
            <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center">
              <AppNav active="learn" />
              <div className="text-right text-sm text-foreground/60">
                <p>{words.length} từ · {studyQueue.length} cần học</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-6">
        <form onSubmit={handleAddWord} className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            placeholder="Thêm từ mới — Gemini sẽ phân tích độ phổ biến"
            className="flex-1 rounded-xl border border-primary-200 bg-white px-4 py-3 text-foreground shadow-sm placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            disabled={adding || !newWord.trim()}
            className="rounded-xl bg-primary px-5 py-3 font-medium text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-50"
          >
            {adding ? "..." : "Thêm"}
          </button>
        </form>

        <div className="mt-4 flex flex-wrap gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-foreground shadow-sm"
          >
            <option value="importance">Sắp xếp: Độ quan trọng</option>
            <option value="alphabetical">Sắp xếp: A → Z</option>
            <option value="recent">Sắp xếp: Gần đây</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as FilterOption)}
            className="rounded-lg border border-primary-200 bg-white px-3 py-2 text-sm text-foreground shadow-sm"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="new">Mới</option>
            <option value="need_review">Cần ôn lại</option>
            <option value="learning">Đang học</option>
            <option value="mastered">Đã thuộc</option>
          </select>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
            {error}
          </p>
        )}

        {loading ? (
          <div className="mt-12 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-100 border-t-primary" />
          </div>
        ) : words.length === 0 ? (
          <p className="mt-12 text-center text-foreground/60">
            Chưa có từ vựng. Hãy thêm từ đầu tiên!
          </p>
        ) : (
          <div className="mt-8">
            <div className="mb-4 flex items-center justify-between text-sm text-foreground/60">
              <span>
                Thẻ {currentIndex + 1} / {words.length}
              </span>
              {currentWord && (
                <span className="rounded-full bg-primary-50 px-3 py-1 text-primary-800 shadow-sm">
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

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm disabled:opacity-40"
              >
                ← Trước
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={currentIndex >= words.length - 1}
                className="rounded-xl border border-primary-200 bg-white px-4 py-2 text-sm font-medium text-foreground/80 shadow-sm disabled:opacity-40"
              >
                Sau →
              </button>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={updating || !currentWord}
                onClick={() => updateStatus("need_review")}
                className="rounded-xl border-2 border-primary-200 bg-primary-50 py-3.5 font-semibold text-primary-800 transition hover:bg-primary-100 disabled:opacity-50"
              >
                Cần ôn lại
              </button>
              <button
                type="button"
                disabled={updating || !currentWord}
                onClick={() => updateStatus("mastered")}
                className="rounded-xl bg-primary py-3.5 font-semibold text-white shadow-sm transition hover:bg-primary-hover disabled:opacity-50"
              >
                Đã thuộc
              </button>
            </div>

            <div className="mt-8">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/50">
                Danh sách theo độ quan trọng
              </h2>
              <ul className="space-y-2">
                {words.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => goTo(index)}
                      className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                        index === currentIndex
                          ? "border-primary bg-primary-50 shadow-sm"
                          : "border-primary-100 bg-white hover:border-primary-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-foreground">
                          {capitalizeFirst(item.word)}
                        </span>
                        <span className="text-xs text-foreground/50">
                          #{item.rank.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-primary-700">
                          ⭐ {item.importance_tier}
                        </span>
                        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-800">
                          {STATUS_LABELS[item.learning_status]}
                        </span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
