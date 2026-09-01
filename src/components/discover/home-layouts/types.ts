import type { GoalType } from "@/lib/app-settings";

export type HomeLayoutVariant = "1" | "2" | "3" | "4" | "5";

export const HOME_LAYOUT_VARIANTS: readonly HomeLayoutVariant[] = [
  "1",
  "2",
  "3",
  "4",
  "5",
] as const;

export type HomeLayoutProps = {
  variant?: HomeLayoutVariant;
  /** Gallery preview — shows layout number badge */
  preview?: boolean;
  rangeLabel: string;
  queueLength: number;
  rankProgress: number;
  dueReviewCount: number;
  wordsKnown: number;
  wordsReviewing: number;
  streakDays: number;
  goalType: GoalType;
  goalCurrent: number;
  goalTarget: number;
  todayWordsLearned: number;
  onStartJourney: () => void;
  onStartReview: () => void;
  onOpenLibrary: () => void;
};
