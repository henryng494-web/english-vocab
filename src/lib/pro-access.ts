import { localDateKey } from "@/lib/local-date";
import { WORD_RANGES } from "@/data/word-ranges";
import { REVENUECAT_MOCK_MODE, isRevenueCatAvailable } from "@/lib/revenuecat";

/** Ranks above this are "high ranks": Free users may open them but get a tiny daily new-word allowance. */
export const FREE_MAX_RANK = 500;
export const FREE_HIGH_RANK_DAILY_NEW_WORDS = 3;
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

const HIGH_RANK_KEY = "jj-free-high-rank-new-v1";

function readHighRankState(): { date: string; count: number } {
  const today = localDateKey();
  if (typeof window === "undefined") return { date: today, count: 0 };
  try {
    const parsed = JSON.parse(localStorage.getItem(HIGH_RANK_KEY) ?? "null") as {
      date?: string;
      count?: number;
    } | null;
    if (parsed?.date === today && typeof parsed.count === "number") {
      return { date: today, count: parsed.count };
    }
  } catch {
    /* ignore */
  }
  return { date: today, count: 0 };
}

export function getFreeHighRankLearnedToday(): number {
  return readHighRankState().count;
}

/** Counts a new word learned in a high rank (> 500) today; returns the new total. */
export function incrementFreeHighRankLearned(): number {
  const next = { date: localDateKey(), count: readHighRankState().count + 1 };
  try {
    localStorage.setItem(HIGH_RANK_KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  return next.count;
}

export function isFreeHighRankQuotaReached(): boolean {
  return getFreeHighRankLearnedToday() >= FREE_HIGH_RANK_DAILY_NEW_WORDS;
}
