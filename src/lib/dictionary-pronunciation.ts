import { apiUrl } from "@/lib/api-base";
import {
  DEFAULT_PRONOUNCE_ACCENT,
  isPronounceAccent,
  voiceVersionForAccent,
  type PronounceAccent,
} from "@/lib/pronounce-accent";

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

const ACCENT_AUDIO_PATTERNS: Record<PronounceAccent, RegExp[]> = {
  us: [/-us(?:-\w+)?\.mp3/i, /\/en\/[^/]*-us[^/]*\.mp3/i],
  uk: [
    /-gb(?:-\w+)?\.mp3/i,
    /\/en\/[^/]*-gb[^/]*\.mp3/i,
    /\/en\/[^/]*-uk[^/]*\.mp3/i,
  ],
  au: [/-au(?:-\w+)?\.mp3/i, /\/en\/[^/]*-au[^/]*\.mp3/i],
};

function pickAccentAudioUrl(
  phonetics: DictionaryPhonetic[] | undefined,
  accent: PronounceAccent,
): string | null {
  if (!phonetics?.length) return null;

  const withAudio = phonetics.filter((item) => item.audio?.trim());
  if (!withAudio.length) return null;

  for (const pattern of ACCENT_AUDIO_PATTERNS[accent]) {
    const match = withAudio.find((item) => pattern.test(item.audio!));
    if (match?.audio) return match.audio;
  }

  return withAudio[0]?.audio?.trim() ?? null;
}

const DICTIONARY_FETCH_TIMEOUT_MS = 2200;

/** Fetch dictionary MP3 bytes for the requested accent (same-origin proxy for client). */
export async function fetchDictionaryAudioBytes(
  word: string,
  accent: PronounceAccent = DEFAULT_PRONOUNCE_ACCENT,
): Promise<ArrayBuffer | null> {
  const upstreamUrl = await lookupDictionaryAudioUrl(word, accent);
  if (!upstreamUrl) return null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), DICTIONARY_FETCH_TIMEOUT_MS);

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

/** Upstream dictionary MP3 URL (cross-origin). */
const DICTIONARY_USER_AGENT =
  "Mozilla/5.0 (compatible; EnglishVocab/1.0; +https://english-vocab-omega.vercel.app)";

export async function lookupDictionaryAudioUrl(
  word: string,
  accent: PronounceAccent = DEFAULT_PRONOUNCE_ACCENT,
): Promise<string | null> {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return null;
  const cacheKey = `${accent}:${normalized}`;
  if (upstreamAudioCache.has(cacheKey)) return upstreamAudioCache.get(cacheKey) ?? null;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(normalized)}`,
      {
        signal: controller.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": DICTIONARY_USER_AGENT,
        },
        next: { revalidate: 60 * 60 * 24 * 30 },
      },
    );

    if (!response.ok) {
      upstreamAudioCache.set(cacheKey, null);
      return null;
    }

    const entries = (await response.json()) as DictionaryEntry[];
    for (const entry of entries) {
      const audioUrl = pickAccentAudioUrl(entry.phonetics, accent);
      if (audioUrl) {
        if (upstreamAudioCache.size >= MAX_CACHE) {
          const firstKey = upstreamAudioCache.keys().next().value;
          if (firstKey) upstreamAudioCache.delete(firstKey);
        }
        upstreamAudioCache.set(cacheKey, audioUrl);
        return audioUrl;
      }
    }

    upstreamAudioCache.set(cacheKey, null);
    return null;
  } catch {
    upstreamAudioCache.set(cacheKey, null);
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export function proxyPronounceAudioPath(
  text: string,
  accent: PronounceAccent = DEFAULT_PRONOUNCE_ACCENT,
): string {
  const normalized = text.trim();
  const params = new URLSearchParams({
    text: normalized,
    v: voiceVersionForAccent(accent),
    accent,
  });
  return apiUrl(`/api/pronounce/audio?${params}`);
}

export function parsePronounceAccentParam(value: string | null): PronounceAccent {
  return isPronounceAccent(value) ? value : DEFAULT_PRONOUNCE_ACCENT;
}

/** Google translate_tts works reliably up to ~200 characters per request. */
export const FALLBACK_TTS_MAX_CHARS = 200;

/** HTTP TTS fallback when Bing Edge WebSocket is unavailable (e.g. Vercel cold start). */
export async function lookupFallbackTtsAudio(
  text: string,
  options?: { timeoutMs?: number },
): Promise<ArrayBuffer | null> {
  const q = text.trim();
  if (!q || q.length > FALLBACK_TTS_MAX_CHARS) return null;

  const timeoutMs = options?.timeoutMs ?? 4500;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = new URL("https://translate.google.com/translate_tts");
    url.searchParams.set("ie", "UTF-8");
    url.searchParams.set("client", "tw-ob");
    url.searchParams.set("q", q);
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
