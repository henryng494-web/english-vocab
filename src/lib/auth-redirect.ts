import { API_BASE_URL, IS_MOBILE_BUILD } from "@/lib/api-base";
import { Capacitor } from "@capacitor/core";

function isCapacitorShell(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function isMobileAuthContext(): boolean {
  return IS_MOBILE_BUILD || isCapacitorShell();
}

/**
 * HTTPS origin for auth email links. On Capacitor / mobile export, only
 * `NEXT_PUBLIC_API_BASE_URL` is used — never `window.location.origin`.
 */
export function getAuthSiteOrigin(): string {
  const fromEnv = API_BASE_URL.trim();
  if (fromEnv.startsWith("https://")) return fromEnv;

  if (isMobileAuthContext()) {
    return "";
  }

  if (typeof window !== "undefined") {
    const origin = window.location.origin.replace(/\/+$/, "");
    if (origin.startsWith("https://") && !/localhost|127\.0\.0\.1/i.test(origin)) {
      return origin;
    }
  }

  return "";
}

export function getAuthCallbackUrl(): string | undefined {
  const origin = getAuthSiteOrigin();
  return origin ? `${origin}/auth/callback` : undefined;
}

export type AuthCallbackResult =
  | { ok: true; url: string; origin: string }
  | { ok: false; reason: "missing_api_base" | "invalid_api_base" };

/** Sign-up / reset links on mobile require a baked-in production API base URL. */
export function resolveAuthCallbackUrl(): AuthCallbackResult {
  const origin = getAuthSiteOrigin();
  if (!origin) {
    if (isMobileAuthContext()) {
      return { ok: false, reason: "missing_api_base" };
    }
    return { ok: false, reason: "invalid_api_base" };
  }
  return { ok: true, origin, url: `${origin}/auth/callback` };
}
