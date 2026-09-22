import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { prefetchCardSimilarWords } from "@/lib/card-similar-prefetch";
import { ensureLearnerExampleTranslations } from "@/lib/ensure-learner-example-translations";
import { prefetchLearningChunkContent } from "@/lib/learning-chunk-prefetch";
import { readAppSettings } from "@/lib/app-settings";

type CardPrefetchInput = Pick<
  DiscoverWordData,
  | "word"
  | "word_type"
  | "vietnamese_meaning"
  | "english_definition"
  | "examples"
  | "register"
  | "collocations"
  | "similar_words"
>;

/** Warm Goes-with, phrase, and Family-tab caches before a card opens. */
export function prefetchCardContent(
  data: CardPrefetchInput | null | undefined,
): void {
  if (!data?.word?.trim()) return;
  const locale = readAppSettings().learnerLocale;
  void ensureLearnerExampleTranslations(
    {
      word: data.word,
      rank: 0,
      importance_tier: "",
      examples: data.examples,
      vietnamese_meaning: data.vietnamese_meaning,
      english_definition: data.english_definition,
      word_type: data.word_type,
      phonetic: null,
    },
    locale,
  );
  void prefetchLearningChunkContent(data);
  void prefetchCardSimilarWords({
    word: data.word,
    preset: data.similar_words,
    wordType: data.word_type,
    meaning: data.vietnamese_meaning,
    englishDefinition: data.english_definition,
  });
}
