import { createClientIfConfigured } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";

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
