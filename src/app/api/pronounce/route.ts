import {
  parsePronounceAccentParam,
  proxyPronounceAudioPath,
} from "@/lib/dictionary-pronunciation";
import { parsePronounceTextParam } from "@/lib/pronounce-text";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const text = parsePronounceTextParam(
    request.nextUrl.searchParams.get("text"),
    request.nextUrl.searchParams.get("word"),
  );
  if (!text) {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  const accent = parsePronounceAccentParam(request.nextUrl.searchParams.get("accent"));
  const audioUrl = proxyPronounceAudioPath(text, accent);
  return NextResponse.json(
    { audioUrl },
    { headers: { "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400" } },
  );
}
