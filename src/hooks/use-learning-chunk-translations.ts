"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LEARNING_CHUNK_OVERRIDES,
  MAX_LEARNING_COLLOCATIONS,
  type LearningChunkEntry,
  type LearningChunkPhrase,
} from "@/data/demo-learning-chunks";
import {
  prefetchLearningChunkContent,
  resolveHydratedCollocations,
} from "@/lib/learning-chunk-prefetch";
import {
  getCachedCollocationTranslations,
} from "@/lib/learning-chunk-vi-cache";
import {
  getCachedSupplementCollocations,
  setCachedSupplementCollocations,
} from "@/lib/learning-chunk-supplement-cache";
import type { WordRegister } from "@/lib/word-meanings";

type UseLearningChunkTranslationsArgs = {
  word: string;
  examples?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  register?: WordRegister | null;
  englishDefinition?: string | null;
  entry: LearningChunkEntry | null;
};

function mergeCollocationVi(
  base: LearningChunkPhrase[],
  translated: LearningChunkPhrase[],
): LearningChunkPhrase[] {
  const byEn = new Map(
    translated.map((item) => [item.en.trim().toLowerCase(), item.vi]),
  );
  return base.map((item) => {
    const vi = item.vi.trim() || byEn.get(item.en.trim().toLowerCase()) || "";
    return vi ? { ...item, vi } : item;
  });
}

function entrySeedKey(word: string, entry: LearningChunkEntry | null): string {
  if (!entry) return `${word.trim().toLowerCase()}::empty`;
  const col = entry.collocations.map((item) => item.en.trim().toLowerCase()).join("|");
  const chunks = entry.chunks.map((item) => item.en.trim().toLowerCase()).join("|");
  return `${word.trim().toLowerCase()}::${col}::${chunks}`;
}

export function useLearningChunkTranslations({
  word,
  examples,
  wordType,
  meaning,
  register,
  englishDefinition,
  entry,
}: UseLearningChunkTranslationsArgs): LearningChunkEntry | null {
  const seedKey = useMemo(() => entrySeedKey(word, entry), [word, entry]);

  const isOverride = useMemo(() => {
    const key = word.trim().toLowerCase();
    return Boolean(key && LEARNING_CHUNK_OVERRIDES[key]);
  }, [word]);

  const cachedCollocations = useMemo(
    () => resolveHydratedCollocations(word, entry, isOverride),
    [word, entry, isOverride, seedKey],
  );

  const [collocations, setCollocations] =
    useState<LearningChunkPhrase[]>(cachedCollocations);
  const hydratedKeyRef = useRef<string | null>(null);
  const supplementedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setCollocations(resolveHydratedCollocations(word, entry, isOverride));
    hydratedKeyRef.current = null;
    supplementedKeyRef.current = null;
  }, [seedKey, word, entry, isOverride]);

  useEffect(() => {
    if (!entry || isOverride) return;
    if (entry.collocations.length > 0) return;
    if (!entry.chunks.length) return;
    if (supplementedKeyRef.current === seedKey) return;

    const usefulPhrase = entry.chunks[0];
    const cached = getCachedSupplementCollocations(word, []);
    if (cached?.length) {
      setCollocations(cached);
      supplementedKeyRef.current = seedKey;
      hydratedKeyRef.current = seedKey;
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/learning-chunks/supplement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word,
            wordType,
            meaning,
            register,
            englishDefinition,
            existing: [],
            usefulPhrase: usefulPhrase
              ? { en: usefulPhrase.en, vi: usefulPhrase.vi }
              : null,
            count: MAX_LEARNING_COLLOCATIONS,
          }),
        });

        if (!response.ok || cancelled) return;

        const data = (await response.json()) as {
          collocations?: LearningChunkPhrase[];
        };
        const supplemented = data.collocations?.filter(
          (item) => item.en?.trim() && item.vi?.trim(),
        );
        if (!supplemented?.length || cancelled) return;

        setCachedSupplementCollocations(word, [], supplemented);
        setCollocations(supplemented);
        supplementedKeyRef.current = seedKey;
        hydratedKeyRef.current = seedKey;
      } catch {
        // keep chunk-only card when supplement fails
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    word,
    wordType,
    meaning,
    register,
    englishDefinition,
    entry,
    seedKey,
    isOverride,
  ]);

  useEffect(() => {
    if (!entry || isOverride) return;
    if (hydratedKeyRef.current === seedKey) return;

    const baseCollocations = resolveHydratedCollocations(word, entry, false);
    const pending = entry.collocations.filter((item) => !item.vi.trim());
    if (!pending.length) {
      setCollocations(baseCollocations);
      hydratedKeyRef.current = seedKey;
      return;
    }

    const cachedTranslations = getCachedCollocationTranslations(word, pending);
    if (cachedTranslations?.length) {
      setCollocations(mergeCollocationVi(entry.collocations, cachedTranslations));
      hydratedKeyRef.current = seedKey;
      return;
    }

    let cancelled = false;

    void prefetchLearningChunkContent({
      word,
      word_type: wordType,
      vietnamese_meaning: meaning,
      english_definition: englishDefinition,
      examples,
      register,
      collocations: null,
    }).then(() => {
      if (cancelled) return;
      const warmed = getCachedCollocationTranslations(word, pending);
      if (!warmed?.length) return;
      setCollocations(mergeCollocationVi(entry.collocations, warmed));
      hydratedKeyRef.current = seedKey;
    });

    return () => {
      cancelled = true;
    };
  }, [
    word,
    examples,
    wordType,
    meaning,
    register,
    englishDefinition,
    entry,
    seedKey,
    isOverride,
  ]);

  if (!entry) return null;

  return {
    collocations,
    chunks: entry.chunks,
  };
}
