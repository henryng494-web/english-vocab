import { translateCollocationsWithGemini } from "@/lib/gemini-core";
import { alignmentMeaningLines } from "@/lib/word-meanings";
import { NextResponse } from "next/server";

type PhraseInput = {
  en?: string;
  contextEn?: string | null;
  contextVi?: string | null;
  sense?: number | null;
};

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown error";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      word?: string;
      wordType?: string | null;
      meaning?: string | null;
      phrases?: PhraseInput[];
    };

    const word = body.word?.trim() ?? "";
    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const phrases = (body.phrases ?? [])
      .map((item) => ({
        en: item.en?.trim() ?? "",
        contextEn: item.contextEn?.trim() || null,
        contextVi: item.contextVi?.trim() || null,
        sense: item.sense ?? null,
      }))
      .filter((item) => item.en);

    if (!phrases.length) {
      return NextResponse.json(
        { error: "At least one phrase is required" },
        { status: 400 },
      );
    }

    const meaningLines = alignmentMeaningLines(body.meaning);
    const geminiInput = phrases.map((item) => ({
      en: item.en,
      contextEn: item.contextEn,
      contextVi: item.contextVi,
      senseMeaning:
        item.sense && meaningLines[item.sense - 1]
          ? meaningLines[item.sense - 1]!
          : meaningLines[0] ?? body.meaning ?? null,
    }));

    const translations = await translateCollocationsWithGemini(
      word,
      geminiInput,
      body.wordType,
      body.meaning,
    );

    if (!translations?.length) {
      return NextResponse.json(
        { error: "Translation unavailable" },
        { status: 503 },
      );
    }

    return NextResponse.json({
      translations: phrases.map((item, index) => ({
        en: item.en,
        vi: translations[index] ?? "",
        sense: item.sense ?? undefined,
      })),
    });
  } catch (error) {
    console.error("Learning chunk translate error:", error);
    return NextResponse.json(
      { error: "Failed to translate phrases", details: errorMessage(error) },
      { status: 500 },
    );
  }
}
