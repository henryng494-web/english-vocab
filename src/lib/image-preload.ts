import {
  peekCachedWordImageUrl,
  setCachedWordImageUrl,
} from "@/lib/word-image-cache";
import { isRealCardImageUrl } from "@/lib/unsplash";

const preloadedUrls = new Set<string>();
const inflightWords = new Map<string, Promise<string | null>>();

export type WordImagePrefetchTarget = {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
};

/** Browser-preload an image URL once per session. */
export function preloadImageUrlDeduped(url: string | null | undefined): void {
  if (!url || typeof window === "undefined") return;
  if (preloadedUrls.has(url)) return;
  preloadedUrls.add(url);
  const img = new window.Image();
  img.src = url;
}

export function preloadWordImagesFromCache(
  targets: WordImagePrefetchTarget[],
): void {
  for (const target of targets) {
    const known = peekCachedWordImageUrl(target.word, target.imageUrl);
    if (known) preloadImageUrlDeduped(known);
  }
}

async function fetchWordImageFast(
  target: WordImagePrefetchTarget,
): Promise<string | null> {
  const word = target.word.trim().toLowerCase();
  if (!word) return null;

  const cached = peekCachedWordImageUrl(word, target.imageUrl);
  if (cached) {
    preloadImageUrlDeduped(cached);
    return cached;
  }

  const pending = inflightWords.get(word);
  if (pending) return pending;

  const promise = (async () => {
    try {
      const params = new URLSearchParams({ word });
      if (target.searchKeyword?.trim()) {
        params.set("keyword", target.searchKeyword.trim());
      }
      if (target.wordType?.trim()) {
        params.set("pos", target.wordType.trim());
      }
      const res = await fetch(`/api/word-image?${params}`);
      const data = (await res.json()) as { image_url?: string | null };
      const url = data.image_url?.trim() ?? null;
      if (url && isRealCardImageUrl(url, word)) {
        setCachedWordImageUrl(word, url);
        preloadImageUrlDeduped(url);
        return url;
      }
    } catch {
      /* ignore */
    }
    return null;
  })().finally(() => {
    inflightWords.delete(word);
  });

  inflightWords.set(word, promise);
  return promise;
}

/** Resolve photos via the lightweight word-image API and warm the browser cache. */
export async function prefetchWordImages(
  targets: WordImagePrefetchTarget[],
  concurrency = 4,
): Promise<void> {
  const unique: WordImagePrefetchTarget[] = [];
  const seen = new Set<string>();

  for (const target of targets) {
    const word = target.word.trim().toLowerCase();
    if (!word || seen.has(word)) continue;
    seen.add(word);
    unique.push(target);
  }

  if (unique.length === 0) return;

  let index = 0;
  async function worker() {
    while (index < unique.length) {
      const current = index;
      index += 1;
      await fetchWordImageFast(unique[current]!);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, unique.length) }, () => worker()),
  );
}
