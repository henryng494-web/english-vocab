import { preloadImageUrl } from "@/lib/discover-word-cache";
import {
  peekCachedWordImageUrl,
  setCachedWordImageUrl,
} from "@/lib/word-image-cache";
import { isRealCardImageUrl } from "@/lib/unsplash";

type ReviewImageTarget = {
  word: string;
  imageUrl?: string | null;
};

async function fetchWordImageFast(word: string): Promise<string | null> {
  const cached = peekCachedWordImageUrl(word);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({ word });
    const res = await fetch(`/api/word-image?${params}`);
    const data = (await res.json()) as { image_url?: string | null };
    const url = data.image_url?.trim() ?? null;
    if (url && isRealCardImageUrl(url, word)) {
      setCachedWordImageUrl(word, url);
      preloadImageUrl(url);
      return url;
    }
  } catch {
    /* ignore */
  }
  return null;
}

/** Resolve and browser-preload photos for the current review question. */
export async function prefetchReviewImages(
  targets: ReviewImageTarget[],
): Promise<Record<string, string>> {
  const updates: Record<string, string> = {};
  const pending: Promise<void>[] = [];

  for (const target of targets) {
    const word = target.word.trim().toLowerCase();
    if (!word) continue;

    const known = peekCachedWordImageUrl(word, target.imageUrl);
    if (known) {
      updates[word] = known;
      preloadImageUrl(known);
      continue;
    }

    pending.push(
      fetchWordImageFast(word).then((url) => {
        if (url) updates[word] = url;
      }),
    );
  }

  if (pending.length > 0) {
    await Promise.all(pending);
  }

  return updates;
}

export function preloadReviewImageBatch(
  targets: ReviewImageTarget[],
): void {
  for (const target of targets) {
    const known = peekCachedWordImageUrl(target.word, target.imageUrl);
    if (known) preloadImageUrl(known);
  }
}
