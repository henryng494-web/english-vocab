"use client";

import { useI18n } from "@/hooks/use-i18n";
import type { GoalType } from "@/lib/app-settings";

export function ProgressBar({
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

export function useHomeBannerCopy(args: {
  goalType: GoalType;
  goalCurrent: number;
  goalTarget: number;
  goalMet: boolean;
  dueReviewCount: number;
  todayWordsLearned: number;
  queueLength: number;
  rangeLabel: string;
}) {
  const { t, goalTypeLabel } = useI18n();
  const {
    goalType,
    goalCurrent,
    goalTarget,
    goalMet,
    dueReviewCount,
    todayWordsLearned,
    queueLength,
    rangeLabel,
  } = args;

  const goalProgressLabel = (() => {
    if (goalType === "new_words") {
      return t("home.wordsProgress", { current: goalCurrent, goal: goalTarget });
    }
    if (goalType === "reviews") {
      return t("home.reviewsProgress", { current: goalCurrent, goal: goalTarget });
    }
    return t("home.minutesProgress", { current: goalCurrent, goal: goalTarget });
  })();

  const bannerSubtitle = t("home.bannerSubtitle", {
    count: queueLength,
    range: rangeLabel,
  });

  const bannerMeta = dueReviewCount
    ? t("home.bannerReviewHint", { count: dueReviewCount })
    : t("home.bannerLearnedToday", { count: todayWordsLearned });

  return {
    t,
    goalTypeLabel: (gt: GoalType) => goalTypeLabel(gt),
    goalProgressLabel,
    bannerSubtitle,
    bannerMeta,
    bannerTitle: t("home.bannerTitle"),
    bannerCta: t("home.bannerCta"),
    goalMet,
  };
}
