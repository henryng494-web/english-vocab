import { isDailyGoalMet } from "@/lib/goal-progress";

const WEEKLY_KEY = "vocab-weekly-goal-days-v1";

export type WeekDayStatus = {
  dateKey: string;
  weekdayKey: "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
  shortLabel: string;
  met: boolean;
  isToday: boolean;
  isFuture: boolean;
};

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function readWeeklyMet(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(WEEKLY_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const out: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === true) out[key] = true;
    }
    return out;
  } catch {
    return {};
  }
}

function writeWeeklyMet(map: Record<string, boolean>): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(WEEKLY_KEY, JSON.stringify(map));
  window.dispatchEvent(new CustomEvent("weekly-streak-changed"));
}

function startOfWeekMonday(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatShortDate(date: Date): string {
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  return `${dd}.${mm}`;
}

const WEEKDAY_KEYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"] as const;

/** Mark today when daily goal is met (call from syncStreak). */
export function markWeeklyGoalMetToday(): void {
  if (!isDailyGoalMet()) return;
  const map = readWeeklyMet();
  map[todayKey()] = true;
  writeWeeklyMet(map);
}

export function getWeeklyStreakDays(): WeekDayStatus[] {
  const today = new Date();
  const todayStr = todayKey();
  const metMap = readWeeklyMet();
  const monday = startOfWeekMonday(today);

  return WEEKDAY_KEYS.map((weekdayKey, index) => {
    const date = addDays(monday, index);
    const dateKey = date.toISOString().slice(0, 10);
    const isToday = dateKey === todayStr;
    const isFuture = dateKey > todayStr;
    return {
      dateKey,
      weekdayKey,
      shortLabel: formatShortDate(date),
      met: Boolean(metMap[dateKey]),
      isToday,
      isFuture,
    };
  });
}

export function countWeeklyMetDays(): number {
  return getWeeklyStreakDays().filter((d) => d.met).length;
}

export function subscribeWeeklyStreak(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("weekly-streak-changed", handler);
  window.addEventListener("streak-changed", handler);
  window.addEventListener("app-settings-changed", handler);
  window.addEventListener("study-time-changed", handler);
  window.addEventListener("daily-words-changed", handler);
  window.addEventListener("daily-reviews-changed", handler);
  return () => {
    window.removeEventListener("weekly-streak-changed", handler);
    window.removeEventListener("streak-changed", handler);
    window.removeEventListener("app-settings-changed", handler);
    window.removeEventListener("study-time-changed", handler);
    window.removeEventListener("daily-words-changed", handler);
    window.removeEventListener("daily-reviews-changed", handler);
  };
}
