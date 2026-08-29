import {
  fetchWordImageFromApi,
  fetchWordImagesBatchFromApi,
  type WordImagePrefetchTarget,
} from "@/lib/word-image-client";
import { resolveCastPreferredImagePath } from "@/lib/cast-word-images";
import {
  peekCachedWordImageUrl,
  setCachedWordImageUrl,
} from "@/lib/word-image-cache";
import { hasAcceptableWordImage } from "@/lib/unsplash";

const preloadedUrls = new Set<string>();
const inflightWords = new Map<string, Promise<string | null>>();

function inflightKey(target: WordImagePrefetchTarget): string {
  const word = target.word.trim().toLowerCase();
  const keyword = target.searchKeyword?.trim().toLowerCase() ?? "";
  const meaning = target.meaning?.trim().toLowerCase() ?? "";
  const pos = target.wordType?.trim().toLowerCase() ?? "";
  return `${word}|${keyword}|${meaning}|${pos}`;
}

export type { WordImagePrefetchTarget };

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

function cacheResolvedUrl(
  word: string,
  url: string | null,
  wordType?: string | null,
): string | null {
  if (url && hasAcceptableWordImage(url, word)) {
    setCachedWordImageUrl(word, url);
    preloadImageUrlDeduped(url);
    return url;
  }
  void wordType;
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
    const batchResults = await fetchWordImagesBatchFromApi(
      pending.map((target) => ({
        word: target.word,
        keyword: target.searchKeyword?.trim() || undefined,
        pos: target.wordType?.trim() || undefined,
        meaning: target.meaning?.trim() || undefined,
      })),
    );
    for (const target of pending) {
      const word = target.word.trim().toLowerCase();
      const result = batchResults[word];
      const cached = cacheResolvedUrl(word, result?.url ?? null);
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
    const castPath = resolveCastPreferredImagePath(word);
    if (castPath) {
      updates[word] = castPath;
      preloadImageUrlDeduped(castPath);
      continue;
    }
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

  const castPath = resolveCastPreferredImagePath(word);
  if (castPath) {
    cacheResolvedUrl(word, castPath);
    preloadImageUrlDeduped(castPath);
    return castPath;
  }

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
      const result = await fetchWordImageFromApi(target);
      return cacheResolvedUrl(word, result.url);
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
    if (resolveCastPreferredImagePath(word)) continue;
    const known = peekCachedWordImageUrl(word, target.imageUrl);
    if (known) updates[word] = known;
  }

  return updates;
}
