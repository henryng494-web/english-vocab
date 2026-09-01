export type PronounceSpeed = "slow" | "medium" | "fast";

export const PRONOUNCE_SPEED_OPTIONS: readonly PronounceSpeed[] = [
  "slow",
  "medium",
  "fast",
] as const;

export const DEFAULT_PRONOUNCE_SPEED: PronounceSpeed = "medium";

/** Client playback multiplier for MP3 pronunciation. */
export const PRONOUNCE_SPEED_PLAYBACK: Record<PronounceSpeed, number> = {
  slow: 0.75,
  medium: 1,
  fast: 1.2,
};

export function isPronounceSpeed(value: unknown): value is PronounceSpeed {
  return (
    value === "slow" || value === "medium" || value === "fast"
  );
}

export function playbackRateForPronounceSpeed(speed: PronounceSpeed): number {
  return PRONOUNCE_SPEED_PLAYBACK[speed];
}

const APP_SETTINGS_STORAGE_KEY = "vocab-app-settings-v1";

/** Read learner playback rate without importing app-settings (safe for audio module). */
export function getPronouncePlaybackRate(): number {
  if (typeof window === "undefined") {
    return PRONOUNCE_SPEED_PLAYBACK[DEFAULT_PRONOUNCE_SPEED];
  }
  try {
    const raw = localStorage.getItem(APP_SETTINGS_STORAGE_KEY);
    if (!raw) return PRONOUNCE_SPEED_PLAYBACK[DEFAULT_PRONOUNCE_SPEED];
    const parsed = JSON.parse(raw) as { pronounceSpeed?: unknown };
    if (isPronounceSpeed(parsed.pronounceSpeed)) {
      return playbackRateForPronounceSpeed(parsed.pronounceSpeed);
    }
  } catch {
    /* ignore quota / private mode */
  }
  return PRONOUNCE_SPEED_PLAYBACK[DEFAULT_PRONOUNCE_SPEED];
}
