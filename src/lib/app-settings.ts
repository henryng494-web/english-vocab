import type { AppLocale } from "@/lib/i18n/messages";
import {
  DEFAULT_APP_LOCALE,
  isAppLocale,
  normalizeAppLocale,
} from "@/lib/i18n/messages";
import { pairedLanguageSettings } from "@/lib/learner-app-sync";
import {
  DEFAULT_PRONOUNCE_ACCENT,
  isPronounceAccent,
  type PronounceAccent,
} from "@/lib/pronounce-accent";
import {
  DEFAULT_LEARNER_LOCALE,
  isLearnerLocale,
  LEARNER_LOCALE_OPTIONS,
  LEARNER_LOCALE_LABELS,
  type LearnerLocale,
} from "@/lib/learner-locale";
import {
  DEFAULT_PRONOUNCE_SPEED,
  isPronounceSpeed,
  type PronounceSpeed,
} from "@/lib/pronounce-speed";

export type { LearnerLocale, PronounceAccent, PronounceSpeed };
export { LEARNER_LOCALE_OPTIONS, LEARNER_LOCALE_LABELS } from "@/lib/learner-locale";
export { PRONOUNCE_ACCENT_OPTIONS } from "@/lib/pronounce-accent";
export { PRONOUNCE_SPEED_OPTIONS } from "@/lib/pronounce-speed";

export type DailyGoalMinutes = 10 | 20 | 30 | 60 | 90 | 120;

export type GoalType = "minutes" | "new_words" | "reviews";

export type CountGoalTarget = 5 | 10 | 15 | 20 | 30;

export type AppSettings = {
  autoSpeakEnabled: boolean;
  dailyGoalMinutes: DailyGoalMinutes;
  /** Primary daily goal metric — drives progress bar and streak. */
  goalType: GoalType;
  /** Target count when goalType is new_words or reviews. */
  goalTargetCount: CountGoalTarget;
  reminderEnabled: boolean;
  /** 24h local time HH:MM */
  reminderTime: string;
  /** Interface language — word content stays bilingual. */
  appLanguage: AppLocale;
  /** MP3 playback speed — learner preference from menu. */
  pronounceSpeed: PronounceSpeed;
  /** US / UK / AU neural + dictionary accent from menu. */
  pronounceAccent: PronounceAccent;
  /** Gloss + example translation language on flashcards. */
  learnerLocale: LearnerLocale;
};

export const DAILY_GOAL_OPTIONS: readonly DailyGoalMinutes[] = [
  10, 20, 30, 60, 90, 120,
];

export const COUNT_GOAL_OPTIONS: readonly CountGoalTarget[] = [
  5, 10, 15, 20, 30,
];

export const GOAL_TYPE_OPTIONS: readonly GoalType[] = [
  "minutes",
  "new_words",
  "reviews",
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
  goalType: "minutes",
  goalTargetCount: 10,
  reminderEnabled: false,
  reminderTime: "19:00",
  appLanguage: DEFAULT_APP_LOCALE,
  pronounceSpeed: DEFAULT_PRONOUNCE_SPEED,
  pronounceAccent: DEFAULT_PRONOUNCE_ACCENT,
  learnerLocale: DEFAULT_LEARNER_LOCALE,
};

function isDailyGoalMinutes(value: number): value is DailyGoalMinutes {
  return DAILY_GOAL_OPTIONS.includes(value as DailyGoalMinutes);
}

function isCountGoalTarget(value: number): value is CountGoalTarget {
  return COUNT_GOAL_OPTIONS.includes(value as CountGoalTarget);
}

function isGoalType(value: unknown): value is GoalType {
  return value === "minutes" || value === "new_words" || value === "reviews";
}

function normalizeReminderTime(value: unknown): string {
  if (typeof value !== "string") return DEFAULT_SETTINGS.reminderTime;
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  return match ? value.trim() : DEFAULT_SETTINGS.reminderTime;
}

function normalizeAppSettings(parsed: Partial<AppSettings>): AppSettings {
  const dailyGoalMinutes = isDailyGoalMinutes(parsed.dailyGoalMinutes ?? NaN)
    ? (parsed.dailyGoalMinutes as DailyGoalMinutes)
    : DEFAULT_SETTINGS.dailyGoalMinutes;

  return {
    autoSpeakEnabled:
      typeof parsed.autoSpeakEnabled === "boolean"
        ? parsed.autoSpeakEnabled
        : DEFAULT_SETTINGS.autoSpeakEnabled,
    dailyGoalMinutes,
    goalType: "minutes",
    goalTargetCount: isCountGoalTarget(parsed.goalTargetCount ?? NaN)
      ? (parsed.goalTargetCount as CountGoalTarget)
      : DEFAULT_SETTINGS.goalTargetCount,
      reminderEnabled:
        typeof parsed.reminderEnabled === "boolean"
          ? parsed.reminderEnabled
          : DEFAULT_SETTINGS.reminderEnabled,
      reminderTime: normalizeReminderTime(parsed.reminderTime),
      appLanguage: isAppLocale(parsed.appLanguage)
        ? normalizeAppLocale(parsed.appLanguage)
        : DEFAULT_SETTINGS.appLanguage,
    pronounceSpeed: isPronounceSpeed(parsed.pronounceSpeed)
      ? parsed.pronounceSpeed
      : DEFAULT_SETTINGS.pronounceSpeed,
    pronounceAccent: isPronounceAccent(parsed.pronounceAccent)
      ? parsed.pronounceAccent
      : DEFAULT_SETTINGS.pronounceAccent,
    learnerLocale: isLearnerLocale(parsed.learnerLocale)
      ? parsed.learnerLocale
      : DEFAULT_SETTINGS.learnerLocale,
  };
}

function syncPairedLocales(settings: AppSettings): AppSettings {
  if (settings.appLanguage === settings.learnerLocale) return settings;
  return {
    ...settings,
    appLanguage: settings.learnerLocale,
    learnerLocale: settings.learnerLocale,
  };
}

export function readAppSettings(): AppSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const normalized = normalizeAppSettings(parsed);
    if (parsed.goalType && parsed.goalType !== "minutes") {
      writeAppSettings(normalized);
    }
    return syncPairedLocales(normalized);
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
  const current = readAppSettings();
  let merged: Partial<AppSettings> = {
    ...current,
    ...patch,
    goalType: "minutes",
  };

  if (patch.learnerLocale !== undefined && patch.appLanguage === undefined) {
    Object.assign(merged, pairedLanguageSettings(patch.learnerLocale));
  } else if (patch.appLanguage !== undefined && patch.learnerLocale === undefined) {
    Object.assign(
      merged,
      pairedLanguageSettings(normalizeAppLocale(patch.appLanguage)),
    );
  }

  const next = syncPairedLocales(normalizeAppSettings(merged));
  writeAppSettings(next);
  return next;
}

export function getDefaultAppSettings(): AppSettings {
  return { ...DEFAULT_SETTINGS };
}

export { getPronouncePlaybackRate } from "@/lib/pronounce-speed";
