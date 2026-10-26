import { localDateKey } from "@/lib/local-date";
import { isUsageLimited } from "@/lib/pro-access";

/** Total new words a Free/guest user may ever learn before the daily rule applies. */
export const FREE_LIFETIME_NEW_WORDS = 10;
/** After the lifetime bootstrap, new words allowed per calendar day. */
export const FREE_DAILY_NEW_AFTER_BOOTSTRAP = 1;

export const FREE_NEW_WORDS_CHANGED_EVENT = "free-new-words-changed";

const STORAGE_KEY = "jj-free-new-words-v2";

type FreeNewWordState = {
  lifetime: number;
  date: string;
  daily: number;
};

function readState(): FreeNewWordState {
  const today = localDateKey();
  if (typeof window === "undefined") {
    return { lifetime: 0, date: today, daily: 0 };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { lifetime: 0, date: today, daily: 0 };
    const parsed = JSON.parse(raw) as Partial<FreeNewWordState>;
    const lifetime = typeof parsed.lifetime === "number" ? Math.max(0, parsed.lifetime) : 0;
    const date = typeof parsed.date === "string" ? parsed.date : today;
    let daily = typeof parsed.daily === "number" ? Math.max(0, parsed.daily) : 0;
    if (date !== today) daily = 0;
    return { lifetime, date: today, daily };
  } catch {
    return { lifetime: 0, date: today, daily: 0 };
  }
}

function writeState(state: FreeNewWordState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event(FREE_NEW_WORDS_CHANGED_EVENT));
  } catch {
    /* private mode */
  }
}

export function getFreeLifetimeNewWordsLearned(): number {
  return readState().lifetime;
}

export function getFreeNewWordsLearnedToday(): number {
  return readState().daily;
}

/** Remaining new-word allowance right now (bootstrap total or 0/1 for today). */
export function getFreeNewWordAllowanceRemaining(): number {
  if (!isUsageLimited()) return Number.POSITIVE_INFINITY;
  const { lifetime, daily } = readState();
  if (lifetime < FREE_LIFETIME_NEW_WORDS) {
    return FREE_LIFETIME_NEW_WORDS - lifetime;
  }
  return Math.max(0, FREE_DAILY_NEW_AFTER_BOOTSTRAP - daily);
}

/** Whether the user may mark another word as new (Free/guest rules). */
export function canFreeUserLearnNewWord(): boolean {
  if (!isUsageLimited()) return true;
  return getFreeNewWordAllowanceRemaining() > 0;
}

/** Call after a word is successfully saved as "new" while usage limits apply. */
export function recordFreeNewWordLearned(): number {
  if (!isUsageLimited()) return getFreeLifetimeNewWordsLearned();
  const today = localDateKey();
  const state = readState();
  const daily = state.date === today ? state.daily : 0;
  const next: FreeNewWordState = {
    lifetime: state.lifetime + 1,
    date: today,
    daily: daily + 1,
  };
  writeState(next);
  return next.lifetime;
}

export function isFreeNewWordLimitReached(): boolean {
  return isUsageLimited() && !canFreeUserLearnNewWord();
}
