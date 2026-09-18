import {
  DEFAULT_PRONOUNCE_ACCENT,
  NEURAL_VOICE_BY_ACCENT,
  voiceVersionForAccent,
  type PronounceAccent,
} from "@/lib/pronounce-accent";
import { Communicate } from "edge-tts-universal";

/** @deprecated Use voiceVersionForAccent(accent) — kept for legacy cache checks. */
export const PRONOUNCE_VOICE_VERSION = voiceVersionForAccent(DEFAULT_PRONOUNCE_ACCENT);
/** Learner pace — slower than default neural TTS. */
export const PRONOUNCE_NEURAL_RATE = "-22%";
/** Light lift — keeps delivery clear without sounding cartoonish. */
export const PRONOUNCE_NEURAL_PITCH = "+4Hz";

const neuralAudioCache = new Map<string, ArrayBuffer>();
const NEURAL_CACHE_MAX = 4000;
/** Fail fast when Bing WebSocket cannot connect (common on cold Vercel instances). */
const CONNECTION_TIMEOUT_MS = 6000;
const SYNTHESIS_TIMEOUT_MS = 8000;

function cacheKey(word: string, accent: PronounceAccent): string {
  return `${voiceVersionForAccent(accent)}:${word.trim().toLowerCase()}`;
}

async function synthesizeNeuralMp3(
  word: string,
  accent: PronounceAccent,
): Promise<ArrayBuffer | null> {
  const comm = new Communicate(word, {
    voice: NEURAL_VOICE_BY_ACCENT[accent],
    rate: PRONOUNCE_NEURAL_RATE,
    pitch: PRONOUNCE_NEURAL_PITCH,
    connectionTimeout: CONNECTION_TIMEOUT_MS,
  });
  const chunks: Buffer[] = [];

  try {
    for await (const chunk of comm.stream()) {
      if (chunk.type === "audio" && chunk.data?.length) {
        chunks.push(Buffer.from(chunk.data));
      }
    }
  } catch {
    return null;
  }

  if (!chunks.length) return null;

  const bytes = Buffer.concat(chunks);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function raceTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), ms);
    }),
  ]);
}

/** Microsoft Edge neural TTS (server-only). Per-request WebSocket with hard timeout. */
export async function lookupNeuralTtsAudio(
  word: string,
  accent: PronounceAccent = DEFAULT_PRONOUNCE_ACCENT,
): Promise<ArrayBuffer | null> {
  const normalized = word.trim().toLowerCase();
  if (!normalized) return null;

  const key = cacheKey(normalized, accent);

  const cached = neuralAudioCache.get(key);
  if (cached) return cached;

  const buffer = await raceTimeout(
    synthesizeNeuralMp3(normalized, accent).catch(() => null),
    SYNTHESIS_TIMEOUT_MS,
  );
  if (!buffer || buffer.byteLength === 0) return null;

  if (neuralAudioCache.size >= NEURAL_CACHE_MAX) {
    const first = neuralAudioCache.keys().next().value;
    if (first) neuralAudioCache.delete(first);
  }
  neuralAudioCache.set(key, buffer);
  return buffer;
}
