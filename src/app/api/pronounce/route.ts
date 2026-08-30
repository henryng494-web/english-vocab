import { proxyPronounceAudioPath } from "@/lib/dictionary-pronunciation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get("word")?.trim().toLowerCase();
  if (!word || !/^[a-z][a-z'-]*$/i.test(word)) {
    return NextResponse.json({ error: "Invalid word" }, { status: 400 });
  }

  const audioUrl = proxyPronounceAudioPath(word);
  return NextResponse.json(
    { audioUrl },
    { headers: { "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400" } },
  );
}
