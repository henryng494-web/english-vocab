import {
  fetchDictionaryAudioBytes,
  lookupFallbackTtsAudio,
  parsePronounceAccentParam,
} from "@/lib/dictionary-pronunciation";
import { lookupNeuralTtsAudio } from "@/lib/neural-pronunciation";
import {
  isLongPronouncePhrase,
  isSinglePronounceWord,
  parsePronounceTextParam,
} from "@/lib/pronounce-text";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
/** Phrases need more synthesis time than single words on cold Vercel instances. */
export const maxDuration = 30;

const NEURAL_BUDGET_WORD_MS = 5000;

function neuralBudgetMs(text: string): number {
  if (!isLongPronouncePhrase(text)) return NEURAL_BUDGET_WORD_MS;
  return Math.min(22_000, 8000 + text.length * 40);
}

function fallbackTimeoutMs(text: string): number {
  return Math.min(12_000, 4500 + text.length * 20);
}

async function lookupNeuralWithBudget(
  text: string,
  accent: ReturnType<typeof parsePronounceAccentParam>,
  budgetMs: number,
): Promise<ArrayBuffer | null> {
  return Promise.race([
    lookupNeuralTtsAudio(text, accent),
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), budgetMs);
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

  // Fast HTTP TTS before Edge neural (words + short phrases).
  if (!bytes) {
    bytes = await lookupFallbackTtsAudio(text, {
      timeoutMs: fallbackTimeoutMs(text),
      accent,
    });
    if (bytes) engine = "fallback-http";
  }

  if (!bytes) {
    const neural = await lookupNeuralWithBudget(
      text,
      accent,
      neuralBudgetMs(text),
    );
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
      "X-Pronounce-Accent": accent,
    },
  });
}
