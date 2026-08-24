"use client";

import Image from "next/image";
import { useWordImageSrc } from "@/lib/use-word-image-src";

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
  const { src, ready, onError } = useWordImageSrc(
    word,
    imageUrl,
    searchKeyword,
    wordType,
    { quizSafe, meaning },
  );

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      {ready && src ? (
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
          priority
          unoptimized
          onError={onError}
        />
      ) : null}
    </div>
  );
}
