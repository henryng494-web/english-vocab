"use client";

import Link from "next/link";
import { useAppMenu } from "@/context/AppMenuContext";
import { getTotalDueReviewCount, subscribeReviewDueCount } from "@/lib/review-due-store";
import { displayFontClass } from "@/lib/fonts";
import type { GoalType } from "@/lib/app-settings";
import {
  EMPTY_WEEK_DAYS,
  getWeeklyMetCountSnapshot,
  getWeeklyStreakDaysSnapshot,
  subscribeWeeklyStreak,
  type WeekDayStatus,
} from "@/lib/weekly-streak";
import { useAuthSession } from "@/context/AuthSessionContext";
import { usePaywall } from "@/context/PaywallContext";
import {
  LEARNER_DISPLAY_NAME_EVENT,
  readLearnerDisplayName,
} from "@/lib/user-display-name";
import { useI18n } from "@/hooks/use-i18n";
import { getDailyReviewPlan } from "@/lib/daily-goal";
import {
  getTodayReviewsCompletedSnapshot,
  subscribeTodayReviewsCompleted,
} from "@/lib/daily-reviews";
import { AppMenuButton } from "@/components/layout/AppMenuButton";
import { JungleMascot } from "@/components/mascot/JungleMascot";
import { StreakBadge } from "@/components/discover/DiscoverDashboard";
import { useMemo, useSyncExternalStore } from "react";

export type HomeGalaxyScreenProps = {
  rangeLabel: string;
  queueLength: number;
  rankProgress: number;
  bandTotalWords: number;
  todayStudyMinutes: number;
  wordsKnown: number;
  wordsReviewing: number;
  streakDays: number;
  goalType: GoalType;
  goalCurrent: number;
  goalTarget: number;
  todayWordsLearned: number;
  onStartJourney: () => void;
  onStartJourneyPointerDown?: () => void;
  onStartReview: () => void;
  onOpenLibrary: () => void;
};

function StatRing({
  displayValue,
  sublabel,
  variant = "goal",
  complete = false,
  value,
  max,
}: {
  displayValue: string;
  sublabel: string;
  variant?: "goal" | "due";
  complete?: boolean;
  value: number;
  max: number;
}) {
  const percent = max > 0 ? Math.max(0, Math.min(100, value / max * 100)) : 0;
  return (
    <div className={`home-focus-goal home-focus-goal--${variant}${complete ? " is-complete" : ""}`}>
      <div className="home-focus-goal__label"><span>{sublabel}</span><strong>{displayValue}</strong></div>
      <progress max={100} value={percent} aria-label={sublabel} />
    </div>
  );
}

function MiniProgressRing({
  value,
  max,
  center,
  className = "",
  ariaLabel,
}: {
  value: number;
  max: number;
  center: string;
  className?: string;
  ariaLabel: string;
}) {
  const pctRaw = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  const pctRounded = Math.round(pctRaw);
  const dashPct =
    pctRounded === 0 && max > 0 ? 1.5 : pctRounded >= 100 ? 100 : pctRounded;
  const dash = `${dashPct} 100`;

  return (
    <div
      className={`home-galaxy-mini-ring ${className}`.trim()}
      role="progressbar"
      aria-valuenow={pctRounded}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={ariaLabel}
    >
      <svg viewBox="0 0 36 36" aria-hidden>
        <path
          className="home-galaxy-mini-ring__track"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="home-galaxy-mini-ring__fill"
          strokeDasharray={dash}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      {center ? <span className="home-galaxy-mini-ring__center">{center}</span> : null}
    </div>
  );
}

function WeekDayCell({
  day,
  weekdayLabel,
  goalCurrent,
  goalTarget,
}: {
  day: WeekDayStatus;
  weekdayLabel: string;
  goalCurrent: number;
  goalTarget: number;
}) {
  const stateClass = day.met
    ? "is-met"
    : day.isToday
      ? "is-today"
      : day.isFuture
        ? "is-future"
        : "is-missed";

  const showTodayRing = day.isToday && !day.met && goalTarget > 0;
  const goalComplete = goalTarget > 0 && goalCurrent >= goalTarget;
  const bubbleLabel = day.met ? null : "·";

  return (
    <div className={`home-galaxy-weekday ${stateClass}`}>
      <div
        className={`home-galaxy-weekday__bubble${showTodayRing ? " home-galaxy-weekday__bubble--ring" : ""}`}
      >
        {day.met ? (
          <span className="home-galaxy-weekday__flame" aria-hidden>🔥</span>
        ) : showTodayRing ? (
          <MiniProgressRing
            value={goalCurrent}
            max={goalTarget}
            center={`${Math.min(goalCurrent, goalTarget)}`}
            className={`home-galaxy-mini-ring--bubble${goalComplete ? " is-complete" : ""}`}
            ariaLabel={`${Math.min(goalCurrent, goalTarget)}/${goalTarget}`}
          />
        ) : (
          <span className="home-galaxy-weekday__points">{bubbleLabel}</span>
        )}
      </div>
      <span className="home-galaxy-weekday__name">{weekdayLabel}</span>
      <span className="home-galaxy-weekday__date">{day.shortLabel}</span>
    </div>
  );
}

function WordsLeftProgressBar({ learned, total }: { learned: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((learned / total) * 100)) : 0;
  return (
    <div
      className="home-galaxy__words-progress home-galaxy__words-progress--hero"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="home-galaxy__words-progress-track">
        <div className="home-galaxy__words-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function HomeGalaxyScreen(props: HomeGalaxyScreenProps) {
  const { t, goalTypeLabel } = useI18n();
  const { isPro } = usePaywall();
  const { openMenu } = useAppMenu();
  const dueCount = useSyncExternalStore(subscribeReviewDueCount, getTotalDueReviewCount, () => 0);
  const { displayName: authDisplayName, ready: authReady } = useAuthSession();
  const storedNickname = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(LEARNER_DISPLAY_NAME_EVENT, onStoreChange);
      return () => window.removeEventListener(LEARNER_DISPLAY_NAME_EVENT, onStoreChange);
    },
    () => readLearnerDisplayName(),
    () => "",
  );
  const greetingName =
    storedNickname.trim() ||
    (authReady && authDisplayName.trim() ? authDisplayName.trim() : "") ||
    t("home.greetingDefault");

  const avatarInitial = useMemo(() => {
    const trimmed = greetingName.trim();
    if (!trimmed) return "?";
    return trimmed.charAt(0).toUpperCase();
  }, [greetingName]);

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
  const todayReviewsCompleted = useSyncExternalStore(
    subscribeTodayReviewsCompleted,
    getTodayReviewsCompletedSnapshot,
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

  const reviewPlan = getDailyReviewPlan();
  const reviewedCount = todayReviewsCompleted;
  const reviewsComplete = reviewedCount >= reviewPlan;
  const reviewDisplay = `${reviewedCount}/${reviewPlan}`;

  const goalDisplay = `${props.goalCurrent}/${props.goalTarget}`;

  const bandTotal = Math.max(props.bandTotalWords, props.queueLength, 1);
  const wordsLearnedInBand = Math.max(0, bandTotal - props.queueLength);

  const weekTitle = t("home.galaxyWeekTitle", { count: weeklyMet });

  return (
    <div className="home-galaxy home-focus">
      <div className="home-galaxy__sheet">
        <header className="home-galaxy__topbar">
          <div className="home-galaxy__topbar-left">
            <AppMenuButton />
            <Link href="/account" aria-label={t("tab.accountAria")} className="home-galaxy__avatar">
              {avatarInitial}
            </Link>
            <p className={`home-galaxy__topbar-greeting ${displayFontClass}`}>
              {t("home.greeting", { name: greetingName })}
              <span className="home-focus-greeting-sub">{t("home.greetingSub")}</span>
            </p>
          </div>
          <div className="home-galaxy__topbar-right">
            {isPro ? (
              <span
                className="rounded-full bg-[#7c3aed]/15 px-2.5 py-1 text-xs font-extrabold text-[#7c3aed]"
                aria-label={t("paywall.proActive")}
              >
                Pro
              </span>
            ) : null}
            <Link
              href="/search"
              className="home-galaxy__topbar-icon"
              aria-label={t("home.searchAria")}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg>
            </Link>
            <StreakBadge days={props.streakDays} />
          </div>
        </header>

        <section className="home-galaxy__lesson home-galaxy-card home-galaxy-card--hero">
          <div className="home-galaxy__lesson-head">
            <h2 className={`home-galaxy__lesson-title ${displayFontClass}`}>
              {t("home.continueLearning")}
            </h2>
            <JungleMascot
              character="tigerHero"
              size={64}
              className="home-galaxy__lesson-mascot"
              priority
            />
          </div>
          <p className="home-galaxy__lesson-subtitle">
            {t("home.bannerSubtitle", {
              count: props.queueLength,
              range: props.rangeLabel,
            })}
          </p>
          <button
            type="button"
            className="home-galaxy__lesson-cta"
            disabled={props.queueLength === 0}
            onPointerDown={props.onStartJourneyPointerDown}
            onClick={props.onStartJourney}
          >
            <span className="home-galaxy__lesson-cta-label font-extrabold">{t("home.continueCta")}</span>
            <span className="home-galaxy__lesson-cta-icon" aria-hidden>⚡</span>
          </button>
          <WordsLeftProgressBar learned={wordsLearnedInBand} total={bandTotal} />
        </section>
        <button type="button" className="home-focus-review home-galaxy-card" onClick={props.onStartReview}>
          <span className="home-focus-review__icon" aria-hidden>↻</span>
          <span><strong>{t("home.flowReview")}</strong><span className="home-focus-review__detail">{dueCount > 0 ? t("home.flowReviewDue", {count: dueCount}) : t("home.flowReviewNone")}</span></span>
          <span className="home-focus-review__arrow" aria-hidden>→</span>
        </button>
        <section className="home-galaxy__stats-card home-galaxy-card">
          <div className="home-focus-section-heading"><h2>{t("home.todayGoals")}</h2><button type="button" onClick={openMenu}>{t("home.editGoals")}</button></div>
          <div className="home-galaxy__stats">
            <StatRing
              value={props.goalCurrent}
              max={props.goalTarget}
              displayValue={goalDisplay}
              sublabel={goalTypeLabel(props.goalType)}
              variant="goal"
            />
            <StatRing
              value={reviewedCount}
              max={reviewPlan}
              displayValue={reviewDisplay}
              sublabel={t("home.reviewPlanShort")}
              variant="due"
              complete={reviewsComplete}
            />
          </div>
        </section>

        <section className="home-galaxy__week home-galaxy-card">
          <p className="home-galaxy__week-title">{weekTitle}</p>
          <div className="home-galaxy__week-row">
            {weekDays.map((day) => (
              <WeekDayCell
                key={day.dateKey}
                day={day}
                weekdayLabel={weekdayLabels[day.weekdayKey]}
                goalCurrent={props.goalCurrent}
                goalTarget={props.goalTarget}
              />
            ))}
          </div>
        </section>

        <button className="home-focus-summary" type="button" onClick={props.onOpenLibrary}>
          <span>{t("home.galaxyMetaLearning")} <strong>{props.wordsReviewing.toLocaleString()}</strong></span>
          <span>{t("home.masteredShort")} <strong>{props.wordsKnown.toLocaleString()}</strong></span>
          <span aria-hidden>→</span>
        </button>

      </div>
    </div>
  );
}
