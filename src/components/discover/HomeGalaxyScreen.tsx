"use client";

import { WELCOME_SPLASH_ART } from "@/data/jungle-cast-brand";
import { displayFontClass } from "@/lib/fonts";
import type { GoalType } from "@/lib/app-settings";
import {
  countWeeklyMetDays,
  getWeeklyStreakDays,
  subscribeWeeklyStreak,
  type WeekDayStatus,
} from "@/lib/weekly-streak";
import { useI18n } from "@/hooks/use-i18n";
import { useSyncExternalStore } from "react";

export type HomeGalaxyScreenProps = {
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

function StatRing({
  value,
  max,
  label,
  sublabel,
}: {
  value: number;
  max: number;
  label: string;
  sublabel: string;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const dash = `${pct} 100`;
  return (
    <div className="home-galaxy-stat">
      <div className="home-galaxy-stat__ring" aria-hidden>
        <svg viewBox="0 0 36 36">
          <path
            className="home-galaxy-stat__track"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="home-galaxy-stat__fill"
            strokeDasharray={dash}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="home-galaxy-stat__value">{label}</span>
      </div>
      <p className="home-galaxy-stat__label">{sublabel}</p>
    </div>
  );
}

function WeekDayCell({
  day,
  weekdayLabel,
  metIndex,
}: {
  day: WeekDayStatus;
  weekdayLabel: string;
  metIndex: number;
}) {
  const stateClass = day.met
    ? "is-met"
    : day.isToday
      ? "is-today"
      : day.isFuture
        ? "is-future"
        : "is-missed";

  const bubbleLabel = day.met
    ? `+${metIndex}`
    : day.isToday
      ? "★"
      : day.isFuture
        ? "+"
        : "·";

  return (
    <div className={`home-galaxy-weekday ${stateClass}`}>
      <div className="home-galaxy-weekday__bubble">
        {day.met ? <span className="home-galaxy-weekday__check" aria-hidden>✓</span> : null}
        <span className="home-galaxy-weekday__points">{bubbleLabel}</span>
      </div>
      <span className="home-galaxy-weekday__name">{weekdayLabel}</span>
      <span className="home-galaxy-weekday__date">{day.shortLabel}</span>
    </div>
  );
}

export function HomeGalaxyScreen(props: HomeGalaxyScreenProps) {
  const { t, goalTypeLabel } = useI18n();
  const weekDays = useSyncExternalStore(subscribeWeeklyStreak, getWeeklyStreakDays, () => []);
  const weeklyMet = useSyncExternalStore(subscribeWeeklyStreak, countWeeklyMetDays, () => 0);

  const goalStatLabel =
    props.goalType === "new_words"
      ? t("home.galaxyGoalWords", { current: props.goalCurrent, goal: props.goalTarget })
      : props.goalType === "reviews"
        ? t("home.galaxyGoalReviews", { current: props.goalCurrent, goal: props.goalTarget })
        : t("home.galaxyGoalMinutes", { current: props.goalCurrent, goal: props.goalTarget });

  const weekdayLabels: Record<WeekDayStatus["weekdayKey"], string> = {
    mon: t("home.weekMon"),
    tue: t("home.weekTue"),
    wed: t("home.weekWed"),
    thu: t("home.weekThu"),
    fri: t("home.weekFri"),
    sat: t("home.weekSat"),
    sun: t("home.weekSun"),
  };

  return (
    <div className="home-galaxy">
      <header
        className="home-galaxy__hero"
        style={{ backgroundImage: `url(${WELCOME_SPLASH_ART.path})` }}
      >
        <div className="home-galaxy__hero-overlay" />
        <p className={`home-galaxy__hero-text ${displayFontClass}`}>{t("home.galaxyHero")}</p>
      </header>

      <div className="home-galaxy__sheet">
        <section className="home-galaxy__progress">
          <p className="home-galaxy__progress-msg">
            {t("home.galaxyProgressMsg", { band: props.rangeLabel })}
          </p>
          <div className="home-galaxy__stats">
            <StatRing
              value={props.goalCurrent}
              max={props.goalTarget}
              label={`${props.goalCurrent}/${props.goalTarget}`}
              sublabel={goalTypeLabel(props.goalType)}
            />
            <StatRing
              value={props.wordsKnown}
              max={Math.max(props.wordsKnown, 100)}
              label={props.wordsKnown.toLocaleString()}
              sublabel={t("home.masteredShort")}
            />
          </div>
        </section>

        <section className="home-galaxy__week">
          <div className="home-galaxy__week-head">
            <p className="home-galaxy__week-title">
              {t("home.galaxyWeekTitle", { count: weeklyMet })}
            </p>
            <button type="button" className="home-galaxy__week-link" onClick={props.onStartReview}>
              {props.dueReviewCount > 0
                ? t("home.nextReview", { count: props.dueReviewCount })
                : t("home.flowReview")}
            </button>
          </div>
          <div className="home-galaxy__week-row">
            {(() => {
              let metCounter = 0;
              return weekDays.map((day) => {
                const metIndex = day.met ? ++metCounter : 0;
                return (
                  <WeekDayCell
                    key={day.dateKey}
                    day={day}
                    weekdayLabel={weekdayLabels[day.weekdayKey]}
                    metIndex={metIndex}
                  />
                );
              });
            })()}
          </div>
        </section>

        <section className="home-galaxy__lesson">
          <p className="home-galaxy__lesson-kicker">{t("home.bannerTitle")}</p>
          <h2 className={`home-galaxy__lesson-title ${displayFontClass}`}>
            {t("home.galaxyLessonTitle")}
          </h2>
          <div className="home-galaxy__lesson-meta">
            <div>
              <span className="home-galaxy__lesson-meta-label">{t("home.galaxyMetaLeft")}</span>
              <span className="home-galaxy__lesson-meta-value">
                {t("home.flowNewLeft", { count: props.queueLength })}
              </span>
            </div>
            <div>
              <span className="home-galaxy__lesson-meta-label">{t("home.galaxyMetaBand")}</span>
              <span className="home-galaxy__lesson-meta-value">{props.rangeLabel}</span>
            </div>
            <div>
              <span className="home-galaxy__lesson-meta-label">{t("home.galaxyMetaToday")}</span>
              <span className="home-galaxy__lesson-meta-value">{props.todayWordsLearned}</span>
            </div>
          </div>
          <button
            type="button"
            className="home-galaxy__lesson-cta"
            disabled={props.queueLength === 0}
            onClick={props.onStartJourney}
          >
            {t("home.bannerCta")}
          </button>
          <button type="button" className="home-galaxy__library-link" onClick={props.onOpenLibrary}>
            {t("home.flowLibrary")} · {t("home.flowLibraryKnown", { count: props.wordsKnown })}
          </button>
        </section>
      </div>
    </div>
  );
}
