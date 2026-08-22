"use client";

import { useEffect, useState } from "react";
import {
  getDefaultLearningImageDataUrl,
  isUsableCardImageUrl,
  resolveWordImageUrl,
} from "@/lib/unsplash";

/**
 * Prefer a stored HTTP photo. If the stored URL is a placeholder SVG,
 * fetch a fresh photo from the discover API.
 */
export function useWordImageSrc(
  word: string,
  imageUrl?: string | null,
  searchKeyword?: string | null,
  wordType?: string | null,
): {
  src: string;
  onError: () => void;
} {
  const fallback = getDefaultLearningImageDataUrl(word, wordType);
  const [src, setSrc] = useState(() =>
    resolveWordImageUrl(word, imageUrl, searchKeyword, wordType),
  );

  useEffect(() => {
    const resolved = resolveWordImageUrl(
      word,
      imageUrl,
      searchKeyword,
      wordType,
    );
    setSrc(resolved);
    if (isUsableCardImageUrl(imageUrl, word)) return;

    let cancelled = false;
    void (async () => {
      const next = await fetchFreshImageUrl(word);
      if (cancelled) return;
      if (isUsableCardImageUrl(next, word) && next !== resolved) {
        setSrc(next!);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [word, imageUrl, searchKeyword, wordType]);

  return {
    src,
    onError: () => {
      if (src === fallback) return;
      void (async () => {
        const next = await fetchFreshImageUrl(word);
        if (isUsableCardImageUrl(next, word) && next !== src) {
          setSrc(next!);
          return;
        }
        setSrc(fallback);
      })();
    },
  };
}

async function fetchFreshImageUrl(word: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      word,
      skipGemini: "true",
    });
    const res = await fetch(`/api/discover/word?${params}`);
    const data = (await res.json()) as {
      word?: { image_url?: string | null };
    };
    return data.word?.image_url ?? null;
  } catch {
    return null;
  }
}
