import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import { createClient } from "@/lib/supabase/server";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { getFamilyHeadword } from "@/lib/word-family";
import {
  errWordImageResult,
  okWordImageResult,
  WORD_IMAGE_SOURCES,
  type WordImageResult,
} from "@/lib/word-image-result";
import {
  fetchWordImageUrlDetailed,
  finalizeWordImageDisplayUrl,
  getDefaultLearningImageDataUrl,
  isPersistableWordImageUrl,
  isRealCardImageUrl,
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

function placeholderResult(
  word: string,
  pos?: string | null,
  source = WORD_IMAGE_SOURCES.ERROR,
): WordImageResult {
  return errWordImageResult(
    getDefaultLearningImageDataUrl(word, pos),
    source,
  );
}

/** Resolve one stock photo — shared by single and batch word-image APIs. */
export async function resolveWordImageForApi(
  rawWord: string,
  keywordParam?: string | null,
  posParam?: string | null,
  meaningParam?: string | null,
): Promise<WordImageResult> {
  const word = normalizeVocabInput(rawWord);
  const posEarly = posParam?.trim() || null;
  if (!word) {
    return placeholderResult("word", posEarly);
  }
  if (
    isExcludedVocabWord(word) ||
    isExcludedVocabWord(getFamilyHeadword(word))
  ) {
    return placeholderResult(word, posEarly, WORD_IMAGE_SOURCES.ERROR);
  }

  try {
    const supabase = await createClient();
    const { data: detail, error: dbError } = await supabase
      .from("word_details")
      .select("image_url, word_type, vietnamese_meaning, english_definition")
      .eq("word", word)
      .maybeSingle();

    if (dbError) {
      console.warn(
        `[word-image-api] DB read failed for "${word}":`,
        dbError.message,
      );
    }

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
      return okWordImageResult(stored, WORD_IMAGE_SOURCES.STORED, searchKeyword);
    }

    let resolved: WordImageResult;
    try {
      resolved = await fetchWordImageUrlDetailed(
        word,
        searchKeyword,
        pos,
        meaning,
        englishDefinition,
        stored,
      );
    } catch (error) {
      console.warn(
        `[word-image-api] Pipeline failed for "${word}":`,
        error instanceof Error ? error.message : error,
      );
      return placeholderResult(word, pos);
    }

    const imageUrl = finalizeWordImageDisplayUrl(
      resolved.url,
      stored,
      word,
      pos,
    );
    const result = okWordImageResult(
      imageUrl,
      resolved.source,
      resolved.searchKeyword ?? searchKeyword,
    );
    if (resolved.error && result.source === WORD_IMAGE_SOURCES.SVG_PLACEHOLDER) {
      result.error = true;
    }

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
      return result;
    }

    if (
      imageUrl &&
      isPersistableWordImageUrl(imageUrl, word) &&
      imageUrl !== stored
    ) {
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

    return result;
  } catch (error) {
    console.warn(
      `[word-image-api] Unexpected failure for "${word}":`,
      error instanceof Error ? error.message : error,
    );
    return placeholderResult(word, posEarly);
  }
}
