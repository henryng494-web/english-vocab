import { createClient } from "@/lib/supabase/server";
import { enrichWord } from "@/lib/enrich-word";
import { serializeExamples } from "@/lib/parse-examples";
import { fetchWordImageUrl, isStalePresetFallbackUrl } from "@/lib/unsplash";
import { NextResponse } from "next/server";

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown error";
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const { word } = (await request.json()) as { word?: string };
    if (!word?.trim()) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const trimmedWord = word.trim().toLowerCase();

    const { data: existingDetails } = await supabase
      .from("word_details")
      .select("*")
      .eq("word", trimmedWord)
      .maybeSingle();

    if (existingDetails) {
      const { data: bankRow } = await supabase
        .from("word_bank")
        .select("rank")
        .eq("word", trimmedWord)
        .maybeSingle();

      const standard = await enrichWord(trimmedWord);
      let imageUrl = existingDetails.image_url;
      if (!imageUrl?.trim() || isStalePresetFallbackUrl(imageUrl)) {
        imageUrl = await fetchWordImageUrl(
          trimmedWord,
          standard.searchKeyword,
        );
      }

      await supabase
        .from("word_details")
        .update({
          image_url: imageUrl,
          phonetic: standard.phonetic,
          word_type: standard.wordType,
          english_definition: standard.englishDefinition,
          vietnamese_meaning: standard.vietnameseMeaning,
          examples: serializeExamples(standard.examples),
        })
        .eq("word", trimmedWord);

      return NextResponse.json({
        word: {
          ...existingDetails,
          phonetic: standard.phonetic,
          word_type: standard.wordType,
          english_definition: standard.englishDefinition,
          vietnamese_meaning: standard.vietnameseMeaning,
          examples: serializeExamples(standard.examples),
          image_url: imageUrl,
          rank: bankRow?.rank ?? standard.frequencyRank ?? 10000,
        },
      });
    }

    const enrichment = await enrichWord(trimmedWord);

    const imageUrl = await fetchWordImageUrl(
      trimmedWord,
      enrichment.searchKeyword,
    );

    const { data: existingBank } = await supabase
      .from("word_bank")
      .select("id")
      .eq("word", trimmedWord)
      .maybeSingle();

    if (!existingBank) {
      const { error: wordError } = await supabase.from("word_bank").insert({
        word: trimmedWord,
        rank: enrichment.frequencyRank,
      });

      if (wordError) throw wordError;
    } else {
      await supabase
        .from("word_bank")
        .update({ rank: enrichment.frequencyRank })
        .eq("word", trimmedWord);
    }

    const { data: wordData, error: detailError } = await supabase
      .from("word_details")
      .insert({
        word: trimmedWord,
        phonetic: enrichment.phonetic,
        word_type: enrichment.wordType,
        english_definition: enrichment.englishDefinition,
        vietnamese_meaning: enrichment.vietnameseMeaning,
        examples: serializeExamples(enrichment.examples),
        collocations: enrichment.collocations,
        image_url: imageUrl,
      })
      .select("*")
      .single();

    if (detailError || !wordData) {
      throw detailError ?? new Error("Failed to create word details");
    }

    const { data: existingLearning } = await supabase
      .from("user_learning")
      .select("id")
      .eq("word", trimmedWord)
      .maybeSingle();

    if (!existingLearning) {
      const { error: learningInsertError } = await supabase
        .from("user_learning")
        .insert({
          word: trimmedWord,
          user_id: null,
          status: "new",
          last_reviewed_at: new Date().toISOString(),
        });

      if (learningInsertError) {
        console.warn("user_learning insert skipped:", learningInsertError.message);
      }
    }

    return NextResponse.json({
      word: {
        ...wordData,
        rank: enrichment.frequencyRank,
        importance_tier: enrichment.importanceTier,
      },
    });
  } catch (error) {
    console.error("Add word error:", error);
    return NextResponse.json(
      { error: "Failed to add word", details: errorMessage(error) },
      { status: 500 },
    );
  }
}
