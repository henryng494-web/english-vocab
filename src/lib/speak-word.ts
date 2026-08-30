import {
  applyNaturalSpeechSettings,
  ensureSpeechVoicesReady,
  getCachedSpeechVoice,
  getSpeechVoiceSync,
  isAppleWebKit,
  primeSpeechSynthesisInGesture,
  speakUtteranceInGesture,
} from "@/lib/speech-voice";
import {
  getCachedWordAudioUrl,
  playWordAudioUrl,
  playWordAudioUrlSync,
  resolveWordAudioUrl,
  stopWordAudio,
} from "@/lib/word-pronunciation-audio";

let lastSpoken: { text: string; at: number } | null = null;
let speakRequestId = 0;

const DEDUPE_MS = 1800;
const SPEECH_UNLOCK_KEY = "ev-speech-unlocked";

let speechUnlocked = false;

function readSpeechUnlockedFromStorage(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(SPEECH_UNLOCK_KEY) === "1";
}

/** iOS/Safari block auto-play until the user has tapped once this session. */
export function isSpeechUnlocked(): boolean {
  if (!isAppleWebKit()) return true;
  return speechUnlocked || readSpeechUnlockedFromStorage();
}

/** Call from tap/click handlers before speaking or enabling auto-speak. */
export function unlockSpeechFromUserGesture(): void {
  if (typeof window === "undefined") return;
  speechUnlocked = true;
  try {
    sessionStorage.setItem(SPEECH_UNLOCK_KEY, "1");
  } catch {
    /* private mode */
  }
  primeSpeechSynthesisInGesture();
}

function speakWithVoice(text: string, voice: SpeechSynthesisVoice | null): void {
  const synth = window.speechSynthesis;
  if (!synth) return;

  primeSpeechSynthesisInGesture();
  if (synth.speaking || synth.pending) synth.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  applyNaturalSpeechSettings(utterance, voice ?? getSpeechVoiceSync());
  speakUtteranceInGesture(utterance);
}

/**
 * Safari/iOS requires speechSynthesis.speak() inside the user gesture stack.
 * Call this synchronously from click/tap handlers before any await.
 */
export function speakEnglishTextSync(text: string): void {
  if (typeof window === "undefined" || !text.trim()) return;
  const synth = window.speechSynthesis;
  if (!synth) return;

  stopWordAudio();
  speakWithVoice(text.trim(), getSpeechVoiceSync());
}

function trySpeakCachedAudioInGesture(text: string): boolean {
  const cachedAudio = getCachedWordAudioUrl(text);
  if (!cachedAudio) return false;
  stopWordAudio();
  if (typeof window !== "undefined") window.speechSynthesis?.cancel();
  return playWordAudioUrlSync(cachedAudio);
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
  if (cachedAudio) {
    if (!stillCurrent()) return;
    if (await playWordAudioUrl(cachedAudio)) return;
  }

  const audioUrl = await resolveWordAudioUrl(text);
  if (!stillCurrent()) return;
  if (audioUrl && (await playWordAudioUrl(audioUrl))) return;

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

  if (isAppleWebKit() && !isSpeechUnlocked()) return;

  const requestId = speakRequestId;

  if (isAppleWebKit()) {
    if (trySpeakCachedAudioInGesture(trimmed)) return;
    speakEnglishTextSync(trimmed);
    void resolveWordAudioUrl(trimmed);
    return;
  }

  stopWordAudio();
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

  unlockSpeechFromUserGesture();

  const requestId = speakRequestId;

  if (options?.force) {
    if (trySpeakCachedAudioInGesture(trimmed)) {
      void resolveWordAudioUrl(trimmed);
      return;
    }
    speakEnglishTextSync(trimmed);
    void resolveWordAudioUrl(trimmed);
    if (!isAppleWebKit()) {
      void speakWithBestAvailableVoice(trimmed, requestId, {
        skipTtsFallback: true,
      });
    }
    return;
  }

  if (isAppleWebKit()) {
    if (trySpeakCachedAudioInGesture(trimmed)) return;
    speakEnglishTextSync(trimmed);
    void resolveWordAudioUrl(trimmed);
    return;
  }

  stopWordAudio();
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
