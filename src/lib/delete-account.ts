import { apiUrl } from "@/lib/api-base";
import { createClientIfConfigured } from "@/lib/supabase/client";

/**
 * Deletes the server-side account (when signed in), then wipes every local key and
 * returns to the start of the app. Throws without touching local data if the server
 * refuses, so the user can retry.
 */
export async function deleteAccountAndData(): Promise<void> {
  const supabase = createClientIfConfigured();
  const { data } = supabase ? await supabase.auth.getSession() : { data: { session: null } };
  const token = data.session?.access_token;

  if (token) {
    const response = await fetch(apiUrl("/api/account/delete"), {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("account-delete-failed");
    try {
      await supabase?.auth.signOut({ scope: "local" });
    } catch {
      /* account already removed server-side */
    }
  }

  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    /* storage unavailable */
  }
  try {
    if ("caches" in window) {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
    }
  } catch {
    /* best effort */
  }
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();
    if (name) document.cookie = `${name}=; Max-Age=0; path=/`;
  });
  window.location.replace("/");
}
