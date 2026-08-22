import { readLocalLearning } from "@/lib/learning-storage";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import type { LearningStatus } from "@/types/database";

export const REVIEW_INTERVALS = [1, 2, 4, 7, 14, 30] as const;

export type ReviewIntervalDays = (typeof REVIEW_INTERVALS)[number];

export type ReviewScheduleEntry = {
  intervalDays: ReviewIntervalDays;
  nextReviewAt: string;
  timesReviewed: number;
};

const STORAGE_KEY = "english-vocab-review-schedule-v1";

type ScheduleMap = Record<string, ReviewScheduleEntry>;

function isInterval(value: number): value is ReviewIntervalDays {
  return (REVIEW_INTERVALS as readonly number[]).includes(value);
}

export function formatReviewInLabel(days: number): string {
  return days === 1 ? "Review in 1 day" : `Review in ${days} days`;
}

export function advanceReviewInterval(current: ReviewIntervalDays): ReviewIntervalDays {
  const index = REVIEW_INTERVALS.indexOf(current);
  if (index < 0) return REVIEW_INTERVALS[0];
  return REVIEW_INTERVALS[Math.min(index + 1, REVIEW_INTERVALS.length - 1)];
}

export function intervalLevelIndex(days: ReviewIntervalDays): number {
  const index = REVIEW_INTERVALS.indexOf(days);
  return index < 0 ? 0 : index;
}

export function readReviewSchedule(): ScheduleMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ScheduleMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function getReviewSchedule(word: string): ReviewScheduleEntry {
  const key = word.trim().toLowerCase();
  const stored = readReviewSchedule()[key];
  if (
    stored &&
    isInterval(stored.intervalDays) &&
    typeof stored.nextReviewAt === "string" &&
    typeof stored.timesReviewed === "number"
  ) {
    return stored;
  }
  return {
    intervalDays: 1,
    nextReviewAt: new Date(0).toISOString(),
    timesReviewed: 0,
  };
}

function endOfLocalDay(now = Date.now()): number {
  const d = new Date(now);
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export function isReviewDue(word: string, now = Date.now()): boolean {
  const entry = getReviewSchedule(word);
  return Date.parse(entry.nextReviewAt) <= endOfLocalDay(now);
}

export function isDueReviewWord(
  word: string,
  learningStatus: LearningStatus,
  lastReviewedAt: string | null | undefined,
  now = Date.now(),
): boolean {
  if (isExcludedVocabWord(word)) return false;
  const local = readLocalLearning();
  const localEntry = local[word] ?? local[word.trim().toLowerCase()];
  const status = localEntry?.status ?? learningStatus;
  if (status === "mastered") return false;
  const tracked = Boolean(localEntry) || Boolean(lastReviewedAt);
  if (!tracked) return false;
  return isReviewDue(word, now);
}

export function countDueReviewWords(
  extraWords: Array<{
    word: string;
    status?: LearningStatus | string;
    last_reviewed_at?: string | null;
  }> = [],
  now = Date.now(),
): number {
  const local = readLocalLearning();
  const due = new Set<string>();

  for (const [word, entry] of Object.entries(local)) {
    if (isExcludedVocabWord(word)) continue;
    if (entry.status === "mastered") continue;
    if (isReviewDue(word, now)) due.add(word.trim().toLowerCase());
  }

  for (const item of extraWords) {
    const key = item.word.trim().toLowerCase();
    if (isExcludedVocabWord(key)) continue;
    if (
      isDueReviewWord(
        item.word,
        (item.status as LearningStatus) ?? "new",
        item.last_reviewed_at,
        now,
      )
    ) {
      due.add(key);
    }
  }

  return due.size;
}

export function writeReviewSchedule(
  word: string,
  intervalDays: ReviewIntervalDays,
  timesReviewed: number,
  now = new Date(),
): ReviewScheduleEntry {
  const key = word.trim().toLowerCase();
  const map = readReviewSchedule();
  const nextReviewAt = new Date(
    now.getTime() + intervalDays * 24 * 60 * 60 * 1000,
  ).toISOString();
  const entry: ReviewScheduleEntry = {
    intervalDays,
    nextReviewAt,
    timesReviewed,
  };
  map[key] = entry;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("vocab-learning-changed"));
  return entry;
}
