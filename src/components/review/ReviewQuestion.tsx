"use client";

import { ReviewWordImage } from "@/components/review/ReviewWordImage";
import { displayFontClass } from "@/lib/fonts";
import { useI18n } from "@/hooks/use-i18n";
import type { ReviewChoice } from "@/lib/review-quiz";

type ReviewQuestionProps = {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  clue: string;
  choices: ReviewChoice[];
  selectedKey: string | null;
  unsure: boolean;
  correctWord: string;
  locked: boolean;
  onChoose: (choice: ReviewChoice) => void;
  onUnsure: () => void;
};

export function ReviewQuestion({
  word,
  imageUrl,
  searchKeyword,
  wordType,
  meaning,
  clue,
  choices,
  selectedKey,
  unsure,
  correctWord,
  locked,
  onChoose,
  onUnsure,
}: ReviewQuestionProps) {
  const { t } = useI18n();
  const correct = correctWord.trim().toLowerCase();

  return (
    <div className={`review-quiz ${displayFontClass}`}>
      <ReviewWordImage
        word={word}
        imageUrl={imageUrl}
        searchKeyword={searchKeyword}
        wordType={wordType}
        meaning={meaning}
        className="review-quiz__image"
        quizSafe
      />

      <p className={`review-quiz__clue ${displayFontClass}`}>{clue}</p>

      <div className="review-quiz__grid">
        {choices.map((choice) => {
          const isCorrect = choice.word.trim().toLowerCase() === correct;
          const isSelected = selectedKey === choice.key;
          let state = "";
          if (locked) {
            if (isCorrect) state = " is-correct";
            else if (isSelected) state = " is-wrong";
            else state = " is-dim";
          }
          return (
            <button
              key={choice.key}
              type="button"
              className={`review-quiz__choice${state}`}
              disabled={locked}
              onClick={() => onChoose(choice)}
            >
              <span className={`review-quiz__letter ${displayFontClass}`}>{choice.letter}</span>
              <span className={`review-quiz__word ${displayFontClass}`}>{choice.word}</span>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        className={`review-quiz__unsure${unsure ? " is-active" : ""} ${displayFontClass}`}
        disabled={locked}
        onClick={onUnsure}
      >
        {t("review.notSure")}
      </button>
    </div>
  );
}
