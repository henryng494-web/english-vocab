"use client";

import {
  getDefaultAppSettings,
  patchAppSettings,
  readAppSettings,
  type AppSettings,
  type DailyGoalMinutes,
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
  setReminderEnabled: (enabled: boolean) => void;
  setReminderTime: (time: string) => void;
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
      setReminderEnabled: (enabled) =>
        setSettings(patchAppSettings({ reminderEnabled: enabled })),
      setReminderTime: (time) =>
        setSettings(patchAppSettings({ reminderTime: time })),
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
