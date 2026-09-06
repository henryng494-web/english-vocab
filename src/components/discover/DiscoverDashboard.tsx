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

export function CoinBadge({
  value,
  label,
  streakDays = 0,
}: {
  value: number;
  label: string;
  streakDays?: number;
}) {
  const hasStreak = streakDays > 0;
  return (
    <span
      className={`coin-badge${hasStreak ? " coin-badge--streak" : ""}`}
      title={label}
      aria-label={label}
    >
      {hasStreak ? (
        <span className="coin-badge__flame" aria-hidden>
          🔥
          <span className="coin-badge__flame-count">{streakDays}</span>
        </span>
      ) : null}
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
