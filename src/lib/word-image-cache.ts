import { hasAcceptableWordImage, shouldRefreshImageUrl } from "@/lib/unsplash";

/** Bump when function-word fw=1 validation rules change. */
const STORAGE_KEY = "word-image-url-cache-v22";
const MAX_ENTRIES = 500;

const cache = new Map<string, string>();
let hydrated = false;

function hydrateFromStorage(): void {
  if (typeof window === "undefined" || hydrated) return;
  hydrated = true;
  try {
    sessionStorage.removeItem("word-image-url-cache-v11");
    sessionStorage.removeItem("word-image-url-cache-v12");
    sessionStorage.removeItem("word-image-url-cache-v13");
    sessionStorage.removeItem("word-image-url-cache-v14");
    sessionStorage.removeItem("word-image-url-cache-v15");
    sessionStorage.removeItem("word-image-url-cache-v16");
    sessionStorage.removeItem("word-image-url-cache-v17");
    sessionStorage.removeItem("word-image-url-cache-v18");
    sessionStorage.removeItem("word-image-url-cache-v19");
    sessionStorage.removeItem("word-image-url-cache-v20");
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<string, string>;
    for (const [word, url] of Object.entries(parsed)) {
      const key = word.trim().toLowerCase();
      if (
        url?.trim() &&
        hasAcceptableWordImage(url.trim(), key) &&
        !shouldRefreshImageUrl(url.trim(), key)
      ) {
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
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(Object.fromEntries(entries)),
    );
  } catch {
    /* quota or private mode */
  }
}

export function getCachedWordImageUrl(word: string): string | undefined {
  hydrateFromStorage();
  const key = word.trim().toLowerCase();
  const cached = cache.get(key);
  if (cached && !shouldRefreshImageUrl(cached, key)) return cached;
  if (cached) cache.delete(key);
  return undefined;
}

export function setCachedWordImageUrl(word: string, url: string): void {
  hydrateFromStorage();
  const key = word.trim().toLowerCase();
  if (!hasAcceptableWordImage(url, key) || shouldRefreshImageUrl(url, key)) {
    return;
  }
  cache.set(key, url.trim());
  persistToStorage();
}

export function peekCachedWordImageUrl(
  word: string,
  imageUrl?: string | null,
): string | undefined {
  hydrateFromStorage();
  const cached = getCachedWordImageUrl(word);
  if (cached && hasAcceptableWordImage(cached, word)) return cached;
  const trimmed = imageUrl?.trim();
  if (
    trimmed &&
    hasAcceptableWordImage(trimmed, word) &&
    !shouldRefreshImageUrl(trimmed, word)
  ) {
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
    if (
      url &&
      hasAcceptableWordImage(url, word) &&
      !shouldRefreshImageUrl(url, word)
    ) {
      const key = word.trim().toLowerCase();
      cache.set(key, url);
    }
  }
  persistToStorage();
}
