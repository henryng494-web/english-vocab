import type { WordDetail } from "@/types/database";
import { hasQualityExamples } from "@/lib/example-quality";
import { parseExamples } from "@/lib/parse-examples";
import { containsForeignScript } from "@/lib/sanitize-vi";
import {
  decodeRegisterFromCollocation,
  hasEmbeddedRegisterHints,
  isLegacyRegisterCollocation,
} from "@/lib/word-meanings";

export type StaleWordDetailReason =
  | "missing_meaning"
  | "missing_register"
  | "legacy_register"
  | "embedded_register_hint";

/** Cached row predates register badge / dual-meaning layout. */
export function getStaleWordDetailReason(
  detail: WordDetail | null | undefined,
): StaleWordDetailReason | null {
  if (!detail) return null;
  if (!detail.vietnamese_meaning?.trim()) return "missing_meaning";
  if (!decodeRegisterFromCollocation(detail.collocations)) return "missing_register";
  if (isLegacyRegisterCollocation(detail.collocations)) return "legacy_register";
  if (hasEmbeddedRegisterHints(detail.vietnamese_meaning)) {
    return "embedded_register_hint";
  }
  return null;
}

export function isStalePersistedWordDetail(
  detail: WordDetail | null | undefined,
): boolean {
  return getStaleWordDetailReason(detail) !== null;
}

/** True when a Supabase word_details row is safe to reuse without calling Gemini. */
export function isPersistedWordDetailComplete(
  detail: WordDetail | null | undefined,
  word: string,
): boolean {
  if (!detail) return false;
  if (detail.word.toLowerCase() !== word.toLowerCase()) return false;
  if (!detail.vietnamese_meaning?.trim()) return false;
  if (containsForeignScript(detail.vietnamese_meaning)) return false;
  if (!hasQualityExamples(word, parseExamples(detail.examples), detail.word_type)) {
    return false;
  }
  if (isStalePersistedWordDetail(detail)) return false;
  return true;
}
