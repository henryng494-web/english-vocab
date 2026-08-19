"use client";

import { capitalizeFirst } from "@/lib/format-text";
import { wordTypeLabelVi } from "@/lib/word-type";
import { SpeakButton } from "./SpeakButton";

type WordCardHeaderProps = {
  word: string;
  phonetic?: string | null;
  wordType?: string | null;
  loadingPhonetic?: boolean;
};

export function WordCardHeader({
  word,
  phonetic,
  wordType,
  loadingPhonetic,
}: WordCardHeaderProps) {
  const wordTypeVi = wordTypeLabelVi(wordType, word);

  return (
    <div className="flex items-center justify-between gap-3">
      <h2
        className="shrink-0 border-b border-primary-200 pb-1 text-3xl font-bold tracking-tight text-foreground"
      >
        {capitalizeFirst(word)}
      </h2>

      <div className="flex shrink-0 items-center gap-2">
        <SpeakButton text={word} variant="light" iconOnly />

        {phonetic ? (
          <span className="text-base text-foreground/60">{phonetic}</span>
        ) : loadingPhonetic ? (
          <span
            className="h-5 w-16 animate-pulse rounded bg-primary-50"
            aria-hidden
          />
        ) : null}

        {wordTypeVi && (
          <span className="rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-800">
            {wordTypeVi}
          </span>
        )}
      </div>
    </div>
  );
}
