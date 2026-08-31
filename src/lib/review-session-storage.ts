import type { ReviewIntervalDays } from "@/lib/review-schedule";

const STORAGE_KEY = "english-vocab-review-session-v1";

export type ReviewSessionInProgress = {
  word: string;
  correct: boolean;
  intervalDays: ReviewIntervalDays;
  timesReviewed: number;
  markMastered: boolean;
};

export type ReviewSessionSnapshot = {
  /** Local calendar date YYYY-MM-DD */
  date: string;
  /** Words fully confirmed today (lower-case). */
  completedWords: string[];
  /** Remaining queue order after last confirm (lower-case). */
  queueWords: string[];
  /** Resume reveal step if user answered but did not confirm. */
  inProgress: ReviewSessionInProgress | null;
};

export function localReviewDateKey(now = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function readReviewSessionSnapshot(): ReviewSessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReviewSessionSnapshot;
    if (!parsed || parsed.date !== localReviewDateKey()) return null;
    if (!Array.isArray(parsed.completedWords) || !Array.isArray(parsed.queueWords)) {
      return null;
    }
    return {
      date: parsed.date,
      completedWords: parsed.completedWords.map((w) => w.trim().toLowerCase()),
      queueWords: parsed.queueWords.map((w) => w.trim().toLowerCase()),
      inProgress: parsed.inProgress ?? null,
    };
  } catch {
    return null;
  }
}

export function writeReviewSessionSnapshot(snapshot: ReviewSessionSnapshot): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...snapshot,
      completedWords: snapshot.completedWords.map((w) => w.trim().toLowerCase()),
      queueWords: snapshot.queueWords.map((w) => w.trim().toLowerCase()),
    }),
  );
  window.dispatchEvent(new Event("vocab-learning-changed"));
}

export function clearReviewSessionSnapshot(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("vocab-learning-changed"));
}

/** Build today's queue: drop completed words, keep saved order, append newly due. */
export function applyReviewSessionSnapshot<T extends { word: string }>(
  dueQueue: T[],
  snapshot: ReviewSessionSnapshot | null,
): T[] {
  if (!snapshot || snapshot.date !== localReviewDateKey()) {
    return dueQueue;
  }

  const completed = new Set(snapshot.completedWords);
  const dueByKey = new Map(
    dueQueue.map((item) => [item.word.trim().toLowerCase(), item]),
  );

  const ordered: T[] = [];
  const seen = new Set<string>();

  for (const key of snapshot.queueWords) {
    if (completed.has(key) || seen.has(key)) continue;
    const item = dueByKey.get(key);
    if (item) {
      ordered.push(item);
      seen.add(key);
    }
  }

  for (const item of dueQueue) {
    const key = item.word.trim().toLowerCase();
    if (completed.has(key) || seen.has(key)) continue;
    ordered.push(item);
    seen.add(key);
  }

  return ordered;
}

export function markReviewSessionCompleted(
  word: string,
  remainingQueue: { word: string }[],
): void {
  const today = localReviewDateKey();
  const key = word.trim().toLowerCase();
  const prev = readReviewSessionSnapshot();
  const completed = new Set(
    prev?.date === today ? prev.completedWords : [],
  );
  completed.add(key);

  writeReviewSessionSnapshot({
    date: today,
    completedWords: [...completed],
    queueWords: remainingQueue.map((item) => item.word.trim().toLowerCase()),
    inProgress: null,
  });
}

export function saveReviewSessionInProgress(
  inProgress: ReviewSessionInProgress,
  queue: { word: string }[],
): void {
  const today = localReviewDateKey();
  const prev = readReviewSessionSnapshot();
  const completed = prev?.date === today ? prev.completedWords : [];

  writeReviewSessionSnapshot({
    date: today,
    completedWords: completed,
    queueWords: queue.map((item) => item.word.trim().toLowerCase()),
    inProgress,
  });
}

export function clearReviewSessionInProgress(): void {
  const prev = readReviewSessionSnapshot();
  if (!prev) return;
  writeReviewSessionSnapshot({ ...prev, inProgress: null });
}
