/** Capacitor WebView origins — must match middleware.ts */
export const MOBILE_APP_ORIGINS = new Set([
  "capacitor://localhost",
  "https://localhost",
  "http://localhost",
  "ionic://localhost",
]);

export function mobileCorsHeaders(origin: string): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, apikey, X-Client-Info, X-Supabase-Api-Version",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function isAllowedMobileOrigin(origin: string | null): boolean {
  return Boolean(origin && MOBILE_APP_ORIGINS.has(origin));
}
