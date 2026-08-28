import {
  applyNaturalSpeechSettings,
  ensureSpeechVoicesReady,
  getCachedSpeechVoice,
} from "@/lib/speech-voice";
import {
  playWordAudioUrl,
  resolveWordAudioUrl,
  stopWordAudio,
} from "@/lib/word-pronunciation-audio";

let lastSpoken: { text: string; at: number } | null = null;

const DEDUPE_MS = 1800;

function speakWithVoice(text: string, voice: SpeechSynthesisVoice | null): void {
  const synth = window.speechSynthesis;
  if (synth.paused) synth.resume();

  const utterance = new SpeechSynthesisUtterance(text);
  applyNaturalSpeechSettings(utterance, voice);
  synth.speak(utterance);
}

async function speakWithBestAvailableVoice(text: string): Promise<void> {
  const key = text.toLowerCase();

  const audioUrl = await resolveWordAudioUrl(text);
  if (lastSpoken?.text !== key) return;
  if (audioUrl && (await playWordAudioUrl(audioUrl))) return;

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
  window.speechSynthesis?.cancel();
  stopWordAudio();

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
