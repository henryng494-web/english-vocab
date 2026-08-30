"use client";

import { useEffect, useRef, useState } from "react";
import { VocabExampleList } from "@/components/flashcard/VocabExampleList";
import { WordLearningChunks } from "@/components/flashcard/WordLearningChunks";
import { capitalizeFirst } from "@/lib/format-text";
import { hasLearningChunks } from "@/lib/learning-chunks";
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
  loading?: boolean;
};

export function WordCardDetails({
  word,
  examples,
  wordType,
  meaning,
  register,
  englishDefinition,
  family,
  loading = false,
}: WordCardDetailsProps) {
  const parsed = loading ? [] : parseExamples(examples);
  const chunksOnly = hasLearningChunks(word, { examples, wordType, meaning });
  const rows = (family ?? []).filter((item) => item.word.trim());
  const canFlip = rows.length > 1;
  const [showFamily, setShowFamily] = useState(false);
  const startX = useRef<number | null>(null);
  const swiped = useRef(false);

  useEffect(() => {
    setShowFamily(false);
  }, [word]);

  if (loading) {
    return (
      <div className="space-y-3 pt-1" aria-hidden>
        <div className="h-6 w-3/4 animate-pulse rounded bg-primary-50" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-primary-50" />
        <div className="h-10 w-full animate-pulse rounded-lg bg-primary-50" />
      </div>
    );
  }

  function toggle() {
    if (!canFlip) return;
    setShowFamily((current) => !current);
  }

  return (
    <div className="card-details card-details--compact">
      <div
        className="card-details__scene"
        onClick={() => {
          if (swiped.current) {
            swiped.current = false;
            return;
          }
          toggle();
        }}
        onPointerDown={(event) => {
          startX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          if (startX.current == null || !canFlip) return;
          const delta = event.clientX - startX.current;
          startX.current = null;
          if (Math.abs(delta) < 40) return;
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
              className={`discover-card__examples min-h-0 flex-1 overflow-hidden${chunksOnly ? " discover-card__examples--chunks-only" : ""}`}
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
            <ul className="card-details__face card-details__face--family">
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
          ) : null}
        </div>
      </div>

      {canFlip ? (
        <button
          type="button"
          className="card-details__hint"
          onClick={(event) => {
            event.stopPropagation();
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
