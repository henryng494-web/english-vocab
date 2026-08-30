"use client";

import { useI18n } from "@/hooks/use-i18n";
import { useLearningChunkTranslations } from "@/hooks/use-learning-chunk-translations";
import {
  MAX_LEARNING_CHUNKS,
  MAX_LEARNING_COLLOCATIONS,
  type LearningChunkPhrase,
} from "@/data/demo-learning-chunks";
import { capitalizeFirst } from "@/lib/format-text";
import { resolveLearningChunks } from "@/lib/learning-chunks";

type WordLearningChunksProps = {
  word: string;
  examples?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  compact?: boolean;
};

function PhraseList({ items }: { items: LearningChunkPhrase[] }) {
  return (
    <ul className="vocab-examples vocab-examples--compact word-learning-chunks__examples">
      {items.map((item) => (
        <li key={`${item.sense ?? 0}-${item.en}`} className="vocab-examples__item">
          <p className="vocab-examples__en italic">{capitalizeFirst(item.en)}</p>
          {item.vi ? (
            <p className="vocab-examples__vi mt-0.5 italic">
              {capitalizeFirst(item.vi)}
            </p>
          ) : null}
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
  compact = false,
}: WordLearningChunksProps) {
  const { t } = useI18n();
  const baseEntry = resolveLearningChunks(word, { examples, wordType, meaning });
  const entry = useLearningChunkTranslations({
    word,
    wordType,
    meaning,
    entry: baseEntry,
    contextExamples: baseEntry?.chunks,
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
        <section className="word-learning-chunks__section">
          <h3 className="word-learning-chunks__label">{t("chunks.collocations")}</h3>
          <PhraseList items={collocationItems} />
        </section>
      ) : null}

      {chunkItems.length > 0 ? (
        <section className="word-learning-chunks__section">
          <h3 className="word-learning-chunks__label">{t("chunks.phrases")}</h3>
          <PhraseList items={chunkItems} />
        </section>
      ) : null}
    </div>
  );
}
