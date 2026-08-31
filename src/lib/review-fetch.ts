import { getPresetRank } from "@/data/preset-word-details";
import { mergeLocalLearning, readLocalLearning } from "@/lib/learning-storage";
import { prefetchReviewQuestionRange } from "@/lib/review-image-preload";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import {
  createDueReviewFilterContext,
  getActionableDueReviewKeys,
  isDueReviewWordInContext,
} from "@/lib/review-schedule";
import {
  applyReviewSessionSnapshot,
  readReviewSessionSnapshot,
} from "@/lib/review-session-storage";
import { getImportanceTier } from "@/lib/word-rank";
import type { LearningStatus, VocabWord } from "@/types/database";

export type ReviewSessionData = {
  allWords: VocabWord[];
  dueQueue: VocabWord[];
};

const DETAILS_BATCH = 100;

function normalizeVocabWord(word: VocabWord): VocabWord {
  return {
    ...word,
    importance_tier: word.importance_tier ?? getImportanceTier(word.rank),
  };
}

function stubVocabFromLocal(
  word: string,
  status: LearningStatus,
  lastReviewedAt: string,
): VocabWord {
  const rank = getPresetRank(word) ?? 10000;
  return {
    id: word,
    word,
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
    last_reviewed_at: lastReviewedAt,
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

function localReviewPoolKeys(): string[] {
  const local = readLocalLearning();
  return Object.entries(local)
    .filter(
      ([word, entry]) =>
        !isExcludedVocabWord(word) && entry.status !== "mastered",
    )
    .map(([word]) => word.trim().toLowerCase());
}

/** Due review rows keyed off local learning state (matches badge/home counts). */
export function collectDueReviewWords(allWords: VocabWord[]): VocabWord[] {
  const ctx = createDueReviewFilterContext();
  const byKey = new Map(
    allWords.map((word) => [word.word.trim().toLowerCase(), word]),
  );
  const due: VocabWord[] = [];
  const seen = new Set<string>();

  for (const [word, entry] of Object.entries(ctx.local)) {
    if (isExcludedVocabWord(word)) continue;
    const key = word.trim().toLowerCase();
    if (seen.has(key)) continue;
    if (
      !isDueReviewWordInContext(
        word,
        entry.status,
        entry.last_reviewed_at,
        ctx,
      )
    ) {
      continue;
    }
    const vocab =
      byKey.get(key) ??
      stubVocabFromLocal(word, entry.status, entry.last_reviewed_at);
    due.push(vocab);
    seen.add(key);
  }

  for (const vocab of allWords) {
    const key = vocab.word.trim().toLowerCase();
    if (seen.has(key)) continue;
    if (
      isDueReviewWordInContext(
        vocab.word,
        vocab.learning_status,
        vocab.last_reviewed_at,
        ctx,
      )
    ) {
      due.push(vocab);
      seen.add(key);
    }
  }

  return due;
}

export function buildDueReviewQueue(allWords: VocabWord[]): VocabWord[] {
  return applyReviewSessionSnapshot(
    collectDueReviewWords(allWords),
    readReviewSessionSnapshot(),
  );
}

export async function fetchReviewWords(): Promise<VocabWord[]> {
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
    /* fall back to local batch hydration */
  }

  const have = new Set(words.map((word) => word.word.trim().toLowerCase()));
  const poolKeys = localReviewPoolKeys();
  const missingPool = poolKeys.filter((key) => !have.has(key));

  if (missingPool.length > 0) {
    const hydrated = await fetchWordDetailsBatch(missingPool);
    for (const word of hydrated) {
      const key = word.word.trim().toLowerCase();
      if (!have.has(key)) {
        words.push(word);
        have.add(key);
      }
    }
  }

  // Ensure due words always have rows even if batch hydration missed some.
  const missingDue = getActionableDueReviewKeys().filter((key) => !have.has(key));
  if (missingDue.length > 0) {
    const local = readLocalLearning();
    for (const key of missingDue) {
      const entry = local[key];
      if (!entry) continue;
      words.push(
        stubVocabFromLocal(key, entry.status, entry.last_reviewed_at),
      );
    }
  }

  return mergeLocalLearning(words.map(normalizeVocabWord));
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
  const allWords = await fetchReviewWords();
  return prepareReviewSession(allWords);
}
