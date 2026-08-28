"use client";

import { parseExamples } from "@/lib/parse-examples";
import { resolveWordRegister } from "@/lib/word-meanings";
import { WordImage } from "@/components/word/WordImage";
import type { VocabWord } from "@/types/database";
import { WordCardHeader } from "./WordCardHeader";
import { VocabExampleList } from "./VocabExampleList";

type FlashcardProps = {
  word: VocabWord;
  isFlipped: boolean;
  onFlip: () => void;
};

function FlashcardImage({ word }: { word: VocabWord }) {
  return (
    <div className="relative h-44 w-full shrink-0 bg-gradient-to-br from-primary-100 via-primary to-primary-hover">
      <WordImage
        word={word.word}
        imageUrl={word.image_url}
        searchKeyword={word.search_keyword}
        wordType={word.word_type}
        meaning={word.vietnamese_meaning}
        priority
      />
    </div>
  );
}

function FlashcardBody({
  word,
  showDetails,
}: {
  word: VocabWord;
  showDetails: boolean;
}) {
  const examples = showDetails ? parseExamples(word.examples) : [];
  const register = resolveWordRegister(word);

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5 pt-4">
      <WordCardHeader
        word={word.word}
        phonetic={word.phonetic}
        wordType={word.word_type}
        meanings={word.vietnamese_meaning}
        register={register}
      />

      {showDetails ? (
        <div className="mt-4">
          <VocabExampleList
            word={word.word}
            examples={examples}
            wordType={word.word_type}
            boxed
          />
        </div>
      ) : (
        <p className="mt-6 text-center text-sm text-foreground/50">Tap to flip</p>
      )}
    </div>
  );
}

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
          <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-surface">
            <FlashcardImage word={word} />
            <FlashcardBody word={word} showDetails={false} />
          </div>
        </div>

        <div className="flashcard-face flashcard-back">
          <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-surface">
            <FlashcardImage word={word} />
            <FlashcardBody word={word} showDetails={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
