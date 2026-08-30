import { isAppleWebKit } from "@/lib/speech-voice";
import {
  playWordAudioInUserGesture,
  playWordAudioWhenReady,
  preloadWordAudioElement,
  primeAudioPipelineInUserGesture,
  stopWordAudio,
  warmWordAudioBytes,
} from "@/lib/word-pronunciation-audio";

let lastSpoken: { text: string; at: number } | null = null;
let speakRequestId = 0;

const DEDUPE_MS = 1800;
const SPEECH_UNLOCK_KEY = "ev-speech-unlocked";
const AUTO_MP3_WAIT_MS = 2200;
const AUTO_MP3_RETRY_MS = 3000;

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

async function speakMp3Auto(
  text: string,
  requestId: number,
): Promise<void> {
  const key = text.toLowerCase();
  preloadWordAudioElement(text);
  await warmWordAudioBytes(text);
  if (!stillCurrentRequest(requestId, key)) return;

  if (await playWordAudioWhenReady(text, AUTO_MP3_WAIT_MS)) return;
  if (!stillCurrentRequest(requestId, key)) return;

  await warmWordAudioBytes(text, { bustCache: true });
  preloadWordAudioElement(text);
  await playWordAudioWhenReady(text, AUTO_MP3_RETRY_MS);
}

/** Auto-pronounce after preload (no user gesture — requires prior audio unlock on iOS). */
export function speakEnglishTextAuto(text: string): void {
  const trimmed = claimSpeak(text, false);
  if (!trimmed) return;

  if (isAppleWebKit() && !isSpeechUnlocked()) return;

  void speakMp3Auto(trimmed, speakRequestId);
}

/** Manual tap — must start play synchronously inside the user gesture. */
export function speakEnglishText(
  text: string,
  _options?: { force?: boolean },
): void {
  const trimmed = claimSpeak(text, Boolean(_options?.force));
  if (!trimmed) return;

  unlockSpeechFromUserGesture();
  primeAudioPipelineInUserGesture();
  preloadWordAudioElement(trimmed);
  void warmWordAudioBytes(trimmed);
  playWordAudioInUserGesture(trimmed);
}

export function cancelSpeech(): void {
  stopWordAudio();
}

export function preloadWordPronunciation(word: string): void {
  preloadWordAudioElement(word);
  void warmWordAudioBytes(word);
}

/** @deprecated MP3-only app — kept for any legacy imports. */
export function speakEnglishTextSync(text: string): void {
  speakEnglishText(text, { force: true });
}

/** @deprecated MP3-only app — no browser voices to preload. */
export function preloadSpeechVoices(): void {}
