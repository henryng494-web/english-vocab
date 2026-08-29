import type { VocabExample } from "@/lib/parse-examples";
import { parseExamples } from "@/lib/parse-examples";
import { looksLikeEnglish } from "@/lib/translate-vi";
import { parseVietnameseMeanings } from "@/lib/word-meanings";
import { viTranslationMatchesGloss } from "@/lib/example-quality";
import { normalizeWordType } from "@/lib/word-type";

/** Scientific / encyclopedia-style glosses — not flashcard translations. */
const ENCYCLOPEDIC_GLOSS_PATTERNS: readonly RegExp[] = [
  /\bđộng vật\b/i,
  /\bthực vật\b/i,
  /\b(côn trùng|giáp xác|động vật có vú|động vật biển)\b/i,
  /\b(một loại|một dạng|một kiểu|một loài)\b/i,
  /\b(là (một )?(loại|dạng|kiểu| loài))\b/i,
  /\b(thuộc (họ|loài|nhóm|bộ))\b/i,
  /\b(có (vỏ|vảy|lông|vây|răng| cánh))\b/i,
  /\b(sinh sống (ở|tại|trong))\b/i,
  /\b(được (dùng|sử dụng) để)\b/i,
  /\b(loài cây|loài vật)\b/i,
];

const MAX_FLASHCARD_GLOSS_WORDS = 7;

function glossWordCount(line: string): number {
  return line.trim().split(/\s+/).filter(Boolean).length;
}

/** True when a gloss reads like a textbook definition instead of a learner translation. */
export function isEncyclopedicGloss(line: string | null | undefined): boolean {
  const trimmed = line?.trim() ?? "";
  if (!trimmed) return false;

  if (ENCYCLOPEDIC_GLOSS_PATTERNS.some((pattern) => pattern.test(trimmed))) {
    return true;
  }

  return glossWordCount(trimmed) > MAX_FLASHCARD_GLOSS_WORDS;
}

export function hasQualityMeanings(
  word: string,
  vietnameseMeaning: string | null | undefined,
  wordType?: string | null,
  examples?: VocabExample[] | null,
  englishDefinition?: string | null,
): boolean {
  const lines = parseVietnameseMeanings(vietnameseMeaning);
  if (!lines.length) return false;

  if (lines.some((line) => looksLikeEnglish(line))) return false;
  if (lines.some((line) => isEncyclopedicGloss(line))) return false;

  const definition = englishDefinition?.trim().toLowerCase();
  if (definition) {
    for (const line of lines) {
      if (line.trim().toLowerCase() === definition) return false;
    }
  }

  const kept = (examples ?? []).filter(
    (item) => Boolean(item.en?.trim()) && Boolean(item.vi?.trim()),
  );
  if (kept.length > 0) {
    for (let index = 0; index < Math.min(2, kept.length); index++) {
      const example = kept[index]!;
      const senseLine =
        lines.length >= 2
          ? lines[Math.min(index, lines.length - 1)]!
          : lines[0]!;
      if (!viTranslationMatchesGloss(example.vi, senseLine)) {
        return false;
      }
    }
  }

  const pos = normalizeWordType(wordType, word);
  if (pos === "noun" && lines[0] && glossWordCount(lines[0]) >= 4) {
    if (isEncyclopedicGloss(lines[0])) return false;
  }

  return true;
}

export function meaningsNeedRegeneration(
  word: string,
  vietnameseMeaning: string | null | undefined,
  wordType?: string | null,
  examples?: string | VocabExample[] | null,
  englishDefinition?: string | null,
): boolean {
  const parsedExamples = Array.isArray(examples)
    ? examples
    : parseExamples(examples);
  return !hasQualityMeanings(
    word,
    vietnameseMeaning,
    wordType,
    parsedExamples,
    englishDefinition,
  );
}
