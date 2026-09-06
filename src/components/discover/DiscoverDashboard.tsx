"use client";

import type { GoalType } from "@/lib/app-settings";
import { HomeGalaxyScreen } from "@/components/discover/HomeGalaxyScreen";

type DiscoverDashboardProps = {
  rangeLabel: string;
  queueLength: number;
  currentIndex: number;
  bandTotalWords: number;
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

export function StreakBadge({ days }: { days: number }) {
  if (days <= 0) return null;
  return (
    <span className="streak-badge" aria-label={`${days} day streak`}>
      <span className="streak-badge__flame" aria-hidden>🔥</span>
      <span className="streak-badge__count">{days}</span>
    </span>
  );
}

export function CoinBadge({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <span className="coin-badge" title={label} aria-label={label}>
      <span className="coin-badge__icon" aria-hidden>🪙</span>
      {value.toLocaleString()}
    </span>
  );
}

export function DiscoverDashboard({
  currentIndex,
  queueLength,
  ...props
}: DiscoverDashboardProps) {
  const rankProgress =
    queueLength > 0 ? Math.round((currentIndex / queueLength) * 100) : 0;

  return (
    <div className="home-scroll home-scroll--galaxy">
      <HomeGalaxyScreen {...props} queueLength={queueLength} rankProgress={rankProgress} />
    </div>
  );
}
