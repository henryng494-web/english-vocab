/** Personal data is isolated from device preferences and Supabase's auth storage. */
export const LEARNER_SCOPE_EVENT = "learner-storage-scope-changed";
const LEGACY_OWNER_KEY = "jj-legacy-learner-owner-v1";
const PREFIX = "jj-learner-v1:";
export const PERSONAL_STORAGE_KEYS = [
  "english-vocab-learning", "english-vocab-review-schedule-v1",
  "english-vocab-review-session-v1", "english-vocab-review-completed-today-v1",
  "jj-bootstrap-snapshot-v1", "english-vocab-placement-v1",
  "user_recommended_rank", "user_selected_rank", "vocab-learner-display-name",
  "jj-pro-status-v1", "vocab-journey-daily-goal-v1", "vocab-study-time-v1",
  "jj-free-new-words-v2", "english-vocab-review-daily-word-target-v1",
  "vocab-daily-reviews-v1", "vocab-weekly-goal-days-v1", "vocab-streak-v1",
  "english-vocab-daily-session-v1",
] as const;

let owner = "pending";
let generation = 0;
export function learnerScope(): string { return `${owner}:${generation}`; }
export function learnerUserId(): string | null { return owner.startsWith("user:") ? owner.slice(5) : null; }
export function isLearnerScopeCurrent(scope: string): boolean { return learnerScope() === scope; }

function scopedKey(key: string): string { return `${PREFIX}${encodeURIComponent(owner)}:${key}`; }

/** Run only after initial auth resolution, before mounting personal-data consumers. */
export function activateLearnerScope(userId: string | null): void {
  const next = userId ? `user:${userId}` : "guest";
  if (next === owner) return;
  owner = next;
  generation++;
  try {
    // Attribute the old device-wide data once. Keep the originals as a recovery
    // backup; subsequent accounts never fall back to those keys. Never migrate a
    // device-wide entitlement: RevenueCat will confirm access for this user.
    if (!localStorage.getItem(LEGACY_OWNER_KEY)) {
      // An unresolved signed-out legacy session cannot establish ownership.
      const legacyOwner = !userId && localStorage.getItem("jj-auth-signed-in-v1") === "1"
        ? "unclaimed" : next;
      if (legacyOwner === next) {
        for (const key of PERSONAL_STORAGE_KEYS) {
          if (key === "jj-pro-status-v1") continue;
          const value = localStorage.getItem(key);
          if (value !== null && localStorage.getItem(scopedKey(key)) === null) {
            localStorage.setItem(scopedKey(key), value);
          }
        }
      }
      localStorage.setItem(LEGACY_OWNER_KEY, legacyOwner);
    }
  } catch { /* blocked/quota-full storage: do not expose legacy data */ }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(LEARNER_SCOPE_EVENT));
}

export const learnerStorage = {
  getItem(key: string): string | null {
    if (owner === "pending") return null;
    return localStorage.getItem(scopedKey(key));
  },
  setItem(key: string, value: string): void {
    if (owner !== "pending") localStorage.setItem(scopedKey(key), value);
  },
  removeItem(key: string): void {
    if (owner !== "pending") localStorage.removeItem(scopedKey(key));
  },
};

/** Delete this learner's local records without erasing other accounts on this device. */
export function clearCurrentLearnerData(): void {
  for (const key of PERSONAL_STORAGE_KEYS) learnerStorage.removeItem(key);
  if (localStorage.getItem(LEGACY_OWNER_KEY) === owner) {
    for (const key of PERSONAL_STORAGE_KEYS) localStorage.removeItem(key);
  }
}
