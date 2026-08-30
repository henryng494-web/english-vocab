import { proxyPronounceAudioPath } from "@/lib/dictionary-pronunciation";
import { isAppleWebKit } from "@/lib/speech-voice";
import {
  getCachedWordAudioUrl,
  isWordAudioElementReady,
  playWordAudioInUserGesture,
  playWordAudioUrl,
  playWordAudioWhenReady,
  preloadWordAudioElement,
  stopWordAudio,
  warmWordAudioBytes,
} from "@/lib/word-pronunciation-audio";

let lastSpoken: { text: string; at: number } | null = null;
let speakRequestId = 0;

const DEDUPE_MS = 1800;
const SPEECH_UNLOCK_KEY = "ev-speech-unlocked";
const AUTO_MP3_WAIT_MS = 1600;
const MANUAL_MP3_WAIT_MS = 1200;
const MP3_RETRY_WAIT_MS = 2200;

let speechUnlocked = false;

function readSpeechUnlockedFromStorage(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(SPEECH_UNLOCK_KEY) === "1";
}

export function isSpeechUnlocked(): boolean {
  if (!isAppleWebKit()) return true;
  return speechUnlocked || readSpeechUnlockedFromStorage();
}

/** Unlock HTML audio on iOS/PWA (first user gesture). */
export function unlockSpeechFromUserGesture(): void {
  if (typeof window === "undefined") return;
  speechUnlocked = true;
  try {
    sessionStorage.setItem(SPEECH_UNLOCK_KEY, "1");
  } catch {
    /* private mode */
  }
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

function primeMp3Playback(text: string): void {
  preloadWordAudioElement(text);
  warmWordAudioBytes(text);
  if (isAppleWebKit()) {
    playWordAudioInUserGesture(text);
  }
}

/** MP3-only playback — dictionary recording or Edge neural voice from server. */
async function speakMp3Only(
  text: string,
  requestId: number,
  mp3WaitMs: number,
): Promise<void> {
  const key = text.toLowerCase();
  primeMp3Playback(text);

  if (isWordAudioElementReady(text)) {
    if (await playWordAudioUrl(playableWordAudioUrl(text))) return;
  }

  if (await playWordAudioWhenReady(text, mp3WaitMs)) {
    if (stillCurrentRequest(requestId, key)) return;
  }
  if (!stillCurrentRequest(requestId, key)) return;

  await warmWordAudioBytes(text, { bustCache: true });
  preloadWordAudioElement(text);
  if (isAppleWebKit()) {
    playWordAudioInUserGesture(text);
  }
  await playWordAudioWhenReady(text, MP3_RETRY_WAIT_MS);
}

export function speakEnglishTextAuto(text: string): void {
  const trimmed = claimSpeak(text, false);
  if (!trimmed) return;

  if (isAppleWebKit() && !isSpeechUnlocked()) return;

  void speakMp3Only(trimmed, speakRequestId, AUTO_MP3_WAIT_MS);
}

export function speakEnglishText(
  text: string,
  _options?: { force?: boolean },
): void {
  const trimmed = claimSpeak(text, Boolean(_options?.force));
  if (!trimmed) return;

  unlockSpeechFromUserGesture();
  void speakMp3Only(trimmed, speakRequestId, MANUAL_MP3_WAIT_MS);
}

export function cancelSpeech(): void {
  stopWordAudio();
}

export function preloadWordPronunciation(word: string): void {
  preloadWordAudioElement(word);
  warmWordAudioBytes(word);
}
