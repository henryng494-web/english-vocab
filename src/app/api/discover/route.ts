import {
  getRangeById,
  getWordsByRangeId,
} from "@/data/preset-vocabulary";
import {
  getStaticWordDetail,
  hasStaticWordDetail,
} from "@/data/preset-word-details";
import { hasStaticVietnamese } from "@/lib/static-vietnamese";
import { createClient } from "@/lib/supabase/server";
import { getImportanceTier } from "@/lib/word-rank";
import { NextResponse } from "next/server";

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown error";
}

/** Lightweight list — no Gemini, no bulk word_details fetch */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rangeId = searchParams.get("range") ?? "1-100";
    const range = getRangeById(rangeId);

    if (!range) {
      return NextResponse.json({ error: "Invalid range" }, { status: 400 });
    }

    const presetWords = getWordsByRangeId(rangeId);
    const supabase = await createClient();

    const { data: learningRows } = await supabase
      .from("user_learning")
      .select("word, status");

    const masteredWords = new Set(
      (learningRows ?? [])
        .filter((r) => r.status === "mastered")
        .map((r) => r.word),
    );

    const visiblePreset = presetWords.filter((p) => !masteredWords.has(p.word));

    const words = visiblePreset.map((preset) => {
      const staticDetail = getStaticWordDetail(preset.word);
      const hasStatic = Boolean(staticDetail);
      const hasVi = hasStaticVietnamese(preset.word);

      return {
        word: preset.word,
        rank: preset.rank,
        importance_tier: getImportanceTier(preset.rank),
        from_static: hasStatic,
        has_vietnamese: hasVi,
        needs_fetch: !hasStatic,
      };
    });

    return NextResponse.json({
      range,
      words,
      total_in_range: presetWords.length,
      hidden_mastered: presetWords.length - visiblePreset.length,
      static_count: visiblePreset.filter((p) => hasStaticWordDetail(p.word)).length,
    });
  } catch (error) {
    console.error("Discover list error:", error);
    return NextResponse.json(
      { error: "Failed to load discover words", details: errorMessage(error) },
      { status: 500 },
    );
  }
}
