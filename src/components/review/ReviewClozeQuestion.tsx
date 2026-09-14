"use client";

import { useEffect, useMemo, useState } from "react";
import { displayFontClass } from "@/lib/fonts";
import { useI18n } from "@/hooks/use-i18n";
import {
  CLOZE_PREFIX_HINT,
  type ReviewClozeLetterSlot,
  type ReviewClozeLetterTile,
  type ReviewClozePart,
} from "@/lib/review-quiz";

type ReviewClozeQuestionProps = {
  sentenceVi: string;
  parts: ReviewClozePart[];
  letterSlots: ReviewClozeLetterSlot[];
  letterTiles: ReviewClozeLetterTile[];
  correctWord: string;
  locked: boolean;
  unsure: boolean;
  onComplete: (attempt: string) => void;
  onUnsure: () => void;
};

function assembleWord(
  letterSlots: ReviewClozeLetterSlot[],
  blankFills: Map<number, string | null>,
  tileById: Map<string, ReviewClozeLetterTile>,
): string {
  return letterSlots
    .map((slot, index) => {
      if (!slot.blank) return slot.char;
      const tileId = blankFills.get(index);
      return tileId ? tileById.get(tileId)?.char ?? "" : "";
    })
    .join("");
}

export function ReviewClozeQuestion({
  sentenceVi,
  parts,
  letterSlots,
  letterTiles,
  correctWord,
  locked,
  unsure,
  onComplete,
  onUnsure,
}: ReviewClozeQuestionProps) {
  const { t } = useI18n();
  const prefixCount = Math.min(CLOZE_PREFIX_HINT, letterSlots.length);
  const blankIndices = useMemo(
    () =>
      letterSlots
        .map((slot, index) => (slot.blank ? index : -1))
        .filter((index) => index >= 0),
    [letterSlots],
  );

  function renderTailSlot(slot: ReviewClozeLetterSlot, slotIndex: number) {
    if (!slot.blank) {
      return (
        <span
          key={`slot-${slotIndex}`}
          className="review-cloze__slot review-cloze__slot--prefilled"
          aria-hidden
        >
          {slot.char}
        </span>
      );
    }

    const tileId = blankFills.get(slotIndex);
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
        onClick={() => handleBlankTap(slotIndex)}
        aria-label={
          char
            ? t("review.clozeSlotFilled", { letter: char })
            : t("review.clozeSlotEmpty")
        }
      >
        {char ?? "·"}
      </button>
    );
  }
  const tileById = useMemo(
    () => new Map(letterTiles.map((tile) => [tile.id, tile])),
    [letterTiles],
  );
  const [blankFills, setBlankFills] = useState<Map<number, string | null>>(
    () => new Map(),
  );

  useEffect(() => {
    setBlankFills(new Map());
  }, [correctWord, letterSlots, letterTiles]);

  const usedTileIds = new Set(
    [...blankFills.values()].filter(Boolean) as string[],
  );
  const assembled = assembleWord(letterSlots, blankFills, tileById);
  const allBlanksFilled = blankIndices.every((index) => blankFills.get(index));
  const isCorrect =
    assembled.toLowerCase() === correctWord.trim().toLowerCase();

  function handleTileTap(tile: ReviewClozeLetterTile) {
    if (locked || usedTileIds.has(tile.id)) return;
    const nextBlank = blankIndices.find((index) => !blankFills.get(index));
    if (nextBlank === undefined) return;

    const next = new Map(blankFills);
    next.set(nextBlank, tile.id);
    setBlankFills(next);

    const filledAll = blankIndices.every((index) => next.get(index));
    if (filledAll) {
      onComplete(assembleWord(letterSlots, next, tileById));
    }
  }

  function handleBlankTap(index: number) {
    if (locked || !letterSlots[index]?.blank) return;
    const tileId = blankFills.get(index);
    if (!tileId) return;

    const lastFilled = blankIndices.reduce<number>(
      (last, blankIndex) => (blankFills.get(blankIndex) ? blankIndex : last),
      -1,
    );
    if (index !== lastFilled) return;

    const next = new Map(blankFills);
    next.delete(index);
    setBlankFills(next);
  }

  return (
    <div className={`review-cloze ${displayFontClass}`}>
      <p className={`review-cloze__vi ${displayFontClass}`}>{sentenceVi}</p>

      <p className={`review-cloze__en ${displayFontClass}`}>
        {parts.map((part, index) =>
          part.isBlank ? (
            <span key={`blank-${index}`} className="review-cloze__slots">
              {prefixCount > 0 ? (
                <>
                  <span className="review-cloze__prefix" aria-hidden>
                    {letterSlots.slice(0, prefixCount).map((slot, slotIndex) => (
                      <span key={`prefix-${slotIndex}`} className="review-cloze__prefix-char">
                        {slot.char.toUpperCase()}
                      </span>
                    ))}
                  </span>
                  <span className="review-cloze__prefix-dash" aria-hidden>
                    –
                  </span>
                </>
              ) : null}
              {letterSlots
                .slice(prefixCount)
                .map((slot, tailIndex) =>
                  renderTailSlot(slot, tailIndex + prefixCount),
                )}
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

      {locked && !unsure && allBlanksFilled ? (
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
