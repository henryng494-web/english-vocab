import {
  getRangeById,
  getWordsByRangeId,
} from "@/data/preset-vocabulary";
import {
  getStaticWordDetail,
  hasStaticWordDetail,
} from "@/data/preset-word-details";
import { standardToDiscoverFields } from "@/lib/enrichment-helpers";
import {
  getBundledLearnerContent,
  hasBundledLearnerGloss,
} from "@/lib/learner-content";
import { parseLearnerLocale } from "@/lib/learner-locale";
import { hasStaticVietnamese } from "@/lib/static-vietnamese";
import { serializeExamples } from "@/lib/parse-examples";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { createClient } from "@/lib/supabase/server";
import { getImportanceTier } from "@/lib/word-rank";
import { getFamilyMembers, familyContainsTaken } from "@/lib/word-family";
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
    const learnerLocale = parseLearnerLocale(searchParams.get("locale"));
    const range = getRangeById(rangeId);

    if (!range) {
      return NextResponse.json({ error: "Invalid range" }, { status: 400 });
    }

    const presetWords = getWordsByRangeId(rangeId);
    const supabase = await createClient();

    const { data: learningRows, error: learningError } = await supabase
      .from("user_learning")
      .select("word, status");

    if (learningError) {
      console.warn("user_learning fetch skipped:", learningError.message);
    }

    const takenWords = new Set(
      (learningRows ?? []).map((row) => row.word.trim().toLowerCase()),
    );

    const visiblePreset = presetWords.filter(
      (preset) =>
        !isExcludedVocabWord(preset.word) &&
        !familyContainsTaken(preset.word, takenWords),
    );

    const words = visiblePreset.map((preset) => {
      const staticDetail = getStaticWordDetail(preset.word);
      const standardFields = standardToDiscoverFields(preset.word);
      const hasStatic = Boolean(staticDetail) || Boolean(standardFields);
      const hasVi = hasStaticVietnamese(preset.word);

      const bundled = getBundledLearnerContent(preset.word, learnerLocale);
      const preview =
        bundled?.vietnamese_meaning?.trim()
          ? {
              phonetic: bundled.phonetic,
              word_type: bundled.word_type,
              vietnamese_meaning: bundled.vietnamese_meaning,
              english_definition: bundled.english_definition,
              examples: bundled.examples,
              search_keyword: bundled.search_keyword ?? preset.word,
            }
          : learnerLocale === "vi"
            ? standardFields
              ? {
                  phonetic: standardFields.phonetic,
                  word_type: standardFields.word_type,
                  vietnamese_meaning: standardFields.vietnamese_meaning,
                  english_definition: standardFields.english_definition,
                  examples: standardFields.examples,
                  search_keyword: standardFields.search_keyword,
                }
              : staticDetail
                ? {
                    phonetic: staticDetail.ipa,
                    word_type: staticDetail.pos,
                    vietnamese_meaning: staticDetail.vietnamese,
                    english_definition: staticDetail.definition,
                    examples: serializeExamples(staticDetail.examples),
                    search_keyword: preset.word,
                  }
                : null
            : null;

      const hasLearnerGloss =
        hasBundledLearnerGloss(preset.word, learnerLocale) || hasVi;

      return {
        word: preset.word,
        rank: preset.rank,
        importance_tier: getImportanceTier(preset.rank),
        from_static: hasStatic,
        has_vietnamese: hasLearnerGloss,
        needs_fetch: !hasStatic,
        family_members: getFamilyMembers(preset.word),
        preview,
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
