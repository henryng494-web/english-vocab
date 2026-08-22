"use client";

import Image from "next/image";
import { useWordImageSrc } from "@/lib/use-word-image-src";

export function ReviewWordImage({
  word,
  imageUrl,
  wordType,
  className,
}: {
  word: string;
  imageUrl?: string | null;
  wordType?: string | null;
  className?: string;
}) {
  const { src, onError } = useWordImageSrc(word, imageUrl, undefined, wordType);

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
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
    </div>
  );
}
