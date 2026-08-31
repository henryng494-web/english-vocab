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
  medium: 0.9,
  fast: 1,
};

export function isPronounceSpeed(value: unknown): value is PronounceSpeed {
  return (
    value === "slow" || value === "medium" || value === "fast"
  );
}

export function playbackRateForPronounceSpeed(speed: PronounceSpeed): number {
  return PRONOUNCE_SPEED_PLAYBACK[speed];
}
