import { purgeLegacyDiscoverWordCaches } from "@/lib/discover-word-cache";
import { DEFAULT_APP_LOCALE } from "@/lib/i18n/messages";

const SETTINGS_KEY = "vocab-app-settings-v1";
const PURGE_FLAG_KEY = "vocab-es-locale-purge-v1";

const LOCALE_FIELD_NAMES = [
  "learnerLocale",
  "appLanguage",
  "userLanguage",
  "learningLanguage",
] as const;

const CHUNK_CACHE_KEYS = [
  "learning-chunk-vi-cache-v3",
  "learning-chunk-supplement-cache-v1",
];

function settingsBlobHasSpanish(raw: string): boolean {
  if (!raw.includes('"es"')) return false;
  return LOCALE_FIELD_NAMES.some((field) => {
    const re = new RegExp(`"${field}"\\s*:\\s*"es"`);
    return re.test(raw);
  });
}

function stripSpanishFromSettingsRecord(
  parsed: Record<string, unknown>,
): { cleaned: Record<string, unknown>; changed: boolean } {
  let changed = false;
  const cleaned = { ...parsed };
  for (const field of LOCALE_FIELD_NAMES) {
    if (cleaned[field] === "es") {
      cleaned[field] = "vi";
      changed = true;
    }
  }
  if (cleaned.appLanguage === "es") {
    cleaned.appLanguage = DEFAULT_APP_LOCALE;
    changed = true;
  }
  return { cleaned, changed };
}

function purgeSessionWordCaches(): void {
  try {
    purgeLegacyDiscoverWordCaches();
    for (let v = 80; v <= 120; v++) {
      sessionStorage.removeItem(`discover-word-cache-v${v}`);
    }
    for (const key of CHUNK_CACHE_KEYS) {
      sessionStorage.removeItem(key);
    }
    const toRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (!key) continue;
      if (key.startsWith("es:") || key.includes(":es:")) {
        toRemove.push(key);
      }
    }
    for (const key of toRemove) sessionStorage.removeItem(key);
  } catch {
    /* private mode */
  }
}

/**
 * One-time client purge after removing the Spanish learner locale experiment.
 * Keeps learning progress keys; only fixes settings + word-content caches.
 */
export function purgeStaleSpanishLocaleStorage(): boolean {
  if (typeof window === "undefined") return false;

  let changed = false;
  const raw = localStorage.getItem(SETTINGS_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const { cleaned, changed: settingsChanged } =
        stripSpanishFromSettingsRecord(parsed);
      if (settingsChanged || settingsBlobHasSpanish(raw)) {
        changed = true;
        for (const field of LOCALE_FIELD_NAMES) {
          delete cleaned[field];
        }
        if (cleaned.appLanguage === "es") {
          cleaned.appLanguage = DEFAULT_APP_LOCALE;
        }
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(cleaned));
        window.dispatchEvent(new CustomEvent("app-settings-changed"));
      }
    } catch {
      localStorage.removeItem(SETTINGS_KEY);
      changed = true;
    }
  }

  const alreadyPurged = localStorage.getItem(PURGE_FLAG_KEY) === "1";
  if (!alreadyPurged || changed) {
    purgeSessionWordCaches();
    localStorage.setItem(PURGE_FLAG_KEY, "1");
    changed = true;
    window.dispatchEvent(new CustomEvent("word-content-cache-cleared"));
  }

  return changed;
}

export function rawSettingsMentionsSpanishLocale(): boolean {
  if (typeof window === "undefined") return false;
  const raw = localStorage.getItem(SETTINGS_KEY);
  return Boolean(raw && settingsBlobHasSpanish(raw));
}
