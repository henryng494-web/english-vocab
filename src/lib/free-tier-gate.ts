import { getMaxNewWordsPerDay, getTodayWordsLearned } from "@/lib/daily-goal";
import { getTodayReviewsCompleted } from "@/lib/daily-reviews";
import {
  isFreeDailyReviewLimitReached,
  isFreeHighRankQuotaReached,
  isFreeTier,
  isRangeFree,
} from "@/lib/pro-access";
export type FreeTierBlockReason = "reviews" | "learn";

/** Why a Free user should see the paywall before continuing (null = allowed). */
export function freeTierBlockReason(
  action: "review" | "learn",
  options?: { dueReviewCount?: number; rangeId?: string },
): FreeTierBlockReason | null {
  if (!isFreeTier()) return null;

  if (action === "review") {
    return isFreeDailyReviewLimitReached(getTodayReviewsCompleted()) ? "reviews" : null;
  }

  const due = options?.dueReviewCount ?? 0;
  const rangeId = options?.rangeId;
  const learnedToday = getTodayWordsLearned();
  const dailyCap = getMaxNewWordsPerDay();
  if (learnedToday >= dailyCap) {
    return "learn";
  }
  if (rangeId && !isRangeFree(rangeId) && isFreeHighRankQuotaReached()) {
    return "learn";
  }
  return null;
}
