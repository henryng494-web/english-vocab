const STARTUP_SPLASH_DONE_KEY = "ev-startup-splash-done-v2";

/** In-memory flag survives client-side tab changes without full document reload. */
let startupSplashDismissedInMemory = false;

/** Capacitor static export reloads HTML per route — persist splash dismissal in localStorage. */
export function hasCompletedStartupSplash(): boolean {
  if (startupSplashDismissedInMemory) return true;
  if (typeof localStorage === "undefined") return false;
  try {
    return localStorage.getItem(STARTUP_SPLASH_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markStartupSplashCompleted(): void {
  startupSplashDismissedInMemory = true;
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STARTUP_SPLASH_DONE_KEY, "1");
  } catch {
    /* private mode */
  }
}

/** Returning learners with setup done should never see splash again (cold start included). */
export function shouldSkipStartupSplashForReturningUser(): boolean {
  if (hasCompletedStartupSplash()) return true;
  if (typeof localStorage === "undefined") return false;
  try {
    const nickname = localStorage.getItem("vocab-learner-display-name")?.trim();
    const settingsRaw = localStorage.getItem("vocab-app-settings-v1");
    if (!nickname || !settingsRaw) return false;
    const settings = JSON.parse(settingsRaw) as { hasOnboarded?: boolean };
    if (settings.hasOnboarded !== true) return false;
    markStartupSplashCompleted();
    return true;
  } catch {
    return false;
  }
}
