import { proxyPronounceAudioPath } from "@/lib/dictionary-pronunciation";

const audioUrlCache = new Map<string, string | null>();
const pendingLookups = new Map<string, Promise<string | null>>();
const preloadedElements = new Map<string, HTMLAudioElement>();

let sharedAudio: HTMLAudioElement | null = null;
let currentAudio: HTMLAudioElement | null = null;

function cacheKey(word: string): string {
  return word.trim().toLowerCase();
}

function ensureSharedAudio(): HTMLAudioElement | null {
  if (typeof document === "undefined") return null;
  if (sharedAudio) return sharedAudio;

  const audio = document.createElement("audio");
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.setAttribute("webkit-playsinline", "true");
  audio.style.display = "none";
  document.body.appendChild(audio);
  sharedAudio = audio;
  return audio;
}

function configureAudioElement(audio: HTMLAudioElement): void {
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  audio.setAttribute("webkit-playsinline", "true");
  audio.playbackRate = 1.04;
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

/** Cached same-origin MP3 URL from a prior lookup. */
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

/** Warm `<audio>` for a word so iOS can play inside the next tap. */
export function preloadWordAudioElement(word: string, url?: string | null): void {
  if (typeof window === "undefined") return;
  const key = cacheKey(word);
  if (!key) return;

  const src = resolvePlayableUrl(key, url ?? getCachedWordAudioUrl(key));
  if (!src) return;

  let audio = preloadedElements.get(key);
  if (!audio) {
    audio = ensureSharedAudio() ?? new Audio();
    configureAudioElement(audio);
    preloadedElements.set(key, audio);
  }

  if (audio.dataset.wordKey !== key || !audio.src) {
    audio.dataset.wordKey = key;
    audio.src = src;
    audio.load();
  }
}

export function preloadWordAudio(word: string): void {
  void resolveWordAudioUrl(word).then((url) => {
    if (url) preloadWordAudioElement(word, url);
  });
}

export function stopWordAudio(): void {
  if (sharedAudio) {
    sharedAudio.pause();
    sharedAudio.currentTime = 0;
  }
  for (const audio of preloadedElements.values()) {
    audio.pause();
    audio.currentTime = 0;
  }
}

/**
 * Play preloaded same-origin audio synchronously inside a tap (iOS Safari).
 * Returns true only when audio is buffered enough to start immediately.
 */
export function playPreloadedWordAudioSync(word: string): boolean {
  if (typeof window === "undefined") return false;
  const key = cacheKey(word);
  if (!key) return false;

  let audio = preloadedElements.get(key);
  const src = resolvePlayableUrl(key);
  if (!src) return false;

  if (!audio) {
    const created = ensureSharedAudio();
    if (!created) return false;
    audio = created;
    configureAudioElement(audio);
    audio.src = src;
    audio.load();
    preloadedElements.set(key, audio);
  }

  if (audio.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    return false;
  }

  stopWordAudio();
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

/** Play human dictionary audio when available. */
export async function playWordAudioUrl(url: string): Promise<boolean> {
  if (typeof window === "undefined" || !url.trim()) return false;

  stopWordAudio();

  const audio = ensureSharedAudio() ?? new Audio();
  configureAudioElement(audio);
  audio.src = url;
  currentAudio = audio;

  try {
    await audio.play();
    return true;
  } catch {
    if (currentAudio === audio) currentAudio = null;
    return false;
  }
}

/** @deprecated Prefer playPreloadedWordAudioSync inside tap handlers. */
export function playWordAudioUrlSync(url: string): boolean {
  if (typeof window === "undefined" || !url.trim()) return false;
  stopWordAudio();
  const audio = ensureSharedAudio() ?? new Audio();
  configureAudioElement(audio);
  audio.src = url;
  currentAudio = audio;
  const playPromise = audio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      if (currentAudio === audio) currentAudio = null;
    });
  }
  return audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA;
}
