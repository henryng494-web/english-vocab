import { isExcludedVocabWord } from "@/lib/proper-noun";
import { getFamilyHeadword } from "@/lib/word-family";
import { resolveWordImageForApi } from "@/lib/word-image-api";
import { normalizeVocabInput } from "@/lib/word-validation";
import { NextResponse } from "next/server";

/** Fast image lookup for cards — no Gemini enrichment. */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const word = normalizeVocabInput(searchParams.get("word") ?? "");
    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }
    if (
      isExcludedVocabWord(word) ||
      isExcludedVocabWord(getFamilyHeadword(word))
    ) {
      return NextResponse.json({ error: "Word not available" }, { status: 404 });
    }

    const imageUrl = await resolveWordImageForApi(
      word,
      searchParams.get("keyword")?.trim(),
      searchParams.get("pos")?.trim(),
      searchParams.get("meaning")?.trim(),
    );

    return NextResponse.json({ image_url: imageUrl });
  } catch (error) {
    console.error("word-image error:", error);
    return NextResponse.json({ image_url: null });
  }
}
