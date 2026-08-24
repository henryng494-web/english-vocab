import type { LearningStatus } from "@/types/database";
import { isExcludedVocabWord } from "@/lib/proper-noun";

const STORAGE_KEY = "english-vocab-learning";

type LocalLearningMap = Record<
  string,
  { status: LearningStatus; last_reviewed_at: string }
>;

function isCountableWord(word: string): boolean {
  return !isExcludedVocabWord(word);
}

export function readLocalLearning(): LocalLearningMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LocalLearningMap) : {};
  } catch {
    return {};
  }
}

export function writeLocalLearning(word: string, status: LearningStatus) {
  if (typeof window === "undefined") return;
  const map = readLocalLearning();
  map[word] = { status, last_reviewed_at: new Date().toISOString() };
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

export type LocalWordEntry = {
  word: string;
  status: LearningStatus;
  last_reviewed_at: string;
};

export function getLocalWordStatus(word: string): LearningStatus | null {
  return readLocalLearning()[word.trim()]?.status ?? null;
}

export function getLocalWordsByFilter(
  filter: WordLibraryFilter,
): LocalWordEntry[] {
  const map = readLocalLearning();
  return Object.entries(map)
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
    }))
    .sort((a, b) => b.last_reviewed_at.localeCompare(a.last_reviewed_at));
}
