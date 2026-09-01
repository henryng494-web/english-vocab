"use client";

import type { AppLocale } from "@/lib/i18n/messages";
import {
  getDefaultAppSettings,
  patchAppSettings,
  readAppSettings,
  type AppSettings,
  type CountGoalTarget,
  type DailyGoalMinutes,
  type GoalType,
  type PronounceSpeed,
} from "@/lib/app-settings";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type AppSettingsContextValue = AppSettings & {
  setAutoSpeakEnabled: (enabled: boolean) => void;
  setDailyGoalMinutes: (minutes: DailyGoalMinutes) => void;
  setGoalType: (goalType: GoalType) => void;
  setGoalTargetCount: (count: CountGoalTarget) => void;
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
  setAppLanguage: (language: AppLocale) => void;
  setPronounceSpeed: (speed: PronounceSpeed) => void;
  refresh: () => void;
};

const AppSettingsContext = createContext<AppSettingsContextValue | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(getDefaultAppSettings);

  const refresh = useCallback(() => {
    setSettings(readAppSettings());
  }, []);

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("app-settings-changed", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("app-settings-changed", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, [refresh]);

  const value = useMemo<AppSettingsContextValue>(
    () => ({
      ...settings,
      setAutoSpeakEnabled: (enabled) =>
        setSettings(patchAppSettings({ autoSpeakEnabled: enabled })),
      setDailyGoalMinutes: (minutes) =>
        setSettings(patchAppSettings({ dailyGoalMinutes: minutes })),
      setGoalType: (goalType) =>
        setSettings(patchAppSettings({ goalType })),
      setGoalTargetCount: (count) =>
        setSettings(patchAppSettings({ goalTargetCount: count })),
      setReminderEnabled: (enabled) =>
        setSettings(patchAppSettings({ reminderEnabled: enabled })),
      setReminderTime: (time) =>
        setSettings(patchAppSettings({ reminderTime: time })),
      setAppLanguage: (language) =>
        setSettings(patchAppSettings({ appLanguage: language })),
      setPronounceSpeed: (speed) =>
        setSettings(patchAppSettings({ pronounceSpeed: speed })),
      refresh,
    }),
    [settings, refresh],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings(): AppSettingsContextValue {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) {
    throw new Error("useAppSettings must be used within AppSettingsProvider");
  }
  return ctx;
}

export function useAutoSpeakSetting(): boolean {
  return useAppSettings().autoSpeakEnabled;
}
