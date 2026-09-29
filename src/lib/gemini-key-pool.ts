import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Multi-key rotation pool for the learner-locale translation pipeline
 * (backfill-translations.ts). Scoped to translation only — the main
 * enrichment pipeline in gemini-core.ts keeps using a single GEMINI_API_KEY.
 *
 * Env:
 *   GEMINI_API_KEYS="key1,key2,key3"  — comma/whitespace separated pool
 *   GEMINI_API_KEY                    — fallback single key when the list above is unset
 *   GEMINI_KEY_COOLDOWN_MS=65000      — 429 cooldown per key before it's eligible again
 */

export type GeminiKeyStatus = "active" | "cooldown" | "dead";

type KeyEntry = {
  key: string;
  client: GoogleGenerativeAI;
  status: GeminiKeyStatus;
  cooldownUntil: number;
  deadReason?: string;
  lastRequestAt: number;
};

export type GeminiKeyHandle = {
  key: string;
  client: GoogleGenerativeAI;
  masked: string;
};

export type GeminiErrorClass =
  | "model-not-found"
  | "dead-key"
  | "rate-limit"
  | "other";

const DEFAULT_COOLDOWN_MS = 65_000;

function maskKey(key: string): string {
  return key.length > 6 ? `...${key.slice(-6)}` : "...(short)";
}

function parseApiKeys(): string[] {
  const multi = process.env.GEMINI_API_KEYS?.trim();
  const raw = multi
    ? multi.split(/[,;\s]+/)
    : [process.env.GEMINI_API_KEY?.trim() ?? ""];

  const seen = new Set<string>();
  const keys: string[] = [];
  for (const candidate of raw) {
    const trimmed = candidate.trim();
    if (!trimmed || seen.has(trimmed)) continue;
    seen.add(trimmed);
    keys.push(trimmed);
  }
  return keys;
}

let pool: KeyEntry[] | null = null;
let cursor = 0;

function getPool(): KeyEntry[] {
  if (pool) return pool;
  const keys = parseApiKeys();
  pool = keys.map((key) => ({
    key,
    client: new GoogleGenerativeAI(key),
    status: "active",
    cooldownUntil: 0,
    lastRequestAt: 0,
  }));
  if (pool.length > 0) {
    console.log(
      `[gemini-pool] loaded ${pool.length} key(s): ${pool
        .map((entry) => maskKey(entry.key))
        .join(", ")}`,
    );
  } else {
    console.warn("[gemini-pool] no GEMINI_API_KEYS / GEMINI_API_KEY configured");
  }
  return pool;
}

export function geminiPoolSize(): number {
  return getPool().length;
}

function isEntryAvailable(entry: KeyEntry, now: number): boolean {
  if (entry.status === "dead") return false;
  if (entry.status === "cooldown" && entry.cooldownUntil > now) return false;
  return true;
}

/** Round-robin pick so load is spread across all active keys, not just on failure. */
export function pickNextGeminiKey(): GeminiKeyHandle | null {
  const entries = getPool();
  if (entries.length === 0) return null;
  const now = Date.now();

  for (let i = 0; i < entries.length; i++) {
    const idx = (cursor + i) % entries.length;
    const entry = entries[idx];
    if (isEntryAvailable(entry, now)) {
      cursor = (idx + 1) % entries.length;
      if (entry.status === "cooldown") entry.status = "active";
      return { key: entry.key, client: entry.client, masked: maskKey(entry.key) };
    }
  }
  return null;
}

/** Smallest remaining cooldown among non-dead keys, or null when nothing will ever recover. */
export function earliestGeminiCooldownWaitMs(): number | null {
  const entries = getPool();
  const now = Date.now();
  let earliest: number | null = null;
  for (const entry of entries) {
    if (entry.status !== "cooldown") continue;
    const wait = entry.cooldownUntil - now;
    if (wait <= 0) continue;
    if (earliest === null || wait < earliest) earliest = wait;
  }
  return earliest;
}

function findEntry(key: string): KeyEntry | undefined {
  return getPool().find((entry) => entry.key === key);
}

export function markGeminiKeyRateLimited(key: string): void {
  const entry = findEntry(key);
  if (!entry || entry.status === "dead") return;
  const cooldownMs = Math.max(
    5000,
    Number(process.env.GEMINI_KEY_COOLDOWN_MS ?? DEFAULT_COOLDOWN_MS) ||
      DEFAULT_COOLDOWN_MS,
  );
  entry.status = "cooldown";
  entry.cooldownUntil = Date.now() + cooldownMs;
  console.warn(
    `[gemini-pool] key ${maskKey(key)} → cooldown (429) for ${Math.round(cooldownMs / 1000)}s`,
  );
}

export function markGeminiKeyDead(key: string, reason: string): void {
  const entry = findEntry(key);
  if (!entry || entry.status === "dead") return;
  entry.status = "dead";
  entry.deadReason = reason;
  console.warn(`[gemini-pool] key ${maskKey(key)} → dead (${reason})`);
  logGeminiPoolSummary();
}

export function geminiPoolAllDead(): boolean {
  const entries = getPool();
  return entries.length > 0 && entries.every((entry) => entry.status === "dead");
}

export function logGeminiPoolSummary(): void {
  const entries = getPool();
  if (entries.length === 0) return;
  const active = entries.filter((e) => e.status === "active").length;
  const cooldown = entries.filter((e) => e.status === "cooldown").length;
  const dead = entries.filter((e) => e.status === "dead").length;
  console.log(
    `[gemini-pool] status: ${active} active, ${cooldown} cooldown, ${dead} dead (of ${entries.length})`,
  );
}

function geminiKeyMinIntervalMs(): number {
  const rpm = Number(process.env.GEMINI_MAX_RPM ?? "0");
  if (Number.isFinite(rpm) && rpm > 0) return Math.ceil(60000 / rpm);
  const explicit = Number(process.env.GEMINI_MIN_REQUEST_INTERVAL_MS ?? "0");
  return Number.isFinite(explicit) && explicit > 0 ? explicit : 0;
}

/** Per-key rate gate — GEMINI_MAX_RPM applies to each key independently. */
export async function awaitGeminiKeyRateLimit(key: string): Promise<void> {
  const gap = geminiKeyMinIntervalMs();
  if (gap <= 0) return;
  const entry = findEntry(key);
  if (!entry) return;
  const now = Date.now();
  const wait = entry.lastRequestAt + gap - now;
  if (wait > 0) {
    await new Promise((resolve) => setTimeout(resolve, wait));
  }
}

export function markGeminiKeyRequestDone(key: string): void {
  const entry = findEntry(key);
  if (entry) entry.lastRequestAt = Date.now();
}

export function classifyGeminiError(error: unknown): GeminiErrorClass {
  const msg = error instanceof Error ? error.message : String(error);
  if (/404|not found|not supported for generateContent/i.test(msg)) {
    return "model-not-found";
  }
  if (
    /402|payment required|credits are depleted|API_KEY_INVALID|api key not valid|invalid authentication credentials|401|ByteString|greater than 255/i.test(
      msg,
    )
  ) {
    // The ByteString/"greater than 255" case is a malformed key (e.g. stray
    // non-Latin1 characters from a paste/IME mishap) that fails client-side
    // before ever reaching Google — permanently broken, same as 401/402.
    return "dead-key";
  }
  if (/429|RESOURCE_EXHAUSTED|rate limit|quota/i.test(msg)) {
    return "rate-limit";
  }
  return "other";
}

export function describeGeminiError(error: unknown): string {
  const msg = error instanceof Error ? error.message : String(error);
  if (/402|payment required|credits are depleted/i.test(msg)) {
    return "402 billing depleted";
  }
  if (/401|invalid authentication credentials|API_KEY_INVALID|api key not valid/i.test(msg)) {
    return "401 invalid key";
  }
  if (/ByteString|greater than 255/i.test(msg)) {
    return "malformed key (non-ASCII characters)";
  }
  return "auth/billing error";
}

/** Test-only: reset module singleton state between test cases. */
export function __resetGeminiPoolForTests(): void {
  pool = null;
  cursor = 0;
}
