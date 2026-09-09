import { countLearningWords } from "@/lib/learning-storage";
import { readAppSettings, type AppSettings } from "@/lib/app-settings";

const DAILY_GOAL_KEY = "vocab-journey-daily-goal-v1";

type DailyGoalState = {
  date: string;
  count: number;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readState(): DailyGoalState {
  if (typeof window === "undefined") {
    return { date: todayKey(), count: 0 };
  }
  try {
    const raw = localStorage.getItem(DAILY_GOAL_KEY);
    if (!raw) return { date: todayKey(), count: 0 };
    const parsed = JSON.parse(raw) as DailyGoalState;
    if (parsed.date !== todayKey()) return { date: todayKey(), count: 0 };
    return parsed;
  } catch {
    return { date: todayKey(), count: 0 };
  }
}

/** Max new words per day — synced with study-minutes target (2 min per word). */
export function getMaxNewWordsPerDay(
  settings: AppSettings = readAppSettings(),
): number {
  return Math.floor(settings.dailyGoalMinutes / 2);
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
  const next = { date: todayKey(), count: readState().count + 1 };
  localStorage.setItem(DAILY_GOAL_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("daily-words-changed", { detail: next }));
  return next.count;
}

export function countWordsLearned(): number {
  return countLearningWords();
}
