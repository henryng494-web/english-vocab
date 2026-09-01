import { hasQualityStandardVocab, getStandardSearchKeyword } from "@/data/standard-vocab";
import { getPresetRank } from "@/data/preset-word-details";
import { createClient } from "@/lib/supabase/server";
import { enrichmentToDiscoverWord } from "@/lib/enrichment-helpers";
import { enrichWord } from "@/lib/enrich-word";
import { isPersistedWordDetailComplete } from "@/lib/persisted-word-detail";
import { generatePhoneticWithGemini } from "@/lib/gemini-core";
import { isPlaceholderPhonetic, formatIpa } from "@/lib/phonetic";
import {
  examplesNeedRegeneration,
  repairWordExamples,
} from "@/lib/repair-word-examples";
import { meaningsNeedRegeneration } from "@/lib/meaning-quality";
import { repairWordMeanings } from "@/lib/repair-word-meanings";
import { getImportanceTier } from "@/lib/word-rank";
import { withWordFamily } from "@/lib/word-family-display";
import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import {
  fetchWordImageUrlDetailed,
  finalizeWordImageDisplayUrl,
  isPersistableWordImageUrl,
} from "@/lib/unsplash";
import { isClosedClassWord } from "@/lib/word-image-strategy";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";
import { resolveWordRegister } from "@/lib/word-meanings";
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
  existingUrl?: string | null,
  searchKeyword?: string | null,
  pos?: string | null,
  meaning?: string | null,
  englishDefinition?: string | null,
): Promise<string> {
  const fetched = await fetchWordImageUrlDetailed(
    word,
    searchKeyword ?? word,
    pos,
    meaning,
    englishDefinition,
    existingUrl,
  );
  return finalizeWordImageDisplayUrl(
    fetched.url,
    existingUrl,
    word,
    pos,
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
    register: resolveWordRegister(detail),
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
function parseOptionalRank(rankParam: string | null): number | undefined {
  if (!rankParam) return undefined;
  const parsed = Number(rankParam);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function persistRepairField(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  field: "phonetic" | "examples" | "vietnamese_meaning",
  value: string,
  previous: string | null | undefined,
): Promise<void> {
  if (value === previous) return;
  const { error } = await supabase
    .from("word_details")
    .update({ [field]: value })
    .eq("word", word);
  if (error) {
    console.warn(`Failed to persist repaired ${field} for "${word}":`, error.message);
  }
}
/** Self-heal: persist a freshly regenerated image URL so it's fixed for good. */
async function persistImageUrlIfChanged(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  previousUrl: string | null | undefined,
  resolvedUrl: string,
): Promise<void> {
  if (!isPersistableWordImageUrl(resolvedUrl, word)) return;
  if (previousUrl?.trim() === resolvedUrl) return;
  const { error } = await supabase
    .from("word_details")
    .update({ image_url: resolvedUrl })
    .eq("word", word);
  if (error) {
    console.warn(`Failed to persist refreshed image_url for "${word}":`, error.message);
  }
}

async function repairPersistedExamplesIfNeeded(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  detail: WordDetail,
): Promise<string> {
  const previous = detail.examples?.trim() ?? "";
  const repaired = await repairWordExamples(
    word,
    detail.examples,
    detail.word_type,
    detail.vietnamese_meaning,
  );
  if (
    !examplesNeedRegeneration(
      word,
      repaired,
      detail.word_type,
      detail.vietnamese_meaning,
    )
  ) {
    await persistRepairField(supabase, word, "examples", repaired, detail.examples);
    return repaired;
  }
  if (
    previous &&
    !examplesNeedRegeneration(
      word,
      previous,
      detail.word_type,
      detail.vietnamese_meaning,
    )
  ) {
    return previous;
  }
  return repaired.trim() ? repaired : previous;
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
  await persistRepairField(supabase, word, "phonetic", repaired, detail.phonetic);
  return repaired;
}

async function repairPersistedMeaningIfNeeded(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  detail: WordDetail,
): Promise<string> {
  const repaired = await repairWordMeanings(
    word,
    detail.vietnamese_meaning,
    detail.word_type,
    detail.examples,
    detail.english_definition,
  );
  if (repaired) {
    await persistRepairField(
      supabase,
      word,
      "vietnamese_meaning",
      repaired,
      detail.vietnamese_meaning,
    );
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
    const rank = parseOptionalRank(rankParam);
    const skipGemini =
      searchParams.get("skipGemini") === "true" &&
      hasQualityStandardVocab(word ?? "");
    const forceRepair = searchParams.get("forceRepair") === "true";

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
      const vietnamese_meaning = await repairPersistedMeaningIfNeeded(
        supabase,
        word,
        dbDetail,
      );
      const examples = await repairPersistedExamplesIfNeeded(
        supabase,
        word,
        { ...dbDetail, vietnamese_meaning },
      );
      const phonetic = await repairPersistedPhoneticIfNeeded(
        supabase,
        word,
        { ...dbDetail, examples, vietnamese_meaning },
      );
      repairedDbDetail = { ...dbDetail, examples, phonetic, vietnamese_meaning };
    }

    const examplesStillMisaligned = repairedDbDetail
      ? examplesNeedRegeneration(
          word,
          repairedDbDetail.examples,
          repairedDbDetail.word_type,
          repairedDbDetail.vietnamese_meaning,
        )
      : false;
    const meaningsStillBad = repairedDbDetail
      ? meaningsNeedRegeneration(
          word,
          repairedDbDetail.vietnamese_meaning,
          repairedDbDetail.word_type,
          repairedDbDetail.examples,
          repairedDbDetail.english_definition,
        )
      : false;

    const preferCurated = hasQualityStandardVocab(word);

    if (
      !forceRepair &&
      !preferCurated &&
      !examplesStillMisaligned &&
      !meaningsStillBad &&
      isPersistedWordDetailComplete(repairedDbDetail, word)
    ) {
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
        if (isPersistableWordImageUrl(imageUrl, word)) {
          await persistImageUrlIfChanged(
            supabase,
            word,
            repairedDbDetail!.image_url,
            imageUrl,
          );
        } else if (
          isClosedClassWord(word, repairedDbDetail!.word_type) &&
          repairedDbDetail!.image_url
        ) {
          await supabase
            .from("word_details")
            .update({ image_url: null })
            .eq("word", word);
        }
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

    const forceExampleRegen = forceRepair || examplesStillMisaligned || meaningsStillBad;

    const enrichment = await enrichWord(word, {
      rank: frequencyRank,
      skipGemini: forceExampleRegen ? false : skipGemini,
      forceGemini: forceExampleRegen,
    });
    const responseWord = enrichmentToDiscoverWord(word, enrichment, null);
    const searchKeyword = responseWord.search_keyword ?? word;
    const vietnameseMeaning =
      sanitizeVietnameseText(responseWord.vietnamese_meaning) || word;
    const englishDefinition = responseWord.english_definition?.trim() || null;
    const fetched = await fetchWordImageUrlDetailed(
      word,
      searchKeyword,
      responseWord.word_type ?? enrichment.wordType,
      vietnameseMeaning,
      englishDefinition,
      dbDetail?.image_url,
    );
    const imageUrl = finalizeWordImageDisplayUrl(
      fetched.url,
      dbDetail?.image_url,
      word,
      responseWord.word_type ?? enrichment.wordType,
    );
    responseWord.image_url = imageUrl;
    let examples = await repairWordExamples(
      word,
      responseWord.examples,
      responseWord.word_type,
      responseWord.vietnamese_meaning,
    );
    let vietnameseMeaningFinal =
      sanitizeVietnameseText(responseWord.vietnamese_meaning) || word;
    if (
      meaningsNeedRegeneration(
        word,
        vietnameseMeaningFinal,
        responseWord.word_type,
        examples,
        responseWord.english_definition,
      )
    ) {
      vietnameseMeaningFinal = await repairWordMeanings(
        word,
        vietnameseMeaningFinal,
        responseWord.word_type,
        examples,
        responseWord.english_definition,
      );
      examples = await repairWordExamples(
        word,
        examples,
        responseWord.word_type,
        vietnameseMeaningFinal,
      );
    }
    if (
      examplesNeedRegeneration(
        word,
        examples,
        responseWord.word_type,
        vietnameseMeaningFinal,
      )
    ) {
      const retried = await repairWordExamples(
        word,
        examples,
        responseWord.word_type,
        vietnameseMeaningFinal,
      );
      if (retried.trim()) examples = retried;
    }
    const phonetic = await repairPhoneticIfNeeded(word, responseWord.phonetic);

    const persistPayload = {
      phonetic: phonetic ?? `/${word}/`,
      word_type: responseWord.word_type ?? "unknown",
      vietnamese_meaning: vietnameseMeaningFinal,
      english_definition: responseWord.english_definition ?? "",
      examples,
      collocations: responseWord.collocations ?? null,
      image_url: isPersistableWordImageUrl(imageUrl, word) ? imageUrl : null,
    };

    if (
      !examplesNeedRegeneration(
        word,
        examples,
        responseWord.word_type,
        vietnameseMeaningFinal,
      ) &&
      !meaningsNeedRegeneration(
        word,
        vietnameseMeaningFinal,
        responseWord.word_type,
        examples,
        responseWord.english_definition,
      )
    ) {
      void persistEnrichedWordDetail(supabase, word, persistPayload);
    } else {
      console.warn(
        `[discover/word] Gemini content still misaligned for "${word}" — not persisting bad rows`,
      );
    }

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
        vietnamese_meaning: vietnameseMeaningFinal,
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
