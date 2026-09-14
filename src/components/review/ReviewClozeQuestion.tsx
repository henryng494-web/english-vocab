"use client";

import { useEffect, useMemo, useState } from "react";
import { displayFontClass } from "@/lib/fonts";
import { useI18n } from "@/hooks/use-i18n";
import type {
  ReviewClozeLetterTile,
  ReviewClozePart,
} from "@/lib/review-quiz";

type ReviewClozeQuestionProps = {
  sentenceVi: string;
  parts: ReviewClozePart[];
  letterTiles: ReviewClozeLetterTile[];
  correctWord: string;
  locked: boolean;
  unsure: boolean;
  onComplete: (attempt: string) => void;
  onUnsure: () => void;
};

export function ReviewClozeQuestion({
  sentenceVi,
  parts,
  letterTiles,
  correctWord,
  locked,
  unsure,
  onComplete,
  onUnsure,
}: ReviewClozeQuestionProps) {
  const { t } = useI18n();
  const slotCount = correctWord.length;
  const tileById = useMemo(
    () => new Map(letterTiles.map((tile) => [tile.id, tile])),
    [letterTiles],
  );
  const [slots, setSlots] = useState<(string | null)[]>(() =>
    Array.from({ length: slotCount }, () => null),
  );

  useEffect(() => {
    setSlots(Array.from({ length: slotCount }, () => null));
  }, [correctWord, slotCount, letterTiles]);

  const usedTileIds = new Set(slots.filter(Boolean) as string[]);
  const assembled = slots
    .map((id) => (id ? tileById.get(id)?.char ?? "" : ""))
    .join("");
  const allFilled = slots.every(Boolean);
  const isCorrect = assembled.toLowerCase() === correctWord.trim().toLowerCase();

  function handleTileTap(tile: ReviewClozeLetterTile) {
    if (locked || usedTileIds.has(tile.id)) return;
    const nextIndex = slots.findIndex((slot) => slot === null);
    if (nextIndex < 0) return;

    const next = [...slots];
    next[nextIndex] = tile.id;
    setSlots(next);

    if (nextIndex === slotCount - 1) {
      const attempt = next
        .map((id) => (id ? tileById.get(id)?.char ?? "" : ""))
        .join("");
      onComplete(attempt);
    }
  }

  function handleSlotTap(index: number) {
    if (locked) return;
    const tileId = slots[index];
    if (!tileId) return;

    const lastFilled = slots.reduce<number>(
      (last, slot, slotIndex) => (slot ? slotIndex : last),
      -1,
    );
    if (index !== lastFilled) return;

    const next = [...slots];
    next[index] = null;
    setSlots(next);
  }

  return (
    <div className={`review-cloze ${displayFontClass}`}>
      <p className={`review-cloze__vi ${displayFontClass}`}>{sentenceVi}</p>

      <p className={`review-cloze__en ${displayFontClass}`}>
        {parts.map((part, index) =>
          part.isBlank ? (
            <span key={`blank-${index}`} className="review-cloze__slots">
              {slots.map((tileId, slotIndex) => {
                const char = tileId ? tileById.get(tileId)?.char : null;
                let state = "";
                if (locked) {
                  state = isCorrect ? " is-correct" : " is-wrong";
                } else if (char) {
                  state = " is-filled";
                }
                return (
                  <button
                    key={`slot-${slotIndex}`}
                    type="button"
                    className={`review-cloze__slot${state}`}
                    disabled={locked || !char}
                    onClick={() => handleSlotTap(slotIndex)}
                    aria-label={
                      char
                        ? t("review.clozeSlotFilled", { letter: char })
                        : t("review.clozeSlotEmpty")
                    }
                  >
                    {char ?? "·"}
                  </button>
                );
              })}
            </span>
          ) : (
            <span key={`${part.text}-${index}`}>{part.text}</span>
          ),
        )}
      </p>

      <p className={`review-cloze__hint ${displayFontClass}`}>
        {t("review.clozeHint")}
      </p>

      <div className="review-cloze__bank">
        {letterTiles.map((tile) => {
          const isUsed = usedTileIds.has(tile.id);
          let state = "";
          if (locked) {
            state = isUsed ? (isCorrect ? " is-correct" : " is-wrong") : " is-dim";
          } else if (isUsed) {
            state = " is-used";
          }
          return (
            <button
              key={tile.id}
              type="button"
              className={`review-cloze__tile review-cloze__tile--letter${state}`}
              disabled={locked || isUsed}
              onClick={() => handleTileTap(tile)}
              aria-label={tile.char}
            >
              {tile.char}
            </button>
          );
        })}
      </div>

      {locked && !unsure && allFilled ? (
        <p
          className={`review-cloze__answer ${displayFontClass}${
            isCorrect ? " is-correct" : " is-wrong"
          }`}
        >
          {isCorrect
            ? t("review.clozeCorrect")
            : t("review.clozeWrong", { word: correctWord })}
        </p>
      ) : null}

      <button
        type="button"
        className={`review-quiz__unsure review-cloze__unsure${unsure ? " is-active" : ""} ${displayFontClass}`}
        disabled={locked}
        onClick={onUnsure}
      >
        {t("review.notSure")}
      </button>
    </div>
  );
}
