"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { VocabExampleList } from "@/components/flashcard/VocabExampleList";
import { WordLearningChunks } from "@/components/flashcard/WordLearningChunks";
import { useI18n } from "@/hooks/use-i18n";
import { useCardSimilarWords } from "@/hooks/use-card-similar-words";
import { capitalizeFirst } from "@/lib/format-text";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import { parseExamples } from "@/lib/parse-examples";
import type { WordFamilyMember } from "@/types/database";
import type { WordRegister } from "@/lib/word-meanings";

const POS_ABBREV: Record<string, string> = {
  noun: "n.",
  verb: "v.",
  adjective: "adj.",
  adverb: "adv.",
  preposition: "prep.",
  pronoun: "pron.",
  conjunction: "conj.",
  interjection: "interj.",
  article: "art.",
  number: "num.",
  determiner: "det.",
};

type WordCardDetailsProps = {
  word: string;
  examples?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  register?: WordRegister | null;
  englishDefinition?: string | null;
  family?: WordFamilyMember[] | null;
  similarWords?: string[] | null;
  loading?: boolean;
};

function DetailsLoadingSkeleton() {
  return (
    <div className="card-details card-details--compact">
      <div className="space-y-3 pt-1" aria-hidden>
        <div className="h-6 w-3/4 animate-pulse rounded bg-primary-50" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-primary-50" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-primary-50" />
      </div>
    </div>
  );
}

export function WordCardDetails({
  word,
  examples,
  wordType,
  meaning,
  register,
  englishDefinition,
  family,
  similarWords,
  loading = false,
}: WordCardDetailsProps) {
  const { t } = useI18n();
  const chunkEntry = useMemo(
    () => resolveLearningChunks(word, { examples, wordType, meaning }),
    [word, examples, wordType, meaning],
  );
  const chunksOnly = Boolean(
    (chunkEntry?.collocations.length ?? 0) > 0 ||
      (chunkEntry?.chunks.length ?? 0) > 0,
  );
  const parsed = loading ? [] : parseExamples(examples);
  const rows = (family ?? []).filter((item) => item.word.trim());
  const similar = useCardSimilarWords({
    word,
    preset: similarWords,
    wordType,
    meaning,
    englishDefinition,
  }).filter((item) => item.trim());
  const canFlip = rows.length > 1 || similar.length > 0;
  const [showFamily, setShowFamily] = useState(false);
  const startX = useRef<number | null>(null);
  const canFlipAtPointerDown = useRef(false);
  const swiped = useRef(false);
  const openedAtRef = useRef(0);

  useEffect(() => {
    setShowFamily(false);
    openedAtRef.current = Date.now();
    startX.current = null;
    canFlipAtPointerDown.current = false;
    swiped.current = false;
  }, [word]);

  if (loading) {
    return <DetailsLoadingSkeleton />;
  }

  function toggle() {
    if (!canFlip) return;
    setShowFamily((current) => !current);
  }

  return (
    <div className="card-details card-details--compact">
      <div
        className="card-details__scene"
        onPointerDown={(event) => {
          if (!canFlip) {
            startX.current = null;
            canFlipAtPointerDown.current = false;
            return;
          }
          startX.current = event.clientX;
          canFlipAtPointerDown.current = true;
        }}
        onPointerUp={(event) => {
          if (
            startX.current == null ||
            !canFlipAtPointerDown.current ||
            Date.now() - openedAtRef.current < 450
          ) {
            startX.current = null;
            canFlipAtPointerDown.current = false;
            return;
          }
          const delta = event.clientX - startX.current;
          startX.current = null;
          canFlipAtPointerDown.current = false;
          if (Math.abs(delta) < 56) return;
          swiped.current = true;
          setShowFamily(delta < 0);
        }}
        role={canFlip ? "button" : undefined}
        tabIndex={canFlip ? 0 : undefined}
        aria-label={canFlip ? (showFamily ? "Show examples" : "Show word family") : undefined}
        onKeyDown={(event) => {
          if (!canFlip) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggle();
          }
        }}
      >
        <div className={`card-details__flip${showFamily ? " is-family" : ""}`}>
          <div className="card-details__face card-details__face--meaning">
            <div
              className={`discover-card__examples min-h-0 flex-1${chunksOnly ? " discover-card__examples--chunks-only" : ""}`}
            >
              <WordLearningChunks
                word={word}
                examples={examples}
                wordType={wordType}
                meaning={meaning}
                register={register}
                englishDefinition={englishDefinition}
                compact
              />
              {!chunksOnly ? (
                <VocabExampleList
                  word={word}
                  examples={parsed}
                  wordType={wordType}
                  meaning={meaning}
                  compact
                />
              ) : null}
            </div>
          </div>

          {canFlip ? (
            <div className="card-details__face card-details__face--family">
              <section className="card-family__column">
                {rows.length > 0 ? (
                  <>
                    <h3 className="word-learning-chunks__label">{t("card.wordForms")}</h3>
                    <ul className="card-family__list">
                      {rows.map((item) => {
                        const pos =
                          POS_ABBREV[item.pos] ?? (item.pos ? `${item.pos}.` : "");
                        return (
                          <li key={item.word} className="card-family__row">
                            <span className="card-family__word">
                              {capitalizeFirst(item.word)}
                            </span>
                            {pos ? (
                              <span className="card-family__meta"> — {pos}</span>
                            ) : null}
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : null}
              </section>
              <section className="card-similar__column">
                {similar.length > 0 ? (
                  <>
                    <h3 className="word-learning-chunks__label">{t("card.similarWords")}</h3>
                    <ul className="card-similar__list">
                      {similar.map((item) => (
                        <li key={item} className="card-similar__row">
                          {capitalizeFirst(item)}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </section>
            </div>
          ) : null}
        </div>
      </div>

      {canFlip ? (
        <button
          type="button"
          className="card-details__hint"
          onClick={(event) => {
            event.stopPropagation();
            swiped.current = false;
            toggle();
          }}
        >
          <span>{showFamily ? "Examples" : "Family"}</span>
          <span className="card-details__dots" aria-hidden>
            <i className={!showFamily ? "is-on" : ""} />
            <i className={showFamily ? "is-on" : ""} />
          </span>
        </button>
      ) : null}
    </div>
  );
}
