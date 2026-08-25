import { enrichWord } from "@/lib/enrich-word";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { getFamilyHeadword } from "@/lib/word-family";
import { normalizeVocabInput } from "@/lib/word-validation";
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
    const { word } = (await request.json()) as { word?: string };

    const normalized = normalizeVocabInput(word ?? "");
    if (!normalized) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    const trimmed = getFamilyHeadword(normalized);
    if (
      isExcludedVocabWord(trimmed) ||
      isExcludedVocabWord(getFamilyHeadword(trimmed))
    ) {
      return NextResponse.json(
        { error: "Word not available in this app" },
        { status: 404 },
      );
    }

    const enrichment = await enrichWord(trimmed);
    return NextResponse.json(enrichment);
  } catch (error) {
    console.error("Gemini enrich error:", error);
    return NextResponse.json(
      { error: "Failed to enrich word", details: errorMessage(error) },
      { status: 500 },
    );
  }
}
