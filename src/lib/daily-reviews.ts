import { localDateKey } from "@/lib/local-date";

const STORAGE_KEY = "vocab-daily-reviews-v1";

type DailyReviewsState = {
  date: string;
  count: number;
};

function readState(): DailyReviewsState {
  if (typeof window === "undefined") {
    return { date: localDateKey(), count: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: localDateKey(), count: 0 };
    const parsed = JSON.parse(raw) as DailyReviewsState;
    if (parsed.date !== localDateKey()) return { date: localDateKey(), count: 0 };
    return parsed;
  } catch {
    return { date: localDateKey(), count: 0 };
  }
}

function writeState(state: DailyReviewsState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("daily-reviews-changed", { detail: state }));
}

/** Reviews completed today (any recall or mastered confirmation). */
export function getTodayReviewsCompleted(): number {
  return readState().count;
}

let cachedTodayReviews = -1;

function todayReviewsSnapshot(): number {
  const next = getTodayReviewsCompleted();
  if (next === cachedTodayReviews) return cachedTodayReviews;
  cachedTodayReviews = next;
  return next;
}

export function subscribeTodayReviewsCompleted(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const refresh = () => {
    cachedTodayReviews = -1;
    onStoreChange();
  };
  window.addEventListener("daily-reviews-changed", refresh);
  window.addEventListener("focus", refresh);
  return () => {
    window.removeEventListener("daily-reviews-changed", refresh);
    window.removeEventListener("focus", refresh);
  };
}

export function getTodayReviewsCompletedSnapshot(): number {
  return todayReviewsSnapshot();
}

export function incrementTodayReviewsCompleted(): number {
  if (typeof window === "undefined") return 0;
  const next = { date: localDateKey(), count: readState().count + 1 };
  writeState(next);
  return next.count;
}
