import { readLocalLearning } from "@/lib/learning-storage";
import { resolveLearnableWordKey } from "@/data/vocab-abbreviations";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import type { ReviewQuizKind } from "@/lib/review-quiz";
import {
  computeNextReviewAt,
  DAILY_REVIEW_SESSION_CAP,
  isLeechEntry,
  normalizeScheduleEntry,
  srsLevelFromIntervalDays,
  type ReviewLastResult,
} from "@/lib/review-srs";
import {
  localReviewDateKey,
  readReviewSessionSnapshot,
} from "@/lib/review-session-storage";
import type { LearningStatus } from "@/types/database";

/** Standard SRS dropdown milestones (days). */
export const REVIEW_INTERVALS = [1, 3, 7, 14, 30] as const;

export type ReviewIntervalDays = (typeof REVIEW_INTERVALS)[number];

/** Mark word as fully known — no further scheduled reviews. */
export const REVIEW_MASTERED_LABEL = "Already know";

export type ReviewScheduleEntry = {
  intervalDays: ReviewIntervalDays;
  nextReviewAt: string;
  timesReviewed: number;
  srsLevel?: number;
  streakCorrect?: number;
  wrongStreak?: number;
  lastResult?: ReviewLastResult;
  lastQuizKind?: ReviewQuizKind;
  leechFlag?: boolean;
};

const STORAGE_KEY = "english-vocab-review-schedule-v1";

type ScheduleMap = Record<string, ReviewScheduleEntry>;

function isInterval(value: number): value is ReviewIntervalDays {
  return (REVIEW_INTERVALS as readonly number[]).includes(value);
}

export function normalizeIntervalDays(days: number): ReviewIntervalDays {
  if (isInterval(days)) return days;
  if (days <= 1) return 1;
  if (days <= 3) return 3;
  if (days <= 7) return 7;
  if (days <= 14) return 14;
  return 30;
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

/** @deprecated use srs engine — kept for migration hints */
export function suggestedReviewIntervalForTimes(
  timesReviewed: number,
): ReviewIntervalDays {
  if (timesReviewed <= 1) return 1;
  if (timesReviewed === 2) return 3;
  if (timesReviewed === 3) return 7;
  if (timesReviewed === 4) return 14;
  return 30;
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
    if (!parsed || typeof parsed !== "object") return {};

    const normalized: ScheduleMap = {};
    let changed = false;
    for (const [key, entry] of Object.entries(parsed)) {
      const word = resolveLearnableWordKey(key);
      if (!word) {
        changed = true;
        continue;
      }
      if (word !== key.trim().toLowerCase()) changed = true;
      const existing = normalized[word];
      if (
        !existing ||
        (entry.timesReviewed ?? 0) > (existing.timesReviewed ?? 0)
      ) {
        normalized[word] = parseScheduleEntry(entry);
        if (entry.srsLevel === undefined) changed = true;
      }
    }
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  } catch {
    return {};
  }
}

function parseScheduleEntry(stored: ReviewScheduleEntry | undefined): ReviewScheduleEntry {
  if (
    stored &&
    typeof stored.intervalDays === "number" &&
    typeof stored.nextReviewAt === "string" &&
    typeof stored.timesReviewed === "number"
  ) {
    return normalizeScheduleEntry({
      ...stored,
      intervalDays: normalizeIntervalDays(stored.intervalDays),
    });
  }
  return normalizeScheduleEntry({
    intervalDays: 1,
    nextReviewAt: new Date(0).toISOString(),
    timesReviewed: 0,
    srsLevel: 0,
    streakCorrect: 0,
    wrongStreak: 0,
  });
}

export function getReviewSchedule(word: string): ReviewScheduleEntry {
  const key = resolveLearnableWordKey(word) ?? word.trim().toLowerCase();
  return parseScheduleEntry(readReviewSchedule()[key]);
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
  return parseScheduleEntry(schedule[key]);
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

function prioritizeDueKeys(keys: string[], schedule: ScheduleMap): string[] {
  return [...keys].sort((a, b) => {
    const entryA = parseScheduleEntry(schedule[a]);
    const entryB = parseScheduleEntry(schedule[b]);
    const leechA = isLeechEntry(entryA);
    const leechB = isLeechEntry(entryB);
    if (leechA !== leechB) return leechA ? -1 : 1;
    return Date.parse(entryA.nextReviewAt) - Date.parse(entryB.nextReviewAt);
  });
}

function capDueKeys(keys: string[], schedule: ScheduleMap): string[] {
  const prioritized = prioritizeDueKeys(keys, schedule);
  return prioritized.slice(0, DAILY_REVIEW_SESSION_CAP);
}

function excludeSessionCompletedToday(keys: string[], now = Date.now()): string[] {
  const snapshot = readReviewSessionSnapshot();
  if (!snapshot || snapshot.date !== localReviewDateKey(new Date(now))) {
    return keys;
  }
  const completed = new Set(snapshot.completedWords);
  return keys.filter((key) => !completed.has(key));
}

export function countDueReviewWords(
  extraWords: Array<{
    word: string;
    status?: LearningStatus | string;
    last_reviewed_at?: string | null;
  }> = [],
  now = Date.now(),
): number {
  return excludeSessionCompletedToday(
    [...collectDueReviewKeys(extraWords, now)],
    now,
  ).length;
}

/** Due word keys for today's review session (capped + prioritized). */
export function getActionableDueReviewKeys(
  extraWords: Array<{
    word: string;
    status?: LearningStatus | string;
    last_reviewed_at?: string | null;
  }> = [],
  now = Date.now(),
): string[] {
  const schedule = readReviewSchedule();
  const keys = excludeSessionCompletedToday(
    [...collectDueReviewKeys(extraWords, now)],
    now,
  );
  return capDueKeys(keys, schedule);
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
  const existing = getReviewSchedule(word);
  return writeReviewScheduleEntry(
    word,
    normalizeScheduleEntry({
      ...existing,
      intervalDays,
      timesReviewed,
      srsLevel:
        existing.srsLevel ??
        srsLevelFromIntervalDays(intervalDays, timesReviewed),
      nextReviewAt: computeNextReviewAt(intervalDays, timesReviewed, now),
    }),
    now,
  );
}

export function writeReviewScheduleEntry(
  word: string,
  entry: ReviewScheduleEntry,
  now = new Date(),
): ReviewScheduleEntry {
  const key = resolveLearnableWordKey(word) ?? word.trim().toLowerCase();
  const map = readReviewSchedule();
  const normalized = normalizeScheduleEntry({
    ...entry,
    intervalDays: normalizeIntervalDays(entry.intervalDays),
    nextReviewAt: computeNextReviewAt(
      entry.intervalDays,
      entry.timesReviewed,
      now,
    ),
  });
  map[key] = normalized;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("vocab-learning-changed"));
  return normalized;
}
