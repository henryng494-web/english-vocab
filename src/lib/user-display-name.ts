import type { User } from "@supabase/supabase-js";

export const LEARNER_DISPLAY_NAME_KEY = "vocab-learner-display-name";
export const LEARNER_DISPLAY_NAME_EVENT = "learner-display-name-changed";

/** Best-effort friendly name from Supabase Auth user (metadata, then email local-part). */
export function displayNameFromUser(user: User | null | undefined): string {
  if (!user) return "";
  const meta = user.user_metadata ?? {};
  for (const key of ["display_name", "full_name", "name", "preferred_username"]) {
    const value = meta[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  const email = user.email?.trim();
  if (!email) return "";
  const at = email.indexOf("@");
  return at > 0 ? email.slice(0, at) : email;
}

export function persistLearnerDisplayName(name: string): void {
  const trimmed = name.trim();
  if (!trimmed || typeof window === "undefined") return;
  try {
    localStorage.setItem(LEARNER_DISPLAY_NAME_KEY, trimmed);
    window.dispatchEvent(new Event(LEARNER_DISPLAY_NAME_EVENT));
  } catch {
    /* private mode */
  }
}

export function readLearnerDisplayName(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(LEARNER_DISPLAY_NAME_KEY)?.trim() ?? "";
  } catch {
    return "";
  }
}
