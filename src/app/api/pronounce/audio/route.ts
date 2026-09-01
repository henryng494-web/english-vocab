import { fetchDictionaryAudioBytes } from "@/lib/dictionary-pronunciation";
import { lookupNeuralTtsAudio } from "@/lib/neural-pronunciation";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

const NEURAL_RETRY_DELAY_MS = 350;

export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get("word")?.trim().toLowerCase();
  if (!word || !/^[a-z][a-z'-]*$/i.test(word)) {
    return NextResponse.json({ error: "Invalid word" }, { status: 400 });
  }

  const dictionaryBytes = await fetchDictionaryAudioBytes(word);
  if (dictionaryBytes) {
    return new NextResponse(dictionaryBytes, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400",
        "X-Pronounce-Engine": "dictionary",
      },
    });
  }

  let bytes = await lookupNeuralTtsAudio(word);
  if (!bytes) {
    await new Promise((resolve) => setTimeout(resolve, NEURAL_RETRY_DELAY_MS));
    bytes = await lookupNeuralTtsAudio(word);
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
