const SETTINGS_KEY = "vocab-app-settings-v1";

/** Legacy keys from earlier experiments — strip on read (keep `learnerLocale: es`). */
export function normalizeLegacySettingsBlob(
  parsed: Record<string, unknown>,
): Record<string, unknown> {
  const cleaned = { ...parsed };
  if (cleaned.appLanguage === "es") {
    cleaned.appLanguage = "vi";
  }
  delete cleaned.userLanguage;
  delete cleaned.learningLanguage;
  return cleaned;
}

export function applyLegacySettingsCleanup(): void {
  if (typeof window === "undefined") return;
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    const cleaned = normalizeLegacySettingsBlob(parsed);
    if (JSON.stringify(cleaned) !== JSON.stringify(parsed)) {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(cleaned));
      window.dispatchEvent(new CustomEvent("app-settings-changed"));
    }
  } catch {
    localStorage.removeItem(SETTINGS_KEY);
  }
}
