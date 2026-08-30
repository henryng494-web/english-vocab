import {
  lookupDictionaryAudioUrl,
  lookupFallbackTtsAudio,
} from "@/lib/dictionary-pronunciation";
import { NextRequest, NextResponse } from "next/server";

async function fetchDictionaryBytes(word: string): Promise<ArrayBuffer | null> {
  const upstreamUrl = await lookupDictionaryAudioUrl(word);
  if (!upstreamUrl) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const upstream = await fetch(upstreamUrl, {
      signal: controller.signal,
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!upstream.ok) return null;
    const bytes = await upstream.arrayBuffer();
    return bytes.byteLength > 0 ? bytes : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function GET(request: NextRequest) {
  const word = request.nextUrl.searchParams.get("word")?.trim().toLowerCase();
  if (!word || !/^[a-z][a-z'-]*$/i.test(word)) {
    return NextResponse.json({ error: "Invalid word" }, { status: 400 });
  }

  const bytes =
    (await fetchDictionaryBytes(word)) ?? (await lookupFallbackTtsAudio(word));

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
