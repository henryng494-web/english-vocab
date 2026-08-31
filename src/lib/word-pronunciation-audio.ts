import { proxyPronounceAudioPath } from "@/lib/dictionary-pronunciation";
import { PRONOUNCE_VOICE_VERSION } from "@/lib/neural-pronunciation";

const audioUrlCache = new Map<string, string | null>();
const pendingLookups = new Map<string, Promise<string | null>>();
const warmedAudioBytes = new Set<string>();

let pronounceAudioElement: HTMLAudioElement | null = null;
let currentAudio: HTMLAudioElement | null = null;

function normalizeWord(word: string): string {
  return word.trim().toLowerCase();
}

/** Client cache key — must include voice version so auto-speak never replays stale MP3s. */
function cacheKey(word: string): string {
  const normalized = normalizeWord(word);
  if (!normalized) return "";
  return `${PRONOUNCE_VOICE_VERSION}:${normalized}`;
}

function absoluteAudioUrl(relativePath: string): string {
  if (typeof window === "undefined") return relativePath;
  return new URL(relativePath, window.location.origin).href;
}

function configureAudioElement(audio: HTMLAudioElement): void {
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.setAttribute("webkit-playsinline", "true");
  audio.playbackRate = 1;
}

/** Register the layout `<audio>` element (required for iOS Safari + PWA). */
export function registerPronounceAudioElement(element: HTMLAudioElement): void {
  pronounceAudioElement = element;
  configureAudioElement(element);
}

function getAudioElement(): HTMLAudioElement | null {
  if (typeof document === "undefined") return null;
  return pronounceAudioElement;
}

/** Same-origin neural MP3 path for the current voice version. */
function resolvePlayableUrl(word: string): string {
  const normalized = normalizeWord(word);
  if (!normalized) return "";
  return proxyPronounceAudioPath(normalized);
}

/** Resolve a same-origin pronunciation MP3 URL (cached). */
export async function resolveWordAudioUrl(word: string): Promise<string | null> {
  const key = cacheKey(word);
  if (!key) return null;
  if (audioUrlCache.has(key)) return audioUrlCache.get(key) ?? null;

  const pending = pendingLookups.get(key);
  if (pending) return pending;

  const normalized = normalizeWord(word);
  const lookup = fetch(`/api/pronounce?word=${encodeURIComponent(normalized)}`, {
    cache: "no-cache",
  })
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
export function preloadWordAudioElement(word: string, _url?: string | null): void {
  if (typeof window === "undefined") return;
  const key = cacheKey(word);
  if (!key) return;

  const audio = getAudioElement();
  if (!audio) return;

  const src = absoluteAudioUrl(resolvePlayableUrl(word));
  if (!src) return;

  if (audio.dataset.wordKey !== key || audio.src !== src) {
    audio.dataset.wordKey = key;
    audio.src = src;
    audio.load();
  }
}

export function preloadWordAudio(word: string): void {
  preloadWordAudioElement(word);
  void resolveWordAudioUrl(word);
}

/** Fetch MP3 bytes into the HTTP cache (no play — safe before user gesture). */
export function warmWordAudioBytes(
  word: string,
  options?: { bustCache?: boolean },
): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const key = cacheKey(word);
  if (!key) return Promise.resolve();

  if (!options?.bustCache && warmedAudioBytes.has(key)) {
    return Promise.resolve();
  }

  warmedAudioBytes.add(key);

  const src = absoluteAudioUrl(resolvePlayableUrl(word));
  if (!src) return Promise.resolve();

  const url = options?.bustCache ? `${src}${src.includes("?") ? "&" : "?"}_=${Date.now()}` : src;

  return fetch(url, { cache: options?.bustCache ? "no-store" : "no-cache" })
    .then((response) => {
      if (!response.ok) {
        warmedAudioBytes.delete(key);
        return;
      }
      preloadWordAudioElement(word);
    })
    .catch(() => {
      warmedAudioBytes.delete(key);
    });
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
): Promise<boolean> {
  const key = cacheKey(word);
  const audio = getAudioElement();
  if (!key || !audio) return Promise.resolve(false);
  if (isWordAudioElementReady(word)) return Promise.resolve(true);

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
      if (audio.dataset.wordKey === key && audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
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
  const audio = getAudioElement();
  if (!audio) return;
  audio.pause();
  audio.currentTime = 0;
  if (currentAudio === audio) currentAudio = null;
}

/** ~0.01s silent WAV — unlocks iOS audio in a gesture without audible speech. */
const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==";

/**
 * Unlock iOS/HTML audio playback during a user gesture with inaudible media.
 * Do not use a real word (e.g. "hello") — iOS ignores volume=0 on MP3.
 */
export function primeAudioPipelineInUserGesture(): void {
  if (typeof window === "undefined") return;
  const audio = getAudioElement();
  if (!audio) return;

  const prevKey = audio.dataset.wordKey ?? "";
  const prevSrc = audio.src;

  audio.src = SILENT_WAV_DATA_URI;
  audio.dataset.wordKey = "__silent__";
  audio.currentTime = 0;
  currentAudio = audio;

  const restore = () => {
    if (audio.dataset.wordKey !== "__silent__") return;
    audio.pause();
    audio.currentTime = 0;
    if (currentAudio === audio) currentAudio = null;
    const versionToken = `v=${PRONOUNCE_VOICE_VERSION}`;
    if (prevSrc && prevSrc.includes(versionToken)) {
      audio.src = prevSrc;
      audio.dataset.wordKey = prevKey;
    } else {
      audio.removeAttribute("src");
      delete audio.dataset.wordKey;
    }
  };

  const playPromise = audio.play();
  if (playPromise && typeof playPromise.then === "function") {
    playPromise.then(restore).catch(restore);
  } else {
    restore();
  }
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
export function playWordAudioInUserGesture(word: string): boolean {
  if (typeof window === "undefined") return false;
  const key = cacheKey(word);
  const audio = getAudioElement();
  if (!key || !audio) return false;

  const src = absoluteAudioUrl(resolvePlayableUrl(word));
  if (!src) return false;

  if (audio.dataset.wordKey !== key || audio.src !== src) {
    audio.dataset.wordKey = key;
    audio.src = src;
    audio.load();
  }

  audio.currentTime = 0;
  currentAudio = audio;

  const playPromise = audio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      if (currentAudio === audio) currentAudio = null;
    });
  }
  return true;
}

/** Start playback when buffered; returns false if nothing plays within timeout. */
export async function playWordAudioWhenReady(
  word: string,
  timeoutMs = 450,
): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const key = cacheKey(word);
  const audio = getAudioElement();
  if (!key || !audio) return false;

  preloadWordAudioElement(word);

  if (!isWordAudioElementReady(word)) {
    const ready = await waitForAudioElementReady(word, timeoutMs);
    if (!ready) return false;
  }

  if (audio.dataset.wordKey !== key) return false;

  try {
    audio.currentTime = 0;
    currentAudio = audio;
    await audio.play();
    return true;
  } catch {
    if (currentAudio === audio) currentAudio = null;
    return false;
  }
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
  currentAudio = audio;
  void audio.play().catch(() => {
    if (currentAudio === audio) currentAudio = null;
  });
  return true;
}
