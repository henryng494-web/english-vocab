import { AUTH_SESSION_EVENT } from "@/context/AuthSessionContext";
import { createClientIfConfigured } from "@/lib/supabase/client";

/** Ensure Supabase reads persisted session from storage before discover bootstrap fetch. */
export async function waitForClientAuthReady(timeoutMs = 6000): Promise<void> {
  const supabase = createClientIfConfigured();
  if (!supabase || typeof window === "undefined") return;

  await supabase.auth.getSession();

  await new Promise<void>((resolve) => {
    const finish = () => {
      window.removeEventListener(AUTH_SESSION_EVENT, onAuth);
      window.clearTimeout(timer);
      resolve();
    };
    const onAuth = () => finish();
    const timer = window.setTimeout(finish, timeoutMs);
    window.addEventListener(AUTH_SESSION_EVENT, onAuth, { once: true });
  });

  await supabase.auth.getSession();
}
