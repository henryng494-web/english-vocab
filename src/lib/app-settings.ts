import type { AppLocale } from "@/lib/i18n/messages";
import { DEFAULT_APP_LOCALE, isAppLocale } from "@/lib/i18n/messages";
import {
  DEFAULT_PRONOUNCE_SPEED,
  isPronounceSpeed,
  type PronounceSpeed,
} from "@/lib/pronounce-speed";

export type { PronounceSpeed };
export { PRONOUNCE_SPEED_OPTIONS } from "@/lib/pronounce-speed";

export type DailyGoalMinutes = 10 | 20 | 30 | 60 | 90 | 120;

export type AppSettings = {
  autoSpeakEnabled: boolean;
  dailyGoalMinutes: DailyGoalMinutes;
  reminderEnabled: boolean;
  /** 24h local time HH:MM */
  reminderTime: string;
  /** Interface language — word content stays bilingual. */
  appLanguage: AppLocale;
  /** MP3 playback speed — learner preference from menu. */
  pronounceSpeed: PronounceSpeed;
};

export const DAILY_GOAL_OPTIONS: readonly DailyGoalMinutes[] = [
  10, 20, 30, 60, 90, 120,
];

export const DAILY_GOAL_LABELS: Record<DailyGoalMinutes, string> = {
  10: "10 min",
  20: "20 min",
  30: "30 min",
  60: "1 hour",
  90: "1.5 hours",
  120: "2 hours",
};

const STORAGE_KEY = "vocab-app-settings-v1";

const DEFAULT_SETTINGS: AppSettings = {
  autoSpeakEnabled: true,
  dailyGoalMinutes: 20,
  reminderEnabled: false,
  reminderTime: "19:00",
  appLanguage: DEFAULT_APP_LOCALE,
  pronounceSpeed: DEFAULT_PRONOUNCE_SPEED,
};

function isDailyGoalMinutes(value: number): value is DailyGoalMinutes {
  return DAILY_GOAL_OPTIONS.includes(value as DailyGoalMinutes);
}

function normalizeReminderTime(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_SETTINGS.reminderTime;
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  return match ? value.trim() : DEFAULT_SETTINGS.reminderTime;
}

export function readAppSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    return {
      autoSpeakEnabled:
        typeof parsed.autoSpeakEnabled === "boolean"
          ? parsed.autoSpeakEnabled
          : DEFAULT_SETTINGS.autoSpeakEnabled,
      dailyGoalMinutes: isDailyGoalMinutes(parsed.dailyGoalMinutes ?? NaN)
        ? (parsed.dailyGoalMinutes as DailyGoalMinutes)
        : DEFAULT_SETTINGS.dailyGoalMinutes,
      reminderEnabled:
        typeof parsed.reminderEnabled === "boolean"
          ? parsed.reminderEnabled
          : DEFAULT_SETTINGS.reminderEnabled,
      reminderTime: normalizeReminderTime(parsed.reminderTime),
      appLanguage: isAppLocale(parsed.appLanguage)
        ? parsed.appLanguage
        : DEFAULT_SETTINGS.appLanguage,
      pronounceSpeed: isPronounceSpeed(parsed.pronounceSpeed)
        ? parsed.pronounceSpeed
        : DEFAULT_SETTINGS.pronounceSpeed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function writeAppSettings(next: AppSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("app-settings-changed", { detail: next }));
}

export function patchAppSettings(patch: Partial<AppSettings>): AppSettings {
  const next = { ...readAppSettings(), ...patch };
  writeAppSettings(next);
  return next;
}

export function getDefaultAppSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS };
}

export { getPronouncePlaybackRate } from "@/lib/pronounce-speed";
