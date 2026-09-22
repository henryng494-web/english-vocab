"use client";

import { useMemo } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { useLearningChunkTranslations } from "@/hooks/use-learning-chunk-translations";
import {
  MAX_LEARNING_CHUNKS,
  MAX_LEARNING_COLLOCATIONS,
  type LearningChunkPhrase,
} from "@/data/demo-learning-chunks";
import { SpeakButton } from "@/components/flashcard/SpeakButton";
import { capitalizeFirst } from "@/lib/format-text";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import { phraseTranslationForLocale } from "@/lib/phrase-locale";
import type { WordRegister } from "@/lib/word-meanings";
import type { UserLanguage } from "@/lib/user-language";
import type { PhraseTranslationsJson } from "@/types/word-content";

type WordLearningChunksProps = {
  word: string;
  examples?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  userLanguage: UserLanguage;
  register?: WordRegister | null;
  englishDefinition?: string | null;
  phraseTranslations?: PhraseTranslationsJson | null;
  compact?: boolean;
};

function PhraseList({
  items,
  userLanguage,
  localeLoading = false,
  inline = false,
  speakAtEnd = false,
  speakAriaLabel,
}: {
  items: LearningChunkPhrase[];
  userLanguage: UserLanguage;
  localeLoading?: boolean;
  inline?: boolean;
  speakAtEnd?: boolean;
  speakAriaLabel?: string;
}) {
  return (
    <ul className="vocab-examples vocab-examples--compact word-learning-chunks__examples">
      {items.map((item) => {
        const translation = phraseTranslationForLocale(item, userLanguage);
        const awaitingLocale =
          userLanguage !== "vi" &&
          localeLoading &&
          item.en.trim() &&
          !translation;
        return (
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
                {awaitingLocale ? (
                  <>
                    <span className="word-learning-chunks__sep" aria-hidden="true">
                      ·
                    </span>
                    <span
                      className="inline-block h-3.5 w-20 animate-pulse rounded bg-primary-100/80 align-middle"
                      aria-hidden
                    />
                  </>
                ) : translation ? (
                  <>
                    <span className="word-learning-chunks__sep" aria-hidden="true">
                      ·
                    </span>
                    <span className="vocab-examples__vi italic">
                      {capitalizeFirst(translation)}
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
                {awaitingLocale ? (
                  <p className="mt-0.5">
                    <span
                      className="inline-block h-3.5 w-40 max-w-full animate-pulse rounded bg-primary-100/80"
                      aria-hidden
                    />
                  </p>
                ) : translation ? (
                  <p className="vocab-examples__vi mt-0.5 italic">
                    {capitalizeFirst(translation)}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <p className="vocab-examples__en italic">{capitalizeFirst(item.en)}</p>
                {awaitingLocale ? (
                  <p className="mt-0.5">
                    <span
                      className="inline-block h-3.5 w-40 max-w-full animate-pulse rounded bg-primary-100/80"
                      aria-hidden
                    />
                  </p>
                ) : translation ? (
                  <p className="vocab-examples__vi mt-0.5 italic">
                    {capitalizeFirst(translation)}
                  </p>
                ) : null}
              </>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function WordLearningChunks({
  word,
  examples,
  wordType,
  meaning,
  userLanguage,
  register,
  englishDefinition,
  phraseTranslations,
  compact = false,
}: WordLearningChunksProps) {
  const { t } = useI18n();
  const baseEntry = useMemo(
    () => resolveLearningChunks(word, { examples, wordType, meaning }),
    [word, examples, wordType, meaning],
  );
  const { entry, localeLoading } = useLearningChunkTranslations({
    word,
    examples,
    wordType,
    meaning,
    register,
    englishDefinition,
    phraseTranslations,
    entry: baseEntry,
  });
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
            userLanguage={userLanguage}
            localeLoading={localeLoading}
            inline
          />
        </section>
      ) : null}

      {chunkItems.length > 0 ? (
        <section className="word-learning-chunks__section word-learning-chunks__section--phrases">
          <h3 className="word-learning-chunks__label">{t("chunks.phrases")}</h3>
          <PhraseList
            items={chunkItems}
            userLanguage={userLanguage}
            localeLoading={localeLoading}
            speakAtEnd
            speakAriaLabel={t("speak.phraseAria")}
          />
        </section>
      ) : null}
    </div>
  );
}
