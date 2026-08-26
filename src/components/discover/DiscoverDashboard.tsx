"use client";

import { JungleMascot, JungleCastPill } from "@/components/mascot/JungleMascot";
import { displayFontClass } from "@/lib/fonts";

type DiscoverDashboardProps = {
  rangeLabel: string;
  queueLength: number;
  currentIndex: number;
  wordsKnown: number;
  wordsReviewing: number;
  streakDays: number;
  todayLearned: number;
  todayGoal: number;
  onStartLearning: () => void;
  onOpenKnown: () => void;
  onOpenReview: () => void;
};

export function CoinBadge({ value }: { value: number }) {
  return (
    <span className="coin-badge">
      <span className="coin-badge__icon" aria-hidden>
        🪙
      </span>
      {value}
    </span>
  );
}

function ProgressBar({ value, max, colorClass = "bg-primary" }: { value: number; max: number; colorClass?: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="ui-progress">
      <div className={`ui-progress__fill ${colorClass}`} style={{ width: `${pct}%` }} />
    </div>
  );
}

export function DiscoverDashboard({
  rangeLabel,
  queueLength,
  currentIndex,
  wordsKnown,
  wordsReviewing,
  streakDays,
  todayLearned,
  todayGoal,
  onStartLearning,
  onOpenKnown,
  onOpenReview,
}: DiscoverDashboardProps) {
  const rankProgress =
    queueLength > 0
      ? Math.round((currentIndex / queueLength) * 100)
      : 0;

  return (
    <div className="home-scroll page-scroll">
      <div className="home-content px-4">
        {/* Welcome Card — 4 Jokers theme */}
        <section className="home-card home-welcome">
          <div className="home-welcome__text">
            <div className="mb-2">
              <JungleCastPill size={24} />
            </div>
            <h2 className={`home-section-title ${displayFontClass}`}>
              Hi there! Ready to learn today?
            </h2>
            <p className="home-body-text mt-1">
              Khám phá từ vựng tiếng Anh vui nhộn cùng Jungle Jokers!
            </p>
            <button
              type="button"
              onClick={onStartLearning}
              disabled={queueLength === 0}
              className="btn-pill-primary mt-4 w-full"
            >
              Start Learning →
            </button>
          </div>
          <div className="home-welcome__mascot shrink-0">
            <JungleMascot
              character="tiger"
              size={96}
              title="Jungle Jokers Tiger"
            />
          </div>
        </section>

        {/* Today's Goal — Crocodile Lime Accent */}
        <section>
          <div className="home-section-header">
            <h3 className="home-section-label">Today&apos;s Goal</h3>
            <span className="home-link-text text-accent-700 font-bold">{todayLearned} / {todayGoal}</span>
          </div>
          <div className="home-card home-card--compact border-accent-200 bg-accent-50/40">
            <div className="flex items-center gap-3">
              <span className="home-stat-icon text-accent" aria-hidden>
                🎯
              </span>
              <div className="min-w-0 flex-1">
                <p className="home-card-title">Learn {todayGoal} new words</p>
                <ProgressBar value={todayLearned} max={todayGoal} colorClass="bg-accent" />
              </div>
            </div>
          </div>
        </section>

        {/* 4-Color Balanced Progress Grid */}
        <section>
          <div className="home-section-header">
            <h3 className="home-section-label">Your Progress</h3>
          </div>
          <div className="home-stat-grid">
            {/* 1. You Know -> Crocodile Lime */}
            <button
              type="button"
              onClick={onOpenKnown}
              className="home-card home-stat-card home-stat-card--link border-accent-200 bg-accent-50/50 hover:bg-accent-100/60 transition"
            >
              <span className="home-stat-icon text-xl" aria-hidden>
                ⭐
              </span>
              <p className="home-stat-label text-accent-800">You know</p>
              <p className={`home-stat-value text-accent-700 ${displayFontClass}`}>{wordsKnown}</p>
            </button>

            {/* 2. In Review -> Elephant Pink */}
            <button
              type="button"
              onClick={onOpenReview}
              className="home-card home-stat-card home-stat-card--link border-pink-200 bg-pink-50/50 hover:bg-pink-100/60 transition"
            >
              <span className="home-stat-icon text-xl" aria-hidden>
                🔁
              </span>
              <p className="home-stat-label text-pink-700">In review</p>
              <p className={`home-stat-value text-pink-600 ${displayFontClass}`}>{wordsReviewing}</p>
            </button>

            {/* 3. Streak -> Tiger Orange */}
            <div className="home-card home-stat-card border-secondary-200 bg-secondary-50/50">
              <span className="home-stat-icon text-xl" aria-hidden>
                🔥
              </span>
              <p className="home-stat-label text-secondary-800">Streak</p>
              <p className={`home-stat-value text-secondary-700 ${displayFontClass}`}>{streakDays} days</p>
            </div>
          </div>
        </section>

        {/* Continue Learning -> Monkey Violet */}
        <section>
          <div className="home-section-header">
            <h3 className="home-section-label">Continue Learning</h3>
          </div>
          <button
            type="button"
            onClick={onStartLearning}
            disabled={queueLength === 0}
            className="home-card home-continue w-full text-left border-primary-200 bg-primary-50/40 hover:bg-primary-50 transition"
          >
            <span className="home-stat-icon text-primary" aria-hidden>
              📖
            </span>
            <div className="min-w-0 flex-1">
              <p className="home-card-title">{rangeLabel}</p>
              <p className="home-body-text">{queueLength} words left</p>
              <ProgressBar value={rankProgress} max={100} colorClass="bg-primary" />
            </div>
            <span className="home-continue__chev text-primary" aria-hidden>
              ›
            </span>
          </button>
        </section>
      </div>
    </div>
  );
}
