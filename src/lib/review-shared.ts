import type { ReviewQuizKind } from "@/lib/review-quiz";

/** Standard SRS dropdown milestones (days). */
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const;

export type ReviewIntervalDays = (typeof REVIEW_INTERVALS)[number];

export type ReviewLastResult = "correct" | "unsure" | "wrong" | "lookup";

export type ReviewScheduleEntry = {
  intervalDays: ReviewIntervalDays;
  nextReviewAt: string;
  timesReviewed: number;
  srsLevel?: number;
  streakCorrect?: number;
  wrongStreak?: number;
  lastResult?: ReviewLastResult;
  lastQuizKind?: ReviewQuizKind;
  leechFlag?: boolean;
};

/** Max words queued for one review session batch. */
export const DAILY_REVIEW_SESSION_CAP = 50;
