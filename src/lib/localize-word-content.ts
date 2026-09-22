import { keepNaturalExamples } from "@/lib/example-fallback";
import {
  translateDefinitionWithGemini,
  translateLearnerMeaningWithGemini,
} from "@/lib/gemini-core";
import type { LearnerLocale } from "@/lib/learner-locale";
import { DEFAULT_LEARNER_LOCALE } from "@/lib/learner-locale";
import {
  mergeExampleTranslationRow,
  splitLegacyExamples,
} from "@/lib/multilang-word-record";
import { parseExamples, serializeExamples } from "@/lib/parse-examples";
import { sanitizeLearnerText } from "@/lib/sanitize-learner";
import { fetchMyMemoryViToLearner } from "@/lib/translate-vi";
import {
  parseVietnameseMeanings,
  serializeVietnameseMeanings,
} from "@/lib/word-meanings";
import { ensureExamplesForLearnerLocale } from "@/lib/localize-examples";
import { isLikelyVietnameseGloss } from "@/lib/example-quality";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
} from "@/types/word-content";

type LocalizeInput = {
  word: string;
  vietnamese_meaning: string;
  examples: string | null;
  word_type?: string | null;
  english_definition?: string | null;
  meanings?: LocalizedMeaningsJson | null;
  example_translations?: ExampleTranslationsJson | null;
};

export type LocalizedWordContentPatch = {
  meanings: LocalizedMeaningsJson;
  example_translations: ExampleTranslationsJson;
  examples: string | null;
  /** Active locale gloss for legacy single-field consumers. */
  active_gloss: string | null;
};

/** Build / merge JSON multi-language fields (never copies vi gloss into es). */
export async function localizeWordContent(
  input: LocalizeInput,
  locale: LearnerLocale,
): Promise<LocalizedWordContentPatch> {
  const split = splitLegacyExamples(input.examples);
  let meanings: LocalizedMeaningsJson = {
    ...(input.meanings ?? {}),
  };
  let example_translations: ExampleTranslationsJson = [
    ...(input.example_translations ?? split.example_translations),
  ];
  const examples = split.examples ?? input.examples;

  if (locale === DEFAULT_LEARNER_LOCALE) {
    const viGloss = input.vietnamese_meaning?.trim();
    if (viGloss) meanings.vi = viGloss;
    return {
      meanings,
      example_translations,
      examples,
      active_gloss: meanings.vi ?? null,
    };
  }

  const word = input.word.trim();
  let glossLines = parseVietnameseMeanings(input.vietnamese_meaning);

  const fromGemini = await translateLearnerMeaningWithGemini(word, locale);
  if (fromGemini) {
    glossLines = parseVietnameseMeanings(fromGemini);
  } else if (input.english_definition?.trim()) {
    const def = await translateDefinitionWithGemini(
      word,
      input.english_definition,
      locale,
    );
    if (def) glossLines = [def];
  }

  if (glossLines.some((line) => isLikelyVietnameseGloss(line))) {
    const translated: string[] = [];
    for (const line of glossLines) {
      if (!isLikelyVietnameseGloss(line)) {
        translated.push(line);
        continue;
      }
      const es =
        (await fetchMyMemoryViToLearner(line, locale)) ??
        (input.english_definition?.trim()
          ? await translateDefinitionWithGemini(
              word,
              input.english_definition,
              locale,
            )
          : null);
      if (es?.trim()) translated.push(es.trim());
    }
    if (translated.length) glossLines = translated;
  }

  const meaningSerialized =
    serializeVietnameseMeanings(
      glossLines.map((line) => sanitizeLearnerText(line, locale)),
    ) || sanitizeLearnerText(glossLines[0] ?? "", locale);

  if (meaningSerialized) {
    meanings = { ...meanings, [locale]: meaningSerialized };
  }

  const parsed = parseExamples(examples);
  const natural = keepNaturalExamples(
    word,
    parsed,
    input.word_type,
    meaningSerialized,
  );
  const translated = await ensureExamplesForLearnerLocale(
    natural,
    word,
    input.word_type,
    meaningSerialized,
    locale,
  );

  translated.forEach((item, index) => {
    const tr = item.vi?.trim();
    if (!tr || isLikelyVietnameseGloss(tr)) return;
    example_translations = mergeExampleTranslationRow(
      example_translations,
      index,
      locale,
      tr,
    );
  });

  const enOnly = serializeExamples(
    translated.map((item) => ({ en: item.en, vi: "" })),
  );

  return {
    meanings,
    example_translations,
    examples: enOnly || examples,
    active_gloss: meanings[locale] ?? null,
  };
}
