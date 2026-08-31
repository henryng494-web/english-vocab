import { readLocalLearning } from "@/lib/learning-storage";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import {
  localReviewDateKey,
  readReviewSessionSnapshot,
} from "@/lib/review-session-storage";
import type { LearningStatus } from "@/types/database";

export const REVIEW_INTERVALS = [1, 2, 4, 7, 14, 30] as const;

export type ReviewIntervalDays = (typeof REVIEW_INTERVALS)[number];

/** Mark word as fully known — no further scheduled reviews. */
export const REVIEW_MASTERED_LABEL = "Already know";

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

export function formatReviewConfirmLabel(
  days: ReviewIntervalDays,
  markMastered: boolean,
): string {
  return markMastered ? REVIEW_MASTERED_LABEL : formatReviewInLabel(days);
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

type DueReviewContext = {
  now: number;
  endOfDay: number;
  local: ReturnType<typeof readLocalLearning>;
  schedule: ScheduleMap;
};

function createDueReviewContext(now = Date.now()): DueReviewContext {
  return {
    now,
    endOfDay: endOfLocalDay(now),
    local: readLocalLearning(),
    schedule: readReviewSchedule(),
  };
}

function scheduleEntryForWord(
  word: string,
  schedule: ScheduleMap,
): ReviewScheduleEntry {
  const key = word.trim().toLowerCase();
  const stored = schedule[key];
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

function isReviewDueWithContext(word: string, ctx: DueReviewContext): boolean {
  const entry = scheduleEntryForWord(word, ctx.schedule);
  return Date.parse(entry.nextReviewAt) <= ctx.endOfDay;
}

export function isReviewDue(word: string, now = Date.now()): boolean {
  const ctx = createDueReviewContext(now);
  return isReviewDueWithContext(word, ctx);
}

function isDueReviewWordWithContext(
  word: string,
  learningStatus: LearningStatus,
  lastReviewedAt: string | null | undefined,
  ctx: DueReviewContext,
): boolean {
  if (isExcludedVocabWord(word)) return false;
  const key = word.trim().toLowerCase();
  const localEntry = ctx.local[key] ?? ctx.local[word];
  const status = localEntry?.status ?? learningStatus;
  if (status === "mastered") return false;
  const tracked = Boolean(localEntry) || Boolean(lastReviewedAt);
  if (!tracked) return false;
  return isReviewDueWithContext(word, ctx);
}

export function isDueReviewWord(
  word: string,
  learningStatus: LearningStatus,
  lastReviewedAt: string | null | undefined,
  now = Date.now(),
): boolean {
  return isDueReviewWordWithContext(
    word,
    learningStatus,
    lastReviewedAt,
    createDueReviewContext(now),
  );
}

export function createDueReviewFilterContext(now = Date.now()): DueReviewContext {
  return createDueReviewContext(now);
}

export function isDueReviewWordInContext(
  word: string,
  learningStatus: LearningStatus,
  lastReviewedAt: string | null | undefined,
  ctx: DueReviewContext,
): boolean {
  return isDueReviewWordWithContext(word, learningStatus, lastReviewedAt, ctx);
}

function collectDueReviewKeys(
  extraWords: Array<{
    word: string;
    status?: LearningStatus | string;
    last_reviewed_at?: string | null;
  }> = [],
  now = Date.now(),
): Set<string> {
  const ctx = createDueReviewContext(now);
  const due = new Set<string>();

  for (const [word, entry] of Object.entries(ctx.local)) {
    if (isExcludedVocabWord(word)) continue;
    if (isDueReviewWordWithContext(word, entry.status, entry.last_reviewed_at, ctx)) {
      due.add(word.trim().toLowerCase());
    }
  }

  for (const item of extraWords) {
    const key = item.word.trim().toLowerCase();
    if (isExcludedVocabWord(key)) continue;
    if (
      isDueReviewWordWithContext(
        item.word,
        (item.status as LearningStatus) ?? "new",
        item.last_reviewed_at,
        ctx,
      )
    ) {
      due.add(key);
    }
  }

  return due;
}

function excludeSessionCompletedToday(keys: Set<string>, now = Date.now()): number {
  const snapshot = readReviewSessionSnapshot();
  if (!snapshot || snapshot.date !== localReviewDateKey(new Date(now))) {
    return keys.size;
  }
  const completed = new Set(snapshot.completedWords);
  let count = 0;
  for (const key of keys) {
    if (!completed.has(key)) count += 1;
  }
  return count;
}

export function countDueReviewWords(
  extraWords: Array<{
    word: string;
    status?: LearningStatus | string;
    last_reviewed_at?: string | null;
  }> = [],
  now = Date.now(),
): number {
  return excludeSessionCompletedToday(collectDueReviewKeys(extraWords, now), now);
}

/** Due word keys for today's review session (matches badge/home counts). */
export function getActionableDueReviewKeys(
  extraWords: Array<{
    word: string;
    status?: LearningStatus | string;
    last_reviewed_at?: string | null;
  }> = [],
  now = Date.now(),
): string[] {
  const keys = collectDueReviewKeys(extraWords, now);
  const snapshot = readReviewSessionSnapshot();
  if (!snapshot || snapshot.date !== localReviewDateKey(new Date(now))) {
    return [...keys];
  }
  const completed = new Set(snapshot.completedWords);
  return [...keys].filter((key) => !completed.has(key));
}

export function countDueReviewWordKeys(
  extraWords: Array<{
    word: string;
    status?: LearningStatus | string;
    last_reviewed_at?: string | null;
  }> = [],
  now = Date.now(),
): number {
  return collectDueReviewKeys(extraWords, now).size;
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
