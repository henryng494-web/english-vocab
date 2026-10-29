import { apiUrl } from "@/lib/api-base";
import { proxyPronounceAudioPath } from "@/lib/dictionary-pronunciation";
import {
  getPronounceAccent,
  voiceVersionForAccent,
} from "@/lib/pronounce-accent";
import { normalizePronounceText } from "@/lib/pronounce-text";
import { getPronouncePlaybackRate } from "@/lib/pronounce-speed";
import {
  formatAudioPlayError,
  logAudioPlayRejection,
  logPronunciation,
  logPronunciationStep,
  nextPronunciationTraceId,
} from "@/lib/pronunciation-log";
import { isAppleWebKit } from "@/lib/speech-voice";

type PlaybackFailureReason = "no-element" | "no-src" | "autoplay-blocked" | "media-error";

/** Bumped on every stop / superseding play so stale canplay handlers never replay the wrong word. */
let playbackEpoch = 0;

const audioUrlCache = new Map<string, string | null>();
const pendingLookups = new Map<string, Promise<string | null>>();
const warmedAudioBytes = new Set<string>();
/** In-memory blob URLs — iOS plays cached blobs instantly inside a user gesture. */
const blobUrlByKey = new Map<string, string>();
const pendingWarmByKey = new Map<string, Promise<void>>();

let pronounceAudioElement: HTMLAudioElement | null = null;
let currentAudio: HTMLAudioElement | null = null;

function normalizeWord(word: string): string {
  return normalizePronounceText(word)?.toLowerCase() ?? word.trim().toLowerCase();
}

/** Client cache key — must include accent + voice version so auto-speak never replays stale MP3s. */
function cacheKey(word: string): string {
  const normalized = normalizePronounceText(word);
  if (!normalized) return "";
  const accent = getPronounceAccent();
  return `${voiceVersionForAccent(accent)}:${normalized.toLowerCase()}`;
}

function clearPronounceAudioCaches(): void {
  audioUrlCache.clear();
  pendingLookups.clear();
  warmedAudioBytes.clear();
  pendingWarmByKey.clear();
  for (const key of blobUrlByKey.keys()) {
    revokeBlobUrl(key);
  }
}

function revokeBlobUrl(key: string): void {
  const blobUrl = blobUrlByKey.get(key);
  if (!blobUrl) return;
  URL.revokeObjectURL(blobUrl);
  blobUrlByKey.delete(key);
}

/** Prefer warmed blob URL (instant on iOS); fall back to same-origin API path. */
function resolvePlayableSrc(word: string): string {
  const key = cacheKey(word);
  if (key) {
    const blobUrl = blobUrlByKey.get(key);
    if (blobUrl) return blobUrl;
  }
  return absoluteAudioUrl(resolvePlayableUrl(word));
}

/**
 * Tap path (Safari/iOS): always assign the same-origin API MP3 URL on `.src`.
 * Blob URLs are not used in-gesture — iOS treats them as async and blocks play().
 */
function resolveGesturePlaySrc(word: string): string {
  return absoluteAudioUrl(resolvePlayableUrl(word));
}

function absoluteAudioUrl(relativePath: string): string {
  const resolved = apiUrl(relativePath);
  if (resolved.startsWith("http://") || resolved.startsWith("https://")) {
    return resolved;
  }
  if (typeof window === "undefined") return resolved;
  return new URL(resolved, window.location.origin).href;
}

/** Compare resolved audio.src with an expected absolute URL. */
function audioSrcMatches(audio: HTMLAudioElement, expectedSrc: string): boolean {
  if (!expectedSrc) return false;
  const current = audio.currentSrc || audio.src;
  if (!current) return false;
  try {
    return new URL(current).href === new URL(expectedSrc).href;
  } catch {
    return current === expectedSrc;
  }
}

function configureAudioElement(audio: HTMLAudioElement): void {
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.setAttribute("webkit-playsinline", "true");
  applyPlaybackRate(audio);
}

function applyPlaybackRate(audio: HTMLAudioElement): void {
  const rate = getPronouncePlaybackRate();
  audio.playbackRate = Number.isFinite(rate) && rate > 0 ? rate : 1;
}

function resolveAudioElement(): HTMLAudioElement | null {
  if (pronounceAudioElement?.isConnected) return pronounceAudioElement;
  pronounceAudioElement = null;
  if (typeof document === "undefined") return null;
  const found = document.getElementById("ev-pronounce-audio");
  if (!(found instanceof HTMLAudioElement)) return null;
  pronounceAudioElement = found;
  configureAudioElement(found);
  bindSettingsListener();
  return found;
}

function wordFromCacheKey(wordKey: string | undefined): string | undefined {
  if (!wordKey) return undefined;
  return wordKey.includes(":") ? wordKey.split(":").slice(1).join(":") : wordKey;
}

function notifyPlaybackFailure(
  wordKey: string | undefined,
  reason: PlaybackFailureReason,
  error?: unknown,
): void {
  logPronunciation({
    stage: "mp3-play-failed",
    word: wordFromCacheKey(wordKey),
    detail: reason,
    error,
  });
}

function playbackStillActive(
  audio: HTMLAudioElement,
  epoch: number,
  wordKey: string,
): boolean {
  return (
    Number(audio.dataset.playbackEpoch) === epoch &&
    audio.dataset.wordKey === wordKey
  );
}

type StartPlaybackOptions = {
  /** User gesture path — one synchronous play(); no async canplay retry (Safari). */
  gesture?: boolean;
  word?: string;
  traceId?: string;
};

async function probePronounceAudioUrl(
  src: string,
  traceId: string,
  word: string,
): Promise<void> {
  try {
    const response = await fetch(src, { cache: "no-store" });
    const contentType = response.headers.get("content-type") ?? "(none)";
    const engine = response.headers.get("x-pronounce-engine") ?? "(none)";
    const accentHeader = response.headers.get("x-pronounce-accent") ?? "(none)";
    logPronunciationStep(
      traceId,
      "2b-api-response",
      word,
      `status=${response.status} content-type=${contentType} engine=${engine} accent=${accentHeader}`,
    );
    if (!response.ok) {
      const body = (await response.text()).slice(0, 240);
      logPronunciationStep(traceId, "2b-api-error-body", word, body || "(empty)");
      return;
    }
    if (!contentType.toLowerCase().includes("audio")) {
      const body = (await response.clone().text()).slice(0, 120);
      logPronunciationStep(
        traceId,
        "2b-api-not-audio",
        word,
        `body-preview=${body}`,
      );
    }
  } catch (err) {
    logPronunciationStep(
      traceId,
      "2b-api-fetch-failed",
      word,
      formatAudioPlayError(err),
      err,
    );
  }
}

function bindPlaybackDiagnostics(
  audio: HTMLAudioElement,
  traceId: string,
  word: string,
  epoch: number,
  wordKey: string,
): void {
  const logMedia = (stage: string, extra?: string) => {
    if (!playbackStillActive(audio, epoch, wordKey)) return;
    logPronunciationStep(
      traceId,
      stage,
      word,
      extra ??
        `readyState=${audio.readyState} networkState=${audio.networkState} paused=${audio.paused}`,
    );
  };

  audio.addEventListener("loadstart", () => logMedia("4-media-loadstart"), { once: true });
  audio.addEventListener("loadedmetadata", () => logMedia("4-media-loadedmetadata"), {
    once: true,
  });
  audio.addEventListener("canplay", () => logMedia("4-media-canplay"), { once: true });
  audio.addEventListener("playing", () => logMedia("5-media-playing"), { once: true });
  audio.addEventListener(
    "error",
    () => {
      const mediaError = audio.error;
      logPronunciationStep(
        traceId,
        "5-media-error",
        word,
        mediaError
          ? `code=${mediaError.code} message=${mediaError.message}`
          : "unknown-media-error",
      );
    },
    { once: true },
  );
}

function startPlayback(
  audio: HTMLAudioElement,
  wordKey: string,
  epoch: number,
  options?: StartPlaybackOptions,
): void {
  applyPlaybackRate(audio);
  currentAudio = audio;
  audio.dataset.playbackEpoch = String(epoch);
  audio.dataset.wordKey = wordKey;

  try {
    audio.currentTime = 0;
  } catch {
    /* media not seekable yet — play() still queues playback */
  }

  const fail = (reason: PlaybackFailureReason, error?: unknown) => {
    if (!playbackStillActive(audio, epoch, wordKey)) return;
    if (currentAudio === audio) currentAudio = null;
    notifyPlaybackFailure(wordKey, reason, error);
  };

  const onMediaError = () => {
    if (!playbackStillActive(audio, epoch, wordKey)) return;
    fail("media-error");
  };
  audio.addEventListener("error", onMediaError, { once: true });

  const gesture = options?.gesture === true;
  const logWord = options?.word ?? wordFromCacheKey(wordKey);
  const traceId = options?.traceId;

  const playAttempt = () => {
    if (traceId && logWord) {
      logPronunciationStep(
        traceId,
        "3-play-called",
        logWord,
        `gesture=${gesture} readyState=${audio.readyState} src=${(audio.currentSrc || audio.src).slice(0, 120)}`,
      );
    }
    try {
      const playPromise = audio.play();
      if (!playPromise || typeof playPromise.catch !== "function") return;
      playPromise.catch((err: unknown) => {
        if (!playbackStillActive(audio, epoch, wordKey)) return;
        logAudioPlayRejection(
          gesture ? "gesture-play" : "auto-play",
          err,
          logWord,
        );
        const blocked =
          err instanceof DOMException &&
          (err.name === "NotAllowedError" || err.name === "AbortError");
        if (gesture) {
          fail(blocked ? "autoplay-blocked" : "media-error", err);
          return;
        }
        if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
          void audio.play().catch((retryErr) => {
            logAudioPlayRejection("auto-play-retry", retryErr, logWord);
            fail(blocked ? "autoplay-blocked" : "media-error", retryErr);
          });
          return;
        }
        const onReady = () => {
          audio.removeEventListener("canplay", onReady);
          audio.removeEventListener("canplaythrough", onReady);
          if (!playbackStillActive(audio, epoch, wordKey)) return;
          if (currentAudio !== audio) return;
          applyPlaybackRate(audio);
          void audio.play().catch((retryErr) => {
            logAudioPlayRejection("canplay-retry", retryErr, logWord);
            fail(blocked ? "autoplay-blocked" : "media-error", retryErr);
          });
        };
        audio.addEventListener("canplay", onReady);
        audio.addEventListener("canplaythrough", onReady);
      });
    } catch (err) {
      logAudioPlayRejection("play-sync-throw", err, logWord);
      fail("media-error", err);
    }
  };

  playAttempt();
}

function bindSettingsListener(): void {
  if (typeof window === "undefined" || settingsListenerBound) return;
  settingsListenerBound = true;
  let lastAccent = getPronounceAccent();
  window.addEventListener("app-settings-changed", () => {
    const audio = getAudioElement();
    if (audio) applyPlaybackRate(audio);
    const nextAccent = getPronounceAccent();
    if (nextAccent !== lastAccent) {
      const previousAccent = lastAccent;
      lastAccent = nextAccent;
      stopWordAudio();
      clearPronounceAudioCaches();
      if (audio) {
        audio.removeAttribute("src");
        delete audio.dataset.wordKey;
      }
      logPronunciation({
        stage: "accent-changed",
        detail: `${previousAccent} -> ${nextAccent} nextUrl=/api/pronounce/audio?text=hello&accent=${nextAccent}&v=${voiceVersionForAccent(nextAccent)}`,
      });
    }
  });
}

let settingsListenerBound = false;

/** Register the layout `<audio>` element (required for iOS Safari + PWA). */
export function registerPronounceAudioElement(element: HTMLAudioElement | null): void {
  if (!element) {
    pronounceAudioElement = null;
    return;
  }
  pronounceAudioElement = element;
  configureAudioElement(element);
  bindSettingsListener();
}

function getAudioElement(): HTMLAudioElement | null {
  if (typeof document === "undefined") return null;
  return resolveAudioElement();
}

function isSharedAudioPlaying(): boolean {
  const audio = getAudioElement();
  if (!audio) return false;
  return !audio.paused && !audio.ended && audio.currentTime > 0;
}

/** True when the shared element is actively playing this word. */
export function isWordAudioPlaying(word: string): boolean {
  const key = cacheKey(word);
  const audio = getAudioElement();
  if (!key || !audio) return false;
  return audio.dataset.wordKey === key && isSharedAudioPlaying();
}

/** Same-origin MP3 path for the current accent + voice version. */
function resolvePlayableUrl(word: string): string {
  const normalized = normalizePronounceText(word);
  if (!normalized) return "";
  return proxyPronounceAudioPath(normalized, getPronounceAccent());
}

/** Resolve a same-origin pronunciation MP3 URL (cached). */
export async function resolveWordAudioUrl(word: string): Promise<string | null> {
  const key = cacheKey(word);
  if (!key) return null;
  if (audioUrlCache.has(key)) return audioUrlCache.get(key) ?? null;

  const pending = pendingLookups.get(key);
  if (pending) return pending;

  const normalized = normalizePronounceText(word) ?? normalizeWord(word);
  const accent = getPronounceAccent();
  const lookup = fetch(
    `/api/pronounce?text=${encodeURIComponent(normalized)}&accent=${accent}`,
    {
      cache: "no-cache",
    },
  )
    .then(async (response) => {
      if (!response.ok) {
        audioUrlCache.set(key, null);
        return null;
      }
      const data = (await response.json()) as { audioUrl?: string | null };
      const url = data.audioUrl?.trim() || resolvePlayableUrl(word);
      audioUrlCache.set(key, url);
      return url;
    })
    .catch(() => {
      audioUrlCache.set(key, null);
      return null;
    })
    .finally(() => {
      pendingLookups.delete(key);
    });

  pendingLookups.set(key, lookup);
  return lookup;
}

export function getCachedWordAudioUrl(word: string): string | null {
  const key = cacheKey(word);
  if (!key || !audioUrlCache.has(key)) return null;
  return audioUrlCache.get(key) ?? null;
}

/** Warm audio src while the card is visible (no play — iOS blocks that). */
export function preloadWordAudioElement(
  word: string,
  options?: { force?: boolean },
): void {
  if (typeof window === "undefined") return;
  const key = cacheKey(word);
  if (!key) return;

  const audio = getAudioElement();
  if (!audio) return;

  // Never hijack the shared element while another word is playing (unless forced).
  if (
    !options?.force &&
    isSharedAudioPlaying() &&
    audio.dataset.wordKey !== key
  ) {
    return;
  }

  const src = isAppleWebKit()
    ? resolveGesturePlaySrc(word)
    : resolvePlayableSrc(word);
  if (!src) return;

  if (audio.dataset.wordKey !== key || !audioSrcMatches(audio, src)) {
    if (options?.force && isSharedAudioPlaying()) {
      audio.pause();
      audio.currentTime = 0;
    }
    audio.dataset.wordKey = key;
    audio.src = src;
    // Avoid load() on iOS — it breaks in-gesture play(); desktop can prefetch.
    if (!isAppleWebKit()) {
      audio.load();
    }
  }
}

export function preloadWordAudio(word: string): void {
  preloadWordAudioElement(word);
  void resolveWordAudioUrl(word);
}

/** True when MP3 bytes are cached in memory (fastest auto-speak path). */
export function hasWordAudioBlob(word: string): boolean {
  const key = cacheKey(word);
  return Boolean(key && blobUrlByKey.has(key));
}

/** Fetch MP3 bytes into memory (blob URL) and HTTP cache — safe before user gesture. */
export function warmWordAudioBytes(
  word: string,
  options?: { bustCache?: boolean },
): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const key = cacheKey(word);
  if (!key) return Promise.resolve();

  if (!options?.bustCache) {
    if (blobUrlByKey.has(key)) return Promise.resolve();
    const pending = pendingWarmByKey.get(key);
    if (pending) return pending;
  } else {
    warmedAudioBytes.delete(key);
    revokeBlobUrl(key);
  }

  const src = absoluteAudioUrl(resolvePlayableUrl(word));
  if (!src) return Promise.resolve();

  const url = options?.bustCache ? `${src}${src.includes("?") ? "&" : "?"}_=${Date.now()}` : src;

  const warm = fetch(url, { cache: options?.bustCache ? "no-store" : "no-cache" })
    .then(async (response) => {
      if (!response.ok) {
        warmedAudioBytes.delete(key);
        return;
      }
      const blob = await response.blob();
      if (blob.size === 0) {
        warmedAudioBytes.delete(key);
        return;
      }
      revokeBlobUrl(key);
      blobUrlByKey.set(key, URL.createObjectURL(blob));
      warmedAudioBytes.add(key);
    })
    .catch(() => {
      warmedAudioBytes.delete(key);
    })
    .finally(() => {
      pendingWarmByKey.delete(key);
    });

  pendingWarmByKey.set(key, warm);
  return warm;
}

/** True when the shared `<audio>` element has buffered enough to play soon. */
export function isWordAudioElementReady(word: string): boolean {
  const key = cacheKey(word);
  const audio = getAudioElement();
  if (!key || !audio) return false;
  if (audio.dataset.wordKey !== key) return false;
  return audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
}

function waitForAudioElementReady(
  word: string,
  timeoutMs: number,
  guard?: () => boolean,
): Promise<boolean> {
  const key = cacheKey(word);
  const audio = getAudioElement();
  if (!key || !audio) return Promise.resolve(false);
  if (guard && !guard()) return Promise.resolve(false);
  if (isWordAudioElementReady(word)) return Promise.resolve(true);

  const epoch = playbackEpoch;

  return new Promise((resolve) => {
    let settled = false;
    const finish = (ready: boolean) => {
      if (settled) return;
      settled = true;
      audio.removeEventListener("canplay", onReady);
      audio.removeEventListener("canplaythrough", onReady);
      audio.removeEventListener("playing", onReady);
      window.clearTimeout(timer);
      resolve(ready);
    };
    const onReady = () => {
      if (guard && !guard()) {
        finish(false);
        return;
      }
      if (
        playbackStillActive(audio, epoch, key) &&
        audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        finish(true);
      }
    };
    const timer = window.setTimeout(() => finish(false), timeoutMs);
    audio.addEventListener("canplay", onReady);
    audio.addEventListener("canplaythrough", onReady);
    audio.addEventListener("playing", onReady);
  });
}

export function stopWordAudio(): void {
  playbackEpoch += 1;
  const audio = getAudioElement();
  if (!audio) return;
  audio.pause();
  try {
    audio.currentTime = 0;
  } catch {
    /* ignore */
  }
  if (currentAudio === audio) currentAudio = null;
}

/** ~0.01s silent WAV — unlocks iOS audio in a gesture without audible speech. */
const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

let sharedAudioPrimedInSession = false;

/**
 * Prime the layout `<audio>` during pointerdown/touchstart (Safari iOS).
 * Uses only the persistent DOM node — no blob URLs, no async src restore.
 */
export function primeSharedAudioInUserGesture(): void {
  if (typeof window === "undefined") return;
  const audio = getAudioElement();
  if (!audio) {
    logPronunciation({ stage: "ios-audio-prime", detail: "no-audio-element" });
    return;
  }
  configureAudioElement(audio);

  if (sharedAudioPrimedInSession && isAppleWebKit()) {
    return;
  }

  try {
    audio.pause();
    audio.src = SILENT_WAV_DATA_URI;
    audio.dataset.wordKey = "__prime__";
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch((err) => {
        logAudioPlayRejection("ios-audio-prime", err);
      });
    }
    sharedAudioPrimedInSession = true;
    audio.pause();
    try {
      audio.currentTime = 0;
    } catch {
      /* ignore */
    }
  } catch (err) {
    logAudioPlayRejection("ios-audio-prime-sync", err);
  }
}

/** @deprecated Use primeSharedAudioInUserGesture — old async restore raced MP3 playback. */
export function primeAudioPipelineInUserGesture(): void {
  primeSharedAudioInUserGesture();
}

/**
 * @deprecated Use primeAudioPipelineInUserGesture — word-based priming spoke "hello" on iOS.
 */
export function primeWordAudioInUserGesture(_word: string): void {
  primeAudioPipelineInUserGesture();
}

/**
 * Start pronunciation inside tap/click — must not await or gate on readyState.
 * iOS Safari/PWA only unlocks playback when play() runs during the user gesture.
 */
export function playWordAudioInUserGesture(
  word: string,
  traceId: string = nextPronunciationTraceId(),
): boolean {
  if (typeof window === "undefined") return false;
  const key = cacheKey(word);
  const audio = getAudioElement();
  if (!key || !audio) {
    logPronunciationStep(
      traceId,
      "1-play-abort",
      word,
      !audio ? "no-audio-element" : "invalid-word",
    );
    return false;
  }

  const src = resolveGesturePlaySrc(word);
  if (!src) {
    logPronunciationStep(traceId, "1-play-abort", word, "no-src");
    return false;
  }

  const accent = getPronounceAccent();
  logPronunciationStep(traceId, "1-tap-play-start", word, `accent=${accent}`);
  logPronunciationStep(traceId, "2-audio-src-set", word, `${src} accent=${accent}`);

  const epoch = playbackEpoch;
  audio.pause();
  try {
    audio.currentTime = 0;
  } catch {
    /* ignore */
  }
  audio.dataset.wordKey = key;
  audio.src = src;
  // Do not call load() here — it resets the buffer and breaks iOS gesture playback.

  bindPlaybackDiagnostics(audio, traceId, word, epoch, key);
  void probePronounceAudioUrl(src, traceId, word);

  startPlayback(audio, key, epoch, {
    gesture: isAppleWebKit(),
    word,
    traceId,
  });
  return true;
}

/** Start playback when buffered; returns false if nothing plays within timeout. */
export async function playWordAudioWhenReady(
  word: string,
  timeoutMs = 450,
  options?: { preserveBuffer?: boolean; guard?: () => boolean },
): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const key = cacheKey(word);
  const audio = getAudioElement();
  if (!key || !audio) return false;

  const guard = options?.guard;
  if (guard && !guard()) return false;

  if (isWordAudioPlaying(word)) return true;

  const keepBuffer =
    options?.preserveBuffer === true && isWordAudioElementReady(word);
  if (keepBuffer) {
    preloadWordAudioElement(word);
  } else {
    stopWordAudio();
    preloadWordAudioElement(word, { force: true });
  }

  const epoch = playbackEpoch;

  if (!isWordAudioElementReady(word)) {
    const ready = await waitForAudioElementReady(word, timeoutMs, guard);
    if (!ready) return false;
  }

  if (guard && !guard()) return false;
  if (!playbackStillActive(audio, epoch, key)) return false;

  if (isWordAudioPlaying(word)) return true;

  return new Promise((resolve) => {
    let timer = 0;
    const finish = (ok: boolean) => {
      audio.removeEventListener("playing", onPlaying);
      window.clearTimeout(timer);
      resolve(ok);
    };
    const onPlaying = () => {
      if (guard && !guard()) {
        finish(false);
        return;
      }
      if (playbackStillActive(audio, epoch, key) && !audio.paused) finish(true);
    };
    timer = window.setTimeout(() => finish(isWordAudioPlaying(word)), timeoutMs);
    audio.addEventListener("playing", onPlaying);
    startPlayback(audio, key, epoch);
  });
}

/** @deprecated Use playWordAudioInUserGesture inside tap handlers. */
export function playPreloadedWordAudioSync(word: string): boolean {
  return playWordAudioInUserGesture(word);
}

export async function playWordAudioUrl(url: string): Promise<boolean> {
  if (typeof window === "undefined" || !url.trim()) return false;

  const audio = getAudioElement();
  if (!audio) return false;

  stopWordAudio();
  audio.src = absoluteAudioUrl(url);
  applyPlaybackRate(audio);
  currentAudio = audio;

  try {
    await audio.play();
    return true;
  } catch {
    if (currentAudio === audio) currentAudio = null;
    return false;
  }
}

export function playWordAudioUrlSync(url: string): boolean {
  if (typeof window === "undefined" || !url.trim()) return false;
  const audio = getAudioElement();
  if (!audio) return false;

  stopWordAudio();
  audio.src = absoluteAudioUrl(url);
  applyPlaybackRate(audio);
  currentAudio = audio;
  void audio.play().catch(() => {
    if (currentAudio === audio) currentAudio = null;
  });
  return true;
}
