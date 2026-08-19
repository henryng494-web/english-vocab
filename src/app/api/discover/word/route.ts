import { hasQualityStandardVocab } from "@/data/standard-vocab";
import { getPresetRank } from "@/data/preset-word-details";
import { createClient } from "@/lib/supabase/server";
import { enrichmentToDiscoverWord } from "@/lib/enrichment-helpers";
import { enrichWord } from "@/lib/enrich-word";
import { isPersistedWordDetailComplete } from "@/lib/persisted-word-detail";
import { serializeExamples } from "@/lib/parse-examples";
import { getImportanceTier } from "@/lib/word-rank";
import {
  fetchWordImageUrl,
  shouldRefreshImageUrl,
} from "@/lib/unsplash";
import { isProfaneWord } from "@/lib/safe-image-search";
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
): Promise<string> {
  const trimmed = existingUrl?.trim();
  if (trimmed?.startsWith("http") && !shouldRefreshImageUrl(trimmed, word)) {
    return trimmed;
  }
  return fetchWordImageUrl(word, searchKeyword ?? word, pos);
}

function persistedDetailToDiscoverWord(
  word: string,
  detail: WordDetail,
  rank: number,
  imageUrl: string,
) {
  return {
    word,
    phonetic: detail.phonetic,
    word_type: detail.word_type,
    vietnamese_meaning: detail.vietnamese_meaning,
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
    search_keyword: word,
  };
}

/** Self-heal: persist a freshly regenerated image URL so it's fixed for good. */
async function persistImageUrlIfChanged(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  previousUrl: string | null | undefined,
  resolvedUrl: string,
): Promise<void> {
  if (previousUrl?.trim() === resolvedUrl) return;
  try {
    await supabase
      .from("word_details")
      .update({ image_url: resolvedUrl })
      .eq("word", word);
  } catch (error) {
    console.warn(`Failed to persist refreshed image_url for "${word}":`, error);
  }
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
    image_url: string;
  },
): Promise<void> {
  try {
    const { data: existing } = await supabase
      .from("word_details")
      .select("word")
      .eq("word", word)
      .maybeSingle();

    if (existing) {
      await supabase.from("word_details").update(payload).eq("word", word);
    } else {
      await supabase.from("word_details").insert({ word, ...payload });
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
    const word = searchParams.get("word")?.trim().toLowerCase();
    const rankParam = searchParams.get("rank");
    const rank = rankParam ? Number(rankParam) : undefined;
    const skipGemini =
      searchParams.get("skipGemini") === "true" &&
      hasQualityStandardVocab(word ?? "");

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    if (isProfaneWord(word)) {
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

    if (isPersistedWordDetailComplete(dbDetail, word)) {
      const imageUrl = await resolveImageUrl(
        word,
        dbDetail!.image_url,
        word,
        dbDetail!.word_type,
      );
      if (dbDetail!.image_url !== imageUrl) {
        await persistImageUrlIfChanged(
          supabase,
          word,
          dbDetail!.image_url,
          imageUrl,
        );
      }
      return NextResponse.json({
        word: persistedDetailToDiscoverWord(
          word,
          dbDetail!,
          frequencyRank,
          imageUrl,
        ),
      });
    }

    const enrichmentPromise = enrichWord(word, { rank: frequencyRank, skipGemini });
    const imagePromise = resolveImageUrl(
      word,
      dbDetail?.image_url ?? null,
      word,
      dbDetail?.word_type ?? null,
    );
    const [enrichment, imageUrlInitial] = await Promise.all([
      enrichmentPromise,
      imagePromise,
    ]);

    let imageUrl = imageUrlInitial;
    const keyword = enrichment.searchKeyword?.trim() || word;
    if (
      keyword !== word &&
      (shouldRefreshImageUrl(imageUrlInitial, word) ||
        imageUrlInitial.startsWith("data:"))
    ) {
      imageUrl = await fetchWordImageUrl(
        word,
        keyword,
        enrichment.wordType,
      );
    }

    const responseWord = enrichmentToDiscoverWord(word, enrichment, imageUrl);

    void persistEnrichedWordDetail(supabase, word, {
      phonetic: responseWord.phonetic ?? `/${word}/`,
      word_type: responseWord.word_type ?? "unknown",
      vietnamese_meaning: responseWord.vietnamese_meaning ?? word,
      english_definition: responseWord.english_definition ?? "",
      examples: responseWord.examples ?? serializeExamples(enrichment.examples),
      collocations: responseWord.collocations ?? null,
      image_url: imageUrl,
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
