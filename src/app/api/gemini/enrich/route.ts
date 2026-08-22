import { enrichWord } from "@/lib/enrich-word";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { getFamilyHeadword } from "@/lib/word-family";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { word } = (await request.json()) as { word?: string };

  if (!word?.trim()) {
    return NextResponse.json({ error: "Word is required" }, { status: 400 });
  }

  const trimmed = word.trim();
  if (isExcludedVocabWord(trimmed) || isExcludedVocabWord(getFamilyHeadword(trimmed))) {
    return NextResponse.json(
      { error: "Word not available in this app" },
      { status: 404 },
    );
  }

  const enrichment = await enrichWord(trimmed);
  return NextResponse.json(enrichment);
}
