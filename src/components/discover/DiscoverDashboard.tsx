"use client";

import { useI18n } from "@/hooks/use-i18n";
import type { GoalType } from "@/lib/app-settings";
import { displayFontClass } from "@/lib/fonts";

type DiscoverDashboardProps = {
  rangeLabel: string;
  queueLength: number;
  dueReviewCount: number;
  wordsKnown: number;
  streakDays: number;
  goalType: GoalType;
  goalCurrent: number;
  goalTarget: number;
  todayWordsLearned: number;
  sessionInProgress?: boolean;
  onStartToday: () => void;
  onStartJourney: () => void;
  onStartReview: () => void;
  onOpenLibrary: () => void;
};

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
  dueReviewCount,
  wordsKnown,
  streakDays,
  goalType,
  goalCurrent,
  goalTarget,
  todayWordsLearned,
  sessionInProgress = false,
  onStartToday,
  onStartJourney,
  onStartReview,
  onOpenLibrary,
}: DiscoverDashboardProps) {
  const { t } = useI18n();
  const goalMet = goalTarget > 0 && goalCurrent >= goalTarget;
  const canStartToday = dueReviewCount > 0 || queueLength > 0 || sessionInProgress;

  const progressLabel = (() => {
    if (goalType === "new_words") {
      return t("home.wordsProgress", { current: goalCurrent, goal: goalTarget });
    }
    if (goalType === "reviews") {
      return t("home.reviewsProgress", { current: goalCurrent, goal: goalTarget });
    }
    return t("home.minutesProgress", { current: goalCurrent, goal: goalTarget });
  })();

  const todayStatus = (() => {
    if (goalMet) {
      if (goalType === "reviews") {
        return t("home.todayGoalDoneReviews", { reviews: goalCurrent });
      }
      return t("home.todayGoalDoneWords", { learned: todayWordsLearned });
    }
    if (dueReviewCount > 0) {
      return t("home.todayStatusDue", {
        due: dueReviewCount,
        learned: todayWordsLearned,
      });
    }
    return t("home.todayStatusCalm", { learned: todayWordsLearned });
  })();

  const primaryCta = goalMet
    ? t("home.continueLearning")
    : canStartToday
      ? t("home.startSession")
      : t("home.doneToday");

  return (
    <div className="home-scroll page-scroll">
      <div className="home-content px-4">
        <div className="home-stats-bar">
          <div className="home-stats-bar__item">
            <span className="home-stats-bar__icon" aria-hidden>
              🔥
            </span>
            <span className="home-stats-bar__label">{t("home.streak")}</span>
            <span className={`home-stats-bar__value ${displayFontClass}`}>
              {t("home.streakDays", { count: streakDays })}
            </span>
          </div>
          <button
            type="button"
            className="home-stats-bar__item home-stats-bar__item--link"
            onClick={onOpenLibrary}
            title={t("home.coinBadge")}
            aria-label={t("home.coinBadge")}
          >
            <span className="home-stats-bar__icon" aria-hidden>
              🪙
            </span>
            <span className="home-stats-bar__label">{t("home.masteredShort")}</span>
            <span className={`home-stats-bar__value ${displayFontClass}`}>
              {wordsKnown.toLocaleString()}
            </span>
          </button>
        </div>

        <section className="home-card home-today home-today--compact border-primary-200 bg-primary-50/30">
          <h2 className={`home-section-title ${displayFontClass}`}>{t("home.today")}</h2>

          <ProgressBar
            value={goalCurrent}
            max={goalTarget}
            colorClass="bg-accent"
          />
          <p className="home-body-text mt-2 text-sm font-semibold text-foreground/80">
            {progressLabel}
          </p>
          <p className="home-body-text mt-1 text-sm text-foreground/60">{todayStatus}</p>

          <button
            type="button"
            onClick={onStartToday}
            disabled={!canStartToday && !goalMet}
            className="btn-pill-primary mt-4 w-full"
          >
            {primaryCta} →
          </button>
        </section>

        <section className="home-next">
          <h3 className="home-section-label">{t("home.next")}</h3>
          <div className="home-next-list">
            <button
              type="button"
              onClick={onStartReview}
              className="home-next-row border-secondary-200 bg-secondary-50/40 hover:bg-secondary-50 transition"
            >
              <span className="home-next-row__icon text-secondary" aria-hidden>
                🔁
              </span>
              <span className="home-next-row__copy">
                <span className="home-next-row__title">
                  {dueReviewCount > 0
                    ? t("home.nextReview", { count: dueReviewCount })
                    : t("home.flowReviewNone")}
                </span>
                <span className="home-next-row__meta">{t("home.flowReviewDetail")}</span>
              </span>
              <span className="home-next-row__chev" aria-hidden>
                →
              </span>
            </button>

            <button
              type="button"
              onClick={onStartJourney}
              disabled={queueLength === 0}
              className="home-next-row border-primary-200 bg-primary-50/40 hover:bg-primary-50 transition"
            >
              <span className="home-next-row__icon text-primary" aria-hidden>
                📖
              </span>
              <span className="home-next-row__copy">
                <span className="home-next-row__title">
                  {t("home.nextJourney", { count: queueLength })}
                </span>
                <span className="home-next-row__meta">{rangeLabel}</span>
              </span>
              <span className="home-next-row__chev" aria-hidden>
                →
              </span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
