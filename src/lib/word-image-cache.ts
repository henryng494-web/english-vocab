import { isRealCardImageUrl } from "@/lib/unsplash";

const STORAGE_KEY = "word-image-url-cache-v4";
const MAX_ENTRIES = 500;

const cache = new Map<string, string>();
let hydrated = false;

function hydrateFromStorage(): void {
  if (typeof window === "undefined" || hydrated) return;
  hydrated = true;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, string>;
    for (const [word, url] of Object.entries(parsed)) {
      const key = word.trim().toLowerCase();
      if (url?.trim() && isRealCardImageUrl(url.trim(), key)) {
        cache.set(key, url.trim());
      }
    }
  } catch {
    /* ignore */
  }
}

function persistToStorage(): void {
  if (typeof window === "undefined") return;
  try {
    const entries = Array.from(cache.entries()).slice(-MAX_ENTRIES);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    /* quota or private mode */
  }
}

export function getCachedWordImageUrl(word: string): string | undefined {
  hydrateFromStorage();
  const key = word.trim().toLowerCase();
  return cache.get(key);
}

export function setCachedWordImageUrl(word: string, url: string): void {
  hydrateFromStorage();
  const key = word.trim().toLowerCase();
  if (!isRealCardImageUrl(url, key)) return;
  cache.set(key, url.trim());
  persistToStorage();
}

export function peekCachedWordImageUrl(
  word: string,
  imageUrl?: string | null,
): string | undefined {
  hydrateFromStorage();
  const cached = getCachedWordImageUrl(word);
  if (cached) return cached;
  const trimmed = imageUrl?.trim();
  if (trimmed && isRealCardImageUrl(trimmed, word)) {
    setCachedWordImageUrl(word, trimmed);
    return trimmed;
  }
  return undefined;
}

/** Seed the in-memory image cache from discover/bootstrap word entries. */
export function seedWordImageCacheFromEntries(
  entries: Iterable<[string, { image_url?: string | null }]>,
): void {
  hydrateFromStorage();
  for (const [word, entry] of entries) {
    const url = entry.image_url?.trim();
    if (url && isRealCardImageUrl(url, word)) {
      const key = word.trim().toLowerCase();
      if (!cache.has(key)) {
        cache.set(key, url);
      }
    }
  }
  persistToStorage();
}
