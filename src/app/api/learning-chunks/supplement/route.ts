import { supplementCollocationsWithGemini } from "@/lib/gemini-core";
import { MAX_LEARNING_COLLOCATIONS } from "@/data/demo-learning-chunks";
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
    const body = (await request.json()) as {
      word?: string;
      wordType?: string | null;
      meaning?: string | null;
      register?: string | null;
      englishDefinition?: string | null;
      existing?: string[];
      usefulPhrase?: { en?: string; vi?: string } | null;
      count?: number;
    };

    const word = body.word?.trim() ?? "";
    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const existing = (body.existing ?? [])
      .map((item) => item.trim())
      .filter(Boolean);
    const count = Math.min(
      Math.max(body.count ?? 1, 1),
      MAX_LEARNING_COLLOCATIONS,
    );
    const usefulPhrase =
      body.usefulPhrase?.en?.trim() && body.usefulPhrase?.vi?.trim()
        ? {
            en: body.usefulPhrase.en.trim(),
            vi: body.usefulPhrase.vi.trim(),
          }
        : null;

    const collocations = await supplementCollocationsWithGemini(
      word,
      count,
      body.wordType,
      body.meaning,
      existing,
      usefulPhrase,
      {
        register: body.register,
        englishDefinition: body.englishDefinition,
      },
    );

    if (!collocations?.length) {
      return NextResponse.json(
        { error: "Supplement unavailable" },
        { status: 503 },
      );
    }

    return NextResponse.json({ collocations });
  } catch (error) {
    console.error("Learning chunk supplement error:", error);
    return NextResponse.json(
      { error: "Failed to supplement phrases", details: errorMessage(error) },
      { status: 500 },
    );
  }
}
