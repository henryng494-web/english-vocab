"use client";

import type { HomeLayoutProps } from "@/components/discover/home-layouts/types";
import {
  HomeFlowLibraryCard,
  HomeFlowRankCard,
  HomeFlowReviewCard,
  HomeGoalBlock,
  HomeNextSection,
  HomeProgressDuo,
  HomeStageTiles,
  HomeStatQuad,
  HomeStatsBar,
  MonkeyBannerBubble,
  MonkeyBannerFloat,
  MonkeyBannerHero,
  MonkeyBannerMagazine,
  MonkeyBannerStage,
  useHomePageCopy,
} from "@/components/discover/home-layouts/HomePageSections";

/** Page 1 — Daily Hub: stats bar · hero banner · mục tiêu · tiếp theo */
export function HomeLayout1(props: HomeLayoutProps) {
  const copy = useHomePageCopy(props);

  return (
    <div className="home-page home-page--1">
      <HomeStatsBar
        streakDays={props.streakDays}
        wordsKnown={props.wordsKnown}
        onOpenLibrary={props.onOpenLibrary}
        t={copy.t}
      />
      <MonkeyBannerHero props={props} copy={copy} />
      <HomeGoalBlock copy={copy} goalCurrent={props.goalCurrent} goalTarget={props.goalTarget} />
      <HomeNextSection props={props} copy={copy} />
    </div>
  );
}

/** Page 2 — Dashboard: banner nổi · 3 thẻ luồng · tiến độ */
export function HomeLayout2(props: HomeLayoutProps) {
  const copy = useHomePageCopy(props);
  const goalMet = props.goalTarget > 0 && props.goalCurrent >= props.goalTarget;

  return (
    <div className="home-page home-page--2">
      <MonkeyBannerFloat props={props} copy={copy} />
      <section>
        <div className="home-section-header">
          <h3 className="home-section-label">{copy.t("home.flows")}</h3>
        </div>
        <div className="home-flow-grid">
          <HomeFlowReviewCard
            dueReviewCount={props.dueReviewCount}
            onStartReview={props.onStartReview}
            t={copy.t}
          />
          <HomeFlowLibraryCard
            wordsKnown={props.wordsKnown}
            wordsReviewing={props.wordsReviewing}
            onOpenLibrary={props.onOpenLibrary}
            t={copy.t}
          />
          <HomeFlowRankCard
            rangeLabel={props.rangeLabel}
            queueLength={props.queueLength}
            rankProgress={props.rankProgress}
            t={copy.t}
          />
        </div>
      </section>
      <HomeProgressDuo
        streakDays={props.streakDays}
        goalType={props.goalType}
        goalCurrent={props.goalCurrent}
        goalTarget={props.goalTarget}
        goalMet={goalMet}
        copy={copy}
      />
    </div>
  );
}

/** Page 3 — Center stage: stats · khỉ giữa · 3 ô · mục tiêu */
export function HomeLayout3(props: HomeLayoutProps) {
  const copy = useHomePageCopy(props);

  return (
    <div className="home-page home-page--3">
      <HomeStatsBar
        streakDays={props.streakDays}
        wordsKnown={props.wordsKnown}
        onOpenLibrary={props.onOpenLibrary}
        t={copy.t}
      />
      <MonkeyBannerStage props={props} copy={copy} />
      <HomeStageTiles props={props} copy={copy} />
      <HomeGoalBlock copy={copy} goalCurrent={props.goalCurrent} goalTarget={props.goalTarget} />
    </div>
  );
}

/** Page 4 — Magazine: banner ngang · lối tắt · tiến độ */
export function HomeLayout4(props: HomeLayoutProps) {
  const copy = useHomePageCopy(props);
  const goalMet = props.goalTarget > 0 && props.goalCurrent >= props.goalTarget;

  return (
    <div className="home-page home-page--4">
      <MonkeyBannerMagazine props={props} copy={copy} />
      <HomeNextSection props={props} copy={copy} />
      <HomeProgressDuo
        streakDays={props.streakDays}
        goalType={props.goalType}
        goalCurrent={props.goalCurrent}
        goalTarget={props.goalTarget}
        goalMet={goalMet}
        copy={copy}
      />
    </div>
  );
}

/** Page 5 — Bubble: banner tím · lưới 4 số · ôn nếu có */
export function HomeLayout5(props: HomeLayoutProps) {
  const copy = useHomePageCopy(props);

  return (
    <div className="home-page home-page--5">
      <MonkeyBannerBubble props={props} copy={copy} />
      <HomeStatQuad props={props} copy={copy} />
      {props.dueReviewCount > 0 ? (
        <HomeNextSection props={props} copy={copy} showLibrary={false} />
      ) : null}
    </div>
  );
}
