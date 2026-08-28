import { NextRequest, NextResponse } from "next/server";

type DictionaryPhonetic = {
  text?: string;
  audio?: string;
};

type DictionaryEntry = {
  word?: string;
  phonetics?: DictionaryPhonetic[];
};

const audioCache = new Map<string, string | null>();
const MAX_CACHE = 8000;

function pickUsAudioUrl(phonetics: DictionaryPhonetic[] | undefined): string | null {
  if (!phonetics?.length) return null;

  const withAudio = phonetics.filter((item) => item.audio?.trim());
  if (!withAudio.length) return null;

  const usExact = withAudio.find((item) => /-us(?:-\w+)?\.mp3/i.test(item.audio!));
  if (usExact?.audio) return usExact.audio;

  const usLoose = withAudio.find((item) => /\/en\/[^/]*-us[^/]*\.mp3/i.test(item.audio!));
  if (usLoose?.audio) return usLoose.audio;

  return withAudio[0]?.audio?.trim() ?? null;
}

async function lookupDictionaryAudio(word: string): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`,
      {
        signal: controller.signal,
        next: { revalidate: 60 * 60 * 24 * 30 },
      },
    );

    if (!response.ok) return null;

    const entries = (await response.json()) as DictionaryEntry[];
    for (const entry of entries) {
      const audioUrl = pickUsAudioUrl(entry.phonetics);
      if (audioUrl) return audioUrl;
    }

    return null;
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

  if (audioCache.has(word)) {
    const cached = audioCache.get(word) ?? null;
    if (!cached) return NextResponse.json({ audioUrl: null }, { status: 404 });
    return NextResponse.json(
      { audioUrl: cached },
      { headers: { "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400" } },
    );
  }

  const audioUrl = await lookupDictionaryAudio(word);
  if (audioCache.size >= MAX_CACHE) {
    const firstKey = audioCache.keys().next().value;
    if (firstKey) audioCache.delete(firstKey);
  }
  audioCache.set(word, audioUrl);

  if (!audioUrl) {
    return NextResponse.json({ audioUrl: null }, { status: 404 });
  }

  return NextResponse.json(
    { audioUrl },
    { headers: { "Cache-Control": "public, max-age=2592000, stale-while-revalidate=86400" } },
  );
}
