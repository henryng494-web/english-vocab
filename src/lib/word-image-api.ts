import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import { createClient } from "@/lib/supabase/server";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { getFamilyHeadword } from "@/lib/word-family";
import {
  fetchWordImageUrlDetailed,
  finalizeWordImageDisplayUrl,
  isPersistableWordImageUrl,
  isRealCardImageUrl,
  isUsableCardImageUrl,
  shouldRefreshImageUrl,
} from "@/lib/unsplash";
import { isApprovedFunctionWordStockUrl } from "@/lib/function-word-images";
import { isClosedClassWord } from "@/lib/word-image-strategy";
import { normalizeVocabInput } from "@/lib/word-validation";

export type WordImageLookupInput = {
  word: string;
  keyword?: string | null;
  pos?: string | null;
  meaning?: string | null;
};

/** Resolve one stock photo URL — shared by single and batch word-image APIs. */
export async function resolveWordImageForApi(
  rawWord: string,
  keywordParam?: string | null,
  posParam?: string | null,
  meaningParam?: string | null,
): Promise<string | null> {
  const word = normalizeVocabInput(rawWord);
  if (!word) return null;
  if (
    isExcludedVocabWord(word) ||
    isExcludedVocabWord(getFamilyHeadword(word))
  ) {
    return null;
  }

  const supabase = await createClient();
  const { data: detail } = await supabase
    .from("word_details")
    .select("image_url, word_type, vietnamese_meaning, english_definition")
    .eq("word", word)
    .maybeSingle();

  const meaning =
    meaningParam?.trim() || detail?.vietnamese_meaning?.trim() || null;
  const englishDefinition = detail?.english_definition?.trim() || null;
  const searchKeyword = resolveImageSearchKeyword(word, {
    searchKeyword: keywordParam,
    pos: posParam?.trim() || detail?.word_type,
    meaning,
    englishDefinition,
  });
  const pos = posParam?.trim() || detail?.word_type || null;

  const stored = detail?.image_url?.trim();
  if (
    stored &&
    isRealCardImageUrl(stored, word) &&
    !shouldRefreshImageUrl(stored, word, pos)
  ) {
    return stored;
  }

  const resolved = await fetchWordImageUrlDetailed(
    word,
    searchKeyword,
    pos,
    meaning,
    englishDefinition,
    stored,
  );
  const imageUrl = finalizeWordImageDisplayUrl(
    resolved.imageUrl,
    stored,
    word,
    pos,
  );

  if (isClosedClassWord(word, pos)) {
    if (isApprovedFunctionWordStockUrl(imageUrl, word)) {
      if (imageUrl !== stored) {
        const { error } = await supabase
          .from("word_details")
          .update({ image_url: imageUrl })
          .eq("word", word);
        if (error) {
          console.warn(
            `[word-image-api] Failed to persist image_url for "${word}":`,
            error.message,
          );
        }
      }
    } else if (stored && isPersistableWordImageUrl(stored, word)) {
      const { error } = await supabase
        .from("word_details")
        .update({ image_url: null })
        .eq("word", word);
      if (error) {
        console.warn(
          `[word-image-api] Failed to clear stale image_url for "${word}":`,
          error.message,
        );
      }
    }
    return imageUrl;
  }

  if (imageUrl && isPersistableWordImageUrl(imageUrl, word) && imageUrl !== stored) {
    const { error } = await supabase
      .from("word_details")
      .update({ image_url: imageUrl })
      .eq("word", word);
    if (error) {
      console.warn(
        `[word-image-api] Failed to persist image_url for "${word}":`,
        error.message,
      );
    }
  }

  return isUsableCardImageUrl(imageUrl, word, pos) ? imageUrl : null;
}
