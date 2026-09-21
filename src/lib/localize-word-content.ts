import {
  fillExampleTranslations,
  keepNaturalExamples,
} from "@/lib/example-fallback";
import {
  translateDefinitionWithGemini,
  translateLearnerMeaningWithGemini,
} from "@/lib/gemini-core";
import type { LearnerLocale } from "@/lib/learner-locale";
import { DEFAULT_LEARNER_LOCALE } from "@/lib/learner-locale";
import { parseExamples, serializeExamples } from "@/lib/parse-examples";
import { sanitizeLearnerText } from "@/lib/sanitize-learner";
import {
  parseVietnameseMeanings,
  serializeVietnameseMeanings,
} from "@/lib/word-meanings";

type LocalizeInput = {
  word: string;
  vietnamese_meaning: string;
  examples: string | null;
  word_type?: string | null;
  english_definition?: string | null;
};

/** Spanish (or future locales) from persisted Vietnamese/English card data. */
export async function localizeWordContent(
  input: LocalizeInput,
  locale: LearnerLocale,
): Promise<{ vietnamese_meaning: string; examples: string | null }> {
  if (locale === DEFAULT_LEARNER_LOCALE) {
    return {
      vietnamese_meaning: input.vietnamese_meaning,
      examples: input.examples,
    };
  }

  const word = input.word.trim();
  let meanings = parseVietnameseMeanings(input.vietnamese_meaning);

  const fromGemini = await translateLearnerMeaningWithGemini(word, locale);
  if (fromGemini) {
    meanings = parseVietnameseMeanings(fromGemini);
  } else if (input.english_definition?.trim()) {
    const def = await translateDefinitionWithGemini(
      word,
      input.english_definition,
      locale,
    );
    if (def) meanings = [def];
  }

  const meaningSerialized =
    serializeVietnameseMeanings(
      meanings.map((line) => sanitizeLearnerText(line, locale)),
    ) || sanitizeLearnerText(meanings[0] ?? word, locale);

  const parsed = parseExamples(input.examples);
  const natural = keepNaturalExamples(
    word,
    parsed,
    input.word_type,
    meaningSerialized,
  );
  const translated = await fillExampleTranslations(
    natural,
    word,
    input.word_type,
    meaningSerialized,
    locale,
  );

  return {
    vietnamese_meaning: meaningSerialized,
    examples: translated.length ? serializeExamples(translated) : input.examples,
  };
}
