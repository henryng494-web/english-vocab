import { isRealCardImageUrl } from "@/lib/unsplash";

const cache = new Map<string, string>();

export function getCachedWordImageUrl(word: string): string | undefined {
  const key = word.trim().toLowerCase();
  return cache.get(key);
}

export function setCachedWordImageUrl(word: string, url: string): void {
  const key = word.trim().toLowerCase();
  if (!isRealCardImageUrl(url, key)) return;
  cache.set(key, url.trim());
}

export function peekCachedWordImageUrl(
  word: string,
  imageUrl?: string | null,
): string | undefined {
  const cached = getCachedWordImageUrl(word);
  if (cached) return cached;
  const trimmed = imageUrl?.trim();
  if (trimmed && isRealCardImageUrl(trimmed, word)) {
    setCachedWordImageUrl(word, trimmed);
    return trimmed;
  }
  return undefined;
}
