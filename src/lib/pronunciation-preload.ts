import {
  DEFAULT_BOOTSTRAP_RANGE,
  type RangeBootstrapData,
} from "@/lib/app-bootstrap";
import { filterDiscoverQueue } from "@/lib/discover-fetch";
import { readOnboarding } from "@/lib/onboarding";
import { getCachedLearningSummary } from "@/lib/review-due-store";
import { resolveReviewSession } from "@/lib/review-session";
import {
  preloadWordAudioElement,
  warmWordAudioBytes,
} from "@/lib/word-pronunciation-audio";

const PRONUNCIATION_WARM_CONCURRENCY = 4;
const AHEAD_PRONUNCIATION_STAGGER_MS = 120;

let journeyRangesCache: Record<string, RangeBootstrapData> | null = null;
let journeyCurrentWord: string | null = null;

/** Browser-fetch MP3 bytes so the next card play hits cache. */
export function warmWordPronunciation(word: string): void {
  const trimmed = word?.trim();
  if (!trimmed) return;
  warmWordAudioBytes(trimmed);
}

/** Preload pronunciation for one or more words (current card + ahead). */
export function preloadWordPronunciations(words: string[]): void {
  const current = words[0]?.trim();
  if (current) {
    preloadWordAudioElement(current);
    void warmWordAudioBytes(current);
  }

  for (let index = 1; index < words.length; index++) {
    const trimmed = words[index]?.trim();
    if (!trimmed) continue;
    window.setTimeout(
      () => {
        void warmWordAudioBytes(trimmed);
      },
      index * AHEAD_PRONUNCIATION_STAGGER_MS,
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

function resolveJourneyFirstWord(): string | null {
  if (journeyCurrentWord) return journeyCurrentWord;

  const rangeId = readOnboarding().preferredRangeId || DEFAULT_BOOTSTRAP_RANGE;
  const preferredQueue = journeyRangesCache?.[rangeId]?.queue;
  if (preferredQueue?.length) {
    const first = filterDiscoverQueue(preferredQueue)[0]?.word?.trim();
    if (first) return first;
  }

  if (!journeyRangesCache) return null;
  for (const range of Object.values(journeyRangesCache)) {
    const first = filterDiscoverQueue(range.queue)[0]?.word?.trim();
    if (first) return first;
  }
  return null;
}

/** Start warming the first Journey word (call on Journey tab tap). */
export function warmFirstJourneyWordPronunciation(): void {
  if (typeof window === "undefined") return;
  const first = resolveJourneyFirstWord();
  if (!first) return;
  preloadWordAudioElement(first);
  void warmWordAudioBytes(first);
}

/** Start warming the first due review word (call on Review tab tap). */
export function warmFirstReviewWordPronunciation(): void {
  if (typeof window === "undefined") return;
  const first = resolveReviewSession(getCachedLearningSummary()).queue[0]?.word?.trim();
  if (!first) return;
  preloadWordPronunciations([first]);
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
