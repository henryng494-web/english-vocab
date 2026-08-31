import { getPresetRank } from "@/data/preset-word-details";
import {
  hydrateLocalLearningFromApi,
  mergeLocalLearning,
  readLocalLearning,
} from "@/lib/learning-storage";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { prefetchReviewQuestionRange } from "@/lib/review-image-preload";
import { getActionableDueReviewKeys } from "@/lib/review-schedule";
import {
  applyReviewSessionSnapshot,
  clearReviewSessionSnapshot,
  readReviewSessionSnapshot,
} from "@/lib/review-session-storage";
import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import { getImportanceTier } from "@/lib/word-rank";
import type { LearningStatus, VocabWord } from "@/types/database";

export type LearningSummaryRow = {
  word: string;
  status?: LearningStatus | string;
  last_reviewed_at?: string | null;
};

export type ReviewSession = {
  dueCount: number;
  queue: VocabWord[];
  pool: VocabWord[];
};

const SUMMARY_RETRY_DELAYS_MS = [0, 400, 900];
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
    search_keyword: resolveImageSearchKeyword(key, { pos: "", meaning: "" }),
  };
}

export async function fetchLearningSummary(): Promise<LearningSummaryRow[]> {
  for (let attempt = 0; attempt < SUMMARY_RETRY_DELAYS_MS.length; attempt++) {
    const delay = SUMMARY_RETRY_DELAYS_MS[attempt] ?? 0;
    if (delay > 0) {
      await new Promise((resolve) => window.setTimeout(resolve, delay));
    }
    try {
      const res = await fetch("/api/words?summary=learning", {
        cache: "no-store",
      });
      const data = (await res.json()) as { words?: LearningSummaryRow[] };
      if (res.ok) {
        const words = data.words ?? [];
        if (words.length > 0 || attempt === SUMMARY_RETRY_DELAYS_MS.length - 1) {
          return words;
        }
      }
    } catch {
      /* retry */
    }
  }
  return [];
}

function buildQueueFromKeys(
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

function applySnapshot(queue: VocabWord[]): VocabWord[] {
  const snapshot = readReviewSessionSnapshot();
  let ordered = applyReviewSessionSnapshot(queue, snapshot);
  if (ordered.length === 0 && queue.length > 0) {
    clearReviewSessionSnapshot();
    ordered = queue;
  }
  return ordered;
}

/** Single source of truth — same due keys for badge, home, and review queue. */
export function resolveReviewSession(
  extraWords: LearningSummaryRow[] = [],
): ReviewSession {
  if (typeof window !== "undefined") {
    hydrateLocalLearningFromApi(extraWords, { notify: false });
  }

  const dueKeys = getActionableDueReviewKeys(extraWords);
  const queue = applySnapshot(buildQueueFromKeys(dueKeys, [], extraWords));

  return {
    dueCount: dueKeys.length,
    queue,
    pool: queue,
  };
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

async function fetchReviewPool(
  extraWords: LearningSummaryRow[],
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
    /* hydrate below */
  }

  const have = new Set(words.map((word) => word.word.trim().toLowerCase()));
  const poolKeys = new Set<string>();

  for (const [word, entry] of Object.entries(readLocalLearning())) {
    if (isExcludedVocabWord(word) || entry.status === "mastered") continue;
    poolKeys.add(word.trim().toLowerCase());
  }
  for (const row of extraWords) {
    const key = row.word.trim().toLowerCase();
    if (isExcludedVocabWord(key) || row.status === "mastered") continue;
    poolKeys.add(key);
  }

  const missing = [...poolKeys].filter((key) => !have.has(key));
  if (missing.length > 0) {
    for (const word of await fetchWordDetailsBatch(missing)) {
      const key = word.word.trim().toLowerCase();
      if (!have.has(key)) {
        words.push(word);
        have.add(key);
      }
    }
  }

  return mergeLocalLearning(words.map(normalizeVocabWord));
}

async function enrichDueWordsOnly(
  extraWords: LearningSummaryRow[],
  queue: VocabWord[],
): Promise<{ queue: VocabWord[]; pool: VocabWord[] }> {
  if (queue.length === 0) {
    return { queue: [], pool: [] };
  }

  const dueKeys = queue.map((word) => word.word.trim().toLowerCase());
  const dueDetails = await fetchWordDetailsBatch(dueKeys);
  const pool = mergeLocalLearning(dueDetails.map(normalizeVocabWord));
  const enrichedQueue = applySnapshot(
    buildQueueFromKeys(dueKeys, pool, extraWords),
  );

  void prefetchReviewQuestionRange(enrichedQueue, pool, 0, 20);

  return {
    queue: enrichedQueue.length > 0 ? enrichedQueue : queue,
    pool,
  };
}

async function enrichQueue(
  extraWords: LearningSummaryRow[],
  queue: VocabWord[],
): Promise<{ queue: VocabWord[]; pool: VocabWord[] }> {
  if (queue.length === 0) {
    return { queue: [], pool: [] };
  }

  const dueKeys = queue.map((word) => word.word.trim().toLowerCase());
  const pool = await fetchReviewPool(extraWords);

  const have = new Set(pool.map((word) => word.word.trim().toLowerCase()));
  let allWords = pool;
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

  const enrichedQueue = applySnapshot(
    buildQueueFromKeys(dueKeys, allWords, extraWords),
  );

  void prefetchReviewQuestionRange(enrichedQueue, allWords, 0, 20);

  return {
    queue: enrichedQueue.length > 0 ? enrichedQueue : queue,
    pool: allWords,
  };
}

/** Load review session: sync resolve first, then enrich pool. */
export async function loadReviewSession(): Promise<ReviewSession> {
  const summary = await fetchLearningSummary();
  const base = resolveReviewSession(summary);
  if (base.queue.length === 0) {
    return base;
  }
  const enriched = await enrichQueue(summary, base.queue);
  return {
    dueCount: base.dueCount,
    queue: enriched.queue,
    pool: enriched.pool,
  };
}

export async function enrichDueReviewWords(
  extraWords: LearningSummaryRow[],
  queue: VocabWord[],
): Promise<ReviewSession> {
  if (queue.length === 0) {
    return { dueCount: 0, queue: [], pool: [] };
  }
  const enriched = await enrichDueWordsOnly(extraWords, queue);
  return {
    dueCount: queue.length,
    queue: enriched.queue,
    pool: enriched.pool,
  };
}

export async function enrichReviewSession(
  extraWords: LearningSummaryRow[],
  queue: VocabWord[],
): Promise<ReviewSession> {
  if (queue.length === 0) {
    return { dueCount: 0, queue: [], pool: [] };
  }
  const enriched = await enrichQueue(extraWords, queue);
  return {
    dueCount: queue.length,
    queue: enriched.queue,
    pool: enriched.pool,
  };
}

/** Fast bootstrap for splash — sync stubs only, no network. */
export function resolveReviewSessionFast(): ReviewSession {
  return resolveReviewSession([]);
}

export async function loadReviewSessionFast(): Promise<ReviewSession> {
  try {
    const summary = await fetchLearningSummary();
    if (typeof window !== "undefined") {
      const { seedCachedLearningSummary } = await import("@/lib/review-due-store");
      seedCachedLearningSummary(summary);
    }
    return resolveReviewSession(summary);
  } catch {
    return resolveReviewSessionFast();
  }
}
