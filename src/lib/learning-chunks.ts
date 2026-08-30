import {
  LEARNING_CHUNK_OVERRIDES,
  type LearningChunkEntry,
} from "@/data/demo-learning-chunks";
import { buildLearningChunksFromExamples } from "@/lib/build-learning-chunks";
import { parseExamples } from "@/lib/parse-examples";

export type { LearningChunkEntry, LearningChunkPhrase } from "@/data/demo-learning-chunks";

export type LearningChunksInput = {
  examples?: string | null;
  wordType?: string | null;
  meaning?: string | null;
};

export function resolveLearningChunks(
  word: string,
  input?: LearningChunksInput,
): LearningChunkEntry | null {
  const key = word.trim().toLowerCase();
  if (!key) return null;

  const override = LEARNING_CHUNK_OVERRIDES[key];
  if (override) return override;

  const parsed = parseExamples(input?.examples);
  if (!parsed.length) return null;

  return buildLearningChunksFromExamples(
    word,
    parsed,
    input?.wordType,
    input?.meaning,
  );
}

export function hasLearningChunks(
  word: string,
  input?: LearningChunksInput,
): boolean {
  const entry = resolveLearningChunks(word, input);
  if (!entry) return false;
  return entry.collocations.length > 0 || entry.chunks.length > 0;
}

/** @deprecated Use resolveLearningChunks */
export function getLearningChunks(
  word: string,
  input?: LearningChunksInput,
): LearningChunkEntry | null {
  return resolveLearningChunks(word, input);
}
