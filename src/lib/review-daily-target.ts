import { readAppSettings } from "@/lib/app-settings";
import { getDailyReviewPlan } from "@/lib/daily-goal";
import { localDateKey } from "@/lib/local-date";
import { readTodayCompletedReviewWords } from "@/lib/review-session-storage";

const STORAGE_KEY = "english-vocab-review-daily-word-target-v1";

type DailyWordTargetState = {
  date: string;
  target: number;
};

function readState(): DailyWordTargetState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DailyWordTargetState;
    if (!parsed || parsed.date !== localDateKey() || !Number.isFinite(parsed.target)) {
      return null;
    }
    return { date: parsed.date, target: Math.max(0, Math.round(parsed.target)) };
  } catch {
    return null;
  }
}

function writeState(state: DailyWordTargetState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Today's review word target — min(words due today, daily rep plan).
 * Grows if new words become due later the same day; never shrinks intraday.
 */
export function getTodayReviewWordTarget(dueRemaining: number): number {
  const today = localDateKey();
  const plan = getDailyReviewPlan(readAppSettings());
  const completedUnique = readTodayCompletedReviewWords().length;
  const candidate = Math.min(Math.max(0, dueRemaining) + completedUnique, plan);

  const stored = readState();
  if (!stored || stored.date !== today) {
    writeState({ date: today, target: candidate });
    return candidate;
  }

  const target = Math.max(stored.target, candidate);
  if (target !== stored.target) {
    writeState({ date: today, target });
  }
  return target;
}
