"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  getDefaultLearningImageDataUrl,
  resolveWordImageUrl,
} from "@/lib/unsplash";

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
  const primarySrc = resolveWordImageUrl(word, imageUrl, undefined, wordType);
  const finalSrc = getDefaultLearningImageDataUrl(word, wordType);
  const [src, setSrc] = useState(primarySrc);

  useEffect(() => {
    setSrc(resolveWordImageUrl(word, imageUrl, undefined, wordType));
  }, [word, imageUrl, wordType]);

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
        onError={() => {
          if (src !== finalSrc) setSrc(finalSrc);
        }}
      />
    </div>
  );
}
