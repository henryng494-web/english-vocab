import { createBrowserClient } from "@supabase/ssr";
import { createClient as createSupabaseJsClient, type SupabaseClient } from "@supabase/supabase-js";
import { logSupabaseAuthError } from "@/lib/auth-errors";
import {
  MOBILE_AUTH_STORAGE_VERIFY_TOKEN,
  shouldUseLocalStorageAuthPersistence,
  supabaseAuthPersistenceMode,
} from "@/lib/supabase/auth-storage-mode";
import { createCapacitorAuthStorage } from "@/lib/supabase/capacitor-auth-storage";
import {
  isBrowserOfflineSignal,
  isUnreliableNavigatorOnLine,
} from "@/lib/network-status";
import {
  getSupabaseConfig,
  getSupabaseConfigOptional,
} from "@/lib/supabase/env";
import {
  shouldProxySupabaseAuthFetch,
  toSupabaseAuthProxyUrl,
} from "@/lib/supabase/mobile-auth-proxy";

function resolveFetchUrl(input: RequestInfo | URL): string {
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.href;
  if (input instanceof Request) return input.url;
  return String(input);
}

function capacitorAwareFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const config = getSupabaseConfigOptional();
  const resolved = resolveFetchUrl(input);
  if (config && shouldProxySupabaseAuthFetch(resolved, config.url)) {
    const proxyUrl = toSupabaseAuthProxyUrl(resolved, config.url);
    return globalThis.fetch(proxyUrl, init).catch((err) => {
      logSupabaseAuthError("fetch:auth-proxy", err, { url: proxyUrl });
      throw err;
    });
  }
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
  return { global: { fetch: capacitorAwareFetch } };
}

function createWebBrowserClient(url: string, anonKey: string): SupabaseClient {
  return createBrowserClient(url, anonKey, browserClientOptions());
}

function createCapacitorBrowserClient(url: string, anonKey: string): SupabaseClient {
  return createSupabaseJsClient(url, anonKey, {
    ...browserClientOptions(),
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      // Static export routes carry no OAuth callback; parsing the URL can clear a valid session.
      detectSessionInUrl: false,
      flowType: "pkce",
      storage: createCapacitorAuthStorage(),
    },
  });
}

function createSharedBrowserClient(url: string, anonKey: string): SupabaseClient {
  if (typeof window !== "undefined" && shouldUseLocalStorageAuthPersistence()) {
    if (typeof console !== "undefined") {
      console.info(
        `[supabase-auth] persistence=${supabaseAuthPersistenceMode()} token=${MOBILE_AUTH_STORAGE_VERIFY_TOKEN}`,
      );
    }
    return createCapacitorBrowserClient(url, anonKey);
  }
  return createWebBrowserClient(url, anonKey);
}

let sharedBrowserClient: SupabaseClient | null = null;

export function createClientIfConfigured(): SupabaseClient | null {
  const config = getSupabaseConfigOptional();
  if (!config) return null;
  if (!sharedBrowserClient) {
    sharedBrowserClient = createSharedBrowserClient(config.url, config.anonKey);
  }
  return sharedBrowserClient;
}

export function createClient(): SupabaseClient {
  const configured = createClientIfConfigured();
  if (configured) return configured;
  const { url, anonKey } = getSupabaseConfig();
  sharedBrowserClient = createSharedBrowserClient(url, anonKey);
  return sharedBrowserClient;
}
