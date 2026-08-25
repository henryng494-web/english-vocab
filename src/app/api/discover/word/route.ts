import { hasQualityStandardVocab, getStandardSearchKeyword } from "@/data/standard-vocab";
import { getPresetRank } from "@/data/preset-word-details";
import { createClient } from "@/lib/supabase/server";
import { enrichmentToDiscoverWord } from "@/lib/enrichment-helpers";
import { enrichWord } from "@/lib/enrich-word";
import {
  ensureExamples,
  fillExampleTranslations,
} from "@/lib/example-fallback";
import { hasQualityExamples } from "@/lib/example-quality";
import { isPersistedWordDetailComplete } from "@/lib/persisted-word-detail";
import { generatePhoneticWithGemini } from "@/lib/gemini-core";
import { isPlaceholderPhonetic, formatIpa } from "@/lib/phonetic";
import { parseExamples, serializeExamples } from "@/lib/parse-examples";
import { getImportanceTier } from "@/lib/word-rank";
import { withWordFamily } from "@/lib/word-family-display";
import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import {
  fetchWordImageUrl,
  isRealCardImageUrl,
  shouldRefreshImageUrl,
} from "@/lib/unsplash";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";
import { normalizeVocabInput } from "@/lib/word-validation";
import { getFamilyHeadword } from "@/lib/word-family";
import type { WordDetail } from "@/types/database";
import { NextResponse } from "next/server";

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown error";
}

async function resolveImageUrl(
  word: string,
  _existingUrl?: string | null,
  searchKeyword?: string | null,
  pos?: string | null,
  meaning?: string | null,
  englishDefinition?: string | null,
): Promise<string> {
  void _existingUrl;
  return fetchWordImageUrl(
    word,
    searchKeyword ?? word,
    pos,
    meaning,
    englishDefinition,
  );
}

function imageSearchKeyword(
  word: string,
  pos?: string | null,
  meaning?: string | null,
  englishDefinition?: string | null,
): string {
  return resolveImageSearchKeyword(word, {
    searchKeyword: getStandardSearchKeyword(word),
    pos,
    meaning,
    englishDefinition,
  });
}

function persistedDetailToDiscoverWord(
  word: string,
  detail: WordDetail,
  rank: number,
  imageUrl: string,
  searchKeyword: string,
) {
  return withWordFamily({
    word,
    phonetic: detail.phonetic,
    word_type: detail.word_type,
    vietnamese_meaning: sanitizeVietnameseText(detail.vietnamese_meaning),
    english_definition: detail.english_definition,
    examples: detail.examples,
    collocations: detail.collocations,
    image_url: imageUrl,
    rank,
    importance_tier: getImportanceTier(rank),
    from_fallback: false,
    from_static: false,
    from_cache: true,
    source: "database" as const,
    search_keyword: searchKeyword,
  });
}

/** Self-heal: persist a freshly regenerated image URL so it's fixed for good. */
async function persistImageUrlIfChanged(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  previousUrl: string | null | undefined,
  resolvedUrl: string,
): Promise<void> {
  if (!isRealCardImageUrl(resolvedUrl, word)) return;
  if (previousUrl?.trim() === resolvedUrl) return;
  const { error } = await supabase
    .from("word_details")
    .update({ image_url: resolvedUrl })
    .eq("word", word);
  if (error) {
    console.warn(`Failed to persist refreshed image_url for "${word}":`, error.message);
  }
}

async function repairExamplesIfNeeded(
  word: string,
  examples: string | null | undefined,
  wordType?: string | null,
  meaning?: string | null,
): Promise<string> {
  const parsed = parseExamples(examples);
  if (hasQualityExamples(word, parsed, wordType)) {
    return examples?.trim() ? examples : serializeExamples(parsed);
  }

  const ensured = ensureExamples(word, parsed, wordType, meaning);
  const translated = await fillExampleTranslations(ensured);
  const finalExamples = hasQualityExamples(word, translated, wordType)
    ? translated
    : ensured;
  return serializeExamples(finalExamples);
}

async function repairPhoneticIfNeeded(
  word: string,
  phonetic?: string | null,
): Promise<string> {
  const formatted = formatIpa(phonetic ?? "", word);
  if (!isPlaceholderPhonetic(word, formatted)) return formatted;
  const fromGemini = await generatePhoneticWithGemini(word);
  if (fromGemini && !isPlaceholderPhonetic(word, fromGemini)) return fromGemini;
  return formatted;
}

async function repairPersistedPhoneticIfNeeded(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  detail: WordDetail,
): Promise<string> {
  const repaired = await repairPhoneticIfNeeded(word, detail.phonetic);
  if (repaired !== detail.phonetic) {
    try {
      await supabase
        .from("word_details")
        .update({ phonetic: repaired })
        .eq("word", word);
    } catch (error) {
      console.warn(`Failed to persist repaired phonetic for "${word}":`, error);
    }
  }
  return repaired;
}

async function repairPersistedExamplesIfNeeded(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  detail: WordDetail,
): Promise<string> {
  const repaired = await repairExamplesIfNeeded(
    word,
    detail.examples,
    detail.word_type,
    detail.vietnamese_meaning,
  );
  if (repaired !== detail.examples) {
    try {
      await supabase
        .from("word_details")
        .update({ examples: repaired })
        .eq("word", word);
    } catch (error) {
      console.warn(`Failed to persist repaired examples for "${word}":`, error);
    }
  }
  return repaired;
}

async function repairPersistedMeaningIfNeeded(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  detail: WordDetail,
): Promise<string> {
  const repaired = sanitizeVietnameseText(detail.vietnamese_meaning);
  if (repaired && repaired !== detail.vietnamese_meaning) {
    try {
      await supabase
        .from("word_details")
        .update({ vietnamese_meaning: repaired })
        .eq("word", word);
    } catch (error) {
      console.warn(`Failed to persist repaired meaning for "${word}":`, error);
    }
  }
  return repaired || detail.vietnamese_meaning;
}

async function persistEnrichedWordDetail(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  payload: {
    phonetic: string;
    word_type: string;
    vietnamese_meaning: string;
    english_definition: string;
    examples: string;
    collocations: string | null;
    image_url: string | null;
  },
): Promise<void> {
  try {
    const { error } = await supabase
      .from("word_details")
      .upsert({ word, ...payload }, { onConflict: "word" });
    if (error) {
      console.warn(`Failed to persist word_details for "${word}":`, error);
    }
  } catch (error) {
    console.warn(`Failed to persist word_details for "${word}":`, error);
  }
}

/**
 * Lazy word detail — Gemini / curated standard vocab only.
 * Free Dictionary is no longer used (it returned slang/secondary senses).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const word = normalizeVocabInput(searchParams.get("word") ?? "");
    const rankParam = searchParams.get("rank");
    const rank = rankParam ? Number(rankParam) : undefined;
    const skipGemini =
      searchParams.get("skipGemini") === "true" &&
      hasQualityStandardVocab(word ?? "");

    if (!word) {
      return NextResponse.json(
        { error: "Word is required or invalid format" },
        { status: 400 },
      );
    }

    if (isExcludedVocabWord(word) || isExcludedVocabWord(getFamilyHeadword(word))) {
      return NextResponse.json(
        { error: "Word not available in this app" },
        { status: 404 },
      );
    }

    const supabase = await createClient();
    const { data: dbDetail } = await supabase
      .from("word_details")
      .select("*")
      .eq("word", word)
      .maybeSingle();

    const frequencyRank = rank ?? getPresetRank(word) ?? 5000;

    let repairedDbDetail = dbDetail ?? null;
    if (dbDetail) {
      const examples = await repairPersistedExamplesIfNeeded(
        supabase,
        word,
        dbDetail,
      );
      const phonetic = await repairPersistedPhoneticIfNeeded(
        supabase,
        word,
        { ...dbDetail, examples },
      );
      const vietnamese_meaning = await repairPersistedMeaningIfNeeded(
        supabase,
        word,
        { ...dbDetail, examples, phonetic },
      );
      repairedDbDetail = { ...dbDetail, examples, phonetic, vietnamese_meaning };
    }

    if (isPersistedWordDetailComplete(repairedDbDetail, word)) {
      const searchKeyword = imageSearchKeyword(
        word,
        repairedDbDetail!.word_type,
        repairedDbDetail!.vietnamese_meaning,
        repairedDbDetail!.english_definition,
      );
      const imageUrl = await resolveImageUrl(
        word,
        repairedDbDetail!.image_url,
        searchKeyword,
        repairedDbDetail!.word_type,
        repairedDbDetail!.vietnamese_meaning,
        repairedDbDetail!.english_definition,
      );
      if (repairedDbDetail!.image_url !== imageUrl) {
        await persistImageUrlIfChanged(
          supabase,
          word,
          repairedDbDetail!.image_url,
          imageUrl,
        );
      }
      return NextResponse.json({
        word: persistedDetailToDiscoverWord(
          word,
          repairedDbDetail!,
          frequencyRank,
          imageUrl,
          searchKeyword,
        ),
      });
    }

    const enrichment = await enrichWord(word, { rank: frequencyRank, skipGemini });
    const responseWord = enrichmentToDiscoverWord(word, enrichment, null);
    const searchKeyword = responseWord.search_keyword ?? word;
    const vietnameseMeaning =
      sanitizeVietnameseText(responseWord.vietnamese_meaning) || word;
    const englishDefinition = responseWord.english_definition?.trim() || null;
    let imageUrl = await fetchWordImageUrl(
      word,
      searchKeyword,
      responseWord.word_type ?? enrichment.wordType,
      vietnameseMeaning,
      englishDefinition,
    );
    if (!imageUrl || shouldRefreshImageUrl(imageUrl, word)) {
      imageUrl = await fetchWordImageUrl(
        word,
        searchKeyword,
        responseWord.word_type ?? enrichment.wordType,
        vietnameseMeaning,
        englishDefinition,
      );
    }
    responseWord.image_url = isRealCardImageUrl(imageUrl, word)
      ? imageUrl
      : isRealCardImageUrl(dbDetail?.image_url, word)
        ? dbDetail!.image_url!
        : imageUrl;
    const examples = await repairExamplesIfNeeded(
      word,
      responseWord.examples,
      responseWord.word_type,
      responseWord.vietnamese_meaning,
    );
    const phonetic = await repairPhoneticIfNeeded(word, responseWord.phonetic);

    void persistEnrichedWordDetail(supabase, word, {
      phonetic: phonetic ?? `/${word}/`,
      word_type: responseWord.word_type ?? "unknown",
      vietnamese_meaning:
        sanitizeVietnameseText(responseWord.vietnamese_meaning) || word,
      english_definition: responseWord.english_definition ?? "",
      examples,
      collocations: responseWord.collocations ?? null,
      image_url: isRealCardImageUrl(imageUrl, word)
        ? imageUrl
        : isRealCardImageUrl(dbDetail?.image_url, word)
          ? dbDetail!.image_url!
          : null,
    });

    if (dbDetail) {
      await persistImageUrlIfChanged(
        supabase,
        word,
        dbDetail.image_url,
        imageUrl,
      );
    }

    return NextResponse.json({
      word: {
        ...responseWord,
        examples,
        phonetic,
        from_cache: hasQualityStandardVocab(word),
      },
    });
  } catch (error) {
    console.error("Discover word preview error:", error);
    return NextResponse.json(
      { error: "Failed to load word", details: errorMessage(error) },
      { status: 500 },
    );
  }
}
