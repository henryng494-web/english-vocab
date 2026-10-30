import { createClientIfConfigured } from "@/lib/supabase/client";

/**
 * Wait until Supabase has read persisted auth from storage (INITIAL_SESSION).
 * Avoids treating the user as signed-out while localStorage hydration is in flight.
 */
export function waitForSupabaseAuthInitialized(timeoutMs = 5000): Promise<void> {
  const supabase = createClientIfConfigured();
  if (!supabase || typeof window === "undefined") return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      resolve();
    };

    const timer = window.setTimeout(finish, timeoutMs);

    const cleanup = () => {
      window.clearTimeout(timer);
      listener.subscription.unsubscribe();
    };

    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "INITIAL_SESSION") {
        cleanup();
        finish();
      }
    });

    // INITIAL_SESSION may have fired before this listener was registered.
    void supabase.auth.getSession().finally(() => {
      window.setTimeout(() => {
        if (!settled) {
          cleanup();
          finish();
        }
      }, 64);
    });
  });
}
