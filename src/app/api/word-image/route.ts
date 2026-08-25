import { isExcludedVocabWord } from "@/lib/proper-noun";
import { getFamilyHeadword } from "@/lib/word-family";
import { resolveWordImageForApi } from "@/lib/word-image-api";
import { toWordImageApiResponse } from "@/lib/word-image-result";
import {
  getDefaultLearningImageDataUrl,
} from "@/lib/unsplash";
import { normalizeVocabInput } from "@/lib/word-validation";
import { NextResponse } from "next/server";

/** Fast image lookup for cards — uses stored URL or stock pipelines with unified response. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = normalizeVocabInput(searchParams.get("word") ?? "");
  const pos = searchParams.get("pos")?.trim() || null;

  if (!word) {
    return NextResponse.json({ error: "Word is required" }, { status: 400 });
  }
  if (
    isExcludedVocabWord(word) ||
    isExcludedVocabWord(getFamilyHeadword(word))
  ) {
    return NextResponse.json({ error: "Word not available" }, { status: 404 });
  }

  try {
    const result = await resolveWordImageForApi(
      word,
      searchParams.get("keyword")?.trim(),
      pos,
      searchParams.get("meaning")?.trim(),
    );
    return NextResponse.json(toWordImageApiResponse(result));
  } catch (error) {
    console.error("word-image error:", error);
    const fallback = getDefaultLearningImageDataUrl(word, pos);
    return NextResponse.json(
      toWordImageApiResponse({
        url: fallback,
        source: "error",
        error: true,
        searchKeyword: null,
      }),
    );
  }
}
