import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { prefetchCardSimilarWords } from "@/lib/card-similar-prefetch";
import { prefetchLearningChunkContent } from "@/lib/learning-chunk-prefetch";

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
  void prefetchLearningChunkContent(data);
  void prefetchCardSimilarWords({
    word: data.word,
    preset: data.similar_words,
    wordType: data.word_type,
    meaning: data.vietnamese_meaning,
    englishDefinition: data.english_definition,
  });
}
