import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceSupabase } from "@/lib/supabase/admin";

let cachedWriteClient: SupabaseClient | null | undefined;

/** Service-role client for catalog / multilang writes (bypasses RLS). */
export function getSupabaseWriteClient(): SupabaseClient | null {
  if (cachedWriteClient !== undefined) return cachedWriteClient;
  try {
    cachedWriteClient = createServiceSupabase();
  } catch (error) {
    console.warn("[supabase] write client unavailable:", error);
    cachedWriteClient = null;
  }
  return cachedWriteClient;
}
