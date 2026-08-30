"use client";

import { useEffect, useMemo, useState } from "react";
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

function dedupeCollocations(items: LearningChunkPhrase[]): LearningChunkPhrase[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.en.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
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

  const needsSupplement = useMemo(() => {
    if (!entry || isOverride) return false;
    return entry.collocations.length < MAX_LEARNING_COLLOCATIONS;
  }, [entry, isOverride]);

  const needsTranslation = useMemo(() => {
    if (!collocations.length || isOverride) return false;
    return collocations.some((item) => !item.vi.trim());
  }, [collocations, isOverride]);

  useEffect(() => {
    setCollocations(entry?.collocations ?? []);
  }, [entry]);

  useEffect(() => {
    if (!entry || !needsSupplement) return;

    const existing = entry.collocations.map((item) => item.en);
    const needed = MAX_LEARNING_COLLOCATIONS - existing.length;
    if (needed < 1) return;

    const cached = getCachedSupplementCollocations(word, existing);
    if (cached?.length) {
      setCollocations(
        dedupeCollocations([...entry.collocations, ...cached]).slice(
          0,
          MAX_LEARNING_COLLOCATIONS,
        ),
      );
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const usefulPhrase = entry.chunks[0] ?? contextExamples[0] ?? null;
        const response = await fetch("/api/learning-chunks/supplement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word,
            wordType,
            meaning,
            register,
            englishDefinition,
            existing,
            usefulPhrase,
            count: needed,
          }),
        });

        if (!response.ok || cancelled) return;

        const data = (await response.json()) as {
          collocations?: LearningChunkPhrase[];
        };
        const generated = data.collocations?.filter(
          (item) => item.en?.trim() && item.vi?.trim(),
        );
        if (!generated?.length || cancelled) return;

        setCachedSupplementCollocations(word, existing, generated);
        setCollocations(
          dedupeCollocations([...entry.collocations, ...generated]).slice(
            0,
            MAX_LEARNING_COLLOCATIONS,
          ),
        );
      } catch {
        // keep extracted collocations only
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
    needsSupplement,
    contextExamples,
  ]);

  useEffect(() => {
    if (!collocations.length || !needsTranslation) return;

    const pending = collocations.filter((item) => !item.vi.trim());
    if (!pending.length) return;

    const cached = getCachedCollocationTranslations(word, pending);
    if (cached) {
      setCollocations((current) => mergeCollocationVi(current, cached));
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const contextPool = [...contextExamples, ...(entry?.chunks ?? [])];
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
        setCollocations((current) => mergeCollocationVi(current, translated));
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
    collocations,
    needsTranslation,
    contextExamples,
    entry?.chunks,
  ]);

  if (!entry) return null;

  return {
    collocations,
    chunks: entry.chunks,
  };
}
