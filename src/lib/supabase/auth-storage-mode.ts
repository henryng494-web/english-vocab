import { IS_MOBILE_BUILD } from "@/lib/api-base";
import { isNativeCapacitorShell } from "@/lib/network-status";

/**
 * Capacitor static export uses full document loads (`window.location.assign`).
 * @supabase/ssr's default cookie storage does not persist reliably in WKWebView;
 * use supabase-js localStorage persistence instead.
 */
export function shouldUseLocalStorageAuthPersistence(): boolean {
  if (IS_MOBILE_BUILD) return true;
  if (typeof window === "undefined") return false;
  return isNativeCapacitorShell();
}
