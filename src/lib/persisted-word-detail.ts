import type { WordDetail } from "@/types/database";
import { hasQualityExamples } from "@/lib/example-quality";
import { isPlaceholderPhonetic } from "@/lib/phonetic";
import { parseExamples } from "@/lib/parse-examples";
import { containsForeignScript } from "@/lib/sanitize-vi";
import { hasAcceptableWordImage } from "@/lib/unsplash";
import { normalizeWordType } from "@/lib/word-type";

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
  if (!normalizeWordType(detail.word_type, word)) return false;
  if (!detail.vietnamese_meaning?.trim()) return false;
  if (containsForeignScript(detail.vietnamese_meaning)) return false;
  if (!hasQualityExamples(word, parseExamples(detail.examples), detail.word_type)) return false;
  if (!hasAcceptableWordImage(detail.image_url, word)) return false;
  return true;
}
