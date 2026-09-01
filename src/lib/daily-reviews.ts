const STORAGE_KEY = "vocab-daily-reviews-v1";

type DailyReviewsState = {
  date: string;
  count: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readState(): DailyReviewsState {
  if (typeof window === "undefined") {
    return { date: todayKey(), count: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    const parsed = JSON.parse(raw) as DailyReviewsState;
    if (parsed.date !== todayKey()) return { date: todayKey(), count: 0 };
    return parsed;
  } catch {
    return { date: todayKey(), count: 0 };
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

export function incrementTodayReviewsCompleted(): number {
  if (typeof window === "undefined") return 0;
  const next = { date: todayKey(), count: readState().count + 1 };
  writeState(next);
  return next.count;
}
