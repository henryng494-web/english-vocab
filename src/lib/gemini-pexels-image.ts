/** @deprecated Use `@/lib/gemini-unsplash-image` — stock source is now Unsplash. */
export {
  fetchVocabIllustrationImage,
  fetchVocabIllustrationImageOrNull,
  generateStockSearchPhraseWithGemini,
  fetchUnsplashImageUrl,
  type VocabIllustrationInput,
  type VocabIllustrationResult,
} from "@/lib/gemini-unsplash-image";

import { fetchUnsplashImageUrl } from "@/lib/gemini-unsplash-image";

/** @deprecated Use fetchUnsplashImageUrl(word, searchPhrase) instead. */
export async function fetchPexelsImageUrl(
  searchPhrase: string,
  word = "vocabulary",
): Promise<string | null> {
  return fetchUnsplashImageUrl(word, searchPhrase);
}
