export type PronounceAccent = "us" | "uk" | "au";

export const PRONOUNCE_ACCENT_OPTIONS: readonly PronounceAccent[] = [
  "us",
  "uk",
  "au",
] as const;

export const DEFAULT_PRONOUNCE_ACCENT: PronounceAccent = "us";

/** Microsoft Edge neural voices per accent. */
export const NEURAL_VOICE_BY_ACCENT: Record<PronounceAccent, string> = {
  us: "en-US-JennyNeural",
  uk: "en-GB-SoniaNeural",
  au: "en-AU-NatashaNeural",
};

export function isPronounceAccent(value: unknown): value is PronounceAccent {
  return value === "us" || value === "uk" || value === "au";
}

/** Cache-bust token when accent or voice mapping changes. */
export function voiceVersionForAccent(accent: PronounceAccent): string {
  return `v2-${accent}`;
}

const APP_SETTINGS_STORAGE_KEY = "vocab-app-settings-v1";

/** Read learner accent without importing app-settings (safe for audio module). */
export function getPronounceAccent(): PronounceAccent {
  if (typeof window === "undefined") return DEFAULT_PRONOUNCE_ACCENT;
  try {
    const raw = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_PRONOUNCE_ACCENT;
    const parsed = JSON.parse(raw) as { pronounceAccent?: unknown };
    if (isPronounceAccent(parsed.pronounceAccent)) {
      return parsed.pronounceAccent;
    }
  } catch {
    /* ignore quota / private mode */
  }
  return DEFAULT_PRONOUNCE_ACCENT;
}
