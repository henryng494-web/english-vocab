import { isAppleWebKit } from "@/lib/speech-voice";
import {
  hasWordAudioBlob,
  isWordAudioElementReady,
  isWordAudioPlaying,
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
const AUTO_MP3_WAIT_MS = 1600;
const AUTO_MP3_WAIT_BLOB_MS = 120;
const AUTO_MP3_RETRY_MS = 2400;

let speechUnlocked = false;
let pendingAutoSpeak: string | null = null;
let pendingGestureAutoSpeak: string | null = null;
const unlockListeners = new Set<() => void>();

const GESTURE_AUTO_DEDUPE_MS = 900;

function readSpeechUnlockedFromStorage(): boolean {
  if (typeof sessionStorage === "undefined") return false;
  return sessionStorage.getItem(SPEECH_UNLOCK_KEY) === "1";
}

export function isSpeechUnlocked(): boolean {
  if (!isAppleWebKit()) return true;
  return speechUnlocked || readSpeechUnlockedFromStorage();
}

/** True while the browser still treats the last tap as an active user gesture. */
export function hasTransientUserActivation(): boolean {
  if (typeof navigator === "undefined") return false;
  const activation = (
    navigator as Navigator & { userActivation?: { isActive?: boolean } }
  ).userActivation;
  return Boolean(activation?.isActive);
}

/** Queue auto-speak for the next real pointerdown on the Journey card (iOS). */
export function queueGestureAutoSpeak(word: string): void {
  const trimmed = word?.trim();
  pendingGestureAutoSpeak = trimmed || null;
}

/** Speak a queued Journey word inside pointerdown (iOS auto-speak fallback). */
export function consumeGestureAutoSpeak(): boolean {
  const trimmed = pendingGestureAutoSpeak;
  if (!trimmed) return false;
  pendingGestureAutoSpeak = null;
  if (wasRecentlySpokenInGesture(trimmed)) return true;
  speakWordInUserGesture(trimmed);
  return true;
}

/** Unlock HTML audio on iOS/PWA (first user gesture). */
export function unlockSpeechFromUserGesture(): void {
  if (typeof window === "undefined") return;
  const wasUnlocked = isSpeechUnlocked();
  speechUnlocked = true;
  try {
    sessionStorage.setItem(SPEECH_UNLOCK_KEY, "1");
  } catch {
    /* private mode */
  }

  if (!wasUnlocked) {
    for (const listener of unlockListeners) {
      listener();
    }
  }

  const pending = pendingAutoSpeak;
  if (pending) {
    pendingAutoSpeak = null;
    if (!wasRecentlySpokenInGesture(pending)) {
      tryAutoSpeakWord(pending);
    }
  }
}

export function subscribeSpeechUnlock(listener: () => void): () => void {
  unlockListeners.add(listener);
  return () => {
    unlockListeners.delete(listener);
  };
}

export function wasRecentlySpokenInGesture(text: string): boolean {
  const key = text.trim().toLowerCase();
  if (!key || !lastSpoken) return false;
  return (
    lastSpoken.text === key &&
    Date.now() - lastSpoken.at < GESTURE_AUTO_DEDUPE_MS
  );
}

/** Pronounce inside tap/click — required on iOS before async auto-play works. */
export function speakWordInUserGesture(text: string): void {
  const trimmed = text?.trim();
  if (!trimmed || typeof window === "undefined") return;

  unlockSpeechFromUserGesture();
  preloadWordAudioElement(trimmed);
  void warmWordAudioBytes(trimmed);
  playWordAudioInUserGesture(trimmed);

  const key = trimmed.toLowerCase();
  lastSpoken = { text: key, at: Date.now() };
  speakRequestId += 1;
  pendingGestureAutoSpeak = null;
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

function autoSpeakWaitMs(word: string): number {
  if (hasWordAudioBlob(word) || isWordAudioElementReady(word)) {
    return AUTO_MP3_WAIT_BLOB_MS;
  }
  return AUTO_MP3_WAIT_MS;
}

async function speakMp3Auto(
  text: string,
  requestId: number,
): Promise<void> {
  const key = text.toLowerCase();
  const buffered =
    hasWordAudioBlob(text) || isWordAudioElementReady(text);

  if (!buffered) {
    stopWordAudio();
    preloadWordAudioElement(text, { force: true });
    await warmWordAudioBytes(text);
  } else {
    preloadWordAudioElement(text);
  }
  if (!stillCurrentRequest(requestId, key)) return;
  if (isWordAudioPlaying(text)) return;

  if (
    await playWordAudioWhenReady(text, autoSpeakWaitMs(text), {
      preserveBuffer: buffered,
    })
  ) {
    return;
  }
  if (!stillCurrentRequest(requestId, key)) return;
  if (isWordAudioPlaying(text)) return;

  await warmWordAudioBytes(text, { bustCache: true });
  if (!stillCurrentRequest(requestId, key)) return;
  preloadWordAudioElement(text, { force: true });
  await playWordAudioWhenReady(text, AUTO_MP3_RETRY_MS);
}

/** Auto-pronounce: sync gesture path on iOS; async MP3 elsewhere. */
export function tryAutoSpeakWord(text: string): void {
  const trimmed = text?.trim();
  if (!trimmed || typeof window === "undefined") return;

  if (wasRecentlySpokenInGesture(trimmed)) return;

  preloadWordPronunciation(trimmed);

  if (isAppleWebKit()) {
    if (hasTransientUserActivation()) {
      speakWordInUserGesture(trimmed);
      return;
    }
    if (!isSpeechUnlocked()) {
      pendingAutoSpeak = trimmed;
    }
    queueGestureAutoSpeak(trimmed);
    return;
  }

  pendingAutoSpeak = null;
  speakEnglishTextAuto(trimmed);
}

/** Auto-pronounce after preload (no user gesture — desktop / unlocked Android). */
export function speakEnglishTextAuto(text: string): void {
  const trimmed = text?.trim();
  if (!trimmed || typeof window === "undefined") return;

  if (wasRecentlySpokenInGesture(trimmed)) return;

  if (isAppleWebKit()) {
    tryAutoSpeakWord(trimmed);
    return;
  }

  pendingAutoSpeak = null;
  const key = trimmed.toLowerCase();
  lastSpoken = { text: key, at: Date.now() };
  speakRequestId += 1;
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
  if (isAppleWebKit()) {
    primeAudioPipelineInUserGesture();
  }
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
