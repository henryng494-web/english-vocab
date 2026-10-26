import { canFreeUserLearnNewWord } from "@/lib/free-new-word-limit";
import { getTodayReviewsCompleted } from "@/lib/daily-reviews";
import { isFreeDailyReviewLimitReached, isFreeTier } from "@/lib/pro-access";

export type FreeTierBlockReason = "reviews" | "learn";

/** Why a Free/guest user should see the paywall before continuing (null = allowed). */
export function freeTierBlockReason(action: "review" | "learn"): FreeTierBlockReason | null {
  if (!isFreeTier()) return null;

  if (action === "review") {
    return isFreeDailyReviewLimitReached(getTodayReviewsCompleted()) ? "reviews" : null;
  }

  return canFreeUserLearnNewWord() ? null : "learn";
}
