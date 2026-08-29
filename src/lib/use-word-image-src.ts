"use client";

import { useEffect, useState } from "react";
import {
  getDefaultLearningImageDataUrl,
  hasAcceptableWordImage,
  isDisplayableHttpImageUrl,
  isRealCardImageUrl,
  isUsableCardImageUrl,
  resolveWordImageUrl,
  shouldRefreshImageUrl,
} from "@/lib/unsplash";
import { resolveCastPreferredImagePath } from "@/lib/cast-word-images";
import { peekCachedWordImageUrl } from "@/lib/word-image-cache";
import { resolveWordImageForCard } from "@/lib/image-preload";

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
  const castPath = resolveCastPreferredImagePath(word);
  if (castPath) return castPath;

  const cached = peekCachedWordImageUrl(word, imageUrl);
  if (cached) return cached;
  const trimmed = imageUrl?.trim();
  if (
    trimmed &&
    isRealCardImageUrl(trimmed, word) &&
    !shouldRefreshImageUrl(trimmed, word, wordType)
  ) {
    return trimmed;
  }
  if (trimmed && isDisplayableHttpImageUrl(trimmed, word, wordType)) {
    return trimmed;
  }
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
  options?: WordImageSrcOptions & { meaning?: string | null },
): {
  src: string;
  ready: boolean;
  onError: () => void;
} {
  const quizSafe = options?.quizSafe ?? false;
  const meaning = options?.meaning?.trim() || null;
  const fallback = getDefaultLearningImageDataUrl(word, wordType);

  const resolveDisplay = (url?: string | null) => {
    const cached = peekCachedWordImageUrl(word, url);
    if (cached) return cached;
    if (quizSafe) return pickQuizSrc(word, url, searchKeyword, wordType);
    return resolveWordImageUrl(word, url, searchKeyword, wordType);
  };

  const needsFreshImage = (url?: string | null) =>
    shouldRefreshImageUrl(url, word, wordType) ||
    !isUsableCardImageUrl(url, word, wordType);

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
      if (!needsFreshImage(imageUrl)) return;
    }
    if (quizSafe && !needsFreshImage(imageUrl) && next) return;

    let cancelled = false;
    void (async () => {
      const fetched = await fetchFreshImageUrl(
        word,
        searchKeyword,
        wordType,
        imageUrl,
        meaning,
      );
      if (cancelled) return;
      if (quizSafe) {
        if (fetched) {
          setSrc(fetched);
          setReady(true);
          return;
        }
        const legacy = pickQuizSrc(word, imageUrl, searchKeyword, wordType);
        if (legacy) {
          setSrc(legacy);
          setReady(true);
        }
        return;
      }
      if (fetched && hasAcceptableWordImage(fetched, word) && fetched !== next) {
        setSrc(fetched);
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [word, imageUrl, searchKeyword, wordType, meaning, quizSafe]);

  return {
    src: quizSafe ? src : src || fallback,
    ready,
    onError: () => {
      if (quizSafe) {
        void (async () => {
          const fetched = await fetchFreshImageUrl(
            word,
            searchKeyword,
            wordType,
            imageUrl,
            meaning,
          );
          if (fetched) {
            setSrc(fetched);
            setReady(true);
          }
        })();
        return;
      }
      if (src === fallback) return;
      void (async () => {
        const fetched = await fetchFreshImageUrl(
          word,
          searchKeyword,
          wordType,
          imageUrl,
          meaning,
        );
        setSrc((prev) => {
          if (
            fetched &&
            hasAcceptableWordImage(fetched, word) &&
            fetched !== prev
          ) {
            return fetched;
          }
          return fallback;
        });
        setReady(true);
      })();
    },
  };
}

async function fetchFreshImageUrl(
  word: string,
  searchKeyword?: string | null,
  wordType?: string | null,
  imageUrl?: string | null,
  meaning?: string | null,
): Promise<string | null> {
  return resolveWordImageForCard({
    word,
    imageUrl,
    searchKeyword,
    wordType,
    meaning,
  });
}
