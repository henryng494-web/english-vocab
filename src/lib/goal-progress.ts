import {
  readAppSettings,
  type AppSettings,
  type GoalType,
} from "@/lib/app-settings";
import { getTodayStudySeconds } from "@/lib/study-time";

export type GoalProgress = {
  goalType: GoalType;
  current: number;
  target: number;
  met: boolean;
};

export function getGoalTarget(settings: AppSettings = readAppSettings()): number {
  return settings.dailyGoalMinutes;
}

export function getGoalProgress(
  settings: AppSettings = readAppSettings(),
): GoalProgress {
  const target = getGoalTarget(settings);
  const current = Math.floor(getTodayStudySeconds() / 60);

  return {
    goalType: "minutes",
    current,
    target,
    met: target > 0 && current >= target,
  };
}

export function isDailyGoalMet(settings?: AppSettings): boolean {
  return getGoalProgress(settings).met;
}

let cachedGoalProgress: GoalProgress | null = null;

function goalProgressEqual(a: GoalProgress, b: GoalProgress): boolean {
  return (
    a.goalType === b.goalType &&
    a.current === b.current &&
    a.target === b.target &&
    a.met === b.met
  );
}

export function subscribeGoalProgress(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const refresh = () => {
    cachedGoalProgress = null;
    onStoreChange();
  };
  window.addEventListener("study-time-changed", refresh);
  window.addEventListener("daily-words-changed", refresh);
  window.addEventListener("daily-reviews-changed", refresh);
  window.addEventListener("app-settings-changed", refresh);
  window.addEventListener("focus", refresh);
  return () => {
    window.removeEventListener("study-time-changed", refresh);
    window.removeEventListener("daily-words-changed", refresh);
    window.removeEventListener("daily-reviews-changed", refresh);
    window.removeEventListener("app-settings-changed", refresh);
    window.removeEventListener("focus", refresh);
  };
}

/** Stable snapshot reference for useSyncExternalStore. */
export function getGoalProgressSnapshot(): GoalProgress {
  const next = getGoalProgress();
  if (cachedGoalProgress && goalProgressEqual(cachedGoalProgress, next)) {
    return cachedGoalProgress;
  }
  cachedGoalProgress = next;
  return next;
}
