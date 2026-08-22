"use client";

import Image from "next/image";
import { capitalizeFirst } from "@/lib/format-text";
import { parseExamples } from "@/lib/parse-examples";
import { useWordImageSrc } from "@/lib/use-word-image-src";
import type { VocabWord } from "@/types/database";
import { WordCardHeader } from "./WordCardHeader";
import { VocabExampleList } from "./VocabExampleList";

type FlashcardProps = {
  word: VocabWord;
  isFlipped: boolean;
  onFlip: () => void;
};

function FlashcardImage({ word }: { word: VocabWord }) {
  const { src, onError } = useWordImageSrc(
    word.word,
    word.image_url,
    undefined,
    word.word_type,
  );

  return (
    <div className="relative h-44 w-full shrink-0 bg-gradient-to-br from-primary-100 via-primary to-primary-hover">
      <Image
        src={src}
        alt={word.word}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 400px"
        priority
        unoptimized
        onError={onError}
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

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5 pt-4">
      <WordCardHeader
        word={word.word}
        phonetic={word.phonetic}
        wordType={word.word_type}
      />

      {showDetails ? (
        <div className="mt-4 space-y-3">
          {word.vietnamese_meaning && (
            <p className="text-xl font-semibold text-primary-700">
              {capitalizeFirst(word.vietnamese_meaning)}
            </p>
          )}

          <VocabExampleList
            word={word.word}
            examples={examples}
            wordType={word.word_type}
            meaning={word.vietnamese_meaning}
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
