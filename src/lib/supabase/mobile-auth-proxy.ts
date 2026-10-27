import { API_BASE_URL } from "@/lib/api-base";
import { isNativeCapacitorShell } from "@/lib/network-status";

/** Forward Supabase Auth REST through the deployed site (CORS-safe for Capacitor WebViews). */
export function shouldProxySupabaseAuthFetch(resolvedUrl: string, supabaseUrl: string): boolean {
  if (!API_BASE_URL || !isNativeCapacitorShell()) return false;
  try {
    const base = new URL(supabaseUrl);
    const target = new URL(resolvedUrl);
    if (target.origin !== base.origin) return false;
    return target.pathname.startsWith("/auth/v1/");
  } catch {
    return false;
  }
}

export function toSupabaseAuthProxyUrl(resolvedUrl: string, supabaseUrl: string): string {
  const target = new URL(resolvedUrl);
  const base = new URL(supabaseUrl);
  const suffix = target.pathname.slice("/auth/v1/".length) + target.search;
  return `${API_BASE_URL}/api/supabase-auth/${suffix}`;
}
