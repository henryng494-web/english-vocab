export type PronunciationLogEntry = {
  stage: string;
  word?: string;
  detail?: string;
  error?: unknown;
};

/** Lightweight diagnostics for MP3 / SpeechSynthesis playback (visible in devtools). */
export function logPronunciation(entry: PronunciationLogEntry): void {
  if (typeof console === "undefined") return;
  const payload = {
    ...entry,
    error:
      entry.error instanceof Error
        ? { name: entry.error.name, message: entry.error.message }
        : entry.error,
  };
  console.warn("[pronunciation]", payload);
}
