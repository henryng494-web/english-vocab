import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getSupabaseConfig,
  getSupabaseConfigOptional,
} from "@/lib/supabase/env";

export function createClientIfConfigured(): SupabaseClient | null {
  const config = getSupabaseConfigOptional();
  if (!config) return null;
  return createBrowserClient(config.url, config.anonKey);
}

export function createClient(): SupabaseClient {
  const { url, anonKey } = getSupabaseConfig();
  return createBrowserClient(url, anonKey);
}
