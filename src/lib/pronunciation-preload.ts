import {
  DEFAULT_BOOTSTRAP_RANGE,
  type RangeBootstrapData,
} from "@/lib/app-bootstrap";
import {
  filterDiscoverQueue,
  type DiscoverListItem,
} from "@/lib/discover-fetch";
import { readOnboarding } from "@/lib/onboarding";
import { getCachedLearningSummary } from "@/lib/review-due-store";
import { resolveReviewSession } from "@/lib/review-session";
import { speakWordInUserGesture } from "@/lib/speak-word";
import {
  preloadWordAudioElement,
  warmWordAudioBytes,
} from "@/lib/word-pronunciation-audio";

const PRONUNCIATION_WARM_CONCURRENCY = 4;
/** First N cards get immediate MP3 warm — fixes slow audio on journey/review open. */
export const PRONUNCIATION_PRIORITY_COUNT = 3;
const AHEAD_PRONUNCIATION_STAGGER_MS = 80;

let journeyRangesCache: Record<string, RangeBootstrapData> | null = null;
let journeyCurrentWord: string | null = null;

/** Browser-fetch MP3 bytes so the next card play hits cache. */
export function warmWordPronunciation(word: string): void {
  const trimmed = word?.trim();
  if (!trimmed) return;
  warmWordAudioBytes(trimmed);
}

function uniquePronunciationWords(words: string[]): string[] {
  const unique: string[] = [];
  const seen = new Set<string>();
  for (const raw of words) {
    const trimmed = raw?.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    unique.push(trimmed);
  }
  return unique;
}

/** Preload pronunciation for one or more words (current card + ahead). */
export function preloadWordPronunciations(words: string[]): void {
  const unique = uniquePronunciationWords(words);
  for (let index = 0; index < unique.length; index++) {
    const trimmed = unique[index]!;
    if (index < PRONUNCIATION_PRIORITY_COUNT) {
      preloadWordAudioElement(trimmed);
      void warmWordAudioBytes(trimmed);
      continue;
    }
    window.setTimeout(
      () => {
        void warmWordAudioBytes(trimmed);
      },
      (index - PRONUNCIATION_PRIORITY_COUNT + 1) * AHEAD_PRONUNCIATION_STAGGER_MS,
    );
  }
}

/** Cache discover band queues so Journey tab can warm the first word early. */
export function seedJourneyBootstrapRanges(
  ranges: Record<string, RangeBootstrapData> | null,
): void {
  journeyRangesCache = ranges;
}

/** Track the visible Journey card for tab-bar prewarm. */
export function seedJourneyCurrentWord(word: string | null | undefined): void {
  journeyCurrentWord = word?.trim() || null;
}

function resolveJourneyPriorityWords(
  count = PRONUNCIATION_PRIORITY_COUNT,
): string[] {
  const words: string[] = [];
  const seen = new Set<string>();

  const pushWord = (raw: string | null | undefined) => {
    const trimmed = raw?.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    words.push(trimmed);
  };

  pushWord(journeyCurrentWord);

  const rangeId = readOnboarding().preferredRangeId || DEFAULT_BOOTSTRAP_RANGE;
  const queues: DiscoverListItem[][] = [];
  const preferredQueue = journeyRangesCache?.[rangeId]?.queue;
  if (preferredQueue?.length) queues.push(filterDiscoverQueue(preferredQueue));
  if (journeyRangesCache) {
    for (const range of Object.values(journeyRangesCache)) {
      if (range.queue !== preferredQueue) {
        queues.push(filterDiscoverQueue(range.queue));
      }
    }
  }

  for (const queue of queues) {
    for (const item of queue) {
      pushWord(item.word);
      if (words.length >= count) return words;
    }
  }

  return words;
}

/** Start warming the first Journey word (call on Journey tab tap). */
export function warmFirstJourneyWordPronunciation(): void {
  if (typeof window === "undefined") return;
  preloadWordPronunciations(resolveJourneyPriorityWords());
}

/** Unlock audio and speak the Journey word inside tab/button pointerdown. */
export function primeJourneyAudioFromUserGesture(): void {
  if (typeof window === "undefined") return;
  const first = resolveJourneyPriorityWords(1)[0];
  if (!first) {
    warmFirstJourneyWordPronunciation();
    return;
  }
  seedJourneyCurrentWord(first);
  speakWordInUserGesture(first);
}

/** Start warming the first due review word (call on Review tab tap). */
export function warmFirstReviewWordPronunciation(): void {
  if (typeof window === "undefined") return;
  const words = resolveReviewSession(getCachedLearningSummary())
    .queue.slice(0, PRONUNCIATION_PRIORITY_COUNT)
    .map((item) => item.word);
  if (!words.length) return;
  preloadWordPronunciations(words);
}

/** Warm pronunciation bytes with limited concurrency (bootstrap). */
export async function warmWordPronunciationsBatch(words: string[]): Promise<void> {
  const unique = uniquePronunciationWords(words);
  if (unique.length === 0) return;

  const priority = unique.slice(0, PRONUNCIATION_PRIORITY_COUNT);
  await Promise.all(
    priority.map(async (word) => {
      preloadWordAudioElement(word);
      await warmWordAudioBytes(word);
    }),
  );

  const rest = unique.slice(PRONUNCIATION_PRIORITY_COUNT);
  if (rest.length === 0) return;

  let index = 0;
  async function worker() {
    while (index < rest.length) {
      const current = index;
      index += 1;
      await warmWordAudioBytes(rest[current]!);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(PRONUNCIATION_WARM_CONCURRENCY, rest.length) },
      () => worker(),
    ),
  );
}
