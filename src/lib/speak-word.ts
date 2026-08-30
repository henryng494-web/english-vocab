import { proxyPronounceAudioPath } from "@/lib/dictionary-pronunciation";
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
  isWordAudioElementReady,
  playWordAudioInUserGesture,
  playWordAudioUrl,
  playWordAudioWhenReady,
  preloadWordAudioElement,
  resolveWordAudioUrl,
  stopWordAudio,
  warmWordAudioBytes,
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

export function isSpeechUnlocked(): boolean {
  if (!isAppleWebKit()) return true;
  return speechUnlocked || readSpeechUnlockedFromStorage();
}

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

export function speakEnglishTextSync(text: string): void {
  if (typeof window === "undefined" || !text.trim()) return;
  if (!window.speechSynthesis) return;

  stopWordAudio();
  if (!isAppleWebKit()) {
    window.speechSynthesis.cancel();
  }
  speakWithVoice(text.trim(), getSpeechVoiceSync());
}

/** iOS Safari + Add-to-Home-Screen: MP3 via same-origin proxy, TTS as backup. */
function speakAppleWebKitInGesture(text: string): void {
  preloadWordAudioElement(text);
  if (isWordAudioElementReady(text)) {
    playWordAudioInUserGesture(text);
    return;
  }
  speakEnglishTextSync(text);
  warmWordAudioBytes(text);
}

/** Auto-speak on iOS: instant TTS when MP3 is not buffered yet. */
function speakAppleWebKitAuto(text: string): void {
  preloadWordAudioElement(text);
  if (isWordAudioElementReady(text)) {
    playWordAudioInUserGesture(text);
    return;
  }
  speakEnglishTextSync(text);
  warmWordAudioBytes(text);
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
  options?: { skipTtsFallback?: boolean; mp3WaitMs?: number },
): Promise<void> {
  const key = text.toLowerCase();

  const stillCurrent = () =>
    requestId === speakRequestId && lastSpoken?.text === key;

  preloadWordAudioElement(text);

  if (isWordAudioElementReady(text)) {
    if (await playWordAudioUrl(playableWordAudioUrl(text))) return;
  }

  if (await playWordAudioWhenReady(text, options?.mp3WaitMs ?? 500)) {
    if (stillCurrent()) return;
  }
  if (!stillCurrent()) return;

  const audioUrl = await resolveWordAudioUrl(text);
  if (!stillCurrent()) return;
  if (audioUrl) {
    preloadWordAudioElement(text, audioUrl);
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

async function speakAutoNonApple(text: string, requestId: number): Promise<void> {
  const key = text.toLowerCase();
  const stillCurrent = () =>
    requestId === speakRequestId && lastSpoken?.text === key;

  preloadWordAudioElement(text);

  if (isWordAudioElementReady(text)) {
    if (await playWordAudioUrl(playableWordAudioUrl(text))) return;
  }

  if (await playWordAudioWhenReady(text, 280)) {
    if (stillCurrent()) return;
  }
  if (!stillCurrent()) return;

  const cached = getCachedSpeechVoice();
  if (cached) {
    speakWithVoice(text, cached);
  } else {
    void ensureSpeechVoicesReady().then((voice) => {
      if (stillCurrent()) speakWithVoice(text, voice);
    });
  }

  void resolveWordAudioUrl(text).then((url) => {
    if (url) preloadWordAudioElement(text, url);
  });
}

function playableWordAudioUrl(word: string): string {
  if (typeof window === "undefined") return "";
  const cached = getCachedWordAudioUrl(word);
  const path = cached ?? proxyPronounceAudioPath(word);
  return new URL(path, window.location.origin).href;
}

export function speakEnglishTextAuto(text: string): void {
  const trimmed = claimSpeak(text, false);
  if (!trimmed) return;

  if (isAppleWebKit() && !isSpeechUnlocked()) return;

  const requestId = speakRequestId;

  if (isAppleWebKit()) {
    speakAppleWebKitAuto(trimmed);
    return;
  }

  stopWordAudio();
  window.speechSynthesis?.cancel();
  void speakAutoNonApple(trimmed, requestId);
}

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
  warmWordAudioBytes(word);
  void resolveWordAudioUrl(word).then((url) => {
    if (url) preloadWordAudioElement(word, url);
  });
}
