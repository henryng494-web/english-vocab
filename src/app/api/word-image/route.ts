import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import { createClient } from "@/lib/supabase/server";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { getFamilyHeadword } from "@/lib/word-family";
import {
  fetchWordImageUrl,
  isRealCardImageUrl,
  shouldRefreshImageUrl,
} from "@/lib/unsplash";
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

    const keywordParam = searchParams.get("keyword")?.trim();
    const posParam = searchParams.get("pos")?.trim();

    const supabase = await createClient();
    const { data: detail } = await supabase
      .from("word_details")
      .select("image_url, word_type, vietnamese_meaning")
      .eq("word", word)
      .maybeSingle();

    const searchKeyword =
      keywordParam ||
      resolveImageSearchKeyword(word, {
        pos: posParam || detail?.word_type,
        meaning: detail?.vietnamese_meaning,
      });
    const pos = posParam || detail?.word_type || null;

    const stored = detail?.image_url?.trim();
    if (stored && !shouldRefreshImageUrl(stored, word) && isRealCardImageUrl(stored, word)) {
      return NextResponse.json({ image_url: stored });
    }

    const resolved = await fetchWordImageUrl(
      word,
      searchKeyword,
      pos,
    );
    const imageUrl = isRealCardImageUrl(resolved, word) ? resolved : null;

    if (imageUrl && imageUrl !== stored) {
      try {
        await supabase
          .from("word_details")
          .update({ image_url: imageUrl })
          .eq("word", word);
      } catch {
        /* best-effort persist */
      }
    }

    return NextResponse.json({ image_url: imageUrl });
  } catch (error) {
    console.error("word-image error:", error);
    return NextResponse.json({ image_url: null });
  }
}
