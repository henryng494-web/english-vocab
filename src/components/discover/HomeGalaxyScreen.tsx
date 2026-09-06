"use client";

import { displayFontClass } from "@/lib/fonts";
import type { GoalType } from "@/lib/app-settings";
import {
  EMPTY_WEEK_DAYS,
  getWeeklyMetCountSnapshot,
  getWeeklyStreakDaysSnapshot,
  subscribeWeeklyStreak,
  type WeekDayStatus,
} from "@/lib/weekly-streak";
import { useI18n } from "@/hooks/use-i18n";
import { useEffect, useState, useSyncExternalStore } from "react";

export type HomeGalaxyScreenProps = {
  rangeLabel: string;
  queueLength: number;
  rankProgress: number;
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

function StatRing({
  value,
  max,
  label,
  sublabel,
  variant = "goal",
  urgent = false,
}: {
  value: number;
  max: number;
  label: string;
  sublabel: string;
  variant?: "goal" | "due";
  urgent?: boolean;
}) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const dash = `${pct} 100`;
  const statClass =
    variant === "due"
      ? `home-galaxy-stat home-galaxy-stat--due${urgent ? " is-urgent" : ""}`
      : "home-galaxy-stat home-galaxy-stat--goal";

  return (
    <div className={statClass}>
      <div className="home-galaxy-stat__ring" aria-hidden>
        <svg viewBox="0 0 36 36">
          <path
            className="home-galaxy-stat__track"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={`home-galaxy-stat__fill home-galaxy-stat__fill--${variant}`}
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
}: {
  day: WeekDayStatus;
  weekdayLabel: string;
}) {
  const stateClass = day.met
    ? "is-met"
    : day.isToday
      ? "is-today"
      : day.isFuture
        ? "is-future"
        : "is-missed";

  const bubbleLabel = day.met ? null : day.isToday ? "★" : day.isFuture ? "+" : "·";

  return (
    <div className={`home-galaxy-weekday ${stateClass}`}>
      <div className="home-galaxy-weekday__bubble">
        {day.met ? (
          <span className="home-galaxy-weekday__flame" aria-hidden>🔥</span>
        ) : (
          <span className="home-galaxy-weekday__points">{bubbleLabel}</span>
        )}
        {day.met ? <span className="home-galaxy-weekday__check" aria-hidden>✓</span> : null}
      </div>
      <span className="home-galaxy-weekday__name">{weekdayLabel}</span>
      <span className="home-galaxy-weekday__date">{day.shortLabel}</span>
    </div>
  );
}

function WordsLeftProgressBar({ learned, total }: { learned: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((learned / total) * 100)) : 0;
  return (
    <div className="home-galaxy__words-progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div className="home-galaxy__words-progress-track">
        <div className="home-galaxy__words-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function HomeGalaxyScreen(props: HomeGalaxyScreenProps) {
  const { t, goalTypeLabel } = useI18n();
  const [greetingName, setGreetingName] = useState(() => t("home.greetingDefault"));

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vocab-learner-display-name")?.trim();
      if (stored) setGreetingName(stored);
    } catch {
      /* ignore */
    }
  }, [t]);
  const weekDays = useSyncExternalStore(
    subscribeWeeklyStreak,
    getWeeklyStreakDaysSnapshot,
    () => EMPTY_WEEK_DAYS,
  );
  const weeklyMet = useSyncExternalStore(
    subscribeWeeklyStreak,
    getWeeklyMetCountSnapshot,
    () => 0,
  );

  const weekdayLabels: Record<WeekDayStatus["weekdayKey"], string> = {
    mon: t("home.weekMon"),
    tue: t("home.weekTue"),
    wed: t("home.weekWed"),
    thu: t("home.weekThu"),
    fri: t("home.weekFri"),
    sat: t("home.weekSat"),
    sun: t("home.weekSun"),
  };

  const reviewRingMax =
    props.goalType === "reviews"
      ? Math.max(props.goalTarget, 1)
      : Math.max(props.dueReviewCount, 20);

  const bandTotal = Math.max(props.bandTotalWords, props.queueLength, 1);
  const wordsLearnedInBand = Math.max(0, bandTotal - props.queueLength);

  const weekTitle =
    weeklyMet > 0
      ? t("home.galaxyWeekTitle", { count: weeklyMet })
      : t("home.galaxyWeekTitleEmpty");

  return (
    <div className="home-galaxy">
      <div className="home-galaxy__sheet">
        <header className="home-galaxy__greeting">
          <p className={`home-galaxy__greeting-title ${displayFontClass}`}>
            {t("home.greeting", { name: greetingName })}
          </p>
          <p className="home-galaxy__greeting-sub">{t("home.greetingSub")}</p>
        </header>

        <section className="home-galaxy__progress home-galaxy-card home-galaxy-card--glass">
          <p className="home-galaxy__progress-msg">
            {t("home.galaxyProgressMsg", { band: props.rangeLabel })}
          </p>
          <div className="home-galaxy__stats">
            <StatRing
              value={props.goalCurrent}
              max={props.goalTarget}
              label={`${props.goalCurrent}/${props.goalTarget}`}
              sublabel={goalTypeLabel(props.goalType)}
              variant="goal"
            />
            <StatRing
              value={props.dueReviewCount}
              max={reviewRingMax}
              label={props.dueReviewCount.toLocaleString()}
              sublabel={t("home.dueReviewsShort")}
              variant="due"
              urgent={props.dueReviewCount > 0}
            />
          </div>
        </section>

        <section className="home-galaxy__week home-galaxy-card home-galaxy-card--glass">
          <div className="home-galaxy__week-head">
            <p className="home-galaxy__week-title">{weekTitle}</p>
            <button type="button" className="home-galaxy__week-link" onClick={props.onStartReview}>
              {props.dueReviewCount > 0
                ? t("home.nextReview", { count: props.dueReviewCount })
                : t("home.flowReview")}
            </button>
          </div>
          <div className="home-galaxy__week-row">
            {weekDays.map((day) => (
              <WeekDayCell
                key={day.dateKey}
                day={day}
                weekdayLabel={weekdayLabels[day.weekdayKey]}
              />
            ))}
          </div>
        </section>

        <section className="home-galaxy__lesson home-galaxy-card home-galaxy-card--featured home-galaxy-card--glass">
          <h2 className={`home-galaxy__lesson-title ${displayFontClass}`}>
            {t("home.bannerTitle")}
          </h2>
          <p className="home-galaxy__lesson-subtitle">
            {t("home.bannerSubtitle", {
              count: props.queueLength,
              range: props.rangeLabel,
            })}
          </p>
          <WordsLeftProgressBar learned={wordsLearnedInBand} total={bandTotal} />
          <div className="home-galaxy__lesson-meta">
            <div>
              <span className="home-galaxy__lesson-meta-label">{t("home.galaxyMetaToday")}</span>
              <span className="home-galaxy__lesson-meta-value">{props.todayWordsLearned}</span>
            </div>
            <div>
              <span className="home-galaxy__lesson-meta-label">{t("home.flowReview")}</span>
              <span className="home-galaxy__lesson-meta-value">
                {props.dueReviewCount > 0 ? props.dueReviewCount : "—"}
              </span>
            </div>
            <div>
              <span className="home-galaxy__lesson-meta-label">{t("home.masteredShort")}</span>
              <span className="home-galaxy__lesson-meta-value">
                {props.wordsKnown.toLocaleString()}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="home-galaxy__lesson-cta"
            disabled={props.queueLength === 0}
            onClick={props.onStartJourney}
          >
            <span>{t("home.bannerCta")}</span>
            <span className="home-galaxy__lesson-cta-icon" aria-hidden>⚡</span>
          </button>
        </section>

        <button
          type="button"
          className="home-galaxy__challenge"
          onClick={props.onStartReview}
        >
          <span className="home-galaxy__challenge-icon" aria-hidden>⚡</span>
          <span className="home-galaxy__challenge-copy">
            <span className="home-galaxy__challenge-title">{t("home.dailyChallengeTitle")}</span>
            <span className="home-galaxy__challenge-desc">{t("home.dailyChallengeDesc")}</span>
          </span>
          <span className="home-galaxy__challenge-cta" aria-hidden>→</span>
        </button>
      </div>
    </div>
  );
}
