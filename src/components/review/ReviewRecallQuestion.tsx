"use client";

import { ReviewWordImage } from "@/components/review/ReviewWordImage";
import { displayFontClass } from "@/lib/fonts";
import { splitSentenceAroundWord } from "@/lib/review-quiz";

type ReviewRecallQuestionProps = {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  sentence: string;
  locked: boolean;
  remembered: boolean | null;
  onLookUp: () => void;
  onRemember: () => void;
};

export function ReviewRecallQuestion({
  word,
  imageUrl,
  searchKeyword,
  wordType,
  meaning,
  sentence,
  locked,
  remembered,
  onLookUp,
  onRemember,
}: ReviewRecallQuestionProps) {
  const parts = splitSentenceAroundWord(sentence, word);

  return (
    <div className={`review-recall ${displayFontClass}`}>
      <ReviewWordImage
        word={word}
        imageUrl={imageUrl}
        searchKeyword={searchKeyword}
        wordType={wordType}
        meaning={meaning}
        className="review-recall__image"
        quizSafe
      />

      <p className={`review-recall__sentence ${displayFontClass}`}>
        {parts.length > 0
          ? parts.map((part, index) =>
              part.highlight ? (
                <span key={`${part.text}-${index}`} className="review-recall__word">
                  {part.text}
                </span>
              ) : (
                <span key={`${part.text}-${index}`}>{part.text}</span>
              ),
            )
          : "Do you remember this word?"}
      </p>

      <div className="review-recall__actions">
        <button
          type="button"
          className={`review-recall__btn${
            locked && remembered === false ? " is-active" : ""
          }`}
          disabled={locked}
          onClick={onLookUp}
        >
          Look Up
        </button>
        <button
          type="button"
          className={`review-recall__btn review-recall__btn--remember${
            locked && remembered === true ? " is-correct" : ""
          }`}
          disabled={locked}
          onClick={onRemember}
        >
          I Remember
        </button>
      </div>
    </div>
  );
}
