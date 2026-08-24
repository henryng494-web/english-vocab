import { getPresetRank } from "@/data/preset-vocabulary";
import type { LearningStatus } from "@/types/database";
import { isExcludedVocabWord } from "@/lib/proper-noun";

const STORAGE_KEY = "english-vocab-learning";

type LocalLearningEntry = {
  status: LearningStatus;
  last_reviewed_at: string;
  added_at?: string;
};

type LocalLearningMap = Record<string, LocalLearningEntry>;

function isCountableWord(word: string): boolean {
  return !isExcludedVocabWord(word);
}

export function readLocalLearning(): LocalLearningMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as LocalLearningMap;
    const normalized: LocalLearningMap = {};
    for (const [key, entry] of Object.entries(parsed)) {
      normalized[key.trim().toLowerCase()] = entry;
    }
    return normalized;
  } catch {
    return {};
  }
}

export function writeLocalLearning(word: string, status: LearningStatus) {
  if (typeof window === "undefined") return;
  const key = word.trim().toLowerCase();
  if (!key) return;
  const map = readLocalLearning();
  const now = new Date().toISOString();
  const existing = map[key];
  map[key] = {
    status,
    last_reviewed_at: now,
    added_at: existing?.added_at ?? now,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("vocab-learning-changed"));
}

export function countLearningWords(): number {
  const map = readLocalLearning();
  return Object.entries(map).filter(
    ([word, entry]) =>
      isCountableWord(word) &&
      (entry.status === "new" ||
        entry.status === "learning" ||
        entry.status === "need_review"),
  ).length;
}

export function countMasteredWords(): number {
  const map = readLocalLearning();
  return Object.entries(map).filter(
    ([word, entry]) => isCountableWord(word) && entry.status === "mastered",
  ).length;
}

export function mergeLocalLearning<T extends { word: string; learning_status: LearningStatus; last_reviewed_at: string | null }>(
  words: T[],
): T[] {
  const map = readLocalLearning();
  return words.map((w): T => {
    const local = map[w.word];
    if (!local) return w;
    return {
      ...w,
      learning_status: local.status,
      last_reviewed_at: local.last_reviewed_at,
    };
  });
}

export function isWordMasteredLocally(word: string): boolean {
  const map = readLocalLearning();
  return map[word]?.status === "mastered";
}

export function getLocallyMasteredWords(): string[] {
  const map = readLocalLearning();
  return Object.entries(map)
    .filter(([word, v]) => isCountableWord(word) && v.status === "mastered")
    .map(([word]) => word);
}

/** Words the learner already acted on — known or added to Review. */
export function getLocallyTakenWords(): string[] {
  return Object.keys(readLocalLearning()).filter(isCountableWord);
}

export type WordLibraryFilter = "known" | "review";
export type WordLibrarySort = "rank" | "recent";

export type LocalWordEntry = {
  word: string;
  status: LearningStatus;
  last_reviewed_at: string;
  added_at: string;
};

export function sortLocalWordEntries(
  entries: LocalWordEntry[],
  sort: WordLibrarySort,
): LocalWordEntry[] {
  const sorted = [...entries];
  if (sort === "recent") {
    return sorted.sort((a, b) => b.added_at.localeCompare(a.added_at));
  }
  return sorted.sort((a, b) => {
    const rankA = getPresetRank(a.word) ?? 99999;
    const rankB = getPresetRank(b.word) ?? 99999;
    if (rankA !== rankB) return rankA - rankB;
    return a.word.localeCompare(b.word);
  });
}

export function getLocalWordStatus(word: string): LearningStatus | null {
  return readLocalLearning()[word.trim()]?.status ?? null;
}

export function getLocalWordsByFilter(
  filter: WordLibraryFilter,
  sort: WordLibrarySort = "recent",
): LocalWordEntry[] {
  const map = readLocalLearning();
  const entries = Object.entries(map)
    .filter(([word, entry]) => {
      if (!isCountableWord(word)) return false;
      if (filter === "known") return entry.status === "mastered";
      return (
        entry.status === "new" ||
        entry.status === "learning" ||
        entry.status === "need_review"
      );
    })
    .map(([word, entry]) => ({
      word,
      status: entry.status,
      last_reviewed_at: entry.last_reviewed_at,
      added_at: entry.added_at ?? entry.last_reviewed_at,
    }));
  return sortLocalWordEntries(entries, sort);
}
