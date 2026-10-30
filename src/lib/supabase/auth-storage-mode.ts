import { Capacitor } from "@capacitor/core";
import { MOBILE_APP_ORIGINS } from "@/lib/mobile-api-cors";
import { isNativeCapacitorShell } from "@/lib/network-status";

/** Stable string for verify-mobile-bundle.mjs (must survive minification). */
export const MOBILE_AUTH_STORAGE_VERIFY_TOKEN = "jj-supabase-auth-localStorage-v2";

const IS_MOBILE_BUILD = process.env.NEXT_PUBLIC_MOBILE_BUILD === "1";
const BAKED_API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").trim();

function isCapacitorWebViewOrigin(): boolean {
  if (typeof window === "undefined") return false;
  const origin = window.location.origin;
  if (MOBILE_APP_ORIGINS.has(origin)) return true;
  const protocol = window.location.protocol;
  return protocol === "capacitor:" || protocol === "ionic:";
}

function isCapacitorBridgeReady(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const w = window as Window & { Capacitor?: { isNativePlatform?: () => boolean } };
    if (w.Capacitor?.isNativePlatform?.()) return true;
  } catch {
    /* ignore */
  }
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/**
 * Capacitor static export uses full document loads (`window.location.assign`).
 * @supabase/ssr `createBrowserClient` persists in cookies, which WKWebView often drops.
 * Prefer supabase-js + localStorage whenever we are in the mobile shell.
 *
 * Do not rely on `NEXT_PUBLIC_MOBILE_BUILD` alone — CI must run `build:mobile`, but we also
 * detect Capacitor at runtime and treat any bundle with a baked API base as mobile.
 */
export function shouldUseLocalStorageAuthPersistence(): boolean {
  if (IS_MOBILE_BUILD) return true;
  if (BAKED_API_BASE.length > 0) return true;
  if (typeof window === "undefined") return false;
  if (isCapacitorWebViewOrigin()) return true;
  if (isCapacitorBridgeReady()) return true;
  return isNativeCapacitorShell();
}

export type SupabaseAuthPersistenceMode = "localStorage" | "cookie";

export function supabaseAuthPersistenceMode(): SupabaseAuthPersistenceMode {
  return shouldUseLocalStorageAuthPersistence() ? "localStorage" : "cookie";
}
