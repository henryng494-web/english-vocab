import type { LearningStatus } from "@/types/database";

const STORAGE_KEY = "english-vocab-learning";

type LocalLearningMap = Record<
  string,
  { status: LearningStatus; last_reviewed_at: string }
>;

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
    .filter(([, v]) => v.status === "mastered")
    .map(([word]) => word);
}
