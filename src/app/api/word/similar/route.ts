import { resolveSimilarWords } from "@/lib/word-synonyms";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get("word")?.trim().toLowerCase();
  if (!word || !/^[a-z][a-z'-]*$/i.test(word)) {
    return NextResponse.json({ error: "Invalid word" }, { status: 400 });
  }

  const similar_words = await resolveSimilarWords({
    word,
    pos: request.nextUrl.searchParams.get("pos"),
    meaning: request.nextUrl.searchParams.get("meaning"),
    englishDefinition: request.nextUrl.searchParams.get("definition"),
  });

  return NextResponse.json(
    { similar_words },
    {
      headers: {
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      },
    },
  );
}
