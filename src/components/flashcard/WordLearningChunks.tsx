"use client";

import { useI18n } from "@/hooks/use-i18n";
import { getLearningChunks } from "@/lib/learning-chunks";

type WordLearningChunksProps = {
  word: string;
  compact?: boolean;
};

export function WordLearningChunks({ word, compact = false }: WordLearningChunksProps) {
  const { t } = useI18n();
  const entry = getLearningChunks(word);
  if (!entry) return null;

  const collocationItems = entry.collocations.slice(0, 2);
  const chunkItems = entry.chunks.slice(0, 1);
  if (!collocationItems.length && !chunkItems.length) return null;

  return (
    <div
      className={
        compact
          ? "word-learning-chunks word-learning-chunks--compact"
          : "word-learning-chunks"
      }
    >
      {collocationItems.length > 0 ? (
        <section className="word-learning-chunks__section">
          <h3 className="word-learning-chunks__label">{t("chunks.collocations")}</h3>
          <ul className="word-learning-chunks__list">
            {collocationItems.map((item) => (
              <li key={item.en} className="word-learning-chunks__item">
                <span className="word-learning-chunks__en">{item.en}</span>
                <span className="word-learning-chunks__vi">{item.vi}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {chunkItems.length > 0 ? (
        <section className="word-learning-chunks__section">
          <h3 className="word-learning-chunks__label">{t("chunks.phrases")}</h3>
          <ul className="word-learning-chunks__list">
            {chunkItems.map((item) => (
              <li key={item.en} className="word-learning-chunks__item">
                <span className="word-learning-chunks__en">{item.en}</span>
                <span className="word-learning-chunks__vi">{item.vi}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
