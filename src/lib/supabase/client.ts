import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { logSupabaseAuthError } from "@/lib/auth-errors";
import {
  isBrowserOfflineSignal,
  isUnreliableNavigatorOnLine,
} from "@/lib/network-status";
import {
  getSupabaseConfig,
  getSupabaseConfigOptional,
} from "@/lib/supabase/env";

function capacitorAwareFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  if (isBrowserOfflineSignal()) {
    console.warn("[supabase-auth] navigator.onLine is false (web); attempting fetch anyway");
  } else if (
    isUnreliableNavigatorOnLine() &&
    typeof navigator !== "undefined" &&
    navigator.onLine === false
  ) {
    console.info(
      "[supabase-auth] navigator.onLine is false in Capacitor; ignoring offline signal and calling fetch",
    );
  }
  return globalThis.fetch(input, init).catch((err) => {
    const target =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.href
          : input instanceof Request
            ? input.url
            : String(input);
    logSupabaseAuthError("fetch", err, { url: target });
    throw err;
  });
}

function browserClientOptions() {
  return isUnreliableNavigatorOnLine()
    ? { global: { fetch: capacitorAwareFetch } }
    : undefined;
}

let sharedBrowserClient: SupabaseClient | null = null;

export function createClientIfConfigured(): SupabaseClient | null {
  const config = getSupabaseConfigOptional();
  if (!config) return null;
  if (!sharedBrowserClient) {
    sharedBrowserClient = createBrowserClient(config.url, config.anonKey, browserClientOptions());
  }
  return sharedBrowserClient;
}

export function createClient(): SupabaseClient {
  const configured = createClientIfConfigured();
  if (configured) return configured;
  const { url, anonKey } = getSupabaseConfig();
  sharedBrowserClient = createBrowserClient(url, anonKey, browserClientOptions());
  return sharedBrowserClient;
}
