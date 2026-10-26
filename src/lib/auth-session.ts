import { createClientIfConfigured } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

/** Sync flag for usage caps (guest vs signed-in) — updated by {@link AuthSessionProvider}. */
export const AUTH_SIGNED_IN_STORAGE_KEY = "jj-auth-signed-in-v1";

export function persistAuthSignedInFlag(signedIn: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUTH_SIGNED_IN_STORAGE_KEY, signedIn ? "1" : "0");
  } catch {
    /* private / blocked storage — guest limits still use other keys in same tab */
  }
}

/** Best-effort signed-in flag for synchronous quota checks (defaults to guest when unset). */
export function isAuthSignedInSync(): boolean {
  if (!isSupabaseConfigured()) return true;
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(AUTH_SIGNED_IN_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function isGuestUser(): boolean {
  return isSupabaseConfigured() && !isAuthSignedInSync();
}

/** True when Supabase auth is off or the browser already has a session. */
export async function isClientSignedIn(): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;
  const supabase = createClientIfConfigured();
  if (!supabase) return false;
  try {
    const { data } = await supabase.auth.getSession();
    return Boolean(data.session?.user);
  } catch {
    return false;
  }
}

export function loginPathWithReturn(returnPath: string): string {
  const safe =
    returnPath.startsWith("/") && !returnPath.startsWith("//") ? returnPath : "/discover";
  return `/auth/login?next=${encodeURIComponent(safe)}`;
}
