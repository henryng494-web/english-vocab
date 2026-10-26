import { getMaxNewWordsPerDay, getTodayWordsLearned } from "@/lib/daily-goal";
import { getTodayReviewsCompleted } from "@/lib/daily-reviews";
import { canLearnNewWordTodayWithReviewBonus } from "@/lib/review-srs";
import {
  isFreeDailyNewWordLimitReached,
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
  const dailyCap = getMaxNewWordsPerDay();
  if (isFreeDailyNewWordLimitReached(getTodayWordsLearned(), dailyCap)) {
    return "learn";
  }
  if (!canLearnNewWordTodayWithReviewBonus(due)) {
    return "learn";
  }
  if (rangeId && !isRangeFree(rangeId) && isFreeHighRankQuotaReached()) {
    return "learn";
  }
  return null;
}
