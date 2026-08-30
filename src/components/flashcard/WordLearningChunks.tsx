"use client";

import { useI18n } from "@/hooks/use-i18n";
import { getLearningChunks } from "@/lib/learning-chunks";

type WordLearningChunksProps = {
  word: string;
  compact?: boolean;
};

function PhraseList({ items }: { items: Array<{ en: string; vi: string }> }) {
  return (
    <ul className="vocab-examples vocab-examples--compact word-learning-chunks__examples">
      {items.map((item) => (
        <li key={item.en} className="vocab-examples__item">
          <p className="vocab-examples__en italic">{item.en}</p>
          <p className="vocab-examples__vi mt-0.5 italic">{item.vi}</p>
        </li>
      ))}
    </ul>
  );
}

export function WordLearningChunks({ word, compact = false }: WordLearningChunksProps) {
  const { t } = useI18n();
  const entry = getLearningChunks(word);
  if (!entry) return null;

  const collocationItems = entry.collocations;
  const chunkItems = entry.chunks;
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
