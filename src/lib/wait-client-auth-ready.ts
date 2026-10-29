import { createClientIfConfigured } from "@/lib/supabase/client";

/** Best-effort session read — never block splash/bootstrap longer than a few seconds. */
export async function waitForClientAuthReady(timeoutMs = 2500): Promise<void> {
  const supabase = createClientIfConfigured();
  if (!supabase || typeof window === "undefined") return;

  await Promise.race([
    supabase.auth.getSession().catch(() => undefined),
    new Promise<void>((resolve) => {
      window.setTimeout(resolve, timeoutMs);
    }),
  ]);
}
