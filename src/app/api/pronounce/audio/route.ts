import {
  fetchDictionaryAudioBytes,
  lookupFallbackTtsAudio,
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

/** Stay under Vercel invocation limits — neural WebSocket often exceeds 10s on cold start. */
const NEURAL_BUDGET_MS = 5000;

async function lookupNeuralWithBudget(
  text: string,
  accent: ReturnType<typeof parsePronounceAccentParam>,
): Promise<ArrayBuffer | null> {
  return Promise.race([
    lookupNeuralTtsAudio(text, accent),
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), NEURAL_BUDGET_MS);
    }),
  ]);
}

export async function GET(request: NextRequest) {
  const text = parsePronounceTextParam(
    request.nextUrl.searchParams.get("text"),
    request.nextUrl.searchParams.get("word"),
  );
  if (!text) {
    return NextResponse.json({ error: "Invalid text" }, { status: 400 });
  }

  const accent = parsePronounceAccentParam(request.nextUrl.searchParams.get("accent"));

  let engine: "dictionary" | "fallback-http" | "neural" = "fallback-http";
  let bytes: ArrayBuffer | null = null;

  if (isSinglePronounceWord(text)) {
    bytes = await fetchDictionaryAudioBytes(text, accent);
    if (bytes) engine = "dictionary";
  }

  // Fast HTTP TTS before Edge neural — avoids FUNCTION_INVOCATION_TIMEOUT on production.
  if (!bytes && isSinglePronounceWord(text)) {
    bytes = await lookupFallbackTtsAudio(text);
    if (bytes) engine = "fallback-http";
  }

  if (!bytes) {
    const neural = await lookupNeuralWithBudget(text, accent);
    if (neural) {
      bytes = neural;
      engine = "neural";
    }
  }

  if (!bytes) {
    return NextResponse.json(
      { error: "Pronunciation unavailable" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "1",
          "X-Pronounce-Engine": "none",
        },
      },
    );
  }

  return new NextResponse(bytes, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400",
      "X-Pronounce-Engine": engine,
    },
  });
}
