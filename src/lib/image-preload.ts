import {
  peekCachedWordImageUrl,
  setCachedWordImageUrl,
} from "@/lib/word-image-cache";
import { isRealCardImageUrl } from "@/lib/unsplash";

const preloadedUrls = new Set<string>();
const inflightWords = new Map<string, Promise<string | null>>();

function inflightKey(target: WordImagePrefetchTarget): string {
  const word = target.word.trim().toLowerCase();
  const keyword = target.searchKeyword?.trim().toLowerCase() ?? "";
  const meaning = target.meaning?.trim().toLowerCase() ?? "";
  const pos = target.wordType?.trim().toLowerCase() ?? "";
  return `${word}|${keyword}|${meaning}|${pos}`;
}

export type WordImagePrefetchTarget = {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
  meaning?: string | null;
};

export const REVIEW_IMAGE_PREFETCH_CONCURRENCY = 8;
const BATCH_SIZE = 12;

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

function cacheResolvedUrl(word: string, url: string | null): string | null {
  if (url && isRealCardImageUrl(url, word)) {
    setCachedWordImageUrl(word, url);
    preloadImageUrlDeduped(url);
    return url;
  }
  return null;
}

async function fetchWordImagesBatchChunk(
  pending: WordImagePrefetchTarget[],
): Promise<Record<string, string>> {
  const updates: Record<string, string> = {};

  if (pending.length === 0) return updates;

  if (pending.length === 1) {
    const only = pending[0]!;
    const word = only.word.trim().toLowerCase();
    const url = await fetchWordImageFast(only);
    if (url) updates[word] = url;
    return updates;
  }

  try {
    const res = await fetch("/api/word-image/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: pending.map((target) => ({
          word: target.word,
          keyword: target.searchKeyword?.trim() || undefined,
          pos: target.wordType?.trim() || undefined,
          meaning: target.meaning?.trim() || undefined,
        })),
      }),
    });
    if (!res.ok) throw new Error(`batch ${res.status}`);
    const data = (await res.json()) as {
      images?: Record<string, string | null>;
    };
    for (const target of pending) {
      const word = target.word.trim().toLowerCase();
      const url = data.images?.[word]?.trim() ?? null;
      const cached = cacheResolvedUrl(word, url);
      if (cached) updates[word] = cached;
    }
  } catch {
    await Promise.all(
      pending.map(async (target) => {
        const word = target.word.trim().toLowerCase();
        const url = await fetchWordImageFast(target);
        if (url) updates[word] = url;
      }),
    );
  }

  return updates;
}

async function fetchWordImagesBatch(
  targets: WordImagePrefetchTarget[],
): Promise<Record<string, string>> {
  const updates: Record<string, string> = {};
  const pending: WordImagePrefetchTarget[] = [];

  for (const target of targets) {
    const word = target.word.trim().toLowerCase();
    if (!word) continue;
    const cached = peekCachedWordImageUrl(word, target.imageUrl);
    if (cached) {
      updates[word] = cached;
      preloadImageUrlDeduped(cached);
      continue;
    }
    pending.push(target);
  }

  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const chunk = pending.slice(i, i + BATCH_SIZE);
    const chunkUpdates = await fetchWordImagesBatchChunk(chunk);
    Object.assign(updates, chunkUpdates);
  }

  return updates;
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

  const key = inflightKey(target);
  const pending = inflightWords.get(key);
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
      if (target.meaning?.trim()) {
        params.set("meaning", target.meaning.trim());
      }
      const res = await fetch(`/api/word-image?${params}`);
      const data = (await res.json()) as { image_url?: string | null };
      const url = data.image_url?.trim() ?? null;
      return cacheResolvedUrl(word, url);
    } catch {
      /* ignore */
    }
    return null;
  })().finally(() => {
    inflightWords.delete(key);
  });

  inflightWords.set(key, promise);
  return promise;
}

/** Shared deduped lookup for card hooks and review prefetch. */
export async function resolveWordImageForCard(
  target: WordImagePrefetchTarget,
): Promise<string | null> {
  return fetchWordImageFast(target);
}

/** Resolve photos via the lightweight word-image API and warm the browser cache. */
export async function prefetchWordImages(
  targets: WordImagePrefetchTarget[],
  concurrency = 4,
): Promise<Record<string, string>> {
  const unique: WordImagePrefetchTarget[] = [];
  const seen = new Set<string>();

  for (const target of targets) {
    const word = target.word.trim().toLowerCase();
    if (!word || seen.has(word)) continue;
    seen.add(word);
    unique.push(target);
  }

  if (unique.length === 0) return {};

  if (unique.length >= 2) {
    return fetchWordImagesBatch(unique);
  }

  const updates: Record<string, string> = {};
  let index = 0;
  async function worker() {
    while (index < unique.length) {
      const current = index;
      index += 1;
      const target = unique[current]!;
      const word = target.word.trim().toLowerCase();
      const url = await fetchWordImageFast(target);
      if (url) updates[word] = url;
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, unique.length) }, () => worker()),
  );

  for (const target of unique) {
    const word = target.word.trim().toLowerCase();
    const known = peekCachedWordImageUrl(word, target.imageUrl);
    if (known) updates[word] = known;
  }

  return updates;
}
