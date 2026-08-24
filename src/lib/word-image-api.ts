import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import { createClient } from "@/lib/supabase/server";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { getFamilyHeadword } from "@/lib/word-family";
import {
  fetchWordImageUrlDetailed,
  isRealCardImageUrl,
  shouldRefreshImageUrl,
} from "@/lib/unsplash";
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
  const searchKeyword = resolveImageSearchKeyword(word, {
    searchKeyword: keywordParam,
    pos: posParam?.trim() || detail?.word_type,
    meaning,
    englishDefinition: detail?.english_definition,
  });
  const pos = posParam?.trim() || detail?.word_type || null;

  const stored = detail?.image_url?.trim();
  if (
    stored &&
    !shouldRefreshImageUrl(stored, word) &&
    isRealCardImageUrl(stored, word)
  ) {
    return stored;
  }

  const resolved = await fetchWordImageUrlDetailed(
    word,
    searchKeyword,
    pos,
    meaning,
  );
  const imageUrl = isRealCardImageUrl(resolved.imageUrl, word)
    ? resolved.imageUrl
    : null;
  const persistedKeyword = resolved.searchKeyword ?? searchKeyword;

  if (imageUrl && (imageUrl !== stored || persistedKeyword)) {
    try {
      await supabase
        .from("word_details")
        .update({
          image_url: imageUrl,
          search_keyword: persistedKeyword,
        })
        .eq("word", word);
    } catch {
      /* best-effort persist */
    }
  }

  return imageUrl;
}
