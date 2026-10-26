import { API_BASE_URL } from "@/lib/api-base";

/** HTTPS site that hosts `/auth/callback` (Vercel). Never use Capacitor WebView origins. */
export function getAuthSiteOrigin(): string {
  const fromEnv = API_BASE_URL.trim();
  if (fromEnv.startsWith("https://")) return fromEnv;

  if (typeof window !== "undefined") {
    const origin = window.location.origin;
    if (origin.startsWith("https://")) return origin.replace(/\/+$/, "");
  }

  return "";
}

export function getAuthCallbackUrl(): string | undefined {
  const origin = getAuthSiteOrigin();
  return origin ? `${origin}/auth/callback` : undefined;
}
