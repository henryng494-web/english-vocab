import { createClientIfConfigured } from "@/lib/supabase/client";
import { getFamilyDisplayWords } from "@/lib/word-family";
import { normalizeSimilarWords } from "@/lib/word-synonyms";
import { isRealtimeGeminiDisabled } from "@/lib/gemini-realtime";
import { resolveSimilarWords } from "@/lib/word-synonyms";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

async function storedSimilarWords(word: string): Promise<string[]> {
  const supabase = createClientIfConfigured();
  if (!supabase) return [];
  const { data } = await supabase
    .from("word_details")
    .select("phrase_translations")
    .eq("word", word)
    .maybeSingle();
  const raw = (data?.phrase_translations as { similar?: unknown } | null)
    ?.similar;
  return normalizeSimilarWords(raw, word, getFamilyDisplayWords(word));
}

export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get("word")?.trim().toLowerCase();
  if (!word || !/^[a-z][a-z'-]*$/i.test(word)) {
    return NextResponse.json({ error: "Invalid word" }, { status: 400 });
  }

  const stored = await storedSimilarWords(word).catch(() => []);
  if (stored.length) {
    return NextResponse.json(
      { similar_words: stored },
      {
        headers: {
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
        },
      },
    );
  }

  if (isRealtimeGeminiDisabled()) {
    return NextResponse.json(
      { similar_words: [] },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  const similar_words = await resolveSimilarWords({
    word,
    pos: request.nextUrl.searchParams.get("pos"),
    meaning: request.nextUrl.searchParams.get("meaning"),
    englishDefinition: request.nextUrl.searchParams.get("definition"),
  });

  return NextResponse.json(
    { similar_words },
    {
      headers: {
        "Cache-Control": similar_words.length
          ? "public, max-age=86400, stale-while-revalidate=3600"
          : "no-store",
      },
    },
  );
}
