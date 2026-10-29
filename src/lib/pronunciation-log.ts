export type PronunciationLogEntry = {
  stage: string;
  word?: string;
  detail?: string;
  error?: unknown;
};

function serializePlayError(error: unknown): { name: string; message: string } | unknown {
  if (error instanceof DOMException) {
    return { name: error.name, message: error.message, code: error.code };
  }
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  return error;
}

/** Human-readable Safari / Chrome play() rejection (e.g. NotAllowedError). */
export function formatAudioPlayError(error: unknown): string {
  if (error instanceof DOMException) {
    return `${error.name}: ${error.message}`;
  }
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
}

/** Lightweight diagnostics for MP3 playback (visible in Safari Web Inspector). */
export function logPronunciation(entry: PronunciationLogEntry): void {
  if (typeof console === "undefined") return;
  const payload = {
    ...entry,
    error: entry.error !== undefined ? serializePlayError(entry.error) : undefined,
  };
  console.warn("[pronunciation]", payload);
}

/** Log audio.play() rejection with explicit DOMException name for iOS debugging. */
export function logAudioPlayRejection(
  context: string,
  error: unknown,
  word?: string,
): void {
  logPronunciation({
    stage: "audio-play-rejected",
    word,
    detail: `${context} — ${formatAudioPlayError(error)}`,
    error,
  });
}
