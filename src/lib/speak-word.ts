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
let speakRequestId = 0;

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

function claimSpeak(text: string, force: boolean): string | null {
  const trimmed = text?.trim();
  if (!trimmed || typeof window === "undefined") return null;

  const key = trimmed.toLowerCase();
  const now = Date.now();
  if (
    !force &&
    lastSpoken?.text === key &&
    now - lastSpoken.at < DEDUPE_MS
  ) {
    return null;
  }

  lastSpoken = { text: key, at: now };
  speakRequestId += 1;
  stopWordAudio();
  return trimmed;
}

async function speakWithBestAvailableVoice(
  text: string,
  requestId: number,
  options?: { skipTtsFallback?: boolean },
): Promise<void> {
  const key = text.toLowerCase();

  const stillCurrent = () =>
    requestId === speakRequestId && lastSpoken?.text === key;

  const cachedAudio = getCachedWordAudioUrl(text);
  if (cachedAudio && !isAppleWebKit()) {
    if (!stillCurrent()) return;
    if (await playWordAudioUrl(cachedAudio)) return;
  }

  const audioUrl = await resolveWordAudioUrl(text);
  if (!stillCurrent()) return;
  if (audioUrl && !isAppleWebKit() && (await playWordAudioUrl(audioUrl))) return;

  if (options?.skipTtsFallback || !stillCurrent()) return;

  const cached = getCachedSpeechVoice();
  if (cached) {
    speakWithVoice(text, cached);
    return;
  }

  const voice = await ensureSpeechVoicesReady();
  if (!stillCurrent()) return;
  speakWithVoice(text, voice);
}

/** Auto-pronounce a word once — MP3 or TTS, never both. */
export function speakEnglishTextAuto(text: string): void {
  const trimmed = claimSpeak(text, false);
  if (!trimmed) return;

  const requestId = speakRequestId;

  if (isAppleWebKit()) {
    speakEnglishTextSync(trimmed);
    return;
  }

  window.speechSynthesis?.cancel();
  void speakWithBestAvailableVoice(trimmed, requestId);
}

/** Speak English text via human audio when possible, else Web Speech API. */
export function speakEnglishText(
  text: string,
  options?: { force?: boolean },
): void {
  const trimmed = claimSpeak(text, Boolean(options?.force));
  if (!trimmed) return;

  const requestId = speakRequestId;

  if (options?.force) {
    speakEnglishTextSync(trimmed);
    if (!isAppleWebKit()) {
      void speakWithBestAvailableVoice(trimmed, requestId, {
        skipTtsFallback: true,
      });
    }
    return;
  }

  if (isAppleWebKit()) {
    speakEnglishTextSync(trimmed);
    return;
  }

  window.speechSynthesis?.cancel();
  void speakWithBestAvailableVoice(trimmed, requestId);
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
