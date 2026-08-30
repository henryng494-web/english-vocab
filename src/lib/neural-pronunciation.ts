import { MsEdgeTTS, OUTPUT_FORMAT } from "msedge-tts";

/** Natural US neural voice — youthful, consistent when dictionary has no clip. */
export const PRONOUNCE_NEURAL_VOICE = "en-US-JennyNeural";

let edgeTtsReady: Promise<MsEdgeTTS> | null = null;

async function getEdgeTts(): Promise<MsEdgeTTS> {
  if (edgeTtsReady) return edgeTtsReady;
  edgeTtsReady = (async () => {
    const tts = new MsEdgeTTS();
    await tts.setMetadata(
      PRONOUNCE_NEURAL_VOICE,
      OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3,
    );
    return tts;
  })();
  return edgeTtsReady;
}

const neuralAudioCache = new Map<string, ArrayBuffer>();
const NEURAL_CACHE_MAX = 4000;

/** Microsoft Edge neural TTS (server-only). */
export async function lookupNeuralTtsAudio(word: string): Promise<ArrayBuffer | null> {
  const key = word.trim().toLowerCase();
  if (!key) return null;

  const cached = neuralAudioCache.get(key);
  if (cached) return cached;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  try {
    const tts = await getEdgeTts();
    if (controller.signal.aborted) return null;

    const { audioStream } = await tts.toStream(key);
    const chunks: Buffer[] = [];
    for await (const chunk of audioStream) {
      if (controller.signal.aborted) return null;
      chunks.push(Buffer.from(chunk));
    }

    const bytes = Buffer.concat(chunks);
    if (bytes.byteLength === 0) return null;

    const buffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength,
    );
    if (neuralAudioCache.size >= NEURAL_CACHE_MAX) {
      const first = neuralAudioCache.keys().next().value;
      if (first) neuralAudioCache.delete(first);
    }
    neuralAudioCache.set(key, buffer);
    return buffer;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}
