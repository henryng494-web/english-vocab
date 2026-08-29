import {
  alignExampleTranslations,
  ensureExamples,
  fillExampleTranslations,
} from "@/lib/example-fallback";
import {
  generateExamplesWithGemini,
  type WordEnrichment,
} from "@/lib/gemini-core";
import {
  hasMeaningAlignedExamples,
  hasQualityExamples,
  keepNaturalExamples,
} from "@/lib/example-quality";
import { parseExamples, serializeExamples } from "@/lib/parse-examples";
import { parseVietnameseMeanings } from "@/lib/word-meanings";

export function examplesNeedRegeneration(
  word: string,
  examples: string | null | undefined,
  wordType?: string | null,
  meaning?: string | null,
): boolean {
  return !hasQualityExamples(word, parseExamples(examples), wordType, meaning);
}

/** Repair or fully regenerate bilingual examples so each line matches its gloss. */
export async function repairWordExamples(
  word: string,
  examples: string | null | undefined,
  wordType?: string | null,
  meaning?: string | null,
): Promise<string> {
  const parsed = parseExamples(examples);
  const meaningLines = parseVietnameseMeanings(meaning);

  if (hasQualityExamples(word, parsed, wordType, meaning)) {
    return examples?.trim() ? examples : serializeExamples(parsed);
  }

  const needsRegeneration = examplesNeedRegeneration(
    word,
    examples,
    wordType,
    meaning,
  );

  if (process.env.GEMINI_API_KEY?.trim()) {
    for (let attempt = 0; attempt < (needsRegeneration ? 2 : 1); attempt += 1) {
      const generated = await generateExamplesWithGemini(
        word,
        wordType,
        meaning,
        meaningLines,
      );
      if (hasQualityExamples(word, generated ?? undefined, wordType, meaning)) {
        return serializeExamples(generated!.slice(0, 2));
      }
    }
  }

  const ensured = ensureExamples(word, parsed, wordType, meaning);
  const aligned = await alignExampleTranslations(ensured, word, wordType, meaning);
  const translated = await fillExampleTranslations(aligned, word, wordType, meaning);
  const finalExamples = hasQualityExamples(word, translated, wordType, meaning)
    ? translated
    : hasQualityExamples(word, aligned, wordType, meaning)
      ? aligned
      : [];
  return serializeExamples(finalExamples);
}

export function enrichmentExamplesNeedRegeneration(
  word: string,
  enrichment: Pick<WordEnrichment, "examples" | "wordType" | "vietnameseMeaning">,
): boolean {
  return examplesNeedRegeneration(
    word,
    serializeExamples(enrichment.examples),
    enrichment.wordType,
    enrichment.vietnameseMeaning,
  );
}
