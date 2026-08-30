import { Communicate } from "edge-tts-universal";

/** Natural US neural voice — single voice for all words. */
export const PRONOUNCE_NEURAL_VOICE = "en-US-JennyNeural";

const neuralAudioCache = new Map<string, ArrayBuffer>();
const NEURAL_CACHE_MAX = 4000;
const SYNTHESIS_TIMEOUT_MS = 12_000;

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), ms);
    }),
  ]);
}

async function synthesizeNeuralMp3(word: string): Promise<ArrayBuffer | null> {
  const comm = new Communicate(word, { voice: PRONOUNCE_NEURAL_VOICE });
  const chunks: Buffer[] = [];

  for await (const chunk of comm.stream()) {
    if (chunk.type === "audio" && chunk.data?.length) {
      chunks.push(Buffer.from(chunk.data));
    }
  }

  if (!chunks.length) return null;

  const bytes = Buffer.concat(chunks);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

/** Microsoft Edge neural TTS (server-only). Fresh WebSocket per word — no stuck singleton. */
export async function lookupNeuralTtsAudio(word: string): Promise<ArrayBuffer | null> {
  const key = word.trim().toLowerCase();
  if (!key) return null;

  const cached = neuralAudioCache.get(key);
  if (cached) return cached;

  const buffer = await withTimeout(
    synthesizeNeuralMp3(key).catch(() => null),
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
