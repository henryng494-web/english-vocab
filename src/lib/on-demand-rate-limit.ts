/**
 * Best-effort in-memory limiter for on-demand word generation (per server
 * instance). Protects Gemini quota from spammed lookups of junk words.
 */
const WINDOW_MS = 60_000;
const PER_CLIENT_LIMIT = Number(process.env.ON_DEMAND_WORDS_PER_MINUTE ?? 6) || 6;
const GLOBAL_LIMIT = Number(process.env.ON_DEMAND_WORDS_GLOBAL_PER_MINUTE ?? 40) || 40;

const perClient = new Map<string, number[]>();
let globalHits: number[] = [];

function prune(list: number[], now: number): number[] {
  return list.filter((t) => now - t < WINDOW_MS);
}

export function clientKeyFromRequest(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return fwd || request.headers.get("x-real-ip") || "unknown";
}

/** Returns seconds to wait when over the limit, otherwise records the hit and returns 0. */
export function takeOnDemandSlot(clientKey: string, now = Date.now()): number {
  globalHits = prune(globalHits, now);
  const mine = prune(perClient.get(clientKey) ?? [], now);
  if (globalHits.length >= GLOBAL_LIMIT) {
    return Math.max(1, Math.ceil((WINDOW_MS - (now - globalHits[0])) / 1000));
  }
  if (mine.length >= PER_CLIENT_LIMIT) {
    return Math.max(1, Math.ceil((WINDOW_MS - (now - mine[0])) / 1000));
  }
  mine.push(now);
  globalHits.push(now);
  perClient.set(clientKey, mine);
  if (perClient.size > 5000) {
    for (const [key, hits] of perClient) {
      if (!prune(hits, now).length) perClient.delete(key);
    }
  }
  return 0;
}

/** Plausible English headword: letters/'-' only, has a vowel, no long repeats. */
export function isPlausibleOnDemandWord(word: string): boolean {
  if (!/^[a-z][a-z'-]{1,28}[a-z]$/.test(word)) return false;
  if (!/[aeiouy]/.test(word)) return false;
  if (/(.)\1{3,}/.test(word)) return false;
  if (/[^aeiouy'-]{5,}/.test(word) && !/(?:ngths|ghts|rths|thms)$/.test(word)) {
    return false;
  }
  return true;
}
