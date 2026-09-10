import { getTodayReviewsCompleted } from "@/lib/daily-reviews";
import { countLearningWords } from "@/lib/learning-storage";
import { localDateKey } from "@/lib/local-date";
import { readAppSettings, type AppSettings } from "@/lib/app-settings";

const DAILY_GOAL_KEY = "vocab-journey-daily-goal-v1";

type DailyGoalState = {
  date: string;
  count: number;
};

function readState(): DailyGoalState {
  if (typeof window === "undefined") {
    return { date: localDateKey(), count: 0 };
  }
  try {
    const raw = localStorage.getItem(DAILY_GOAL_KEY);
    if (!raw) return { date: localDateKey(), count: 0 };
    const parsed = JSON.parse(raw) as DailyGoalState;
    if (parsed.date !== localDateKey()) return { date: localDateKey(), count: 0 };
    return parsed;
  } catch {
    return { date: localDateKey(), count: 0 };
  }
}

/** ~2 study minutes per new word — drives daily word quota. */
export function recommendedNewWordsForMinutes(minutes: number): number {
  return Math.max(0, Math.floor(minutes / 2));
}

/** Max new words per day — synced with study-minutes target (2 min per word). */
export function getMaxNewWordsPerDay(
  settings: AppSettings = readAppSettings(),
): number {
  return recommendedNewWordsForMinutes(settings.dailyGoalMinutes);
}

/**
 * Daily review rep target — 2 reps per study-minute goal (≈30s each).
 * Drives home ring denominator and review tab badge (remaining reps).
 */
export function getDailyReviewPlan(
  settings: AppSettings = readAppSettings(),
): number {
  return Math.max(1, settings.dailyGoalMinutes * 2);
}

export function getDailyReviewPlanRemaining(
  settings: AppSettings = readAppSettings(),
): number {
  return Math.max(0, getDailyReviewPlan(settings) - getTodayReviewsCompleted());
}

export function getDailyGoalTarget(): number {
  return getMaxNewWordsPerDay();
}

export function getTodayWordsLearned(): number {
  return readState().count;
}

export function isDailyNewWordQuotaReached(
  settings: AppSettings = readAppSettings(),
): boolean {
  return getTodayWordsLearned() >= getMaxNewWordsPerDay(settings);
}

export function canLearnNewWordToday(
  settings: AppSettings = readAppSettings(),
): boolean {
  return !isDailyNewWordQuotaReached(settings);
}

export function incrementTodayWordsLearned(): number {
  if (typeof window === "undefined") return 0;
  const next = { date: localDateKey(), count: readState().count + 1 };
  localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("daily-words-changed", { detail: next }));
  return next.count;
}

export function countWordsLearned(): number {
  return countLearningWords();
}
