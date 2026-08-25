import {
  parseWordImageApiPayload,
  parseWordImageBatchEntry,
  type WordImageResult,
} from "@/lib/word-image-result";
import { getDefaultLearningImageDataUrl } from "@/lib/unsplash";

export type WordImagePrefetchTarget = {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
  meaning?: string | null;
};

function buildWordImageSearchParams(
  target: Pick<
    WordImagePrefetchTarget,
    "word" | "searchKeyword" | "wordType" | "meaning"
  >,
): URLSearchParams {
  const params = new URLSearchParams({ word: target.word.trim() });
  if (target.searchKeyword?.trim()) {
    params.set("keyword", target.searchKeyword.trim());
  }
  if (target.wordType?.trim()) {
    params.set("pos", target.wordType.trim());
  }
  if (target.meaning?.trim()) {
    params.set("meaning", target.meaning.trim());
  }
  return params;
}

function fallbackForTarget(
  target: Pick<WordImagePrefetchTarget, "word" | "wordType">,
): string {
  return getDefaultLearningImageDataUrl(target.word, target.wordType);
}

/** Fetch one word image from `/api/word-image` with unified parsing + placeholder fallback. */
export async function fetchWordImageFromApi(
  target: WordImagePrefetchTarget,
): Promise<WordImageResult> {
  const word = target.word.trim().toLowerCase();
  const placeholder = fallbackForTarget(target);
  if (!word) {
    return parseWordImageApiPayload(null, placeholder);
  }

  try {
    const params = buildWordImageSearchParams(target);
    const res = await fetch(`/api/word-image?${params}`);
    const data = await res.json().catch(() => null);
    if (!res.ok) {
      return parseWordImageApiPayload(data, placeholder);
    }
    return parseWordImageApiPayload(data, placeholder);
  } catch (error) {
    console.warn(
      `[word-image-client] fetch failed for "${word}":`,
      error instanceof Error ? error.message : error,
    );
    return parseWordImageApiPayload(null, placeholder);
  }
}

export type WordImageBatchItem = {
  word: string;
  keyword?: string;
  pos?: string;
  meaning?: string;
};

/** Fetch several words via `/api/word-image/batch`. */
export async function fetchWordImagesBatchFromApi(
  items: WordImageBatchItem[],
): Promise<Record<string, WordImageResult>> {
  const results: Record<string, WordImageResult> = {};
  if (items.length === 0) return results;

  try {
    const res = await fetch("/api/word-image/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    const data = (await res.json().catch(() => null)) as {
      images?: Record<string, unknown>;
    } | null;
    if (!res.ok) throw new Error(`batch ${res.status}`);

    for (const item of items) {
      const word = item.word.trim().toLowerCase();
      if (!word) continue;
      const placeholder = getDefaultLearningImageDataUrl(word, item.pos);
      const entry = data?.images?.[word];
      results[word] = parseWordImageBatchEntry(entry, placeholder);
    }
    return results;
  } catch (error) {
    console.warn(
      "[word-image-client] batch fetch failed:",
      error instanceof Error ? error.message : error,
    );
    await Promise.all(
      items.map(async (item) => {
        const word = item.word.trim().toLowerCase();
        if (!word) return;
        results[word] = await fetchWordImageFromApi({
          word: item.word,
          searchKeyword: item.keyword,
          wordType: item.pos,
          meaning: item.meaning,
        });
      }),
    );
    return results;
  }
}
