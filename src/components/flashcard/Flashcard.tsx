"use client";

import {
  VocabWordCard,
  vocabWordToDiscoverData,
} from "@/components/discover/VocabWordCard";
import type { VocabWord } from "@/types/database";

type FlashcardProps = {
  word: VocabWord;
  isFlipped: boolean;
  onFlip: () => void;
};

export function Flashcard({ word, isFlipped, onFlip }: FlashcardProps) {
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFlip();
    }
  }

  return (
    <div className="flashcard-scene w-full">
      <div
        className={`flashcard-inner ${isFlipped ? "is-flipped" : ""}`}
        onClick={onFlip}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? "Show front" : "Show back"}
      >
        <div className="flashcard-face flashcard-front">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-surface">
            <VocabWordCard data={vocabWordToDiscoverData(word)} autoSpeak />
            <p className="px-5 pb-5 pt-2 text-center text-sm text-foreground/50">
              Tap to flip
            </p>
          </div>
        </div>

        <div className="flashcard-face flashcard-back">
          <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-surface">
            <VocabWordCard
              data={vocabWordToDiscoverData(word)}
              autoSpeak={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
