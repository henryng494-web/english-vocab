const audioUrlCache = new Map<string, string | null>();
const pendingLookups = new Map<string, Promise<string | null>>();

let currentAudio: HTMLAudioElement | null = null;

function cacheKey(word: string): string {
  return word.trim().toLowerCase();
}

/** Resolve a natural US pronunciation MP3 URL (cached). */
export async function resolveWordAudioUrl(word: string): Promise<string | null> {
  const key = cacheKey(word);
  if (!key) return null;
  if (audioUrlCache.has(key)) return audioUrlCache.get(key) ?? null;

  const pending = pendingLookups.get(key);
  if (pending) return pending;

  const lookup = fetch(
    `/api/pronounce?word=${encodeURIComponent(key)}`,
    { cache: "force-cache" },
  )
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

/** Cached MP3 URL from a prior lookup — safe to read synchronously on tap. */
export function getCachedWordAudioUrl(word: string): string | null {
  const key = cacheKey(word);
  if (!key || !audioUrlCache.has(key)) return null;
  return audioUrlCache.get(key) ?? null;
}

export function preloadWordAudio(word: string): void {
  void resolveWordAudioUrl(word);
}

export function stopWordAudio(): void {
  if (!currentAudio) return;
  currentAudio.pause();
  currentAudio.currentTime = 0;
  currentAudio = null;
}

/** Play human dictionary audio when available. Returns true if playback started. */
export async function playWordAudioUrl(url: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  stopWordAudio();

  const audio = new Audio(url);
  audio.preload = "auto";
  audio.playbackRate = 1.04;
  currentAudio = audio;

  try {
    await audio.play();
    return true;
  } catch {
    if (currentAudio === audio) currentAudio = null;
    return false;
  }
}
