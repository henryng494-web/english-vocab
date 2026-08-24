"use client";

import { useEffect, useState } from "react";
import {
  getDefaultLearningImageDataUrl,
  isRealCardImageUrl,
  isUsableCardImageUrl,
  resolveWordImageUrl,
} from "@/lib/unsplash";

type WordImageSrcOptions = {
  /** Hide SVG placeholders until a real photo loads (review quizzes). */
  quizSafe?: boolean;
};

/**
 * Prefer a stored HTTP photo. If the stored URL is a placeholder SVG,
 * fetch a fresh photo from the discover API.
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

  const resolve = (url?: string | null) =>
    resolveWordImageUrl(word, url, searchKeyword, wordType);

  const initial = resolve(imageUrl);
  const initialReady = !quizSafe || isRealCardImageUrl(initial, word);

  const [src, setSrc] = useState(() =>
    quizSafe && !initialReady ? "" : initial,
  );
  const [ready, setReady] = useState(initialReady);

  useEffect(() => {
    const resolved = resolve(imageUrl);
    const real = isRealCardImageUrl(resolved, word);

    if (quizSafe) {
      if (real) {
        setSrc(resolved);
        setReady(true);
        return;
      }
      setSrc("");
      setReady(false);
    } else {
      setSrc(resolved);
      setReady(true);
    }

    if (!quizSafe && isUsableCardImageUrl(imageUrl, word)) return;
    if (quizSafe && real) return;

    let cancelled = false;
    void (async () => {
      const next = await fetchFreshImageUrl(word);
      if (cancelled) return;
      if (!isRealCardImageUrl(next, word)) return;
      setSrc(next!);
      setReady(true);
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
          const next = await fetchFreshImageUrl(word);
          if (isRealCardImageUrl(next, word)) {
            setSrc(next!);
            setReady(true);
          }
        })();
        return;
      }
      if (src === fallback) return;
      void (async () => {
        const next = await fetchFreshImageUrl(word);
        if (isUsableCardImageUrl(next, word) && next !== src) {
          setSrc(next!);
          setReady(true);
          return;
        }
        setSrc(fallback);
        setReady(true);
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
