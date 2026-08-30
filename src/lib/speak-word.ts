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
/** Wait for preloaded MP3 before falling back to browser TTS. */
const AUTO_MP3_WAIT_MS = 1000;
const MANUAL_MP3_WAIT_MS = 750;

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

  stopWordAudio();
  primeSpeechSynthesisInGesture();

  const utterance = new SpeechSynthesisUtterance(text);
  applyNaturalSpeechSettings(utterance, voice ?? getSpeechVoiceSync());
  speakUtteranceInGesture(utterance);
}

function playableWordAudioUrl(word: string): string {
  if (typeof window === "undefined") return "";
  const cached = getCachedWordAudioUrl(word);
  const path = cached ?? proxyPronounceAudioPath(word);
  return new URL(path, window.location.origin).href;
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

function stillCurrentRequest(requestId: number, key: string): boolean {
  return requestId === speakRequestId && lastSpoken?.text === key;
}

async function speakTtsFallback(text: string, requestId: number): Promise<void> {
  const key = text.toLowerCase();
  if (!stillCurrentRequest(requestId, key)) return;

  const cached = getCachedSpeechVoice();
  if (cached) {
    speakWithVoice(text, cached);
    return;
  }

  const voice = await ensureSpeechVoicesReady();
  if (!stillCurrentRequest(requestId, key)) return;
  speakWithVoice(text, voice);
}

/** One voice path: same-origin MP3 first, browser TTS only if MP3 fails. */
async function speakMp3Preferred(
  text: string,
  requestId: number,
  options?: { mp3WaitMs?: number; allowTtsFallback?: boolean },
): Promise<void> {
  const key = text.toLowerCase();
  const mp3WaitMs = options?.mp3WaitMs ?? MANUAL_MP3_WAIT_MS;
  const allowTtsFallback = options?.allowTtsFallback ?? true;

  preloadWordAudioElement(text);
  warmWordAudioBytes(text);

  if (isWordAudioElementReady(text)) {
    if (await playWordAudioUrl(playableWordAudioUrl(text))) return;
  }

  if (isAppleWebKit()) {
    playWordAudioInUserGesture(text);
  }

  if (await playWordAudioWhenReady(text, mp3WaitMs)) {
    if (stillCurrentRequest(requestId, key)) return;
  }
  if (!stillCurrentRequest(requestId, key)) return;

  const audioUrl = await resolveWordAudioUrl(text);
  if (!stillCurrentRequest(requestId, key)) return;
  if (audioUrl) {
    preloadWordAudioElement(text, audioUrl);
    if (await playWordAudioUrl(audioUrl)) return;
  }

  if (!allowTtsFallback || !stillCurrentRequest(requestId, key)) return;
  await speakTtsFallback(text, requestId);
}

export function speakEnglishTextSync(text: string): void {
  if (typeof window === "undefined" || !text.trim()) return;
  if (!window.speechSynthesis) return;

  if (!isAppleWebKit()) {
    window.speechSynthesis.cancel();
  }
  speakWithVoice(text.trim(), getSpeechVoiceSync());
}

export function speakEnglishTextAuto(text: string): void {
  const trimmed = claimSpeak(text, false);
  if (!trimmed) return;

  if (isAppleWebKit() && !isSpeechUnlocked()) return;

  const requestId = speakRequestId;

  if (!isAppleWebKit()) {
    stopWordAudio();
    window.speechSynthesis?.cancel();
  }

  void speakMp3Preferred(trimmed, requestId, {
    mp3WaitMs: AUTO_MP3_WAIT_MS,
    allowTtsFallback: true,
  });
}

export function speakEnglishText(
  text: string,
  options?: { force?: boolean },
): void {
  const trimmed = claimSpeak(text, Boolean(options?.force));
  if (!trimmed) return;

  unlockSpeechFromUserGesture();

  const requestId = speakRequestId;

  if (!isAppleWebKit()) {
    stopWordAudio();
    window.speechSynthesis?.cancel();
  }

  void speakMp3Preferred(trimmed, requestId, {
    mp3WaitMs: MANUAL_MP3_WAIT_MS,
    allowTtsFallback: true,
  });
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
