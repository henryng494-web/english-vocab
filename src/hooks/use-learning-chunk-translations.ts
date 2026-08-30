"use client";

import { useEffect, useMemo, useState } from "react";
import type { LearningChunkEntry, LearningChunkPhrase } from "@/data/demo-learning-chunks";
import {
  getCachedCollocationTranslations,
  setCachedCollocationTranslations,
} from "@/lib/learning-chunk-vi-cache";
import { LEARNING_CHUNK_OVERRIDES } from "@/data/demo-learning-chunks";

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

export function useLearningChunkTranslations({
  word,
  wordType,
  meaning,
  register,
  englishDefinition,
  entry,
  contextExamples = [],
}: UseLearningChunkTranslationsArgs): LearningChunkEntry | null {
  const [collocations, setCollocations] = useState<LearningChunkPhrase[]>(
    entry?.collocations ?? [],
  );

  const isOverride = useMemo(() => {
    const key = word.trim().toLowerCase();
    return Boolean(key && LEARNING_CHUNK_OVERRIDES[key]);
  }, [word]);

  const needsTranslation = useMemo(() => {
    if (!entry?.collocations.length || isOverride) return false;
    return entry.collocations.some((item) => !item.vi.trim());
  }, [entry, isOverride]);

  useEffect(() => {
    setCollocations(entry?.collocations ?? []);
  }, [entry]);

  useEffect(() => {
    if (!entry || !needsTranslation) return;

    const pending = entry.collocations.filter((item) => !item.vi.trim());
    if (!pending.length) return;

    const cached = getCachedCollocationTranslations(word, pending);
    if (cached) {
      setCollocations(mergeCollocationVi(entry.collocations, cached));
      return;
    }

    let cancelled = false;

    (async () => {
      try {
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
              const context = findContextForCollocation(item.en, [
                ...contextExamples,
                ...entry.chunks,
              ]);
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
      } catch {
        // keep EN-only collocations on failure
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [word, wordType, meaning, register, englishDefinition, entry, needsTranslation, contextExamples]);

  if (!entry) return null;

  return {
    collocations,
    chunks: entry.chunks,
  };
}
