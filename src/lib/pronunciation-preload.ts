import {
  preloadWordAudioElement,
  warmWordAudioBytes,
} from "@/lib/word-pronunciation-audio";

const PRONUNCIATION_WARM_CONCURRENCY = 4;

/** Browser-fetch MP3 bytes so the next card play hits cache. */
export function warmWordPronunciation(word: string): void {
  const trimmed = word?.trim();
  if (!trimmed) return;
  warmWordAudioBytes(trimmed);
}

/** Preload pronunciation for one or more words (current card + ahead). */
export function preloadWordPronunciations(words: string[]): void {
  for (let index = 0; index < words.length; index++) {
    const trimmed = words[index]?.trim();
    if (!trimmed) continue;
    // Only bind the shared <audio> element to the visible word — ahead words fetch only.
    if (index === 0) {
      preloadWordAudioElement(trimmed);
    }
    warmWordAudioBytes(trimmed);
  }
}

/** Warm pronunciation bytes with limited concurrency (bootstrap). */
export async function warmWordPronunciationsBatch(words: string[]): Promise<void> {
  const unique = [
    ...new Set(words.map((w) => w.trim().toLowerCase()).filter(Boolean)),
  ];
  if (unique.length === 0) return;

  let index = 0;
  async function worker() {
    while (index < unique.length) {
      const current = index;
      index += 1;
      warmWordAudioBytes(unique[current]!);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(PRONUNCIATION_WARM_CONCURRENCY, unique.length) },
      () => worker(),
    ),
  );
}
