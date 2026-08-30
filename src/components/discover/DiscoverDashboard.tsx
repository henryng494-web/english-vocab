"use client";

import { JungleMascot, JungleCastPill } from "@/components/mascot/JungleMascot";
import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";

type DiscoverDashboardProps = {
  rangeLabel: string;
  queueLength: number;
  currentIndex: number;
  dueReviewCount: number;
  wordsKnown: number;
  wordsReviewing: number;
  streakDays: number;
  todayStudySeconds: number;
  todayGoalMinutes: number;
  todayWordsLearned: number;
  sessionInProgress?: boolean;
  onStartToday: () => void;
  onStartJourney: () => void;
  onStartReview: () => void;
  onOpenLibrary: () => void;
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

function ProgressBar({
  value,
  max,
  colorClass = "bg-primary",
}: {
  value: number;
  max: number;
  colorClass?: string;
}) {
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
  dueReviewCount,
  wordsKnown,
  wordsReviewing,
  streakDays,
  todayStudySeconds,
  todayGoalMinutes,
  todayWordsLearned,
  onStartToday,
  onStartJourney,
  onStartReview,
  onOpenLibrary,
}: DiscoverDashboardProps) {
  const { t } = useI18n();
  const rankProgress =
    queueLength > 0 ? Math.round((currentIndex / queueLength) * 100) : 0;
  const todayStudyMinutes = Math.floor(todayStudySeconds / 60);
  const minutesLeft = Math.max(0, todayGoalMinutes - todayStudyMinutes);
  const canStartToday = dueReviewCount > 0 || queueLength > 0;

  const todaySummary =
    dueReviewCount > 0
      ? t("home.todayDueGoal", { due: dueReviewCount, minutes: minutesLeft })
      : minutesLeft > 0
        ? t("home.todayGoalLeft", {
            minutes: minutesLeft,
            learned: todayWordsLearned,
          })
        : t("home.todayGoalDone", { learned: todayWordsLearned });

  const primaryCta = canStartToday ? t("home.startSession") : t("home.doneToday");

  return (
    <div className="home-scroll page-scroll">
      <div className="home-content px-4">
        <section className="home-card home-today border-primary-200 bg-primary-50/30">
          <div className="home-today__head">
            <div>
              <div className="mb-2">
                <JungleCastPill size={22} />
              </div>
              <h2 className={`home-section-title ${displayFontClass}`}>{t("home.today")}</h2>
              <p className="home-body-text mt-1">{todaySummary}</p>
            </div>
            <JungleMascot character="tiger" size={72} title="Jungle Jokers Tiger" />
          </div>

          <ProgressBar
            value={todayStudyMinutes}
            max={todayGoalMinutes}
            colorClass="bg-accent"
          />
          <p className="home-body-text mt-2 text-sm text-foreground/60">
            {t("home.minutesProgress", {
              current: todayStudyMinutes,
              goal: todayGoalMinutes,
            })}
          </p>

          <button
            type="button"
            onClick={onStartToday}
            disabled={!canStartToday}
            className="btn-pill-primary mt-4 w-full"
          >
            {primaryCta} →
          </button>
        </section>

        <section>
          <div className="home-section-header">
            <h3 className="home-section-label">{t("home.flows")}</h3>
          </div>
          <div className="home-flow-grid">
            <button
              type="button"
              onClick={onStartJourney}
              disabled={queueLength === 0}
              className="home-card home-flow-card border-primary-200 bg-primary-50/40 hover:bg-primary-50 transition text-left"
            >
              <span className="home-stat-icon text-primary" aria-hidden>
                📖
              </span>
              <p className="home-flow-card__title">{t("home.flowNew")}</p>
              <p className="home-flow-card__meta">{rangeLabel}</p>
              <p className="home-flow-card__detail">
                {t("home.flowNewLeft", { count: queueLength })}
              </p>
              <ProgressBar value={rankProgress} max={100} colorClass="bg-primary" />
            </button>

            <button
              type="button"
              onClick={onStartReview}
              className="home-card home-flow-card border-secondary-200 bg-secondary-50/40 hover:bg-secondary-50 transition text-left"
            >
              <span className="home-stat-icon text-secondary" aria-hidden>
                🔁
              </span>
              <p className="home-flow-card__title">{t("home.flowReview")}</p>
              <p className="home-flow-card__meta">
                {dueReviewCount > 0
                  ? t("home.flowReviewDue", { count: dueReviewCount })
                  : t("home.flowReviewNone")}
              </p>
              <p className="home-flow-card__detail">{t("home.flowReviewDetail")}</p>
            </button>

            <button
              type="button"
              onClick={onOpenLibrary}
              className="home-card home-flow-card border-pink-200 bg-pink-50/40 hover:bg-pink-50 transition text-left"
            >
              <span className="home-stat-icon text-pink-600" aria-hidden>
                📚
              </span>
              <p className="home-flow-card__title">{t("home.flowLibrary")}</p>
              <p className="home-flow-card__meta">
                {t("home.flowLibraryKnown", { count: wordsKnown })}
              </p>
              <p className="home-flow-card__detail">
                {t("home.flowLibraryReview", { count: wordsReviewing })}
              </p>
            </button>
          </div>
        </section>

        <section>
          <div className="home-section-header">
            <h3 className="home-section-label">{t("home.progress")}</h3>
          </div>
          <div className="home-stat-grid">
            <div className="home-card home-stat-card border-accent-200 bg-accent-50/50">
              <span className="home-stat-icon text-xl" aria-hidden>
                ⭐
              </span>
              <p className="home-stat-label text-accent-800">{t("home.known")}</p>
              <p className={`home-stat-value text-accent-700 ${displayFontClass}`}>
                {wordsKnown}
              </p>
            </div>

            <div className="home-card home-stat-card border-pink-200 bg-pink-50/50">
              <span className="home-stat-icon text-xl" aria-hidden>
                🔁
              </span>
              <p className="home-stat-label text-pink-700">{t("home.reviewing")}</p>
              <p className={`home-stat-value text-pink-600 ${displayFontClass}`}>
                {wordsReviewing}
              </p>
            </div>

            <div className="home-card home-stat-card border-secondary-200 bg-secondary-50/50">
              <span className="home-stat-icon text-xl" aria-hidden>
                🔥
              </span>
              <p className="home-stat-label text-secondary-800">{t("home.streak")}</p>
              <p className={`home-stat-value text-secondary-700 ${displayFontClass}`}>
                {t("home.streakDays", { count: streakDays })}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
