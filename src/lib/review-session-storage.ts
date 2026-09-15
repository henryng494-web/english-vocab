import { localDateKey } from "@/lib/local-date";
import type { ReviewIntervalDays } from "@/lib/review-schedule";

/** @deprecated Use `localDateKey` from `@/lib/local-date`. */
export { localDateKey as localReviewDateKey };

const STORAGE_KEY = "english-vocab-review-session-v1";
const COMPLETED_TODAY_KEY = "english-vocab-review-completed-today-v1";

type CompletedTodayState = {
  date: string;
  words: string[];
};

export type ReviewSessionInProgress = {
  word: string;
  correct: boolean;
  intervalDays: ReviewIntervalDays;
  timesReviewed: number;
  markMastered: boolean;
  grade?: "correct" | "unsure" | "wrong";
  srsLevel?: number;
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

export function readReviewSessionSnapshot(): ReviewSessionSnapshot | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ReviewSessionSnapshot;
    if (!parsed || parsed.date !== localDateKey()) return null;
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

export function writeReviewSessionSnapshot(
  snapshot: ReviewSessionSnapshot,
  options?: { notify?: boolean },
): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...snapshot,
      completedWords: snapshot.completedWords.map((w) => w.trim().toLowerCase()),
      queueWords: snapshot.queueWords.map((w) => w.trim().toLowerCase()),
    }),
  );
  if (options?.notify !== false) {
    window.dispatchEvent(new Event("vocab-learning-changed"));
  }
}

function readCompletedTodayState(): CompletedTodayState {
  if (typeof window === "undefined") {
    return { date: localDateKey(), words: [] };
  }
  try {
    const raw = localStorage.getItem(COMPLETED_TODAY_KEY);
    if (!raw) return { date: localDateKey(), words: [] };
    const parsed = JSON.parse(raw) as CompletedTodayState;
    if (!parsed || parsed.date !== localDateKey() || !Array.isArray(parsed.words)) {
      return { date: localDateKey(), words: [] };
    }
    return {
      date: parsed.date,
      words: parsed.words.map((w) => w.trim().toLowerCase()).filter(Boolean),
    };
  } catch {
    return { date: localDateKey(), words: [] };
  }
}

/** Words confirmed in review today — survives session snapshot resets. */
export function readTodayCompletedReviewWords(): string[] {
  const snapshot = readReviewSessionSnapshot();
  const persisted = readCompletedTodayState().words;
  if (!snapshot?.date || snapshot.date !== localDateKey()) {
    return persisted;
  }
  return [...new Set([...persisted, ...snapshot.completedWords])];
}

function persistTodayCompletedReviewWord(word: string): void {
  if (typeof window === "undefined") return;
  const today = localDateKey();
  const key = word.trim().toLowerCase();
  if (!key) return;
  const words = new Set(readCompletedTodayState().words);
  words.add(key);
  localStorage.setItem(
    COMPLETED_TODAY_KEY,
    JSON.stringify({ date: today, words: [...words] }),
  );
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
  if (!snapshot || snapshot.date !== localDateKey()) {
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

/** Persist today's session queue for badge + resume (once per day until cleared). */
export function seedReviewSessionQueue(words: { word: string }[]): void {
  const today = localDateKey();
  const prev = readReviewSessionSnapshot();
  if (prev?.date === today && prev.queueWords.length > 0) {
    return;
  }
  writeReviewSessionSnapshot(
    {
      date: today,
      completedWords: prev?.date === today ? prev.completedWords : [],
      queueWords: words.map((item) => item.word.trim().toLowerCase()),
      inProgress: null,
    },
    { notify: true },
  );
}

export function markReviewSessionCompleted(
  word: string,
  remainingQueue: { word: string }[],
): void {
  const today = localDateKey();
  const key = word.trim().toLowerCase();
  const prev = readReviewSessionSnapshot();
  const completed = new Set(
    prev?.date === today ? prev.completedWords : [],
  );
  completed.add(key);

  persistTodayCompletedReviewWord(key);
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
  const today = localDateKey();
  const prev = readReviewSessionSnapshot();
  const completed = prev?.date === today ? prev.completedWords : [];

  const queueWords =
    prev?.date === today && prev.queueWords.length > 0
      ? prev.queueWords
      : queue.map((item) => item.word.trim().toLowerCase());

  writeReviewSessionSnapshot(
    {
      date: today,
      completedWords: completed,
      queueWords,
      inProgress,
    },
    { notify: false },
  );
}

export function clearReviewSessionInProgress(): void {
  const prev = readReviewSessionSnapshot();
  if (!prev) return;
  writeReviewSessionSnapshot({ ...prev, inProgress: null }, { notify: false });
}
