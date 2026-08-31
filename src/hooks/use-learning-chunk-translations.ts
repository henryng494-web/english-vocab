"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  LEARNING_CHUNK_OVERRIDES,
  MAX_LEARNING_COLLOCATIONS,
  type LearningChunkEntry,
  type LearningChunkPhrase,
} from "@/data/demo-learning-chunks";
import {
  getCachedCollocationTranslations,
  setCachedCollocationTranslations,
} from "@/lib/learning-chunk-vi-cache";
import {
  getCachedSupplementCollocations,
  setCachedSupplementCollocations,
} from "@/lib/learning-chunk-supplement-cache";

type UseLearningChunkTranslationsArgs = {
  word: string;
  wordType?: string | null;
  meaning?: string | null;
  register?: string | null;
  englishDefinition?: string | null;
  entry: LearningChunkEntry | null;
  /** Full example sentences for context when translating collocations. */
  contextExamples?: LearningChunkPhrase[];
};

function findContextForCollocation(
  collocationEn: string,
  examples: LearningChunkPhrase[],
): LearningChunkPhrase | null {
  const key = collocationEn.trim().toLowerCase();
  for (const ex of examples) {
    if (ex.en.trim().toLowerCase().includes(key)) return ex;
  }
  return examples[0] ?? null;
}

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
  wordType,
  meaning,
  register,
  englishDefinition,
  entry,
  contextExamples = [],
}: UseLearningChunkTranslationsArgs): LearningChunkEntry | null {
  const seedKey = useMemo(() => entrySeedKey(word, entry), [word, entry]);
  const [collocations, setCollocations] = useState<LearningChunkPhrase[]>(
    entry?.collocations ?? [],
  );
  const hydratedKeyRef = useRef<string | null>(null);
  const supplementedKeyRef = useRef<string | null>(null);

  const isOverride = useMemo(() => {
    const key = word.trim().toLowerCase();
    return Boolean(key && LEARNING_CHUNK_OVERRIDES[key]);
  }, [word]);

  useEffect(() => {
    setCollocations(entry?.collocations ?? []);
    hydratedKeyRef.current = null;
    supplementedKeyRef.current = null;
  }, [seedKey, entry]);

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

    const pending = entry.collocations.filter((item) => !item.vi.trim());
    if (!pending.length) {
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

    (async () => {
      try {
        const contextPool = [...contextExamples, ...entry.chunks];
        const response = await fetch("/api/learning-chunks/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word,
            wordType,
            meaning,
            register,
            englishDefinition,
            phrases: pending.map((item) => {
              const context = findContextForCollocation(item.en, contextPool);
              return {
                en: item.en,
                sense: item.sense,
                contextEn: context?.en,
                contextVi: context?.vi,
              };
            }),
          }),
        });

        if (!response.ok || cancelled) return;

        const data = (await response.json()) as {
          translations?: LearningChunkPhrase[];
        };
        const translated = data.translations?.filter((item) => item.vi?.trim());
        if (!translated?.length || cancelled) return;

        setCachedCollocationTranslations(word, pending, translated);
        setCollocations(mergeCollocationVi(entry.collocations, translated));
        hydratedKeyRef.current = seedKey;
      } catch {
        // keep EN-only collocations on failure
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
    contextExamples,
  ]);

  if (!entry) return null;

  return {
    collocations,
    chunks: entry.chunks,
  };
}
