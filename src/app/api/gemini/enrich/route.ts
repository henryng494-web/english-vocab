import { enrichWord } from "@/lib/enrich-word";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { word } = (await request.json()) as { word?: string };

  if (!word?.trim()) {
    return NextResponse.json({ error: "Word is required" }, { status: 400 });
  }

  const trimmed = word.trim();
  const enrichment = await enrichWord(trimmed);
  return NextResponse.json(enrichment);
}
