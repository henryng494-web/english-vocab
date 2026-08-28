"use client";

import { useAutoSpeakWord } from "@/hooks/use-auto-speak-word";
import { capitalizeFirst } from "@/lib/format-text";
import { normalizeWordType } from "@/lib/word-type";
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
  useAutoSpeakWord(word);
  const wordTypeLabel = normalizeWordType(wordType, word);

  return (
    <div className="flex w-full flex-wrap items-center gap-x-3 gap-y-2">
      <h2 className="min-w-0 break-words border-b border-primary-200 pb-1 text-4xl font-bold tracking-tight text-foreground">
        {capitalizeFirst(word)}
      </h2>

      <div className="ml-auto flex flex-wrap items-center justify-end gap-2">
        <SpeakButton text={word} variant="light" iconOnly />

        {phonetic ? (
          <span className="text-lg text-foreground/60">{phonetic}</span>
        ) : loadingPhonetic ? (
          <span
            className="h-5 w-16 animate-pulse rounded bg-primary-50"
            aria-hidden
          />
        ) : null}

        {wordTypeLabel && (
          <span className="word-type-badge rounded-full bg-primary-50 px-3 py-1 text-sm font-medium text-primary-800">
            {capitalizeFirst(wordTypeLabel)}
          </span>
        )}
      </div>
    </div>
  );
}
