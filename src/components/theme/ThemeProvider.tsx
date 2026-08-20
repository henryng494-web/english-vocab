"use client";

import {
  APP_THEMES,
  DEFAULT_THEME_ID,
  type AppThemeId,
} from "@/data/app-themes";
import { loadThemeId, saveThemeId } from "@/lib/theme-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type ThemeContextValue = {
  themeId: AppThemeId;
  setThemeId: (themeId: AppThemeId) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function applyThemeToDocument(themeId: AppThemeId): void {
  const theme = APP_THEMES[themeId];
  const root = document.documentElement;

  for (const [key, value] of Object.entries(theme.cssVars)) {
    root.style.setProperty(key, value);
  }

  root.dataset.theme = themeId;

  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme.cssVars["--primary"] ?? "#2563eb");
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<AppThemeId>(DEFAULT_THEME_ID);

  useEffect(() => {
    const saved = loadThemeId();
    setThemeIdState(saved);
    applyThemeToDocument(saved);
  }, []);

  const setThemeId = useCallback((nextThemeId: AppThemeId) => {
    setThemeIdState(nextThemeId);
    saveThemeId(nextThemeId);
    applyThemeToDocument(nextThemeId);
  }, []);

  const value = useMemo(
    () => ({ themeId, setThemeId }),
    [themeId, setThemeId],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useAppTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within ThemeProvider");
  }
  return context;
}
