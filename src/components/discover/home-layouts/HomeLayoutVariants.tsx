"use client";

import { JungleMascot } from "@/components/mascot/JungleMascot";
import { displayFontClass } from "@/lib/fonts";
import type { HomeLayoutProps } from "@/components/discover/home-layouts/types";
import {
  LayoutPreviewBadge,
  ProgressBar,
  useHomeBannerCopy,
} from "@/components/discover/home-layouts/shared";

function SecondaryRow({
  dueReviewCount,
  streakDays,
  wordsKnown,
  onStartReview,
  onOpenLibrary,
  t,
}: Pick<
  HomeLayoutProps,
  "dueReviewCount" | "streakDays" | "wordsKnown" | "onStartReview" | "onOpenLibrary"
> & { t: ReturnType<typeof useHomeBannerCopy>["t"] }) {
  return (
    <div className="home-layout-secondary">
      <button type="button" className="home-layout-secondary__chip" onClick={onStartReview}>
        🔁{" "}
        {dueReviewCount > 0
          ? t("home.nextReview", { count: dueReviewCount })
          : t("home.flowReviewNone")}
      </button>
      <button type="button" className="home-layout-secondary__chip" onClick={onOpenLibrary}>
        🪙 {wordsKnown.toLocaleString()}
      </button>
      <span className="home-layout-secondary__chip home-layout-secondary__chip--static">
        🔥 {t("home.streakDays", { count: streakDays })}
      </span>
    </div>
  );
}

/** Layout 1 — Hero split: gradient banner, monkey right, bold CTA */
export function HomeLayout1(props: HomeLayoutProps) {
  const goalMet = props.goalTarget > 0 && props.goalCurrent >= props.goalTarget;
  const copy = useHomeBannerCopy({ ...props, goalMet });

  return (
    <div className="home-layout home-layout--1">
      {props.preview ? <LayoutPreviewBadge variant="1" /> : null}
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
      <ProgressBar value={props.rankProgress} max={100} colorClass="bg-primary" />
      <p className="home-body-text text-sm text-foreground/60">{copy.goalProgressLabel}</p>
      <SecondaryRow {...props} t={copy.t} />
    </div>
  );
}

/** Layout 2 — Floating card: monkey overlaps top, white card body */
export function HomeLayout2(props: HomeLayoutProps) {
  const goalMet = props.goalTarget > 0 && props.goalCurrent >= props.goalTarget;
  const copy = useHomeBannerCopy({ ...props, goalMet });

  return (
    <div className="home-layout home-layout--2">
      {props.preview ? <LayoutPreviewBadge variant="2" /> : null}
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
      <div className="home-layout-mini-stats">
        <span>🔥 {copy.t("home.streakDays", { count: props.streakDays })}</span>
        <span>{copy.goalProgressLabel}</span>
      </div>
      <SecondaryRow {...props} t={copy.t} />
    </div>
  );
}

/** Layout 3 — Center stage: monkey in middle, symmetric tiles */
export function HomeLayout3(props: HomeLayoutProps) {
  const goalMet = props.goalTarget > 0 && props.goalCurrent >= props.goalTarget;
  const copy = useHomeBannerCopy({ ...props, goalMet });

  return (
    <div className="home-layout home-layout--3">
      {props.preview ? <LayoutPreviewBadge variant="3" /> : null}
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
    </div>
  );
}

/** Layout 4 — Magazine: monkey left column, stacked actions right */
export function HomeLayout4(props: HomeLayoutProps) {
  const goalMet = props.goalTarget > 0 && props.goalCurrent >= props.goalTarget;
  const copy = useHomeBannerCopy({ ...props, goalMet });

  return (
    <div className="home-layout home-layout--4">
      {props.preview ? <LayoutPreviewBadge variant="4" /> : null}
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
          <div className="home-layout-magazine__links">
            <button type="button" onClick={props.onStartReview}>
              {props.dueReviewCount > 0
                ? copy.t("home.nextReview", { count: props.dueReviewCount })
                : copy.t("home.flowReview")}
            </button>
            <button type="button" onClick={props.onOpenLibrary}>
              {copy.t("home.flowLibrary")}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Layout 5 — Playful bubble: rounded purple blob, monkey peeking */
export function HomeLayout5(props: HomeLayoutProps) {
  const goalMet = props.goalTarget > 0 && props.goalCurrent >= props.goalTarget;
  const copy = useHomeBannerCopy({ ...props, goalMet });

  return (
    <div className="home-layout home-layout--5">
      {props.preview ? <LayoutPreviewBadge variant="5" /> : null}
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
      <div className="home-layout-bubble-footer">
        <button type="button" onClick={props.onStartReview}>
          🔁 {props.dueReviewCount}
        </button>
        <span>🔥 {copy.t("home.streakDays", { count: props.streakDays })}</span>
        <button type="button" onClick={props.onOpenLibrary}>
          ⭐ {props.wordsKnown.toLocaleString()}
        </button>
      </div>
    </div>
  );
}
