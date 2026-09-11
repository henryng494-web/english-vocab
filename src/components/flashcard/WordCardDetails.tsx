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
  /** Block horizontal swipe-to-flip briefly after the word opens (review reveal). */
  familySwipeGraceMs?: number;
};

const SWIPE_MIN_PX = 40;
const SWIPE_LOCK_PX = 10;
const SWIPE_HORIZONTAL_RATIO = 1.15;

type GestureIntent = "pending" | "horizontal" | "vertical";

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
  familySwipeGraceMs = 0,
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
  const sceneRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const activePointer = useRef<number | null>(null);
  const gestureIntent = useRef<GestureIntent>("pending");
  const openedAtRef = useRef(0);

  function resetGesture() {
    activePointer.current = null;
    gestureIntent.current = "pending";
  }

  function releaseCapture(pointerId: number) {
    const scene = sceneRef.current;
    if (!scene) return;
    try {
      if (scene.hasPointerCapture(pointerId)) {
        scene.releasePointerCapture(pointerId);
      }
    } catch {
      /* pointer already released */
    }
  }

  useEffect(() => {
    setShowFamily(false);
    openedAtRef.current = Date.now();
    resetGesture();
  }, [word]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !canFlip) return;

    const blockScrollDuringHorizontal = (event: TouchEvent) => {
      if (gestureIntent.current === "horizontal" && event.cancelable) {
        event.preventDefault();
      }
    };

    scene.addEventListener("touchmove", blockScrollDuringHorizontal, {
      passive: false,
    });
    return () => {
      scene.removeEventListener("touchmove", blockScrollDuringHorizontal);
    };
  }, [canFlip, word]);

  if (loading) {
    return <DetailsLoadingSkeleton />;
  }

  return (
    <div className="card-details card-details--compact">
      <div
        ref={sceneRef}
        className="card-details__scene"
        onPointerDownCapture={(event) => {
          if (!canFlip || event.pointerType === "mouse") return;
          activePointer.current = event.pointerId;
          gestureIntent.current = "pending";
          startX.current = event.clientX;
          startY.current = event.clientY;
          try {
            event.currentTarget.setPointerCapture(event.pointerId);
          } catch {
            /* ignore */
          }
        }}
        onPointerMoveCapture={(event) => {
          if (activePointer.current !== event.pointerId) return;
          if (gestureIntent.current !== "pending") return;

          const deltaX = event.clientX - startX.current;
          const deltaY = event.clientY - startY.current;
          if (Math.hypot(deltaX, deltaY) < SWIPE_LOCK_PX) return;

          if (
            Math.abs(deltaX) >= SWIPE_LOCK_PX &&
            Math.abs(deltaX) > Math.abs(deltaY) * SWIPE_HORIZONTAL_RATIO
          ) {
            gestureIntent.current = "horizontal";
            if (event.cancelable) event.preventDefault();
            return;
          }

          if (
            Math.abs(deltaY) >= SWIPE_LOCK_PX &&
            Math.abs(deltaY) > Math.abs(deltaX)
          ) {
            gestureIntent.current = "vertical";
            releaseCapture(event.pointerId);
            resetGesture();
          }
        }}
        onPointerUpCapture={(event) => {
          if (activePointer.current !== event.pointerId) return;

          const withinGrace =
            familySwipeGraceMs > 0 &&
            Date.now() - openedAtRef.current < familySwipeGraceMs;

          const deltaX = event.clientX - startX.current;
          const deltaY = event.clientY - startY.current;
          const intent = gestureIntent.current;
          releaseCapture(event.pointerId);
          resetGesture();

          if (withinGrace || intent !== "horizontal") return;
          if (Math.abs(deltaX) < SWIPE_MIN_PX) return;
          if (Math.abs(deltaX) <= Math.abs(deltaY) * SWIPE_HORIZONTAL_RATIO) {
            return;
          }
          setShowFamily(deltaX < 0);
        }}
        onPointerCancelCapture={(event) => {
          if (activePointer.current !== event.pointerId) return;
          releaseCapture(event.pointerId);
          resetGesture();
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
        <p className="card-details__hint" aria-hidden>
          <span>{showFamily ? "Examples" : "Family"}</span>
          <span className="card-details__dots">
            <i className={!showFamily ? "is-on" : ""} />
            <i className={showFamily ? "is-on" : ""} />
          </span>
        </p>
      ) : null}
    </div>
  );
}
