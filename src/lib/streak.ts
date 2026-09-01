import { isDailyGoalMet } from "@/lib/goal-progress";
import { markWeeklyGoalMetToday } from "@/lib/weekly-streak";

const STORAGE_KEY = "vocab-streak-v1";

export type StreakState = {
  currentStreak: number;
  /** Last calendar day (YYYY-MM-DD) the daily goal was met. */
  lastGoalMetDate: string | null;
  longestStreak: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayKey(): string {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function readState(): StreakState {
  if (typeof window === "undefined") {
    return { currentStreak: 0, lastGoalMetDate: null, longestStreak: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { currentStreak: 0, lastGoalMetDate: null, longestStreak: 0 };
    }
    const parsed = JSON.parse(raw) as Partial<StreakState>;
    return {
      currentStreak:
        typeof parsed.currentStreak === "number" && parsed.currentStreak >= 0
          ? parsed.currentStreak
          : 0,
      lastGoalMetDate:
        typeof parsed.lastGoalMetDate === "string" ? parsed.lastGoalMetDate : null,
      longestStreak:
        typeof parsed.longestStreak === "number" && parsed.longestStreak >= 0
          ? parsed.longestStreak
          : 0,
    };
  } catch {
    return { currentStreak: 0, lastGoalMetDate: null, longestStreak: 0 };
  }
}

function writeState(state: StreakState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  window.dispatchEvent(new CustomEvent("streak-changed", { detail: state }));
}

/** Read-only streak for React snapshots — never writes during render. */
export function getCurrentStreak(): number {
  const state = readState();
  const today = todayKey();
  const yesterday = yesterdayKey();

  if (state.lastGoalMetDate === today) {
    return state.currentStreak;
  }
  if (state.lastGoalMetDate === yesterday) {
    return state.currentStreak;
  }
  return 0;
}

/** Persist streak when daily goal progress changes (call from write paths only). */
export function syncStreak(): number {
  const state = readState();
  const today = todayKey();
  const yesterday = yesterdayKey();
  const goalMet = isDailyGoalMet();

  if (goalMet) {
    if (state.lastGoalMetDate === today) {
      markWeeklyGoalMetToday();
      return state.currentStreak;
    }
    const nextStreak =
      state.lastGoalMetDate === yesterday ? state.currentStreak + 1 : 1;
    const next: StreakState = {
      currentStreak: nextStreak,
      lastGoalMetDate: today,
      longestStreak: Math.max(state.longestStreak, nextStreak),
    };
    writeState(next);
    markWeeklyGoalMetToday();
    return nextStreak;
  }

  if (state.lastGoalMetDate === today) {
    return state.currentStreak;
  }
  if (state.lastGoalMetDate === yesterday) {
    return state.currentStreak;
  }
  return 0;
}

export function subscribeStreak(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const refresh = () => onStoreChange();
  window.addEventListener("streak-changed", refresh);
  window.addEventListener("study-time-changed", refresh);
  window.addEventListener("daily-reviews-changed", refresh);
  window.addEventListener("daily-words-changed", refresh);
  window.addEventListener("app-settings-changed", refresh);
  window.addEventListener("focus", refresh);
  return () => {
    window.removeEventListener("streak-changed", refresh);
    window.removeEventListener("study-time-changed", refresh);
    window.removeEventListener("daily-reviews-changed", refresh);
    window.removeEventListener("daily-words-changed", refresh);
    window.removeEventListener("app-settings-changed", refresh);
    window.removeEventListener("focus", refresh);
  };
}
