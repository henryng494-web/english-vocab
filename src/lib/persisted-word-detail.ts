import type { WordDetail } from "@/types/database";
import { hasQualityExamples } from "@/lib/example-quality";
import { isPlaceholderPhonetic } from "@/lib/phonetic";
import { parseExamples } from "@/lib/parse-examples";
import {
  isOutdatedSemanticImageUrl,
  isPlaceholderIllustrationUrl,
  isUntrustedRandomImageUrl,
} from "@/lib/unsplash";

/** True when a Supabase word_details row is safe to reuse without calling Gemini. */
export function isPersistedWordDetailComplete(
  detail: WordDetail | null | undefined,
  word: string,
): boolean {
  if (!detail) return false;
  if (detail.word.toLowerCase() !== word.toLowerCase()) return false;
  if (isPlaceholderPhonetic(word, detail.phonetic)) {
    return false;
  }
  if (!detail.vietnamese_meaning?.trim()) return false;
  if (!hasQualityExamples(word, parseExamples(detail.examples))) return false;
  const image = detail.image_url?.trim();
  if (!image) return false;
  if (isUntrustedRandomImageUrl(image)) return false;
  if (isOutdatedSemanticImageUrl(image)) return false;
  if (isPlaceholderIllustrationUrl(image)) return false;
  return true;
}
