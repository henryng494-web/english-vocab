import { getPresetRank } from "@/data/preset-word-details";
import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import { createClient } from "@/lib/supabase/server";
import { cleanupCorruptWords, cleanupExcludedVocabWords } from "@/lib/cleanup-corrupt-words";
import { getImportanceTier } from "@/lib/word-rank";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { getFamilyHeadword } from "@/lib/word-family";
import { withWordFamily } from "@/lib/word-family-display";
import { isValidVocabWord } from "@/lib/word-validation";
import type { LearningStatus, VocabWord } from "@/types/database";
import { NextResponse } from "next/server";

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown error";
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get("sort") ?? "importance";
    const statusFilter = searchParams.get("status");

    const supabase = await createClient();

    if (searchParams.get("summary") === "learning") {
      const { data, error } = await supabase
        .from("user_learning")
        .select("word, status, last_reviewed_at");
      if (error) {
        return NextResponse.json({ words: [] });
      }
      const words = (data ?? []).filter(
        (row) =>
          row.status !== "mastered" && !isExcludedVocabWord(row.word),
      );
      return NextResponse.json({ words });
    }

    /** Review pool — word_details for active user_learning rows only (not the full catalog). */
    if (searchParams.get("scope") === "learning") {
      const { data: learningRows, error: learningError } = await supabase
        .from("user_learning")
        .select("word, status, last_reviewed_at");

      if (learningError) throw learningError;

      const active = (learningRows ?? []).filter(
        (row) =>
          row.status !== "mastered" && !isExcludedVocabWord(row.word),
      );
      if (active.length === 0) {
        return NextResponse.json({ words: [] });
      }

      const learningByWord = new Map(
        active.map((row) => [row.word, row]),
      );
      const wordList = [...learningByWord.keys()];

      const [{ data: details, error: detailsError }, { data: bankRows, error: bankError }] =
        await Promise.all([
          supabase.from("word_details").select("*").in("word", wordList),
          supabase.from("word_bank").select("word, rank").in("word", wordList),
        ]);

      if (detailsError) throw detailsError;
      if (bankError) throw bankError;

      const rankByWord = new Map(
        (bankRows ?? []).map((row) => [row.word, row.rank]),
      );

      let words: VocabWord[] = (details ?? [])
        .filter(
          (detail) =>
            isValidVocabWord(detail.word) &&
            !isExcludedVocabWord(detail.word) &&
            !isExcludedVocabWord(getFamilyHeadword(detail.word)),
        )
        .map((detail) => {
          const rank =
            getPresetRank(detail.word) ?? rankByWord.get(detail.word) ?? 10000;
          const learning = learningByWord.get(detail.word);
          return withWordFamily({
            ...detail,
            rank,
            importance_tier: getImportanceTier(rank),
            learning_status: (learning?.status as LearningStatus) ?? "new",
            last_reviewed_at: learning?.last_reviewed_at ?? null,
            search_keyword: resolveImageSearchKeyword(detail.word, {
              pos: detail.word_type,
              meaning: detail.vietnamese_meaning,
              englishDefinition: detail.english_definition,
            }),
            family_head: getFamilyHeadword(detail.word),
          });
        });

      if (sort === "recent") {
        words.sort((a, b) => {
          const aTime = a.last_reviewed_at ?? "";
          const bTime = b.last_reviewed_at ?? "";
          return bTime.localeCompare(aTime);
        });
      } else {
        words.sort(
          (a, b) => a.rank - b.rank || a.word.localeCompare(b.word),
        );
      }

      return NextResponse.json({ words });
    }

    // Corrupt-word cleanup belongs in scripts/admin — not on every list read.
    if (searchParams.get("repair") === "true") {
      await cleanupCorruptWords(supabase);
      await cleanupExcludedVocabWords(supabase);
    }

    const { data: bankRows, error: bankError } = await supabase
      .from("word_bank")
      .select("word, rank");

    if (bankError) throw bankError;

    const { data: details, error: detailsError } = await supabase
      .from("word_details")
      .select("*");

    if (detailsError) throw detailsError;

    const { data: learningRows, error: learningError } = await supabase
      .from("user_learning")
      .select("word, status, last_reviewed_at");

    if (learningError) {
      console.warn("user_learning fetch skipped:", learningError.message);
    }

    const rankByWord = new Map(
      (bankRows ?? []).map((row) => [row.word, row.rank]),
    );
    const learningByWord = new Map(
      (learningRows ?? []).map((row) => [row.word, row]),
    );

    let words: VocabWord[] = (details ?? [])
      .filter(
        (detail) =>
          isValidVocabWord(detail.word) &&
          !isExcludedVocabWord(detail.word) &&
          !isExcludedVocabWord(getFamilyHeadword(detail.word)),
      )
      .map((detail) => {
        const rank =
          getPresetRank(detail.word) ?? rankByWord.get(detail.word) ?? 10000;
        const learning = learningByWord.get(detail.word);
        return withWordFamily({
          ...detail,
          rank,
          importance_tier: getImportanceTier(rank),
          learning_status: (learning?.status as LearningStatus) ?? "new",
          last_reviewed_at: learning?.last_reviewed_at ?? null,
          search_keyword: resolveImageSearchKeyword(detail.word, {
            pos: detail.word_type,
            meaning: detail.vietnamese_meaning,
            englishDefinition: detail.english_definition,
          }),
          family_head: getFamilyHeadword(detail.word),
        });
      });

    if (statusFilter && statusFilter !== "all") {
      words = words.filter((w) => w.learning_status === statusFilter);
    }

    switch (sort) {
      case "alphabetical":
        words.sort((a, b) => a.word.localeCompare(b.word));
        break;
      case "recent":
        words.sort((a, b) => {
          const aTime = a.last_reviewed_at ?? "";
          const bTime = b.last_reviewed_at ?? "";
          return bTime.localeCompare(aTime);
        });
        break;
      case "importance":
      default:
        words.sort(
          (a, b) => a.rank - b.rank || a.word.localeCompare(b.word),
        );
        break;
    }

    return NextResponse.json({ words });
  } catch (error) {
    console.error("Get words error:", error);
    return NextResponse.json(
      { error: "Failed to fetch words", details: errorMessage(error) },
      { status: 500 },
    );
  }
}
