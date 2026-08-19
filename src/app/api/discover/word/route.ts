import { hasQualityStandardVocab } from "@/data/standard-vocab";
import { createClient } from "@/lib/supabase/server";
import { enrichmentToDiscoverWord } from "@/lib/enrichment-helpers";
import { enrichWord } from "@/lib/enrich-word";
import {
  fetchWordImageUrl,
  isStalePresetFallbackUrl,
} from "@/lib/unsplash";
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
  if (trimmed?.startsWith("http") && !isStalePresetFallbackUrl(trimmed)) {
    return trimmed;
  }
  return fetchWordImageUrl(word, searchKeyword ?? word, pos);
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

    const supabase = await createClient();
    const { data: dbDetail } = await supabase
      .from("word_details")
      .select("image_url, collocations")
      .eq("word", word)
      .maybeSingle();

    const enrichment = await enrichWord(word, {
      rank,
      skipGemini,
    });

    const imageUrl = await resolveImageUrl(
      word,
      dbDetail?.image_url ?? null,
      enrichment.searchKeyword,
      enrichment.wordType,
    );
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
        ...enrichmentToDiscoverWord(word, enrichment, imageUrl),
        collocations: dbDetail?.collocations ?? enrichment.collocations,
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
