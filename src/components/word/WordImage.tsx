"use client";

import Image from "next/image";
import { useWordImageSrc } from "@/lib/use-word-image-src";

export type WordImageProps = {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  alt?: string;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  /** When true, hide SVG placeholders until a real photo loads (review quizzes). */
  quizSafe?: boolean;
};

/**
 * Shared learning-card image with guaranteed placeholder fallback and onError recovery.
 */
export function WordImage({
  word,
  imageUrl,
  searchKeyword,
  wordType,
  meaning,
  alt,
  className = "object-cover",
  fill = true,
  width,
  height,
  sizes = "(max-width: 768px) 100vw, 400px",
  priority = false,
  quizSafe = false,
}: WordImageProps) {
  const { src, ready, onError } = useWordImageSrc(
    word,
    imageUrl,
    searchKeyword,
    wordType,
    { quizSafe, meaning },
  );

  if (quizSafe && (!ready || !src)) {
    return null;
  }

  return (
    <Image
      src={src}
      alt={alt ?? word}
      fill={fill && width == null && height == null}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      unoptimized
      onError={onError}
    />
  );
}
