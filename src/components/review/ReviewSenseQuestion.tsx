"use client";

import { SpeakButton } from "@/components/flashcard/SpeakButton";
import { ReviewWordImage } from "@/components/review/ReviewWordImage";
import { displayFontClass } from "@/lib/fonts";
import { capitalizeFirst } from "@/lib/format-text";
import type { ReviewChoice } from "@/lib/review-quiz";

type ReviewSenseQuestionProps = {
  word: string;
  choices: ReviewChoice[];
  selectedKey: string | null;
  unsure: boolean;
  correctWord: string;
  locked: boolean;
  onChoose: (choice: ReviewChoice) => void;
  onUnsure: () => void;
};

export function ReviewSenseQuestion({
  word,
  choices,
  selectedKey,
  unsure,
  correctWord,
  locked,
  onChoose,
  onUnsure,
}: ReviewSenseQuestionProps) {
  const correct = correctWord.trim().toLowerCase();

  return (
    <div className={`review-sense ${displayFontClass}`}>
      <div className="review-sense__prompt">
        <h2 className={`review-sense__word ${displayFontClass}`}>
          {capitalizeFirst(word)}
        </h2>
        <SpeakButton text={word} variant="dark" iconOnly />
      </div>

      <div className="review-sense__list">
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
              className={`review-sense__choice${state}`}
              disabled={locked}
              onClick={() => onChoose(choice)}
            >
              <span className="review-sense__thumb">
                <span className={`review-sense__letter ${displayFontClass}`}>
                  {choice.letter}
                </span>
                <ReviewWordImage
                  word={choice.word}
                  imageUrl={choice.imageUrl}
                  wordType={choice.wordType}
                  className="review-sense__photo"
                />
              </span>
              <span className={`review-sense__meaning ${displayFontClass}`}>
                {choice.meaning}
              </span>
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
        Not Sure?
      </button>
    </div>
  );
}
