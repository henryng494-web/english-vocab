import { PRONOUNCE_VOICE_VERSION } from "@/lib/neural-pronunciation";

type DictionaryPhonetic = {
  text?: string;
  audio?: string;
};

type DictionaryEntry = {
  word?: string;
  phonetics?: DictionaryPhonetic[];
};

const upstreamAudioCache = new Map<string, string | null>();
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

/** Upstream dictionary MP3 URL (cross-origin). */
export async function lookupDictionaryAudioUrl(word: string): Promise<string | null> {
  const key = word.trim().toLowerCase();
  if (!key) return null;
  if (upstreamAudioCache.has(key)) return upstreamAudioCache.get(key) ?? null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`,
      {
        signal: controller.signal,
        next: { revalidate: 60 * 60 * 24 * 30 },
      },
    );

    if (!response.ok) {
      upstreamAudioCache.set(key, null);
      return null;
    }

    const entries = (await response.json()) as DictionaryEntry[];
    for (const entry of entries) {
      const audioUrl = pickUsAudioUrl(entry.phonetics);
      if (audioUrl) {
        if (upstreamAudioCache.size >= MAX_CACHE) {
          const firstKey = upstreamAudioCache.keys().next().value;
          if (firstKey) upstreamAudioCache.delete(firstKey);
        }
        upstreamAudioCache.set(key, audioUrl);
        return audioUrl;
      }
    }

    upstreamAudioCache.set(key, null);
    return null;
  } catch {
    upstreamAudioCache.set(key, null);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function proxyPronounceAudioPath(word: string): string {
  const params = new URLSearchParams({
    word: word.trim().toLowerCase(),
    v: PRONOUNCE_VOICE_VERSION,
  });
  return `/api/pronounce/audio?${params}`;
}

/** HTTP TTS fallback when Bing Edge WebSocket is unavailable (e.g. Vercel cold start). */
export async function lookupFallbackTtsAudio(word: string): Promise<ArrayBuffer | null> {
  const key = word.trim().toLowerCase();
  if (!key) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const url = new URL("https://translate.google.com/translate_tts");
    url.searchParams.set("ie", "UTF-8");
    url.searchParams.set("client", "tw-ob");
    url.searchParams.set("q", key);
    url.searchParams.set("tl", "en-US");

    const response = await fetch(url.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; EnglishVocab/1.0; +https://english-vocab-omega.vercel.app)",
      },
      next: { revalidate: 60 * 60 * 24 * 7 },
    });

    if (!response.ok) return null;
    const bytes = await response.arrayBuffer();
    return bytes.byteLength > 0 ? bytes : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
