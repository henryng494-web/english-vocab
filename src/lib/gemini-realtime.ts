/**
 * Kill switch for realtime (request-time) Gemini calls.
 *
 * Inside the Next.js server (dev, `next start`, Vercel) realtime Gemini is OFF
 * by default: cards are served from the static data already stored in Supabase.
 * Offline scripts (backfill, enrich:*, re-enrich:*) run outside Next and keep
 * using Gemini normally.
 *
 *   DISABLE_REALTIME_GEMINI=1   force off (default inside Next)
 *   DISABLE_REALTIME_GEMINI=0   force on (e.g. local debugging of enrichment)
 */
export function isRealtimeGeminiDisabled(): boolean {
  const explicit = process.env.DISABLE_REALTIME_GEMINI?.trim().toLowerCase();
  if (explicit === "1" || explicit === "true" || explicit === "yes") return true;
  if (explicit === "0" || explicit === "false" || explicit === "no") return false;
  return Boolean(process.env.NEXT_RUNTIME);
}

/** `GEMINI_API_KEY` (trimmed), or "" when realtime Gemini is disabled — drop-in for key-presence checks. */
export function geminiRealtimeKey(): string {
  if (isRealtimeGeminiDisabled()) return "";
  return process.env.GEMINI_API_KEY?.trim() ?? "";
}
