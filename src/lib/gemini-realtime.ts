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
type ScopeStore = {
  enterWith(value: boolean): void;
  getStore(): boolean | undefined;
};

/** Server-only: resolved at runtime so client bundles never reference `node:async_hooks`. */
function createScope(): ScopeStore | null {
  if (typeof window !== "undefined") return null;
  const getBuiltin = (
    process as unknown as { getBuiltinModule?: (id: string) => unknown }
  ).getBuiltinModule;
  const mod = getBuiltin?.("node:async_hooks") as
    | { AsyncLocalStorage: new () => ScopeStore }
    | undefined;
  return mod ? new mod.AsyncLocalStorage() : null;
}

const onDemandScope = createScope();

/**
 * Opens the request-scoped exception used by `/api/discover/word` for words that
 * are not in Supabase yet. Everything awaited after this call in the same request
 * may use Gemini; other requests stay locked. `DISABLE_ON_DEMAND_NEW_WORD=1`
 * closes the exception entirely.
 */
export function allowOnDemandGeminiForThisRequest(): boolean {
  const off = process.env.DISABLE_ON_DEMAND_NEW_WORD?.trim().toLowerCase();
  if (off === "1" || off === "true" || off === "yes") return false;
  if (!onDemandScope) return false;
  onDemandScope.enterWith(true);
  return true;
}

export function isRealtimeGeminiDisabled(): boolean {
  if (onDemandScope?.getStore()) return false;
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
