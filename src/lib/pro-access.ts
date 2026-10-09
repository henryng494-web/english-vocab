import { WORD_RANGES } from "@/data/word-ranges";
import { REVENUECAT_MOCK_MODE, isRevenueCatAvailable } from "@/lib/revenuecat";

/** Free tier: Bronze ranks only (rank 1–500). Silver and above need Pro. */
export const FREE_MAX_RANK = 500;
export const FREE_DAILY_REVIEWS = 30;

const CACHE_KEY = "jj-pro-status-v1";
export const PRO_STATUS_EVENT = "pro-status-changed";

/**
 * Gating only applies where a subscription can actually be bought (native app with a RevenueCat
 * key, or mock mode), so plain web users are never locked out of content they cannot unlock.
 */
export function isGatingActive(): boolean {
  return isRevenueCatAvailable() || REVENUECAT_MOCK_MODE;
}

export function readProCache(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CACHE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writeProCache(isPro: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, isPro ? "1" : "0");
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event(PRO_STATUS_EVENT));
}

export function isFreeTier(): boolean {
  return isGatingActive() && !readProCache();
}

export function isRangeFree(rangeId: string): boolean {
  const range = WORD_RANGES.find((item) => item.id === rangeId);
  return range ? range.max <= FREE_MAX_RANK : true;
}

export function isRangeLocked(rangeId: string): boolean {
  return isFreeTier() && !isRangeFree(rangeId);
}
