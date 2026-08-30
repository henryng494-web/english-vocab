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
  playPreloadedWordAudioSync,
  playWordAudioUrl,
  preloadWordAudioElement,
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
  if (!window.speechSynthesis) return;

  stopWordAudio();
  if (!isAppleWebKit()) {
    window.speechSynthesis.cancel();
  }
  speakWithVoice(text.trim(), getSpeechVoiceSync());
}

function speakAppleWebKitInGesture(text: string): void {
  if (playPreloadedWordAudioSync(text)) return;
  speakEnglishTextSync(text);
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

  if (playPreloadedWordAudioSync(text)) return;

  const audioUrl = await resolveWordAudioUrl(text);
  if (!stillCurrent()) return;
  if (audioUrl) {
    preloadWordAudioElement(text, audioUrl);
    if (playPreloadedWordAudioSync(text)) return;
    if (await playWordAudioUrl(audioUrl)) return;
  }

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
    speakAppleWebKitInGesture(trimmed);
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

  if (isAppleWebKit()) {
    speakAppleWebKitInGesture(trimmed);
    void resolveWordAudioUrl(trimmed).then((url) => {
      if (url) preloadWordAudioElement(trimmed, url);
    });
    return;
  }

  if (options?.force) {
    speakEnglishTextSync(trimmed);
    void speakWithBestAvailableVoice(trimmed, requestId, {
      skipTtsFallback: true,
    });
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
  preloadWordAudioElement(word);
  void resolveWordAudioUrl(word).then((url) => {
    if (url) preloadWordAudioElement(word, url);
  });
}
