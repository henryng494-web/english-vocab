import {
  DEMO_LEARNING_CHUNKS,
  type LearningChunkEntry,
} from "@/data/demo-learning-chunks";

export type { LearningChunkEntry, LearningChunkPhrase } from "@/data/demo-learning-chunks";

export function getLearningChunks(word: string): LearningChunkEntry | null {
  const key = word.trim().toLowerCase();
  if (!key) return null;
  return DEMO_LEARNING_CHUNKS[key] ?? null;
}

export function hasLearningChunks(word: string): boolean {
  return getLearningChunks(word) !== null;
}
