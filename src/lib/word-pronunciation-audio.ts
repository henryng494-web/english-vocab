import { proxyPronounceAudioPath } from "@/lib/dictionary-pronunciation";

const audioUrlCache = new Map<string, string | null>();
const pendingLookups = new Map<string, Promise<string | null>>();

let pronounceAudioElement: HTMLAudioElement | null = null;
let currentAudio: HTMLAudioElement | null = null;

function cacheKey(word: string): string {
  return word.trim().toLowerCase();
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

/** Resolve a same-origin pronunciation MP3 URL (cached). */
export async function resolveWordAudioUrl(word: string): Promise<string | null> {
  const key = cacheKey(word);
  if (!key) return null;
  if (audioUrlCache.has(key)) return audioUrlCache.get(key) ?? null;

  const pending = pendingLookups.get(key);
  if (pending) return pending;

  const lookup = fetch(`/api/pronounce?word=${encodeURIComponent(key)}`, {
    cache: "force-cache",
  })
    .then(async (response) => {
      if (!response.ok) {
        audioUrlCache.set(key, null);
        return null;
      }
      const data = (await response.json()) as { audioUrl?: string | null };
      const url = data.audioUrl?.trim() || null;
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

function resolvePlayableUrl(word: string, url?: string | null): string {
  const key = cacheKey(word);
  if (url?.trim()) return url;
  if (key) return proxyPronounceAudioPath(key);
  return "";
}

/** Warm audio src while the card is visible (no play — iOS blocks that). */
export function preloadWordAudioElement(word: string, url?: string | null): void {
  if (typeof window === "undefined") return;
  const key = cacheKey(word);
  if (!key) return;

  const audio = getAudioElement();
  if (!audio) return;

  const src = absoluteAudioUrl(resolvePlayableUrl(key, url ?? getCachedWordAudioUrl(key)));
  if (!src) return;

  if (audio.dataset.wordKey !== key || audio.src !== src) {
    audio.dataset.wordKey = key;
    audio.src = src;
    audio.load();
  }
}

export function preloadWordAudio(word: string): void {
  preloadWordAudioElement(word);
  void resolveWordAudioUrl(word).then((url) => {
    if (url) preloadWordAudioElement(word, url);
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
  window.speechSynthesis?.cancel();

  audio.src = SILENT_WAV_DATA_URI;
  audio.dataset.wordKey = "__silent__";
  audio.currentTime = 0;
  currentAudio = audio;

  const restore = () => {
    audio.pause();
    audio.currentTime = 0;
    if (currentAudio === audio) currentAudio = null;
    if (prevSrc) {
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

  const src = absoluteAudioUrl(resolvePlayableUrl(key));
  if (!src) return false;

  window.speechSynthesis?.cancel();

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
