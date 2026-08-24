import {
  prefetchWordImages,
  preloadWordImagesFromCache,
  type WordImagePrefetchTarget,
} from "@/lib/image-preload";
import { peekCachedWordImageUrl } from "@/lib/word-image-cache";

export type ReviewImageTarget = WordImagePrefetchTarget;

/** Resolve and browser-preload photos for the current review question. */
export async function prefetchReviewImages(
  targets: ReviewImageTarget[],
): Promise<Record<string, string>> {
  const updates: Record<string, string> = {};
  preloadWordImagesFromCache(targets);
  await prefetchWordImages(targets, 4);
  for (const target of targets) {
    const word = target.word.trim().toLowerCase();
    const known = peekCachedWordImageUrl(word, target.imageUrl);
    if (known) updates[word] = known;
  }
  return updates;
}

export function preloadReviewImageBatch(targets: ReviewImageTarget[]): void {
  preloadWordImagesFromCache(targets);
}
