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
  setCachedCollocationTranslations,
} from "@/lib/learning-chunk-vi-cache";
import {
  getCachedSupplementCollocations,
  setCachedSupplementCollocations,
} from "@/lib/learning-chunk-supplement-cache";
import { useAppSettings } from "@/context/AppSettingsContext";
import {
  phraseNeedsLocaleTranslation,
  stripWrongLocalePhraseTranslations,
} from "@/lib/phrase-locale";
import {
  applyStoredPhraseTranslations,
  parsePhraseTranslationsJson,
} from "@/lib/phrase-translations";
import {
  DEFAULT_LEARNER_LOCALE,
  type LearnerLocale,
} from "@/lib/learner-locale";
import type { WordRegister } from "@/lib/word-meanings";
import type { PhraseTranslationsJson } from "@/types/word-content";

type UseLearningChunkTranslationsArgs = {
  word: string;
  examples?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  register?: WordRegister | null;
  englishDefinition?: string | null;
  phraseTranslations?: PhraseTranslationsJson | null;
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
    const vi = byEn.get(item.en.trim().toLowerCase())?.trim() || "";
    return vi ? { ...item, vi } : { ...item, vi: "" };
  });
}

function entrySeedKey(word: string, entry: LearningChunkEntry | null): string {
  if (!entry) return `${word.trim().toLowerCase()}::empty`;
  const col = entry.collocations.map((item) => item.en.trim().toLowerCase()).join("|");
  const chunks = entry.chunks.map((item) => item.en.trim().toLowerCase()).join("|");
  return `${word.trim().toLowerCase()}::${col}::${chunks}`;
}

async function fetchPhraseTranslations(
  word: string,
  phrases: LearningChunkPhrase[],
  options: {
    wordType?: string | null;
    meaning?: string | null;
    register?: WordRegister | null;
    englishDefinition?: string | null;
    learnerLocale: LearnerLocale;
  },
): Promise<LearningChunkPhrase[] | null> {
  if (!phrases.length) return null;
  const response = await fetch("/api/learning-chunks/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      word,
      wordType: options.wordType,
      meaning: options.meaning,
      register: options.register,
      englishDefinition: options.englishDefinition,
      learnerLocale: options.learnerLocale,
      phrases: phrases.map((item) => ({
        en: item.en,
        contextEn: item.en,
        contextVi: item.vi,
        sense: item.sense,
      })),
    }),
  });
  if (!response.ok) return null;
  const data = (await response.json()) as {
    translations?: LearningChunkPhrase[];
  };
  const translated = data.translations?.filter(
    (item) => item.en?.trim() && item.vi?.trim(),
  );
  return translated?.length ? translated : null;
}

export function useLearningChunkTranslations({
  word,
  examples,
  wordType,
  meaning,
  register,
  englishDefinition,
  phraseTranslations,
  entry,
}: UseLearningChunkTranslationsArgs): {
  entry: LearningChunkEntry | null;
  localeLoading: boolean;
} {
  const { learnerLocale } = useAppSettings();
  const storedPhrases = useMemo(
    () => parsePhraseTranslationsJson(phraseTranslations),
    [phraseTranslations],
  );

  const seededEntry = useMemo(() => {
    if (!entry) return null;
    return applyStoredPhraseTranslations(entry, storedPhrases, learnerLocale);
  }, [entry, storedPhrases, learnerLocale]);

  const seedKey = useMemo(() => entrySeedKey(word, seededEntry), [word, seededEntry]);

  const isOverride = useMemo(() => {
    const key = word.trim().toLowerCase();
    return Boolean(key && LEARNING_CHUNK_OVERRIDES[key]);
  }, [word]);

  const cachedCollocations = useMemo(
    () =>
      stripWrongLocalePhraseTranslations(
        resolveHydratedCollocations(word, seededEntry, isOverride),
        learnerLocale,
      ),
    [word, seededEntry, isOverride, learnerLocale, seedKey],
  );

  const [collocations, setCollocations] =
    useState<LearningChunkPhrase[]>(cachedCollocations);
  const [chunks, setChunks] = useState<LearningChunkPhrase[]>(
    stripWrongLocalePhraseTranslations(seededEntry?.chunks ?? [], learnerLocale),
  );
  const [localeLoading, setLocaleLoading] = useState(false);
  const hydratedKeyRef = useRef<string | null>(null);
  const supplementedKeyRef = useRef<string | null>(null);
  const chunkLocaleKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setCollocations(
      stripWrongLocalePhraseTranslations(
        resolveHydratedCollocations(word, seededEntry, isOverride),
        learnerLocale,
      ),
    );
    setChunks(
      stripWrongLocalePhraseTranslations(seededEntry?.chunks ?? [], learnerLocale),
    );
    hydratedKeyRef.current = null;
    supplementedKeyRef.current = null;
    chunkLocaleKeyRef.current = null;
  }, [seedKey, word, seededEntry, isOverride, learnerLocale]);

  useEffect(() => {
    if (!seededEntry || isOverride) return;
    if (seededEntry.collocations.length > 0) return;
    if (!seededEntry.chunks.length) return;
    if (supplementedKeyRef.current === seedKey) return;

    const usefulPhrase = seededEntry.chunks[0];
    const cached = getCachedSupplementCollocations(word, []);
    if (cached?.length) {
      setCollocations(
        stripWrongLocalePhraseTranslations(cached, learnerLocale),
      );
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
            learnerLocale,
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
        setCollocations(
          stripWrongLocalePhraseTranslations(supplemented, learnerLocale),
        );
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
    seededEntry,
    seedKey,
    isOverride,
    learnerLocale,
  ]);

  useEffect(() => {
    if (!seededEntry || isOverride) return;
    if (learnerLocale === DEFAULT_LEARNER_LOCALE) return;
    if (hydratedKeyRef.current === seedKey) return;

    const pending = seededEntry.collocations.filter((item) =>
      phraseNeedsLocaleTranslation(item, learnerLocale),
    );
    if (!pending.length) {
      setCollocations(
        stripWrongLocalePhraseTranslations(
          resolveHydratedCollocations(word, seededEntry, false),
          learnerLocale,
        ),
      );
      hydratedKeyRef.current = seedKey;
      return;
    }

    const cachedTranslations = getCachedCollocationTranslations(
      word,
      pending,
      learnerLocale,
    );
    if (cachedTranslations?.length) {
      setCollocations(
        stripWrongLocalePhraseTranslations(
          mergeCollocationVi(seededEntry.collocations, cachedTranslations),
          learnerLocale,
        ),
      );
      hydratedKeyRef.current = seedKey;
      return;
    }

    let cancelled = false;
    setLocaleLoading(true);

    void (async () => {
      try {
        const translated = await fetchPhraseTranslations(word, pending, {
          wordType,
          meaning,
          register,
          englishDefinition,
          learnerLocale,
        });
        if (cancelled) return;
        if (translated?.length) {
          setCachedCollocationTranslations(word, pending, translated, learnerLocale);
          setCollocations(
            stripWrongLocalePhraseTranslations(
              mergeCollocationVi(seededEntry.collocations, translated),
              learnerLocale,
            ),
          );
          hydratedKeyRef.current = seedKey;
          return;
        }
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
          const warmed = getCachedCollocationTranslations(
            word,
            pending,
            learnerLocale,
          );
          if (!warmed?.length) return;
          setCollocations(
            stripWrongLocalePhraseTranslations(
              mergeCollocationVi(seededEntry.collocations, warmed),
              learnerLocale,
            ),
          );
          hydratedKeyRef.current = seedKey;
        });
      } finally {
        if (!cancelled) setLocaleLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      setLocaleLoading(false);
    };
  }, [
    word,
    examples,
    wordType,
    meaning,
    register,
    englishDefinition,
    seededEntry,
    seedKey,
    isOverride,
    learnerLocale,
  ]);

  useEffect(() => {
    if (!seededEntry?.chunks.length || learnerLocale === DEFAULT_LEARNER_LOCALE) {
      setChunks(
        stripWrongLocalePhraseTranslations(seededEntry?.chunks ?? [], learnerLocale),
      );
      return;
    }

    const pending = seededEntry.chunks.filter((item) =>
      phraseNeedsLocaleTranslation(item, learnerLocale),
    );
    if (!pending.length) {
      setChunks(
        stripWrongLocalePhraseTranslations(seededEntry.chunks, learnerLocale),
      );
      return;
    }

    const localeKey = `${seedKey}::${learnerLocale}`;
    if (chunkLocaleKeyRef.current === localeKey) return;

    const cached = getCachedCollocationTranslations(
      word,
      pending,
      learnerLocale,
    );
    if (cached?.length) {
      setChunks(
        stripWrongLocalePhraseTranslations(
          mergeCollocationVi(seededEntry.chunks, cached),
          learnerLocale,
        ),
      );
      chunkLocaleKeyRef.current = localeKey;
      return;
    }

    let cancelled = false;
    setLocaleLoading(true);

    void (async () => {
      try {
        const translated = await fetchPhraseTranslations(word, pending, {
          wordType,
          meaning,
          register,
          englishDefinition,
          learnerLocale,
        });
        if (cancelled || !translated?.length) {
          if (!cancelled) {
            setChunks(
              stripWrongLocalePhraseTranslations(seededEntry.chunks, learnerLocale),
            );
          }
          return;
        }
        setCachedCollocationTranslations(word, pending, translated, learnerLocale);
        setChunks(
          stripWrongLocalePhraseTranslations(
            mergeCollocationVi(seededEntry.chunks, translated),
            learnerLocale,
          ),
        );
        chunkLocaleKeyRef.current = localeKey;
      } catch {
        if (!cancelled) {
          setChunks(
            stripWrongLocalePhraseTranslations(seededEntry.chunks, learnerLocale),
          );
        }
      } finally {
        if (!cancelled) setLocaleLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      setLocaleLoading(false);
    };
  }, [
    word,
    wordType,
    meaning,
    register,
    englishDefinition,
    seededEntry,
    seedKey,
    learnerLocale,
  ]);

  if (!seededEntry) {
    return { entry: null, localeLoading: false };
  }

  return {
    entry: {
      collocations,
      chunks,
    },
    localeLoading,
  };
}
