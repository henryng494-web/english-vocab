import {
  applyNaturalSpeechSettings,
  ensureSpeechVoicesReady,
  getCachedSpeechVoice,
  getSpeechVoiceSync,
  isAppleWebKit,
} from "@/lib/speech-voice";
import {
  getCachedWordAudioUrl,
  playWordAudioUrl,
  resolveWordAudioUrl,
  stopWordAudio,
} from "@/lib/word-pronunciation-audio";

let lastSpoken: { text: string; at: number } | null = null;

const DEDUPE_MS = 1800;

function speakWithVoice(text: string, voice: SpeechSynthesisVoice | null): void {
  const synth = window.speechSynthesis;
  if (!synth) return;
  if (synth.paused) synth.resume();

  const utterance = new SpeechSynthesisUtterance(text);
  applyNaturalSpeechSettings(utterance, voice);
  synth.speak(utterance);
}

/**
 * Safari/iOS requires speechSynthesis.speak() inside the user gesture stack.
 * Call this synchronously from click/tap handlers before any await.
 */
export function speakEnglishTextSync(text: string): void {
  if (typeof window === "undefined" || !text.trim()) return;
  const synth = window.speechSynthesis;
  if (!synth) return;

  synth.cancel();
  stopWordAudio();
  speakWithVoice(text.trim(), getSpeechVoiceSync());
}

async function speakWithBestAvailableVoice(
  text: string,
  options?: { skipTtsFallback?: boolean },
): Promise<void> {
  const key = text.toLowerCase();

  const cachedAudio = getCachedWordAudioUrl(text);
  if (cachedAudio && !isAppleWebKit()) {
    if (lastSpoken?.text !== key) return;
    if (await playWordAudioUrl(cachedAudio)) return;
  }

  const audioUrl = await resolveWordAudioUrl(text);
  if (lastSpoken?.text !== key) return;
  if (audioUrl && !isAppleWebKit() && (await playWordAudioUrl(audioUrl))) return;

  if (options?.skipTtsFallback) return;

  const cached = getCachedSpeechVoice();
  if (cached) {
    speakWithVoice(text, cached);
    return;
  }

  const voice = await ensureSpeechVoicesReady();
  if (lastSpoken?.text !== key) return;
  speakWithVoice(text, voice);
}

/** Speak English text via human audio when possible, else Web Speech API. */
export function speakEnglishText(
  text: string,
  options?: { force?: boolean },
): void {
  const trimmed = text?.trim();
  if (!trimmed || typeof window === "undefined") {
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
  stopWordAudio();

  if (options?.force) {
    speakEnglishTextSync(trimmed);
    void speakWithBestAvailableVoice(trimmed, { skipTtsFallback: true });
    return;
  }

  window.speechSynthesis?.cancel();
  void speakWithBestAvailableVoice(trimmed);
}

export function cancelSpeech(): void {
  stopWordAudio();
  if (typeof window !== "undefined") {
    window.speechSynthesis.cancel();
  }
}

export function preloadSpeechVoices(): void {
  void ensureSpeechVoicesReady();
}

export function preloadWordPronunciation(word: string): void {
  void resolveWordAudioUrl(word);
}
