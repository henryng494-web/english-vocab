import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { mergeLocalLearning, readLocalLearning } from "@/lib/learning-storage";
import { prefetchReviewQuestionRange } from "@/lib/review-image-preload";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import {
  createDueReviewFilterContext,
  isDueReviewWordInContext,
} from "@/lib/review-schedule";
import {
  applyReviewSessionSnapshot,
  readReviewSessionSnapshot,
} from "@/lib/review-session-storage";
import { getImportanceTier } from "@/lib/word-rank";
import type { VocabWord } from "@/types/database";

export type ReviewSessionData = {
  allWords: VocabWord[];
  dueQueue: VocabWord[];
};

const HYDRATE_CONCURRENCY = 6;

function normalizeVocabWord(word: VocabWord): VocabWord {
  return {
    ...word,
    importance_tier: word.importance_tier ?? getImportanceTier(word.rank),
  };
}

function discoverWordToVocab(word: DiscoverWordData): VocabWord {
  const rank = word.rank ?? 10000;
  return {
    id: word.word,
    word: word.word,
    phonetic: word.phonetic ?? "",
    word_type: word.word_type ?? "",
    vietnamese_meaning: word.vietnamese_meaning ?? "",
    english_definition: word.english_definition ?? "",
    examples: word.examples ?? "",
    collocations: word.collocations ?? null,
    image_url: word.image_url ?? null,
    rank,
    importance_tier: word.importance_tier ?? getImportanceTier(rank),
    learning_status: "new",
    last_reviewed_at: null,
    search_keyword: word.search_keyword ?? null,
    word_family: word.word_family ?? undefined,
    register: word.register ?? null,
  };
}

async function hydrateMissingReviewWords(
  words: VocabWord[],
  missingKeys: string[],
): Promise<VocabWord[]> {
  if (missingKeys.length === 0) return words;

  const hydrated: VocabWord[] = [];
  let index = 0;

  async function worker() {
    while (index < missingKeys.length) {
      const key = missingKeys[index]!;
      index += 1;
      try {
        const res = await fetch(
          `/api/discover/word?word=${encodeURIComponent(key)}`,
          { cache: "no-store" },
        );
        if (!res.ok) continue;
        const data = (await res.json()) as { word?: DiscoverWordData };
        if (!data.word?.word) continue;
        hydrated.push(discoverWordToVocab(data.word));
      } catch {
        /* skip failed hydrate */
      }
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(HYDRATE_CONCURRENCY, missingKeys.length) },
      () => worker(),
    ),
  );

  return [...words, ...hydrated.map(normalizeVocabWord)];
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
    const vocab = byKey.get(key);
    if (!vocab) continue;
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
  const res = await fetch("/api/words?scope=learning&sort=recent", {
    cache: "no-store",
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.details ?? data.error ?? "Failed to load word list");
  }

  let words = mergeLocalLearning(
    ((data.words ?? []) as VocabWord[]).map(normalizeVocabWord),
  );

  const local = readLocalLearning();
  const have = new Set(words.map((word) => word.word.trim().toLowerCase()));
  const missing = Object.entries(local)
    .filter(
      ([word, entry]) =>
        !isExcludedVocabWord(word) &&
        entry.status !== "mastered" &&
        !have.has(word.trim().toLowerCase()),
    )
    .map(([word]) => word.trim().toLowerCase());

  if (missing.length > 0) {
    words = mergeLocalLearning(await hydrateMissingReviewWords(words, missing));
  }

  return words;
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
