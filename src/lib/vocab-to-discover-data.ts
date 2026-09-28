import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { resolveWordRegister } from "@/lib/word-meanings";
import type { VocabWord } from "@/types/database";

export function vocabWordToDiscoverData(word: VocabWord): DiscoverWordData {
  return {
    word: word.word,
    rank: word.rank,
    importance_tier: word.importance_tier,
    phonetic: word.phonetic,
    word_type: word.word_type,
    vietnamese_meaning: word.vietnamese_meaning,
    english_definition: word.english_definition,
    examples: word.examples,
    meanings: word.meanings,
    example_translations: word.example_translations,
    phrase_translations: word.phrase_translations,
    image_url: word.image_url,
    collocations: word.collocations,
    register: resolveWordRegister(word),
    search_keyword: word.search_keyword,
    word_family: word.word_family,
    similar_words: word.similar_words,
  };
}
