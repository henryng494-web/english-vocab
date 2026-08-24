"use client";

import { useEffect, useState } from "react";
import {
  getDefaultLearningImageDataUrl,
  isRealCardImageUrl,
  isUsableCardImageUrl,
  resolveWordImageUrl,
} from "@/lib/unsplash";
import {
  peekCachedWordImageUrl,
  setCachedWordImageUrl,
} from "@/lib/word-image-cache";
import { preloadImageUrlDeduped } from "@/lib/image-preload";

type WordImageSrcOptions = {
  /** Hide SVG placeholders until a real photo loads (review quizzes). */
  quizSafe?: boolean;
};

function pickQuizSrc(
  word: string,
  imageUrl?: string | null,
  searchKeyword?: string | null,
  wordType?: string | null,
): string {
  const cached = peekCachedWordImageUrl(word, imageUrl);
  if (cached) return cached;
  const trimmed = imageUrl?.trim();
  if (trimmed && isRealCardImageUrl(trimmed, word)) return trimmed;
  const resolved = resolveWordImageUrl(word, imageUrl, searchKeyword, wordType);
  if (isRealCardImageUrl(resolved, word)) return resolved;
  return "";
}

/**
 * Prefer a stored HTTP photo. If the stored URL is a placeholder SVG,
 * fetch a fresh photo from the lightweight word-image API.
 */
export function useWordImageSrc(
  word: string,
  imageUrl?: string | null,
  searchKeyword?: string | null,
  wordType?: string | null,
  options?: WordImageSrcOptions,
): {
  src: string;
  ready: boolean;
  onError: () => void;
} {
  const quizSafe = options?.quizSafe ?? false;
  const fallback = getDefaultLearningImageDataUrl(word, wordType);

  const resolveDisplay = (url?: string | null) => {
    const cached = peekCachedWordImageUrl(word, url);
    if (cached) return cached;
    if (quizSafe) return pickQuizSrc(word, url, searchKeyword, wordType);
    return resolveWordImageUrl(word, url, searchKeyword, wordType);
  };

  const initial = resolveDisplay(imageUrl);
  const initialReady = quizSafe ? Boolean(initial) : true;

  const [src, setSrc] = useState(initial);
  const [ready, setReady] = useState(initialReady);

  useEffect(() => {
    const next = resolveDisplay(imageUrl);
    if (quizSafe) {
      if (next) {
        setSrc(next);
        setReady(true);
        return;
      }
      setSrc("");
      setReady(false);
    } else {
      setSrc(next);
      setReady(true);
    }

    if (!quizSafe) {
      if (isUsableCardImageUrl(imageUrl, word)) return;
      if (isRealCardImageUrl(next, word)) return;
    }
    if (quizSafe && next) return;

    let cancelled = false;
    void (async () => {
      const fetched = await fetchFreshImageUrl(word, searchKeyword, wordType);
      if (cancelled) return;
      if (quizSafe) {
        if (!fetched) return;
        setSrc(fetched);
        setReady(true);
        return;
      }
      if (isUsableCardImageUrl(fetched, word) && fetched !== next) {
        setSrc(fetched!);
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [word, imageUrl, searchKeyword, wordType, quizSafe]);

  return {
    src,
    ready,
    onError: () => {
      if (quizSafe) {
        void (async () => {
          const fetched = await fetchFreshImageUrl(word, searchKeyword, wordType);
          if (fetched) {
            setSrc(fetched);
            setReady(true);
          }
        })();
        return;
      }
      if (src === fallback) return;
      void (async () => {
        const fetched = await fetchFreshImageUrl(word, searchKeyword, wordType);
        if (isUsableCardImageUrl(fetched, word) && fetched !== src) {
          setSrc(fetched!);
          setReady(true);
          return;
        }
        setSrc(fallback);
        setReady(true);
      })();
    },
  };
}

async function fetchFreshImageUrl(
  word: string,
  searchKeyword?: string | null,
  wordType?: string | null,
): Promise<string | null> {
  const cached = peekCachedWordImageUrl(word);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({ word });
    if (searchKeyword?.trim()) {
      params.set("keyword", searchKeyword.trim());
    }
    if (wordType?.trim()) {
      params.set("pos", wordType.trim());
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
}
