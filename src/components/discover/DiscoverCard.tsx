"use client";

import { WordCardHeader } from "@/components/flashcard/WordCardHeader";
import { WordCardDetails } from "@/components/flashcard/WordCardDetails";
import { WordImage } from "@/components/word/WordImage";
import { displayPhonetic } from "@/lib/phonetic";
import { useAppSettings } from "@/context/AppSettingsContext";
import { isCardContentReady } from "@/lib/discover-word-cache";
import type { WordFamilyMember } from "@/types/database";
import type { WordRegister } from "@/lib/word-meanings";
import { resolveWordRegister } from "@/lib/word-meanings";
import { buildWordFamilyEntries } from "@/lib/word-family-display";
import { englishOnlyExamplesSerialized } from "@/lib/multilang-word-record";
import { resolveWordDisplay } from "@/lib/word-display";
import { useEffect, useMemo, useState } from "react";
import { ensureLearnerExampleTranslations } from "@/lib/ensure-learner-example-translations";

export type DiscoverWordData = {
  word: string;
  rank: number;
  importance_tier: string;
  phonetic?: string | null;
  word_type?: string | null;
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
  examples?: string | null;
  image_url?: string | null;
  collocations?: string | null;
  register?: WordRegister | null;
  search_keyword?: string | null;
  word_family?: WordFamilyMember[] | null;
  family_members?: string[] | null;
  similar_words?: string[] | null;
  meanings?: import("@/types/word-content").LocalizedMeaningsJson | null;
  example_translations?:
    | import("@/types/word-content").ExampleTranslationsJson
    | null;
};

type DiscoverCardProps = {
  data: DiscoverWordData;
  loading?: boolean;
  /** e.g. "2 / 194" — shown on the image top-right. */
  imageBadge?: string;
  autoSpeak?: boolean;
  hintGraceMs?: number;
};

function CardImage({
  word,
  imageUrl,
  searchKeyword,
  wordType,
  meaning,
  badge,
}: {
  word: string;
  imageUrl?: string | null;
  searchKeyword?: string | null;
  wordType?: string | null;
  meaning?: string | null;
  badge?: string;
}) {
  return (
    <div className="card-image-frame relative h-full min-h-0 w-full">
      <WordImage
        word={word}
        imageUrl={imageUrl}
        searchKeyword={searchKeyword}
        wordType={wordType}
        meaning={meaning}
        priority
      />
      {badge ? (
        <span className="card-image-badge" aria-label={`Word ${badge}`}>
          {badge}
        </span>
      ) : null}
    </div>
  );
}

export function DiscoverCard({
  data,
  loading,
  imageBadge,
  autoSpeak = true,
  hintGraceMs,
}: DiscoverCardProps) {
  const { learnerLocale, userLanguage } = useAppSettings();
  const [cardData, setCardData] = useState(data);
  useEffect(() => {
    setCardData(data);
  }, [data]);
  useEffect(() => {
    void ensureLearnerExampleTranslations(data, userLanguage).then((fresh) => {
      if (fresh) setCardData(fresh);
    });
  }, [data, userLanguage]);
  const display = useMemo(
    () => resolveWordDisplay(cardData, userLanguage),
    [cardData, userLanguage],
  );
  const examplesEnOnly = useMemo(
    () => englishOnlyExamplesSerialized(cardData.examples) ?? cardData.examples,
    [cardData.examples],
  );
  const detailsLoading =
    loading && !isCardContentReady(cardData, cardData.word, learnerLocale);
  const phonetic = displayPhonetic(cardData.word, cardData.phonetic);
  const register = resolveWordRegister(cardData);
  const glossForFamily = display.primaryMeaning ?? cardData.vietnamese_meaning;
  const wordFamily =
    cardData.word_family && cardData.word_family.length > 0
      ? cardData.word_family
      : buildWordFamilyEntries(
          cardData.word,
          glossForFamily,
          cardData.word_type,
        );

  return (
    <div className="discover-card discover-card--compact grid h-full min-h-0 w-full overflow-hidden rounded-2xl border-2 shadow-lg">
      <CardImage
        word={cardData.word}
        imageUrl={cardData.image_url}
        searchKeyword={cardData.search_keyword}
        wordType={cardData.word_type}
        meaning={display.primaryMeaning}
        badge={imageBadge}
      />

      <div className="discover-card__body discover-card__body--compact flex min-h-0 flex-col overflow-hidden p-3">
        <WordCardHeader
          word={cardData.word}
          phonetic={phonetic}
          wordType={cardData.word_type}
          meanings={display.primaryMeaning}
          register={register}
          loadingPhonetic={detailsLoading && !phonetic}
          autoSpeak={autoSpeak}
        />

        <WordCardDetails
          key={`${cardData.word.trim().toLowerCase()}:${userLanguage}`}
          word={cardData.word}
          examples={examplesEnOnly}
          wordType={cardData.word_type}
          meaning={display.primaryMeaning}
          userLanguage={userLanguage}
          register={register}
          englishDefinition={cardData.english_definition}
          meanings={cardData.meanings}
          example_translations={cardData.example_translations}
          family={wordFamily}
          similarWords={cardData.similar_words}
          loading={detailsLoading}
          hintGraceMs={hintGraceMs}
        />
      </div>
    </div>
  );
}
