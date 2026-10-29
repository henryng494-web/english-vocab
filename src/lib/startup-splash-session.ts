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

/** @deprecated Splash always runs on cold start; kept for older bundles that still import it. */
export function shouldSkipStartupSplashForReturningUser(): boolean {
  return false;
}
