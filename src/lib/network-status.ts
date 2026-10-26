import { Capacitor } from "@capacitor/core";

export function isNativeCapacitorShell(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/** WKWebView often reports `navigator.onLine === false` while HTTPS fetch still works. */
export function isUnreliableNavigatorOnLine(): boolean {
  return process.env.NEXT_PUBLIC_MOBILE_BUILD === "1" || isNativeCapacitorShell();
}

/**
 * Never use this to block auth/API — diagnostic only. On Capacitor, always returns false
 * so we do not treat the device as offline based on navigator.onLine alone.
 */
export function isBrowserOfflineSignal(): boolean {
  if (isUnreliableNavigatorOnLine()) return false;
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

export function isLikelyFetchFailure(error: unknown): boolean {
  if (error instanceof TypeError) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes("failed to fetch") ||
      msg.includes("load failed") ||
      msg.includes("networkerror when attempting to fetch")
    );
  }
  if (error && typeof error === "object") {
    const name = "name" in error ? String(error.name) : "";
    if (name === "AuthRetryableFetchError" || name === "FetchError") return true;
    const msg = ("message" in error ? String(error.message) : "").toLowerCase();
    if (msg.includes("failed to fetch") || msg.includes("network request failed")) {
      return true;
    }
  }
  return false;
}
