import type { SupabaseClient } from "@supabase/supabase-js";

/** Accept only a recovery link, never an unrelated browser session. */
export async function initializePasswordRecovery(client: SupabaseClient, url: string): Promise<void> {
  const hash = new URLSearchParams(new URL(url).hash.slice(1));
  const access_token = hash.get("access_token");
  const refresh_token = hash.get("refresh_token");
  if (hash.get("type") !== "recovery" || !access_token || !refresh_token || hash.has("error")) {
    throw new Error("invalid-recovery-link");
  }
  const { data, error } = await client.auth.setSession({ access_token, refresh_token });
  if (error || !data.session) throw new Error("invalid-recovery-session");
}

export function validRecoveryPassword(password: string, confirmation: string): boolean {
  return password.length >= 8 && password === confirmation;
}
