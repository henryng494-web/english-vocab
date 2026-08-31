import { mergeLocalLearning } from "@/lib/learning-storage";
import { prefetchReviewQuestionRange } from "@/lib/review-image-preload";
import { isDueReviewWord } from "@/lib/review-schedule";
import {
  applyReviewSessionSnapshot,
  readReviewSessionSnapshot,
} from "@/lib/review-session-storage";
import { getImportanceTier } from "@/lib/word-rank";
import type { VocabWord } from "@/types/database";

export type ReviewSessionData = {
  allWords: VocabWord[];
  dueQueue: VocabWord[];
};

export async function fetchReviewWords(): Promise<VocabWord[]> {
  const res = await fetch("/api/words?sort=recent", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.details ?? data.error ?? "Failed to load word list");
  }
  return mergeLocalLearning(
    ((data.words ?? []) as VocabWord[]).map((word) => ({
      ...word,
      importance_tier: word.importance_tier ?? getImportanceTier(word.rank),
    })),
  );
}

export function buildDueReviewQueue(allWords: VocabWord[]): VocabWord[] {
  const due = allWords.filter((word) =>
    isDueReviewWord(
      word.word,
      word.learning_status,
      word.last_reviewed_at,
    ),
  );
  return applyReviewSessionSnapshot(due, readReviewSessionSnapshot());
}

export function countActionableDueReviews(allWords: VocabWord[]): number {
  return buildDueReviewQueue(allWords).length;
}

export async function prepareReviewSession(
  allWords: VocabWord[],
): Promise<ReviewSessionData> {
  const dueQueue = buildDueReviewQueue(allWords);
  void prefetchReviewQuestionRange(dueQueue, allWords, 0, 20);
  return { allWords, dueQueue };
}

export async function loadReviewSession(): Promise<ReviewSessionData> {
  const allWords = await fetchReviewWords();
  return prepareReviewSession(allWords);
}
