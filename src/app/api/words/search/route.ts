import { searchPresetWords } from "@/lib/word-search";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") ?? "";
    const limit = Math.min(
      60,
      Math.max(1, Number(searchParams.get("limit") ?? "30")),
    );

    if (!query.trim()) {
      return NextResponse.json({ words: [] });
    }

    const words = searchPresetWords(query, limit);
    return NextResponse.json({ words });
  } catch (error) {
    console.error("Word search error:", error);
    return NextResponse.json(
      { error: "Failed to search words" },
      { status: 500 },
    );
  }
}
