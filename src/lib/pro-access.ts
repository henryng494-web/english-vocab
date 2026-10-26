import { IS_MOBILE_BUILD } from "@/lib/api-base";
import { localDateKey } from "@/lib/local-date";
import { WORD_RANGES } from "@/data/word-ranges";
import {
  REVENUECAT_MOCK_MODE,
  isNativePlatform,
  isRevenueCatAvailable,
} from "@/lib/revenuecat";

/** Ranks above this are "high ranks": Free users may open them but get a tiny daily new-word allowance. */
export const FREE_MAX_RANK = 500;
export const FREE_HIGH_RANK_DAILY_NEW_WORDS = 3;
export const FREE_DAILY_REVIEWS = 30;
/** Max new words per calendar day on Free (all rank bands; high-rank has an extra cap). */
export const FREE_DAILY_NEW_WORDS = 10;

const CACHE_KEY = "jj-pro-status-v1";
export const PRO_STATUS_EVENT = "pro-status-changed";

/** Local `npm run dev` and optional dashboard flag — test Free limits in the browser. */
const DEV_OR_FORCED_GATING =
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_FORCE_FREE_GATING === "1";

const LOCAL_WEB_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** Browser is on a local dev host (runtime — works even if NODE_ENV was inlined wrong). */
export function isBrowserFreeGatingHost(): boolean {
  if (typeof window === "undefined") return false;
  return LOCAL_WEB_HOSTS.has(window.location.hostname);
}

/**
 * Web QA: apply Free caps in the browser. Ignores stale `jj-pro-status-v1` unless
 * `NEXT_PUBLIC_QA_AS_PRO=1`. Also honors localStorage `jj-force-free-gating=1`.
 */
export function isWebFreeLimitQaMode(): boolean {
  if (DEV_OR_FORCED_GATING) return true;
  if (isBrowserFreeGatingHost()) return true;
  if (typeof window !== "undefined") {
    try {
      if (localStorage.getItem("jj-force-free-gating") === "1") return true;
    } catch {
      /* private mode */
    }
  }
  return false;
}

/**
 * Free-tier limits apply on shipped mobile builds and native shells even when RevenueCat keys
 * are missing (paywall may show "unavailable" until keys are set). Plain web (non-export) stays
 * open on production Vercel so users are not locked out of content they cannot purchase in-browser.
 * Development, localhost, and `NEXT_PUBLIC_FORCE_FREE_GATING=1` enable gating for paywall testing.
 */
export function isGatingActive(): boolean {
  if (isWebFreeLimitQaMode()) return true;
  if (REVENUECAT_MOCK_MODE) return true;
  if (IS_MOBILE_BUILD || isNativePlatform()) return true;
  return isRevenueCatAvailable();
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
  if (!isGatingActive()) return false;
  if (process.env.NEXT_PUBLIC_QA_AS_PRO === "1") return false;
  if (isWebFreeLimitQaMode()) return true;
  return !readProCache();
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

/** Free-tier review reps used today (only meaningful when {@link isFreeTier}). */
export function isFreeDailyReviewLimitReached(completedToday: number): boolean {
  return isFreeTier() && completedToday >= FREE_DAILY_REVIEWS;
}

/** Free-tier new words used today vs cap (only meaningful when {@link isFreeTier}). */
export function isFreeDailyNewWordLimitReached(learnedToday: number, dailyCap: number): boolean {
  return isFreeTier() && learnedToday >= dailyCap;
}
