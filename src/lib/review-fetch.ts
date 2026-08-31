import { getPresetRank } from "@/data/preset-word-details";
import { mergeLocalLearning, readLocalLearning } from "@/lib/learning-storage";
import { prefetchReviewQuestionRange } from "@/lib/review-image-preload";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import {
  countDueReviewWords,
  getActionableDueReviewKeys,
} from "@/lib/review-schedule";
import {
  applyReviewSessionSnapshot,
  clearReviewSessionSnapshot,
  readReviewSessionSnapshot,
} from "@/lib/review-session-storage";
import { getImportanceTier } from "@/lib/word-rank";
import type { LearningStatus, VocabWord } from "@/types/database";

export type ReviewSessionData = {
  allWords: VocabWord[];
  dueQueue: VocabWord[];
};

export type LearningSummaryRow = {
  word: string;
  status?: LearningStatus | string;
  last_reviewed_at?: string | null;
};

const DETAILS_BATCH = 100;

function normalizeVocabWord(word: VocabWord): VocabWord {
  return {
    ...word,
    importance_tier: word.importance_tier ?? getImportanceTier(word.rank),
  };
}

function stubVocabWord(
  word: string,
  status: LearningStatus,
  lastReviewedAt: string | null | undefined,
): VocabWord {
  const key = word.trim().toLowerCase();
  const rank = getPresetRank(key) ?? 10000;
  return {
    id: key,
    word: key,
    phonetic: "",
    word_type: "",
    vietnamese_meaning: "",
    english_definition: "",
    examples: "",
    collocations: null,
    image_url: null,
    rank,
    importance_tier: getImportanceTier(rank),
    learning_status: status,
    last_reviewed_at: lastReviewedAt ?? new Date().toISOString(),
  };
}

/** Same learning rows Home/badge use for due counts. */
export async function fetchLearningSummary(): Promise<LearningSummaryRow[]> {
  try {
    const res = await fetch("/api/words?summary=learning", {
      cache: "no-store",
    });
    const data = (await res.json()) as { words?: LearningSummaryRow[] };
    if (res.ok) return data.words ?? [];
  } catch {
    /* local-only fallback */
  }
  return [];
}

async function fetchWordDetailsBatch(keys: string[]): Promise<VocabWord[]> {
  if (keys.length === 0) return [];

  const unique = [
    ...new Set(keys.map((key) => key.trim().toLowerCase()).filter(Boolean)),
  ];
  const results: VocabWord[] = [];

  for (let offset = 0; offset < unique.length; offset += DETAILS_BATCH) {
    const batch = unique.slice(offset, offset + DETAILS_BATCH);
    try {
      const res = await fetch(
        `/api/words?scope=details&words=${encodeURIComponent(batch.join(","))}`,
        { cache: "no-store" },
      );
      if (!res.ok) continue;
      const data = (await res.json()) as { words?: VocabWord[] };
      results.push(...((data.words ?? []) as VocabWord[]).map(normalizeVocabWord));
    } catch {
      /* try next batch */
    }
  }

  return results;
}

function localReviewPoolKeys(extraWords: LearningSummaryRow[]): string[] {
  const keys = new Set<string>();
  const local = readLocalLearning();

  for (const [word, entry] of Object.entries(local)) {
    if (isExcludedVocabWord(word) || entry.status === "mastered") continue;
    keys.add(word.trim().toLowerCase());
  }

  for (const row of extraWords) {
    const key = row.word.trim().toLowerCase();
    if (isExcludedVocabWord(key) || row.status === "mastered") continue;
    keys.add(key);
  }

  return [...keys];
}

/** Review pool — learning words with card details (for quiz distractors). */
export async function fetchReviewWords(
  extraWords: LearningSummaryRow[] = [],
): Promise<VocabWord[]> {
  let words: VocabWord[] = [];

  try {
    const res = await fetch("/api/words?scope=learning&sort=recent", {
      cache: "no-store",
    });
    const data = (await res.json()) as { words?: VocabWord[] };
    if (res.ok) {
      words = ((data.words ?? []) as VocabWord[]).map(normalizeVocabWord);
    }
  } catch {
    /* hydrate from details batches below */
  }

  const have = new Set(words.map((word) => word.word.trim().toLowerCase()));
  const missingPool = localReviewPoolKeys(extraWords).filter(
    (key) => !have.has(key),
  );

  if (missingPool.length > 0) {
    for (const word of await fetchWordDetailsBatch(missingPool)) {
      const key = word.word.trim().toLowerCase();
      if (!have.has(key)) {
        words.push(word);
        have.add(key);
      }
    }
  }

  return mergeLocalLearning(words.map(normalizeVocabWord));
}

/** Build queue rows from the exact due-key set Home/badge uses. */
export function buildDueQueueFromKeys(
  dueKeys: string[],
  allWords: VocabWord[],
  extraWords: LearningSummaryRow[],
): VocabWord[] {
  const byKey = new Map(
    allWords.map((word) => [word.word.trim().toLowerCase(), word]),
  );
  const local = readLocalLearning();
  const apiByKey = new Map(
    extraWords.map((row) => [row.word.trim().toLowerCase(), row]),
  );

  const due: VocabWord[] = [];
  for (const key of dueKeys) {
    const existing = byKey.get(key);
    if (existing) {
      due.push(existing);
      continue;
    }

    const localEntry = local[key];
    if (localEntry) {
      due.push(
        stubVocabWord(key, localEntry.status, localEntry.last_reviewed_at),
      );
      continue;
    }

    const apiRow = apiByKey.get(key);
    due.push(
      stubVocabWord(
        key,
        (apiRow?.status as LearningStatus) ?? "new",
        apiRow?.last_reviewed_at,
      ),
    );
  }

  return due;
}

function applySessionSnapshotWithHeal(due: VocabWord[]): VocabWord[] {
  const snapshot = readReviewSessionSnapshot();
  let sessionDue = applyReviewSessionSnapshot(due, snapshot);

  if (sessionDue.length === 0 && due.length > 0) {
    clearReviewSessionSnapshot();
    sessionDue = due;
  }

  return sessionDue;
}

/**
 * Single source of truth for Review tab — same due keys as badge/Home counts.
 */
export async function loadActionableReviewSession(): Promise<ReviewSessionData> {
  const extraWords = await fetchLearningSummary();
  const dueKeys = getActionableDueReviewKeys(extraWords);

  let allWords = await fetchReviewWords(extraWords);

  const have = new Set(allWords.map((word) => word.word.trim().toLowerCase()));
  const missingDue = dueKeys.filter((key) => !have.has(key));
  if (missingDue.length > 0) {
    for (const word of await fetchWordDetailsBatch(missingDue)) {
      const key = word.word.trim().toLowerCase();
      if (!have.has(key)) {
        allWords = mergeLocalLearning([...allWords, word]);
        have.add(key);
      }
    }
  }

  const due = buildDueQueueFromKeys(dueKeys, allWords, extraWords);
  const dueQueue = applySessionSnapshotWithHeal(due);

  void prefetchReviewQuestionRange(dueQueue, allWords, 0, 20);

  return { allWords, dueQueue };
}

/** Expected due count — matches Home/badge (includes DB + local learning rows). */
export async function fetchExpectedDueReviewCount(): Promise<number> {
  const extraWords = await fetchLearningSummary();
  return countDueReviewWords(extraWords);
}

export function buildDueReviewQueue(allWords: VocabWord[]): VocabWord[] {
  const dueKeys = getActionableDueReviewKeys();
  return applySessionSnapshotWithHeal(
    buildDueQueueFromKeys(dueKeys, allWords, []),
  );
}

export function countActionableDueReviews(allWords: VocabWord[]): number {
  return buildDueReviewQueue(allWords).length;
}

export async function prepareReviewSession(
  allWords: VocabWord[],
): Promise<ReviewSessionData> {
  const dueQueue = buildDueReviewQueue(allWords);
  void prefetchReviewQuestionRange(dueQueue, allWords, 0, 20);
  return { allWords, dueQueue };
}

export async function loadReviewSession(): Promise<ReviewSessionData> {
  return loadActionableReviewSession();
}
