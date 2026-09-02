"use client";

import { useMemo } from "react";
import { useI18n } from "@/hooks/use-i18n";
import { useLearningChunkTranslations } from "@/hooks/use-learning-chunk-translations";
import {
  MAX_LEARNING_CHUNKS,
  MAX_LEARNING_COLLOCATIONS,
  type LearningChunkPhrase,
} from "@/data/demo-learning-chunks";
import { capitalizeFirst } from "@/lib/format-text";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import type { WordRegister } from "@/lib/word-meanings";

type WordLearningChunksProps = {
  word: string;
  examples?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  register?: WordRegister | null;
  englishDefinition?: string | null;
  compact?: boolean;
};

function PhraseList({
  items,
  inline = false,
}: {
  items: LearningChunkPhrase[];
  inline?: boolean;
}) {
  return (
    <ul className="vocab-examples vocab-examples--compact word-learning-chunks__examples">
      {items.map((item) => (
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
              {item.vi ? (
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
          ) : (
            <>
              <p className="vocab-examples__en italic">{capitalizeFirst(item.en)}</p>
              {item.vi ? (
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
  compact = false,
}: WordLearningChunksProps) {
  const { t } = useI18n();
  const baseEntry = useMemo(
    () => resolveLearningChunks(word, { examples, wordType, meaning }),
    [word, examples, wordType, meaning],
  );
  const entry = useLearningChunkTranslations({
    word,
    examples,
    wordType,
    meaning,
    register,
    englishDefinition,
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
          <PhraseList items={collocationItems} inline />
        </section>
      ) : null}

      {chunkItems.length > 0 ? (
        <section className="word-learning-chunks__section word-learning-chunks__section--phrases">
          <h3 className="word-learning-chunks__label">{t("chunks.phrases")}</h3>
          <PhraseList items={chunkItems} />
        </section>
      ) : null}
    </div>
  );
}
