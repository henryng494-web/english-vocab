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

function dedupeCollocations(items: LearningChunkPhrase[]): LearningChunkPhrase[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = item.en.trim().toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
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

  const isOverride = useMemo(() => {
    const key = word.trim().toLowerCase();
    return Boolean(key && LEARNING_CHUNK_OVERRIDES[key]);
  }, [word]);

  useEffect(() => {
    setCollocations(entry?.collocations ?? []);
    hydratedKeyRef.current = null;
  }, [seedKey, entry]);

  useEffect(() => {
    if (!entry || isOverride) return;
    if (hydratedKeyRef.current === seedKey) return;

    let cancelled = false;

    (async () => {
      let current = dedupeCollocations([...entry.collocations]).slice(
        0,
        MAX_LEARNING_COLLOCATIONS,
      );

      if (current.length < MAX_LEARNING_COLLOCATIONS) {
        const existing = current.map((item) => item.en);
        const needed = MAX_LEARNING_COLLOCATIONS - existing.length;
        const cached = getCachedSupplementCollocations(word, existing);
        let generated = cached ?? null;

        if (!generated?.length) {
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
            if (response.ok) {
              const data = (await response.json()) as {
                collocations?: LearningChunkPhrase[];
              };
              generated =
                data.collocations?.filter(
                  (item) => item.en?.trim() && item.vi?.trim(),
                ) ?? null;
              if (generated?.length) {
                setCachedSupplementCollocations(word, existing, generated);
              }
            }
          } catch {
            // keep extracted collocations only
          }
        }

        if (generated?.length) {
          current = dedupeCollocations([...current, ...generated]).slice(
            0,
            MAX_LEARNING_COLLOCATIONS,
          );
        }
      }

      if (cancelled) return;
      setCollocations(current);

      const pending = current.filter((item) => !item.vi.trim());
      if (!pending.length) {
        hydratedKeyRef.current = seedKey;
        return;
      }

      const cachedTranslations = getCachedCollocationTranslations(word, pending);
      if (cachedTranslations?.length) {
        if (cancelled) return;
        setCollocations((prev) => mergeCollocationVi(prev, cachedTranslations));
        hydratedKeyRef.current = seedKey;
        return;
      }

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
        setCollocations((prev) => mergeCollocationVi(prev, translated));
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
