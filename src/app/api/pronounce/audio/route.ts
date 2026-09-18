import {
  fetchDictionaryAudioBytes,
  parsePronounceAccentParam,
} from "@/lib/dictionary-pronunciation";
import { lookupNeuralTtsAudio } from "@/lib/neural-pronunciation";
import {
  isSinglePronounceWord,
  parsePronounceTextParam,
} from "@/lib/pronounce-text";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

const NEURAL_RETRY_DELAY_MS = 350;

export async function GET(request: NextRequest) {
  const text = parsePronounceTextParam(
    request.nextUrl.searchParams.get("text"),
    request.nextUrl.searchParams.get("word"),
  );
  if (!text) {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  const accent = parsePronounceAccentParam(request.nextUrl.searchParams.get("accent"));

  const dictionaryBytes =
    isSinglePronounceWord(text) ? await fetchDictionaryAudioBytes(text, accent) : null;
  if (dictionaryBytes) {
    return new NextResponse(dictionaryBytes, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400",
        "X-Pronounce-Engine": "dictionary",
      },
    });
  }

  let bytes = await lookupNeuralTtsAudio(text, accent);
  if (!bytes) {
    await new Promise((resolve) => setTimeout(resolve, NEURAL_RETRY_DELAY_MS));
    bytes = await lookupNeuralTtsAudio(text, accent);
  }

  if (!bytes) {
    return NextResponse.json(
      { error: "Neural TTS unavailable" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "1",
        },
      },
    );
  }

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400",
      "X-Pronounce-Engine": "neural",
    },
  });
}
