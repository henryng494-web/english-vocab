import type { SupportedStorage } from "@supabase/supabase-js";

/** Explicit localStorage adapter — Supabase auth must not use @supabase/ssr cookies in Capacitor. */
export function createCapacitorAuthStorage(): SupportedStorage {
  return {
    getItem(key: string) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    setItem(key: string, value: string) {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* quota / private mode */
      }
    },
    removeItem(key: string) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
}
