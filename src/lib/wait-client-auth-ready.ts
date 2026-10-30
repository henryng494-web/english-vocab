import { waitForSupabaseAuthInitialized } from "@/lib/supabase/wait-auth-initialized";

/** Best-effort session hydration — never block splash/bootstrap longer than a few seconds. */
export async function waitForClientAuthReady(timeoutMs = 4000): Promise<void> {
  await waitForSupabaseAuthInitialized(timeoutMs);
}
