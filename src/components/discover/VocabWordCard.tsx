"use client";

import {
  DiscoverCard,
  type DiscoverWordData,
} from "@/components/discover/DiscoverCard";
import { vocabWordToDiscoverData } from "@/lib/vocab-to-discover-data";
import type { VocabWord } from "@/types/database";

export { vocabWordToDiscoverData };

type VocabWordCardProps = {
  data: DiscoverWordData;
  loading?: boolean;
  /** e.g. "8 / 163" — shown on the image top-right. */
  imageBadge?: string;
  className?: string;
  autoSpeak?: boolean;
  hintGraceMs?: number;
};

/** Standard vocabulary card shell used across Journey, Review, and Word detail. */
export function VocabWordCard({
  data,
  loading,
  imageBadge,
  className,
  autoSpeak = true,
  hintGraceMs,
}: VocabWordCardProps) {
  return (
    <div className={`journey-card-slot${className ? ` ${className}` : ""}`}>
      <DiscoverCard
        data={data}
        loading={loading}
        imageBadge={imageBadge}
        autoSpeak={autoSpeak}
        hintGraceMs={hintGraceMs}
      />
    </div>
  );
}
