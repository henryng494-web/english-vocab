import {
  DEFAULT_THEME_ID,
  isAppThemeId,
  THEME_STORAGE_KEY,
  type AppThemeId,
} from "@/data/app-themes";

export function loadThemeId(): AppThemeId {
  if (typeof window === "undefined") return DEFAULT_THEME_ID;

  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (saved && isAppThemeId(saved)) return saved;
  } catch {
    // ignore storage errors
  }

  return DEFAULT_THEME_ID;
}

export function saveThemeId(themeId: AppThemeId): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(THEME_STORAGE_KEY, themeId);
  } catch {
    // ignore storage errors
  }
}
