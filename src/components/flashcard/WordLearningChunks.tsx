"use client";

import { useMemo } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { useLearningChunkTranslations } from "@/hooks/use-learning-chunk-translations";
import {
  MAX_LEARNING_CHUNKS,
  MAX_LEARNING_COLLOCATIONS,
  type LearningChunkEntry,
  type LearningChunkPhrase,
} from "@/data/demo-learning-chunks";
import { SpeakButton } from "@/components/flashcard/SpeakButton";
import { capitalizeFirst } from "@/lib/format-text";
import { localizedLearningChunkEntry } from "@/lib/localized-chunks-display";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import {
  learnerLocaleNeedsHydration,
  type LearnerLocale,
} from "@/lib/learner-locale";
import type { WordRegister } from "@/lib/word-meanings";
import type {
  ExampleTranslationsJson,
  PhraseTranslationsJson,
} from "@/types/word-content";

type WordLearningChunksProps = {
  word: string;
  examples?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  register?: WordRegister | null;
  englishDefinition?: string | null;
  phraseTranslations?: PhraseTranslationsJson | null;
  exampleTranslations?: ExampleTranslationsJson | null;
  learnerLocale?: LearnerLocale;
  localeLoadingGloss?: boolean;
  localeSettled?: boolean;
  compact?: boolean;
};

function stripViForLocalePending(
  items: LearningChunkPhrase[],
  learnerLocale: LearnerLocale,
  allowViFallback: boolean,
): LearningChunkPhrase[] {
  if (!learnerLocaleNeedsHydration(learnerLocale) || allowViFallback) {
    return items;
  }
  return items.map((item) => ({ ...item, vi: "" }));
}

function stripEntryViForLocalePending(
  entry: LearningChunkEntry,
  learnerLocale: LearnerLocale,
  allowViFallback: boolean,
): LearningChunkEntry {
  return {
    collocations: stripViForLocalePending(
      entry.collocations,
      learnerLocale,
      allowViFallback,
    ),
    chunks: stripViForLocalePending(entry.chunks, learnerLocale, allowViFallback),
  };
}

function PhraseList({
  items,
  inline = false,
  speakAtEnd = false,
  speakAriaLabel,
  localeLoadingGloss = false,
  learnerLocale = "vi",
  allowViFallback = true,
}: {
  items: LearningChunkPhrase[];
  inline?: boolean;
  speakAtEnd?: boolean;
  speakAriaLabel?: string;
  localeLoadingGloss?: boolean;
  learnerLocale?: LearnerLocale;
  allowViFallback?: boolean;
}) {
  const visible = stripViForLocalePending(items, learnerLocale, allowViFallback);
  return (
    <ul className="vocab-examples vocab-examples--compact word-learning-chunks__examples">
      {visible.map((item) => (
        <li
          key={`${item.sense ?? 0}-${item.en}`}
          className={
            inline
              ? "vocab-examples__item word-learning-chunks__item--inline"
              : "vocab-examples__item"
          }
        >
          {inline ? (
            <p className="word-learning-chunks__line">
              <span className="vocab-examples__en italic">
                {capitalizeFirst(item.en)}
              </span>
              {(localeLoadingGloss ||
                (learnerLocaleNeedsHydration(learnerLocale) &&
                  !allowViFallback)) &&
              !item.vi.trim() ? (
                <>
                  <span className="word-learning-chunks__sep" aria-hidden="true">
                    ·
                  </span>
                  <span
                    className="vocab-examples__vi vocab-examples__vi--loading inline-block h-4 w-24 animate-pulse rounded bg-primary-50"
                    aria-hidden
                  />
                </>
              ) : item.vi ? (
                <>
                  <span className="word-learning-chunks__sep" aria-hidden="true">
                    ·
                  </span>
                  <span className="vocab-examples__vi italic">
                    {capitalizeFirst(item.vi)}
                  </span>
                </>
              ) : null}
            </p>
          ) : speakAtEnd ? (
            <>
              <p className="word-learning-chunks__en-row">
                <span className="word-learning-chunks__en-text vocab-examples__en italic">
                  {capitalizeFirst(item.en)}
                </span>
                <SpeakButton
                  text={item.en}
                  variant="light"
                  iconOnly
                  ariaLabel={speakAriaLabel}
                  className="word-learning-chunks__speak !inline-flex !h-7 !w-7"
                />
              </p>
              {(localeLoadingGloss ||
                (learnerLocaleNeedsHydration(learnerLocale) &&
                  !allowViFallback)) &&
              !item.vi.trim() ? (
                <span
                  className="vocab-examples__vi vocab-examples__vi--loading mt-0.5 block h-4 w-4/5 max-w-xs animate-pulse rounded bg-primary-50"
                  aria-hidden
                />
              ) : item.vi ? (
                <p className="vocab-examples__vi mt-0.5 italic">
                  {capitalizeFirst(item.vi)}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <p className="vocab-examples__en italic">{capitalizeFirst(item.en)}</p>
              {(localeLoadingGloss ||
                (learnerLocaleNeedsHydration(learnerLocale) &&
                  !allowViFallback)) &&
              !item.vi.trim() ? (
                <span
                  className="vocab-examples__vi vocab-examples__vi--loading mt-0.5 block h-4 w-4/5 max-w-xs animate-pulse rounded bg-primary-50"
                  aria-hidden
                />
              ) : item.vi ? (
                <p className="vocab-examples__vi mt-0.5 italic">
                  {capitalizeFirst(item.vi)}
                </p>
              ) : null}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

export function WordLearningChunks({
  word,
  examples,
  wordType,
  meaning,
  register,
  englishDefinition,
  phraseTranslations,
  exampleTranslations,
  learnerLocale = "vi",
  localeLoadingGloss = false,
  localeSettled = true,
  compact = false,
}: WordLearningChunksProps) {
  const { t } = useI18n();
  const baseEntry = useMemo(
    () => resolveLearningChunks(word, { examples, wordType, meaning }),
    [word, examples, wordType, meaning],
  );
  const viEntry = useLearningChunkTranslations({
    word,
    examples,
    wordType,
    meaning,
    register,
    englishDefinition,
    entry: baseEntry,
    learnerLocale,
  });

  const allowViFallback = localeSettled && !localeLoadingGloss;

  const entry = useMemo(() => {
    if (learnerLocaleNeedsHydration(learnerLocale)) {
      const localized = localizedLearningChunkEntry(
        {
          word,
          examples,
          word_type: wordType,
          vietnamese_meaning: meaning,
          phrase_translations: phraseTranslations,
          example_translations: exampleTranslations,
        },
        learnerLocale,
        { allowViFallback },
      );
      if (localized) return localized;
      if (!baseEntry) return null;
      return stripEntryViForLocalePending(
        baseEntry,
        learnerLocale,
        allowViFallback,
      );
    }
    return viEntry;
  }, [
    learnerLocale,
    word,
    examples,
    wordType,
    meaning,
    phraseTranslations,
    exampleTranslations,
    viEntry,
    baseEntry,
    allowViFallback,
    localeLoadingGloss,
    localeSettled,
  ]);

  if (!entry) return null;

  const collocationItems = entry.collocations.slice(0, MAX_LEARNING_COLLOCATIONS);
  const chunkItems = entry.chunks.slice(0, MAX_LEARNING_CHUNKS);
  if (!collocationItems.length && !chunkItems.length) return null;

  return (
    <div
      className={
        compact
          ? "word-learning-chunks word-learning-chunks--compact word-learning-chunks--solo"
          : "word-learning-chunks"
      }
    >
      {collocationItems.length > 0 ? (
        <section className="word-learning-chunks__section word-learning-chunks__section--collocations">
          <h3 className="word-learning-chunks__label">{t("chunks.collocations")}</h3>
          <PhraseList
            items={collocationItems}
            localeLoadingGloss={localeLoadingGloss}
            learnerLocale={learnerLocale}
            allowViFallback={allowViFallback}
          />
        </section>
      ) : null}

      {chunkItems.length > 0 ? (
        <section className="word-learning-chunks__section word-learning-chunks__section--phrases">
          <h3 className="word-learning-chunks__label">{t("chunks.phrases")}</h3>
          <PhraseList
            items={chunkItems}
            speakAtEnd
            speakAriaLabel={t("speak.phraseAria")}
            localeLoadingGloss={localeLoadingGloss}
            learnerLocale={learnerLocale}
            allowViFallback={allowViFallback}
          />
        </section>
      ) : null}
    </div>
  );
}
