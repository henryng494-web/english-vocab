import {
  isAppleWebKit,
} from "@/lib/speech-voice";
import { logPronunciation } from "@/lib/pronunciation-log";
import {
  hasWordAudioBlob,
  isWordAudioElementReady,
  isWordAudioPlaying,
  playWordAudioInUserGesture,
  playWordAudioWhenReady,
  preloadWordAudioElement,
  primeSharedAudioInUserGesture,
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
const FIRST_CARD_MP3_WAIT_MS = 450;

let firstCardAutoSpoken = false;

/** Manual tap — shared `<audio>` + dictionary / neural MP3 (sync play() in gesture). */
function speakMp3InUserGesture(text: string, requestId: number): void {
  unlockSpeechFromUserGesture();
  if (typeof window !== "undefined" && window.speechSynthesis) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      /* ignore */
    }
  }
  if (isAppleWebKit()) {
    primeSharedAudioInUserGesture();
  }
  stopWordAudio();
  if (!isAppleWebKit()) {
    void warmWordAudioBytes(text);
  }
  const played = playWordAudioInUserGesture(text);
  logPronunciation({
    stage: "mp3-tap",
    word: text,
    detail: played ? `play-called#${requestId}` : "play-not-started",
  });
}

let speechUnlocked = false;
let pendingAutoSpeak: string | null = null;
let pendingGestureAutoSpeak: string | null = null;
const unlockListeners = new Set<() => void>();

const GESTURE_AUTO_DEDUPE_MS = 900;

function readSpeechUnlockedFromStorage(): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    return localStorage.getItem(SPEECH_UNLOCK_KEY) === "1";
  } catch {
    return false;
  }
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
    localStorage.setItem(SPEECH_UNLOCK_KEY, "1");
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
      if (hasTransientUserActivation()) {
        speakWordInUserGesture(pending);
      } else {
        tryAutoSpeakWord(pending);
      }
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

/** Pronounce inside tap/click — MP3 only, synchronous play() in gesture. */
export function speakWordInUserGesture(text: string): void {
  const trimmed = claimSpeak(text, true);
  if (!trimmed) return;

  speakMp3InUserGesture(trimmed, speakRequestId);
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
  const guard = () => stillCurrentRequest(requestId, key);

  stopWordAudio();
  if (!guard()) return;

  const buffered =
    hasWordAudioBlob(text) || isWordAudioElementReady(text);

  if (!buffered) {
    preloadWordAudioElement(text, { force: true });
    await warmWordAudioBytes(text);
  } else {
    preloadWordAudioElement(text);
  }
  if (!guard()) return;
  if (isWordAudioPlaying(text)) return;

  const isFirstCard = !firstCardAutoSpoken;
  firstCardAutoSpoken = true;
  const waitMs = isFirstCard
    ? Math.min(autoSpeakWaitMs(text), FIRST_CARD_MP3_WAIT_MS)
    : autoSpeakWaitMs(text);

  if (
    await playWordAudioWhenReady(text, waitMs, {
      preserveBuffer: buffered,
      guard,
    })
  ) {
    return;
  }
  if (!guard()) return;
  if (isWordAudioPlaying(text)) return;

  await warmWordAudioBytes(text, { bustCache: true });
  if (!guard()) return;
  preloadWordAudioElement(text, { force: true });
  const played = await playWordAudioWhenReady(text, AUTO_MP3_RETRY_MS, {
    guard,
  });
  if (!played && guard() && !isWordAudioPlaying(text)) {
    logPronunciation({ stage: "auto-speak-blocked", word: text, detail: "pending-next-tap" });
    pendingAutoSpeak = text;
  }
}

export function hasPendingAutoSpeak(): boolean {
  return pendingAutoSpeak !== null;
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

/** Manual tap — dictionary MP3 via HTML5 audio (no TTS / native speech stack). */
export function speakEnglishText(
  text: string,
  _options?: { force?: boolean },
): void {
  const trimmed = claimSpeak(text, Boolean(_options?.force));
  if (!trimmed) return;

  speakMp3InUserGesture(trimmed, speakRequestId);
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
export function preloadSpeechVoices(): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const synth = window.speechSynthesis;
    if (synth.getVoices().length === 0) {
      synth.addEventListener("voiceschanged", () => synth.getVoices(), {
        once: true,
      });
    }
  } catch {
    /* ignore */
  }
}
