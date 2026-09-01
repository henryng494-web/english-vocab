"use client";

import { JungleCastPill, JungleMascot, type JungleMascotName } from "@/components/mascot/JungleMascot";
import { displayFontClass } from "@/lib/fonts";
import type { HomeLayoutProps } from "@/components/discover/home-layouts/types";
import { ProgressBar, useHomeBannerCopy } from "@/components/discover/home-layouts/shared";

export function useHomePageCopy(props: HomeLayoutProps) {
  const goalMet = props.goalTarget > 0 && props.goalCurrent >= props.goalTarget;
  return useHomeBannerCopy({ ...props, goalMet });
}

function GoalRing({
  current,
  target,
  label,
}: {
  current: number;
  target: number;
  label: string;
}) {
  const pct = target > 0 ? Math.min(100, Math.round((current / target) * 100)) : 0;
  const dash = `${pct} 100`;
  return (
    <div className="home-ins-ring" title={label}>
      <svg viewBox="0 0 36 36" className="home-ins-ring__svg" aria-hidden>
        <path
          className="home-ins-ring__track"
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
        <path
          className="home-ins-ring__fill"
          strokeDasharray={dash}
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
        />
      </svg>
      <span className="home-ins-ring__label">{pct}%</span>
    </div>
  );
}

function MascotCorner({
  character,
  size = 72,
}: {
  character: JungleMascotName;
  size?: number;
}) {
  return <JungleMascot character={character} size={size} className="home-ins-mascot-corner" priority />;
}

/** 1 · Duolingo — streak nổi, vòng mục tiêu, thẻ bài xanh, hổ */
export function InspiredHome1(props: HomeLayoutProps) {
  const copy = useHomePageCopy(props);

  return (
    <div className="home-ins home-ins--duo">
      <div className="home-ins-duo__top">
        <div className="home-ins-streak-pill">
          <span aria-hidden>🔥</span>
          <span className={`home-ins-streak-pill__value ${displayFontClass}`}>
            {copy.t("home.streakDays", { count: props.streakDays })}
          </span>
        </div>
        <GoalRing
          current={props.goalCurrent}
          target={props.goalTarget}
          label={copy.goalProgressLabel}
        />
      </div>

      <button
        type="button"
        className="home-ins-lesson-card home-ins-lesson-card--duo"
        disabled={props.queueLength === 0}
        onClick={props.onStartJourney}
      >
        <MascotCorner character="tiger" size={80} />
        <p className="home-ins-lesson-card__eyebrow">{copy.t("home.insTodayLesson")}</p>
        <h2 className={`home-ins-lesson-card__title ${displayFontClass}`}>{copy.bannerTitle}</h2>
        <p className="home-ins-lesson-card__meta">{copy.bannerSubtitle}</p>
        <span className="home-ins-lesson-card__cta">{copy.bannerCta} →</span>
      </button>

      <div className="home-ins-duo__bottom">
        <button type="button" className="home-ins-mini-card" onClick={props.onStartReview}>
          <span className="home-ins-mini-card__icon">🔁</span>
          <span className="home-ins-mini-card__title">{copy.t("home.flowReview")}</span>
          <span className="home-ins-mini-card__meta">
            {props.dueReviewCount > 0
              ? copy.t("home.flowReviewDue", { count: props.dueReviewCount })
              : copy.t("home.flowReviewNone")}
          </span>
        </button>
        <button type="button" className="home-ins-mini-card" onClick={props.onOpenLibrary}>
          <span className="home-ins-mini-card__icon">📚</span>
          <span className="home-ins-mini-card__title">{copy.t("home.flowLibrary")}</span>
          <span className="home-ins-mini-card__meta">
            {copy.t("home.flowLibraryKnown", { count: props.wordsKnown })}
          </span>
        </button>
      </div>
    </div>
  );
}

/** 2 · Babbel — bài học sạch, voi, danh sách hành động */
export function InspiredHome2(props: HomeLayoutProps) {
  const copy = useHomePageCopy(props);

  return (
    <div className="home-ins home-ins--babbel">
      <p className="home-ins-section-kicker">{copy.t("home.insTodayFocus")}</p>
      <section className="home-ins-babbel-card">
        <MascotCorner character="elephant" size={64} />
        <h2 className={`home-ins-babbel-card__title ${displayFontClass}`}>{copy.bannerTitle}</h2>
        <p className="home-ins-babbel-card__sub">{copy.bannerSubtitle}</p>
        <ProgressBar value={props.goalCurrent} max={props.goalTarget} colorClass="bg-accent" />
        <p className="home-ins-babbel-card__progress">{copy.goalProgressLabel}</p>
        <button
          type="button"
          className="btn-pill-primary w-full mt-3"
          disabled={props.queueLength === 0}
          onClick={props.onStartJourney}
        >
          {copy.bannerCta}
        </button>
      </section>

      <div className="home-ins-babbel-list">
        <button type="button" className="home-ins-babbel-row" onClick={props.onStartReview}>
          <span className="home-ins-babbel-row__icon">🔁</span>
          <span className="home-ins-babbel-row__copy">
            <span className="home-ins-babbel-row__title">{copy.t("home.flowReview")}</span>
            <span className="home-ins-babbel-row__meta">
              {props.dueReviewCount > 0
                ? copy.t("home.flowReviewDue", { count: props.dueReviewCount })
                : copy.t("home.flowReviewDetail")}
            </span>
          </span>
          <span className="home-ins-babbel-row__chev">→</span>
        </button>
        <button type="button" className="home-ins-babbel-row" onClick={props.onOpenLibrary}>
          <span className="home-ins-babbel-row__icon">📚</span>
          <span className="home-ins-babbel-row__copy">
            <span className="home-ins-babbel-row__title">{copy.t("home.flowLibrary")}</span>
            <span className="home-ins-babbel-row__meta">
              {copy.t("home.flowLibraryKnown", { count: props.wordsKnown })} ·{" "}
              {copy.t("home.streakDays", { count: props.streakDays })}
            </span>
          </span>
          <span className="home-ins-babbel-row__chev">→</span>
        </button>
      </div>
    </div>
  );
}

/** 3 · Memrise — chồng thẻ, số từ lớn, cá sấu */
export function InspiredHome3(props: HomeLayoutProps) {
  const copy = useHomePageCopy(props);

  return (
    <div className="home-ins home-ins--memrise">
      <div className="home-ins-memrise-stack" aria-hidden>
        <div className="home-ins-memrise-stack__card home-ins-memrise-stack__card--3" />
        <div className="home-ins-memrise-stack__card home-ins-memrise-stack__card--2" />
        <div className="home-ins-memrise-stack__card home-ins-memrise-stack__card--1">
          <JungleMascot character="crocodile" size={56} className="mx-auto" />
          <p className={`home-ins-memrise-stack__count ${displayFontClass}`}>
            {props.queueLength.toLocaleString()}
          </p>
          <p className="home-ins-memrise-stack__label">{copy.t("home.insWordsWaiting")}</p>
        </div>
      </div>

      <button
        type="button"
        className="btn-pill-primary home-ins-memrise-cta"
        disabled={props.queueLength === 0}
        onClick={props.onStartJourney}
      >
        {copy.bannerCta}
      </button>
      <p className="home-ins-memrise-sub text-center text-sm text-foreground/60">{copy.bannerSubtitle}</p>

      <div className="home-ins-memrise-stats">
        <button type="button" className="home-ins-memrise-stat" onClick={props.onStartReview}>
          <span className="home-ins-memrise-stat__value">{props.dueReviewCount}</span>
          <span className="home-ins-memrise-stat__label">{copy.t("home.flowReview")}</span>
        </button>
        <div className="home-ins-memrise-stat home-ins-memrise-stat--static">
          <span className="home-ins-memrise-stat__value">{props.streakDays}</span>
          <span className="home-ins-memrise-stat__label">{copy.t("home.streak")}</span>
        </div>
        <button type="button" className="home-ins-memrise-stat" onClick={props.onOpenLibrary}>
          <span className="home-ins-memrise-stat__value">{props.wordsKnown}</span>
          <span className="home-ins-memrise-stat__label">{copy.t("home.masteredShort")}</span>
        </button>
      </div>
    </div>
  );
}

/** 4 · Busuu — lưới module màu, cast pill */
export function InspiredHome4(props: HomeLayoutProps) {
  const copy = useHomePageCopy(props);

  return (
    <div className="home-ins home-ins--busuu">
      <div className="home-ins-busuu-header">
        <div>
          <JungleCastPill size={24} />
          <p className="home-ins-busuu-header__streak">
            🔥 {copy.t("home.streakDays", { count: props.streakDays })}
          </p>
        </div>
        <div className="home-ins-busuu-header__goal">
          <p className="home-ins-busuu-header__goal-label">{copy.goalTypeLabel(props.goalType)}</p>
          <ProgressBar value={props.goalCurrent} max={props.goalTarget} colorClass="bg-secondary" />
          <p className="home-ins-busuu-header__goal-meta">{copy.goalProgressLabel}</p>
        </div>
      </div>

      <p className="home-ins-section-kicker">{copy.t("home.insStudyPlan")}</p>
      <div className="home-ins-busuu-grid">
        <button
          type="button"
          className="home-ins-busuu-tile home-ins-busuu-tile--learn"
          disabled={props.queueLength === 0}
          onClick={props.onStartJourney}
        >
          <JungleMascot character="tiger" size={48} />
          <span className="home-ins-busuu-tile__title">{copy.bannerTitle}</span>
          <span className="home-ins-busuu-tile__meta">{copy.bannerSubtitle}</span>
          <span className="home-ins-busuu-tile__cta">{copy.bannerCta} →</span>
        </button>
        <button
          type="button"
          className="home-ins-busuu-tile home-ins-busuu-tile--review"
          onClick={props.onStartReview}
        >
          <span className="home-ins-busuu-tile__emoji">🔁</span>
          <span className="home-ins-busuu-tile__title">{copy.t("home.flowReview")}</span>
          <span className="home-ins-busuu-tile__count">{props.dueReviewCount}</span>
        </button>
        <button
          type="button"
          className="home-ins-busuu-tile home-ins-busuu-tile--vocab"
          onClick={props.onOpenLibrary}
        >
          <span className="home-ins-busuu-tile__emoji">📚</span>
          <span className="home-ins-busuu-tile__title">{copy.t("home.flowLibrary")}</span>
          <span className="home-ins-busuu-tile__count">{props.wordsKnown}</span>
        </button>
      </div>
    </div>
  );
}

/** 5 · Quizlet — tối giản, ưu tiên ôn, voi nhỏ */
export function InspiredHome5(props: HomeLayoutProps) {
  const copy = useHomePageCopy(props);

  return (
    <div className="home-ins home-ins--quizlet">
      {props.dueReviewCount > 0 ? (
        <button type="button" className="home-ins-quizlet-due" onClick={props.onStartReview}>
          <span className="home-ins-quizlet-due__count">{props.dueReviewCount}</span>
          <span className="home-ins-quizlet-due__copy">
            <span className="home-ins-quizlet-due__title">{copy.t("home.insDueNow")}</span>
            <span className="home-ins-quizlet-due__meta">{copy.t("home.flowReviewDetail")}</span>
          </span>
          <span className="home-ins-quizlet-due__chev">→</span>
        </button>
      ) : null}

      <section className="home-ins-quizlet-deck">
        <div className="home-ins-quizlet-deck__head">
          <div>
            <p className="home-ins-quizlet-deck__label">{copy.t("home.insYourDeck")}</p>
            <h2 className={`home-ins-quizlet-deck__title ${displayFontClass}`}>{copy.bannerTitle}</h2>
            <p className="home-ins-quizlet-deck__meta">{copy.bannerSubtitle}</p>
          </div>
          <JungleMascot character="elephant" size={52} />
        </div>
        <ProgressBar value={props.rankProgress} max={100} colorClass="bg-primary" />
        <button
          type="button"
          className="home-ins-quizlet-deck__btn"
          disabled={props.queueLength === 0}
          onClick={props.onStartJourney}
        >
          {copy.bannerCta}
        </button>
      </section>

      <div className="home-ins-quizlet-footer">
        <span>🔥 {props.streakDays}</span>
        <span>🎯 {props.goalCurrent}/{props.goalTarget}</span>
        <button type="button" onClick={props.onOpenLibrary}>
          🪙 {props.wordsKnown.toLocaleString()}
        </button>
      </div>
    </div>
  );
}
