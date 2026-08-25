"use client";

import { WordImage } from "@/components/word/WordImage";

export function ReviewWordImage({
  word,
  imageUrl,
  searchKeyword,
  wordType,
  meaning,
  className,
  quizSafe = false,
}: {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  className?: string;
  /** When true, never show the SVG placeholder (it can spell the answer). */
  quizSafe?: boolean;
}) {
  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <WordImage
        word={word}
        imageUrl={imageUrl}
        searchKeyword={searchKeyword}
        wordType={wordType}
        meaning={meaning}
        alt=""
        quizSafe={quizSafe}
        priority
      />
    </div>
  );
}
