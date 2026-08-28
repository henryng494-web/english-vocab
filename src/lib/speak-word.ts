import {
  applyNaturalSpeechSettings,
  ensureSpeechVoicesReady,
  getCachedSpeechVoice,
} from "@/lib/speech-voice";

let lastSpoken: { text: string; at: number } | null = null;

const DEDUPE_MS = 1800;

function speakWithVoice(text: string, voice: SpeechSynthesisVoice | null): void {
  const synth = window.speechSynthesis;
  if (synth.paused) synth.resume();

  const utterance = new SpeechSynthesisUtterance(text);
  applyNaturalSpeechSettings(utterance, voice);
  synth.speak(utterance);
}

/** Speak English text via Web Speech API (deduped within ~1.8s). */
export function speakEnglishText(
  text: string,
  options?: { force?: boolean },
): void {
  const trimmed = text?.trim();
  if (!trimmed || typeof window === "undefined" || !window.speechSynthesis) {
    return;
  }

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

  const cached = getCachedSpeechVoice();
  if (cached) {
    speakWithVoice(trimmed, cached);
    return;
  }

  void ensureSpeechVoicesReady().then((voice) => {
    if (lastSpoken?.text !== key) return;
    speakWithVoice(trimmed, voice);
  });
}

export function cancelSpeech(): void {
  if (typeof window !== "undefined") {
    window.speechSynthesis.cancel();
  }
}

export function preloadSpeechVoices(): void {
  void ensureSpeechVoicesReady();
}
