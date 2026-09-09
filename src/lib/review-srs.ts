import type { ReviewQuizKind } from "@/lib/review-quiz";
import {
  REVIEW_INTERVALS,
  type ReviewIntervalDays,
  type ReviewScheduleEntry,
} from "@/lib/review-schedule";
import { getTodayReviewsCompleted } from "@/lib/daily-reviews";
import {
  canLearnNewWordToday,
  getMaxNewWordsPerDay,
} from "@/lib/daily-goal";
import { readAppSettings } from "@/lib/app-settings";

/** Internal SRS ladder — includes extra early 1-day and 5-day steps. */
export const SRS_LADDER = [1, 1, 3, 5, 7, 14, 30] as const;

export const MASTERED_MIN_STREAK = 3;
export const MASTERED_MIN_SRS_LEVEL = 4;

export const LEECH_WRONG_STREAK = 3;
export const IN_SESSION_REPEAT_GAP = 3;
export const DAILY_REVIEW_SESSION_CAP = 50;

export type ReviewGrade = "correct" | "unsure" | "wrong";
export type ReviewLastResult = ReviewGrade | "lookup";

export function gradeFromAnswer(
  isCorrect: boolean,
  wasUnsure: boolean,
  selectedKey: string | null,
): ReviewGrade {
  if (isCorrect && !wasUnsure && selectedKey !== "lookup") return "correct";
  if (isCorrect && (wasUnsure || selectedKey === "remember")) return "unsure";
  if (!isCorrect && (wasUnsure || selectedKey === "lookup")) return "unsure";
  return "wrong";
}

export function ladderDaysForLevel(level: number): number {
  const clamped = Math.max(0, Math.min(level, SRS_LADDER.length - 1));
  return SRS_LADDER[clamped] ?? 1;
}

export function srsLevelFromIntervalDays(
  intervalDays: number,
  timesReviewed = 0,
): number {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < SRS_LADDER.length; i++) {
    const dist = Math.abs(SRS_LADDER[i] - intervalDays);
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return Math.max(best, Math.min(timesReviewed, SRS_LADDER.length - 1));
}

export function dropdownIntervalFromLevel(level: number): ReviewIntervalDays {
  const days = ladderDaysForLevel(level);
  if (days <= 1) return 1;
  if (days <= 3) return 3;
  if (days <= 7) return 7;
  if (days <= 14) return 14;
  return 30;
}

export function normalizeScheduleEntry(
  entry: Partial<ReviewScheduleEntry> & {
    intervalDays: ReviewIntervalDays;
    nextReviewAt: string;
    timesReviewed: number;
  },
): ReviewScheduleEntry {
  const srsLevel =
    typeof entry.srsLevel === "number"
      ? Math.max(0, Math.min(entry.srsLevel, SRS_LADDER.length - 1))
      : srsLevelFromIntervalDays(entry.intervalDays, entry.timesReviewed);

  return {
    intervalDays: entry.intervalDays,
    nextReviewAt: entry.nextReviewAt,
    timesReviewed: entry.timesReviewed,
    srsLevel,
    streakCorrect: entry.streakCorrect ?? 0,
    wrongStreak: entry.wrongStreak ?? 0,
    lastResult: entry.lastResult,
    lastQuizKind: entry.lastQuizKind,
    leechFlag: entry.leechFlag ?? false,
  };
}

export function isLeechEntry(entry: ReviewScheduleEntry): boolean {
  return (
    entry.leechFlag === true ||
    (entry.wrongStreak ?? 0) >= LEECH_WRONG_STREAK
  );
}

export function canMarkWordMastered(entry: ReviewScheduleEntry): boolean {
  return (
    (entry.streakCorrect ?? 0) >= MASTERED_MIN_STREAK &&
    (entry.srsLevel ?? 0) >= MASTERED_MIN_SRS_LEVEL &&
    entry.lastResult === "correct" &&
    entry.lastQuizKind === "recall"
  );
}

export function applySrsGrade(
  entry: ReviewScheduleEntry,
  grade: ReviewGrade,
  quizKind: ReviewQuizKind | null,
): ReviewScheduleEntry {
  let level = entry.srsLevel ?? srsLevelFromIntervalDays(entry.intervalDays, entry.timesReviewed);
  let timesReviewed = entry.timesReviewed;
  let streakCorrect = entry.streakCorrect ?? 0;
  let wrongStreak = entry.wrongStreak ?? 0;

  if (grade === "correct") {
    timesReviewed += 1;
    streakCorrect += 1;
    wrongStreak = 0;
    level = Math.min(level + 1, SRS_LADDER.length - 1);
  } else if (grade === "unsure") {
    streakCorrect = 0;
    level = Math.max(0, level - 1);
  } else {
    streakCorrect = 0;
    wrongStreak += 1;
    const stepBack = quizKind === "recall" ? 2 : 1;
    if (wrongStreak >= 2) {
      level = 0;
    } else {
      level = Math.max(0, level - stepBack);
    }
  }

  const intervalDays = dropdownIntervalFromLevel(level);
  const leechFlag = wrongStreak >= LEECH_WRONG_STREAK;

  return normalizeScheduleEntry({
    ...entry,
    timesReviewed,
    srsLevel: level,
    streakCorrect,
    wrongStreak,
    leechFlag,
    lastResult: grade,
    lastQuizKind: quizKind ?? entry.lastQuizKind,
    intervalDays,
    nextReviewAt: entry.nextReviewAt,
  });
}

/** When user picks a dropdown interval manually, sync srs level to match. */
export function entryWithManualInterval(
  entry: ReviewScheduleEntry,
  intervalDays: ReviewIntervalDays,
): ReviewScheduleEntry {
  return normalizeScheduleEntry({
    ...entry,
    intervalDays,
    srsLevel: srsLevelFromIntervalDays(intervalDays, entry.timesReviewed),
  });
}

export function computeNextReviewAt(
  intervalDays: number,
  timesReviewed: number,
  now = new Date(),
): string {
  if (timesReviewed <= 2 && intervalDays <= 1) {
    const endTomorrow = new Date(now);
    endTomorrow.setDate(endTomorrow.getDate() + 1);
    endTomorrow.setHours(23, 59, 59, 999);
    return endTomorrow.toISOString();
  }

  const next = new Date(now.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  return next.toISOString();
}

export function progressBarFilledSegments(
  srsLevel: number,
  markMastered: boolean,
): number {
  if (markMastered) return REVIEW_INTERVALS.length;
  const dropdownLevel = dropdownIntervalFromLevel(srsLevel);
  const idx = REVIEW_INTERVALS.indexOf(dropdownLevel);
  return idx >= 0 ? idx + 1 : 1;
}

/** Soft cap: allow new words after completing enough reviews today. */
export function canLearnNewWordTodayWithReviewBonus(dueTotal: number): boolean {
  if (canLearnNewWordToday()) return true;
  const settings = readAppSettings();
  const maxNew = getMaxNewWordsPerDay(settings);
  const reviewsDone = getTodayReviewsCompleted();
  const reviewTarget = Math.min(
    dueTotal,
    Math.max(maxNew * 2, DAILY_REVIEW_SESSION_CAP / 2),
  );
  return reviewsDone >= reviewTarget;
}
