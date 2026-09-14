"use client";

import { displayFontClass } from "@/lib/fonts";
import { useI18n } from "@/hooks/use-i18n";
import { capitalizeFirst } from "@/lib/format-text";
import type { ReviewChoice, ReviewClozePart } from "@/lib/review-quiz";

type ReviewClozeQuestionProps = {
  sentenceVi: string;
  parts: ReviewClozePart[];
  tiles: ReviewChoice[];
  selectedKey: string | null;
  unsure: boolean;
  correctWord: string;
  locked: boolean;
  onChoose: (choice: ReviewChoice) => void;
  onUnsure: () => void;
};

export function ReviewClozeQuestion({
  sentenceVi,
  parts,
  tiles,
  selectedKey,
  unsure,
  correctWord,
  locked,
  onChoose,
  onUnsure,
}: ReviewClozeQuestionProps) {
  const { t } = useI18n();
  const correct = correctWord.trim().toLowerCase();
  const selected = tiles.find((tile) => tile.key === selectedKey) ?? null;

  return (
    <div className={`review-cloze ${displayFontClass}`}>
      <p className={`review-cloze__vi ${displayFontClass}`}>{sentenceVi}</p>

      <p className={`review-cloze__en ${displayFontClass}`}>
        {parts.map((part, index) =>
          part.isBlank ? (
            <span
              key={`blank-${index}`}
              className={`review-cloze__blank${
                locked && selected
                  ? selected.word.trim().toLowerCase() === correct
                    ? " is-correct"
                    : " is-wrong"
                  : selected
                    ? " is-filled"
                    : ""
              }`}
            >
              {selected ? capitalizeFirst(selected.word) : "_____"}
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
        {tiles.map((tile) => {
          const isSelected = selectedKey === tile.key;
          const isCorrect = tile.word.trim().toLowerCase() === correct;
          let state = "";
          if (locked) {
            if (isCorrect) state = " is-correct";
            else if (isSelected) state = " is-wrong";
            else state = " is-dim";
          } else if (isSelected) {
            state = " is-active";
          }
          return (
            <button
              key={tile.key}
              type="button"
              className={`review-cloze__tile${state}`}
              disabled={locked || isSelected}
              onClick={() => onChoose(tile)}
            >
              {capitalizeFirst(tile.word)}
            </button>
          );
        })}
      </div>

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
