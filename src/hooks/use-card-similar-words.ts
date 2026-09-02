"use client";

import { getFamilyDisplayWords } from "@/lib/word-family";
import {
  getCachedCardSimilarWords,
  prefetchCardSimilarWords,
} from "@/lib/card-similar-prefetch";
import { normalizeSimilarWords } from "@/lib/word-synonyms";
import { useEffect, useMemo, useState } from "react";

type UseCardSimilarWordsOptions = {
  word: string;
  preset?: string[] | null;
  wordType?: string | null;
  meaning?: string | null;
  englishDefinition?: string | null;
};

/** Resolve similar words for any card — uses preset when present, else cached API lookup. */
export function useCardSimilarWords({
  word,
  preset,
  wordType,
  meaning,
  englishDefinition,
}: UseCardSimilarWordsOptions): string[] {
  const headword = word.trim().toLowerCase();
  const input = useMemo(
    () => ({
      word: headword,
      preset,
      wordType,
      meaning,
      englishDefinition,
    }),
    [headword, preset, wordType, meaning, englishDefinition],
  );

  const presetNormalized = useMemo(
    () =>
      headword
        ? normalizeSimilarWords(
            preset,
            headword,
            getFamilyDisplayWords(headword),
          )
        : [],
    [headword, preset],
  );

  const [similar, setSimilar] = useState<string[]>(() => {
    if (presetNormalized.length) return presetNormalized;
    return getCachedCardSimilarWords(input) ?? [];
  });

  useEffect(() => {
    if (!headword) {
      setSimilar([]);
      return;
    }

    if (presetNormalized.length) {
      setSimilar(presetNormalized);
      return;
    }

    const cached = getCachedCardSimilarWords(input);
    if (cached) {
      setSimilar(cached);
      return;
    }

    let cancelled = false;
    void prefetchCardSimilarWords(input).then((resolved) => {
      if (!cancelled) setSimilar(resolved);
    });

    return () => {
      cancelled = true;
    };
  }, [headword, input, presetNormalized]);

  return similar;
}
