"use client";

import { CoachDog } from "@/components/mascot/CoachDog";
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
};

function CoinBadge({ value }: { value: number }) {
  return (
    <span className="coin-badge">
      <span className="coin-badge__icon" aria-hidden>
        🪙
      </span>
      {value}
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="ui-progress">
      <div className="ui-progress__fill" style={{ width: `${pct}%` }} />
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
}: DiscoverDashboardProps) {
  const rankProgress =
    queueLength > 0
      ? Math.round((currentIndex / queueLength) * 100)
      : 0;

  return (
    <div className="home-scroll page-scroll">
      <div className="home-content px-4">
        <section className="home-card home-welcome">
          <div className="home-welcome__text">
            <h2 className={`home-section-title ${displayFontClass}`}>
              Hi there! Ready to learn today?
            </h2>
            <p className="home-body-text mt-1">
              Let&apos;s grow your vocabulary together with Coach Fox!
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
          <CoachDog
            pose="wave"
            size={108}
            className="home-welcome__dog"
            title="Coach Fox"
          />
        </section>

        <section>
          <div className="home-section-header">
            <h3 className="home-section-label">Today&apos;s Goal</h3>
            <span className="home-link-text">{todayLearned} / {todayGoal}</span>
          </div>
          <div className="home-card home-card--compact">
            <div className="flex items-center gap-3">
              <span className="home-stat-icon" aria-hidden>
                🎯
              </span>
              <div className="min-w-0 flex-1">
                <p className="home-card-title">Learn {todayGoal} new words</p>
                <ProgressBar value={todayLearned} max={todayGoal} />
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="home-section-header">
            <h3 className="home-section-label">Your Progress</h3>
          </div>
          <div className="home-stat-grid">
            <div className="home-card home-stat-card">
              <span className="home-stat-icon text-xl" aria-hidden>
                🌟
              </span>
              <p className="home-stat-label">You know</p>
              <p className={`home-stat-value ${displayFontClass}`}>{wordsKnown}</p>
            </div>
            <div className="home-card home-stat-card">
              <span className="home-stat-icon text-xl" aria-hidden>
                🔁
              </span>
              <p className="home-stat-label">In review</p>
              <p className={`home-stat-value ${displayFontClass}`}>{wordsReviewing}</p>
            </div>
            <div className="home-card home-stat-card">
              <span className="home-stat-icon text-xl" aria-hidden>
                🏆
              </span>
              <p className="home-stat-label">Streak</p>
              <p className={`home-stat-value ${displayFontClass}`}>{streakDays} days</p>
            </div>
          </div>
        </section>

        <section>
          <div className="home-section-header">
            <h3 className="home-section-label">Continue Learning</h3>
          </div>
          <button
            type="button"
            onClick={onStartLearning}
            disabled={queueLength === 0}
            className="home-card home-continue w-full text-left"
          >
            <span className="home-stat-icon" aria-hidden>
              📄
            </span>
            <div className="min-w-0 flex-1">
              <p className="home-card-title">{rangeLabel}</p>
              <p className="home-body-text">{queueLength} words left</p>
              <ProgressBar value={rankProgress} max={100} />
            </div>
            <span className="home-continue__chev" aria-hidden>
              ›
            </span>
          </button>
        </section>
      </div>
    </div>
  );
}

export { CoinBadge };
