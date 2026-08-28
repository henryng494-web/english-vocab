let lastSpoken: { text: string; at: number } | null = null;

const DEDUPE_MS = 1800;

/** Speak English text via Web Speech API (deduped within ~1.8s). */
export function speakEnglishText(
  text: string,
  options?: { force?: boolean },
): void {
  const trimmed = text?.trim();
  if (!trimmed || typeof window === "undefined") return;

  const key = trimmed.toLowerCase();
  const now = Date.now();
  if (
    !options?.force &&
    lastSpoken?.text === key &&
    now - lastSpoken.at < DEDUPE_MS
  ) {
    return;
  }

  lastSpoken = { text: key, at: now };
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(trimmed);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

export function cancelSpeech(): void {
  if (typeof window !== "undefined") {
    window.speechSynthesis.cancel();
  }
}
