"use client";

import { getFamilyDisplayWords } from "@/lib/word-family";
import { normalizeSimilarWords } from "@/lib/word-synonyms";
import { useEffect, useMemo, useState } from "react";

const clientSimilarCache = new Map<string, string[]>();

function cacheKey(
  word: string,
  pos?: string | null,
  meaning?: string | null,
): string {
  return `${word.trim().toLowerCase()}:${pos?.trim().toLowerCase() ?? ""}:${meaning?.trim() ?? ""}`;
}

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
    return clientSimilarCache.get(cacheKey(headword, wordType, meaning)) ?? [];
  });

  useEffect(() => {
    if (!headword) {
      setSimilar([]);
      return;
    }

    if (presetNormalized.length) {
      setSimilar(presetNormalized);
      clientSimilarCache.set(
        cacheKey(headword, wordType, meaning),
        presetNormalized,
      );
      return;
    }

    const key = cacheKey(headword, wordType, meaning);
    const cached = clientSimilarCache.get(key);
    if (cached) {
      setSimilar(cached);
      return;
    }

    let cancelled = false;
    const params = new URLSearchParams({ word: headword });
    if (wordType?.trim()) params.set("pos", wordType.trim());
    if (meaning?.trim()) params.set("meaning", meaning.trim());
    if (englishDefinition?.trim()) {
      params.set("definition", englishDefinition.trim());
    }

    void fetch(`/api/word/similar?${params.toString()}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) return { similar_words: [] as string[] };
        return (await response.json()) as { similar_words?: string[] };
      })
      .then((payload) => {
        if (cancelled) return;
        const resolved = normalizeSimilarWords(
          payload.similar_words,
          headword,
          getFamilyDisplayWords(headword),
        );
        clientSimilarCache.set(key, resolved);
        setSimilar(resolved);
      })
      .catch(() => {
        if (cancelled) return;
        clientSimilarCache.set(key, []);
        setSimilar([]);
      });

    return () => {
      cancelled = true;
    };
  }, [
    headword,
    wordType,
    meaning,
    englishDefinition,
    presetNormalized,
  ]);

  return similar;
}
