const STARTUP_SPLASH_DONE_KEY = "ev-startup-splash-done-v1";

/** Capacitor static export reloads the WebView per route — show splash only once per app session. */
export function hasCompletedStartupSplash(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  try {
    return sessionStorage.getItem(STARTUP_SPLASH_DONE_KEY) === "1";
  } catch {
    return false;
  }
}

export function markStartupSplashCompleted(): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(STARTUP_SPLASH_DONE_KEY, "1");
  } catch {
    /* private mode */
  }
}
