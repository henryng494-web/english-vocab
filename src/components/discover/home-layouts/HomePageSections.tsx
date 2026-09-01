"use client";

import { JungleMascot } from "@/components/mascot/JungleMascot";
import { displayFontClass } from "@/lib/fonts";
import type { HomeLayoutProps } from "@/components/discover/home-layouts/types";
import { ProgressBar, useHomeBannerCopy } from "@/components/discover/home-layouts/shared";

type SectionProps = HomeLayoutProps & {
  copy: ReturnType<typeof useHomeBannerCopy>;
};

export function HomeStatsBar({
  streakDays,
  wordsKnown,
  onOpenLibrary,
  t,
}: Pick<HomeLayoutProps, "streakDays" | "wordsKnown" | "onOpenLibrary"> & {
  t: ReturnType<typeof useHomeBannerCopy>["t"];
}) {
  return (
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
  );
}

export function HomeGoalBlock({ copy, goalCurrent, goalTarget }: Pick<SectionProps, "copy" | "goalCurrent" | "goalTarget">) {
  return (
    <section className="home-card home-today home-today--compact border-accent-200 bg-accent-50/30">
      <h3 className="home-section-label">{copy.t("home.progress")}</h3>
      <ProgressBar value={goalCurrent} max={goalTarget} colorClass="bg-accent" />
      <p className="home-body-text mt-2 text-sm text-foreground/70">{copy.goalProgressLabel}</p>
      <p className="home-body-text mt-1 text-sm text-foreground/60">{copy.bannerMeta}</p>
    </section>
  );
}

export function HomeNextReviewRow({
  dueReviewCount,
  onStartReview,
  t,
}: Pick<HomeLayoutProps, "dueReviewCount" | "onStartReview"> & {
  t: ReturnType<typeof useHomeBannerCopy>["t"];
}) {
  return (
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
  );
}

export function HomeNextLibraryRow({
  wordsKnown,
  wordsReviewing,
  onOpenLibrary,
  t,
}: Pick<HomeLayoutProps, "wordsKnown" | "wordsReviewing" | "onOpenLibrary"> & {
  t: ReturnType<typeof useHomeBannerCopy>["t"];
}) {
  return (
    <button
      type="button"
      onClick={onOpenLibrary}
      className="home-next-row border-pink-200 bg-pink-50/40 hover:bg-pink-50 transition"
    >
      <span className="home-next-row__icon text-pink-600" aria-hidden>
        📚
      </span>
      <span className="home-next-row__copy">
        <span className="home-next-row__title">{t("home.flowLibrary")}</span>
        <span className="home-next-row__meta">
          {t("home.flowLibraryKnown", { count: wordsKnown })} ·{" "}
          {t("home.flowLibraryReview", { count: wordsReviewing })}
        </span>
      </span>
      <span className="home-next-row__chev" aria-hidden>
        →
      </span>
    </button>
  );
}

export function HomeNextSection({
  props,
  copy,
  showReview = true,
  showLibrary = true,
}: {
  props: HomeLayoutProps;
  copy: ReturnType<typeof useHomeBannerCopy>;
  showReview?: boolean;
  showLibrary?: boolean;
}) {
  if (!showReview && !showLibrary) return null;
  return (
    <section className="home-next">
      <h3 className="home-section-label">{copy.t("home.next")}</h3>
      <div className="home-next-list">
        {showReview ? (
          <HomeNextReviewRow
            dueReviewCount={props.dueReviewCount}
            onStartReview={props.onStartReview}
            t={copy.t}
          />
        ) : null}
        {showLibrary ? (
          <HomeNextLibraryRow
            wordsKnown={props.wordsKnown}
            wordsReviewing={props.wordsReviewing}
            onOpenLibrary={props.onOpenLibrary}
            t={copy.t}
          />
        ) : null}
      </div>
    </section>
  );
}

export function HomeFlowReviewCard({
  dueReviewCount,
  onStartReview,
  t,
}: Pick<HomeLayoutProps, "dueReviewCount" | "onStartReview"> & {
  t: ReturnType<typeof useHomeBannerCopy>["t"];
}) {
  return (
    <button
      type="button"
      onClick={onStartReview}
      className="home-card home-flow-card home-flow-card--compact border-secondary-200 bg-secondary-50/40 hover:bg-secondary-50 transition text-left"
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
  );
}

export function HomeFlowLibraryCard({
  wordsKnown,
  wordsReviewing,
  onOpenLibrary,
  t,
}: Pick<HomeLayoutProps, "wordsKnown" | "wordsReviewing" | "onOpenLibrary"> & {
  t: ReturnType<typeof useHomeBannerCopy>["t"];
}) {
  return (
    <button
      type="button"
      onClick={onOpenLibrary}
      className="home-card home-flow-card home-flow-card--compact border-pink-200 bg-pink-50/40 hover:bg-pink-50 transition text-left"
    >
      <span className="home-stat-icon text-pink-600" aria-hidden>
        📚
      </span>
      <p className="home-flow-card__title">{t("home.flowLibrary")}</p>
      <p className="home-flow-card__meta">{t("home.flowLibraryKnown", { count: wordsKnown })}</p>
      <p className="home-flow-card__detail">
        {t("home.flowLibraryReview", { count: wordsReviewing })}
      </p>
    </button>
  );
}

export function HomeFlowRankCard({
  rangeLabel,
  queueLength,
  rankProgress,
  t,
}: Pick<HomeLayoutProps, "rangeLabel" | "queueLength" | "rankProgress"> & {
  t: ReturnType<typeof useHomeBannerCopy>["t"];
}) {
  return (
    <div className="home-card home-flow-card home-flow-card--compact border-primary-200 bg-primary-50/40 text-left">
      <span className="home-stat-icon text-primary" aria-hidden>
        📊
      </span>
      <p className="home-flow-card__title">{t("home.rankProgress")}</p>
      <p className="home-flow-card__meta">{rangeLabel}</p>
      <p className="home-flow-card__detail">{t("home.flowNewLeft", { count: queueLength })}</p>
      <ProgressBar value={rankProgress} max={100} colorClass="bg-primary" />
    </div>
  );
}

export function HomeProgressDuo({
  streakDays,
  goalType,
  goalCurrent,
  goalTarget,
  goalMet,
  copy,
}: Pick<SectionProps, "streakDays" | "goalType" | "goalCurrent" | "goalTarget" | "copy"> & {
  goalMet: boolean;
}) {
  const goalStatValue = goalMet ? "✓" : `${goalCurrent}/${goalTarget}`;
  return (
    <section>
      <div className="home-section-header">
        <h3 className="home-section-label">{copy.t("home.progress")}</h3>
      </div>
      <div className="home-stat-grid home-stat-grid--duo">
        <div className="home-card home-stat-card border-secondary-200 bg-secondary-50/50">
          <span className="home-stat-icon text-xl" aria-hidden>
            🔥
          </span>
          <p className="home-stat-label text-secondary-800">{copy.t("home.streak")}</p>
          <p className={`home-stat-value text-secondary-700 ${displayFontClass}`}>
            {copy.t("home.streakDays", { count: streakDays })}
          </p>
        </div>
        <div className="home-card home-stat-card border-accent-200 bg-accent-50/50">
          <span className="home-stat-icon text-xl" aria-hidden>
            🎯
          </span>
          <p className="home-stat-label text-accent-800">{copy.goalTypeLabel(goalType)}</p>
          <p className={`home-stat-value text-accent-700 ${displayFontClass}`}>{goalStatValue}</p>
        </div>
      </div>
    </section>
  );
}

export function HomeStatQuad({
  props,
  copy,
}: {
  props: HomeLayoutProps;
  copy: ReturnType<typeof useHomeBannerCopy>;
}) {
  const goalMet = props.goalTarget > 0 && props.goalCurrent >= props.goalTarget;
  const goalStatValue = goalMet ? "✓" : `${props.goalCurrent}/${props.goalTarget}`;
  return (
    <div className="home-stat-grid home-stat-grid--quad">
      <div className="home-card home-stat-card border-secondary-200 bg-secondary-50/50">
        <span className="home-stat-icon text-xl" aria-hidden>
          🔥
        </span>
        <p className="home-stat-label text-secondary-800">{copy.t("home.streak")}</p>
        <p className={`home-stat-value text-secondary-700 ${displayFontClass}`}>
          {copy.t("home.streakDays", { count: props.streakDays })}
        </p>
      </div>
      <div className="home-card home-stat-card border-accent-200 bg-accent-50/50">
        <span className="home-stat-icon text-xl" aria-hidden>
          🎯
        </span>
        <p className="home-stat-label text-accent-800">{copy.goalTypeLabel(props.goalType)}</p>
        <p className={`home-stat-value text-accent-700 ${displayFontClass}`}>{goalStatValue}</p>
      </div>
      <button
        type="button"
        onClick={props.onStartReview}
        className="home-card home-stat-card home-stat-card--link border-primary-200 bg-primary-50/50"
      >
        <span className="home-stat-icon text-xl" aria-hidden>
          🔁
        </span>
        <p className="home-stat-label text-primary-800">{copy.t("home.flowReview")}</p>
        <p className={`home-stat-value text-primary-700 ${displayFontClass}`}>
          {props.dueReviewCount}
        </p>
      </button>
      <button
        type="button"
        onClick={props.onOpenLibrary}
        className="home-card home-stat-card home-stat-card--link border-pink-200 bg-pink-50/50"
      >
        <span className="home-stat-icon text-xl" aria-hidden>
          🪙
        </span>
        <p className="home-stat-label text-pink-800">{copy.t("home.masteredShort")}</p>
        <p className={`home-stat-value text-pink-700 ${displayFontClass}`}>
          {props.wordsKnown.toLocaleString()}
        </p>
      </button>
    </div>
  );
}

export function MonkeyBannerHero({ props, copy }: { props: HomeLayoutProps; copy: ReturnType<typeof useHomeBannerCopy> }) {
  return (
    <section className="home-layout-banner home-layout-banner--hero">
      <div className="home-layout-banner__copy">
        <p className="home-layout-banner__eyebrow">{copy.bannerSubtitle}</p>
        <h2 className={`home-layout-banner__title ${displayFontClass}`}>{copy.bannerTitle}</h2>
        <p className="home-layout-banner__meta">{copy.bannerMeta}</p>
        <button
          type="button"
          className="btn-pill-primary home-layout-banner__cta"
          disabled={props.queueLength === 0}
          onClick={props.onStartJourney}
        >
          {copy.bannerCta} →
        </button>
      </div>
      <JungleMascot character="monkey" size={96} className="home-layout-banner__mascot" priority />
    </section>
  );
}

export function MonkeyBannerFloat({ props, copy }: { props: HomeLayoutProps; copy: ReturnType<typeof useHomeBannerCopy> }) {
  return (
    <div className="home-layout-float-wrap">
      <JungleMascot character="monkey" size={88} className="home-layout-float__mascot" />
      <section className="home-layout-float-card">
        <h2 className={`home-layout-float-card__title ${displayFontClass}`}>{copy.bannerTitle}</h2>
        <p className="home-layout-float-card__sub">{copy.bannerSubtitle}</p>
        <p className="home-layout-float-card__meta">{copy.bannerMeta}</p>
        <button
          type="button"
          className="btn-pill-primary w-full mt-3"
          disabled={props.queueLength === 0}
          onClick={props.onStartJourney}
        >
          {copy.bannerCta} →
        </button>
      </section>
    </div>
  );
}

export function MonkeyBannerStage({ props, copy }: { props: HomeLayoutProps; copy: ReturnType<typeof useHomeBannerCopy> }) {
  return (
    <section className="home-layout-stage">
      <p className="home-layout-stage__eyebrow">{copy.bannerSubtitle}</p>
      <JungleMascot character="monkey" size={80} className="mx-auto" />
      <h2 className={`home-layout-stage__title ${displayFontClass}`}>{copy.bannerTitle}</h2>
      <p className="home-layout-stage__meta">{copy.bannerMeta}</p>
      <button
        type="button"
        className="btn-pill-primary home-layout-stage__cta"
        disabled={props.queueLength === 0}
        onClick={props.onStartJourney}
      >
        {copy.bannerCta}
      </button>
    </section>
  );
}

export function MonkeyBannerMagazine({ props, copy }: { props: HomeLayoutProps; copy: ReturnType<typeof useHomeBannerCopy> }) {
  return (
    <section className="home-layout-magazine">
      <JungleMascot character="monkey" size={100} className="home-layout-magazine__mascot" />
      <div className="home-layout-magazine__body">
        <h2 className={`home-layout-magazine__title ${displayFontClass}`}>{copy.bannerTitle}</h2>
        <p className="home-layout-magazine__sub">{copy.bannerSubtitle}</p>
        <ProgressBar value={props.goalCurrent} max={props.goalTarget} colorClass="bg-accent" />
        <p className="home-body-text text-xs text-foreground/60 mt-1">{copy.goalProgressLabel}</p>
        <button
          type="button"
          className="btn-pill-primary w-full mt-3"
          disabled={props.queueLength === 0}
          onClick={props.onStartJourney}
        >
          {copy.bannerCta} →
        </button>
      </div>
    </section>
  );
}

export function MonkeyBannerBubble({ props, copy }: { props: HomeLayoutProps; copy: ReturnType<typeof useHomeBannerCopy> }) {
  return (
    <section className="home-layout-bubble">
      <div className="home-layout-bubble__inner">
        <div>
          <h2 className={`home-layout-bubble__title ${displayFontClass}`}>{copy.bannerTitle}</h2>
          <p className="home-layout-bubble__sub">{copy.bannerSubtitle}</p>
          <p className="home-layout-bubble__count">{props.queueLength.toLocaleString()}</p>
          <p className="home-layout-bubble__meta">{copy.bannerMeta}</p>
        </div>
        <JungleMascot character="monkey" size={92} className="home-layout-bubble__mascot" />
      </div>
      <button
        type="button"
        className="home-layout-bubble__cta"
        disabled={props.queueLength === 0}
        onClick={props.onStartJourney}
      >
        {copy.bannerCta} →
      </button>
    </section>
  );
}

export function HomeStageTiles({ props, copy }: { props: HomeLayoutProps; copy: ReturnType<typeof useHomeBannerCopy> }) {
  return (
    <div className="home-layout-tile-row">
      <button type="button" className="home-layout-tile" onClick={props.onStartReview}>
        <span className="home-layout-tile__icon">🔁</span>
        <span className="home-layout-tile__label">{copy.t("home.flowReview")}</span>
        <span className="home-layout-tile__value">{props.dueReviewCount}</span>
      </button>
      <button type="button" className="home-layout-tile" onClick={props.onOpenLibrary}>
        <span className="home-layout-tile__icon">📚</span>
        <span className="home-layout-tile__label">{copy.t("home.flowLibrary")}</span>
        <span className="home-layout-tile__value">{props.wordsKnown}</span>
      </button>
      <div className="home-layout-tile home-layout-tile--static">
        <span className="home-layout-tile__icon">🎯</span>
        <span className="home-layout-tile__label">{copy.goalTypeLabel(props.goalType)}</span>
        <span className="home-layout-tile__value">
          {props.goalCurrent}/{props.goalTarget}
        </span>
      </div>
    </div>
  );
}

export function useHomePageCopy(props: HomeLayoutProps) {
  const goalMet = props.goalTarget > 0 && props.goalCurrent >= props.goalTarget;
  return useHomeBannerCopy({ ...props, goalMet });
}
