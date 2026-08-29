import {
  translateVietnameseWithGemini,
  enrichWithGemini,
} from "@/lib/gemini-core";
import { parseExamples } from "@/lib/parse-examples";
import type { VocabExample } from "@/lib/parse-examples";
import {
  hasQualityMeanings,
  meaningsNeedRegeneration,
} from "@/lib/meaning-quality";
import {
  parseVietnameseMeanings,
  serializeVietnameseMeanings,
} from "@/lib/word-meanings";
import { capitalizeFirst } from "@/lib/format-text";

function normalizeMeaningText(text: string): string {
  const lines = parseVietnameseMeanings(text)
    .map((line) => capitalizeFirst(line.trim()))
    .filter(Boolean)
    .slice(0, 2);
  return serializeVietnameseMeanings(lines);
}

/** Repair or regenerate Vietnamese glosses (common words, not encyclopedia entries). */
export async function repairWordMeanings(
  word: string,
  vietnameseMeaning: string | null | undefined,
  wordType?: string | null,
  examples?: string | null,
  englishDefinition?: string | null,
): Promise<string> {
  const parsedExamples = parseExamples(examples);
  if (
    hasQualityMeanings(
      word,
      vietnameseMeaning,
      wordType,
      parsedExamples,
      englishDefinition,
    )
  ) {
    return vietnameseMeaning?.trim()
      ? normalizeMeaningText(vietnameseMeaning)
      : "";
  }

  if (!process.env.GEMINI_API_KEY?.trim()) {
    return vietnameseMeaning?.trim() ? normalizeMeaningText(vietnameseMeaning) : "";
  }

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const translated = await translateVietnameseWithGemini(word);
    const normalized = translated ? normalizeMeaningText(translated) : "";
    if (
      normalized &&
      hasQualityMeanings(
        word,
        normalized,
        wordType,
        parsedExamples,
        englishDefinition,
      )
    ) {
      return normalized;
    }
  }

  try {
    const enriched = await enrichWithGemini(word);
    const normalized = normalizeMeaningText(enriched.vietnameseMeaning);
    if (
      normalized &&
      hasQualityMeanings(
        word,
        normalized,
        wordType,
        parsedExamples,
        englishDefinition,
      )
    ) {
      return normalized;
    }
    if (normalized) return normalized;
  } catch {
    /* fall through */
  }

  return vietnameseMeaning?.trim()
    ? normalizeMeaningText(vietnameseMeaning)
    : "";
}

export function enrichmentMeaningsNeedRegeneration(
  word: string,
  enrichment: {
    vietnameseMeaning: string;
    wordType?: string | null;
    examples?: VocabExample[];
    englishDefinition?: string | null;
  },
): boolean {
  return meaningsNeedRegeneration(
    word,
    enrichment.vietnameseMeaning,
    enrichment.wordType,
    enrichment.examples,
    enrichment.englishDefinition,
  );
}
