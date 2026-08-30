import { lookupFallbackTtsAudio } from "@/lib/dictionary-pronunciation";
import { lookupNeuralTtsAudio } from "@/lib/neural-pronunciation";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

function raceTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), ms);
    }),
  ]);
}

export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get("word")?.trim().toLowerCase();
  if (!word || !/^[a-z][a-z'-]*$/i.test(word)) {
    return NextResponse.json({ error: "Invalid word" }, { status: 400 });
  }

  const fallbackPromise = lookupFallbackTtsAudio(word);

  let bytes = await raceTimeout(lookupNeuralTtsAudio(word), 7000);
  if (!bytes) {
    bytes = await fallbackPromise;
  }

  if (!bytes) {
    return NextResponse.json({ error: "No audio" }, { status: 404 });
  }

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400",
    },
  });
}
