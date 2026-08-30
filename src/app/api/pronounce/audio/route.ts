import { lookupFallbackTtsAudio } from "@/lib/dictionary-pronunciation";
import { lookupNeuralTtsAudio } from "@/lib/neural-pronunciation";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

const NEURAL_BUDGET_MS = 2500;
const MAX_SENTENCE_LEN = 220;

function raceTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), ms);
    }),
  ]);
}

function resolveSpeechText(request: NextRequest): string | null {
  const word = request.nextUrl.searchParams.get("word")?.trim().toLowerCase();
  if (word) {
    if (!/^[a-z][a-z'-]*$/i.test(word)) return null;
    return word;
  }

  const text = request.nextUrl.searchParams.get("text")?.trim();
  if (!text || text.length > MAX_SENTENCE_LEN) return null;
  if (!/^[a-z0-9\s.,!?'";:\-()]+$/i.test(text)) return null;
  return text;
}

export async function GET(request: NextRequest) {
  const speech = resolveSpeechText(request);
  if (!speech) {
    return NextResponse.json({ error: "Invalid word or text" }, { status: 400 });
  }

  const neuralPromise = lookupNeuralTtsAudio(speech);
  const fallbackPromise = lookupFallbackTtsAudio(speech);

  let bytes = await raceTimeout(neuralPromise, NEURAL_BUDGET_MS);
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
