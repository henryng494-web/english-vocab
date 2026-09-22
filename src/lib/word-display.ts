import { isLikelyVietnameseGloss } from "@/lib/example-quality";
import {
  isLearnerGlossDisplayReady,
  type LearnerLocale,
} from "@/lib/learner-locale";
import { parseExamples, type VocabExample } from "@/lib/parse-examples";
import type { UserLanguage } from "@/lib/user-language";
import { courseIdFor, learningLanguageId } from "@/lib/user-language";
import type {
  LocalizedExample,
  LocalizedMeanings,
  WordContentRecord,
  WordDisplayView,
} from "@/types/word-content";
import { formatMeaningsForDisplay } from "@/lib/word-meanings";

/** Legacy API/DB shape — English fields + single-locale gloss storage. */
export type WordDisplaySource = {
  word: string;
  phonetic?: string | null;
  word_type?: string | null;
  /** Legacy DB/API field: gloss text for the locale it was generated for. */
  vietnamese_meaning?: string | null;
  english_definition?: string | null;
  examples?: string | null;
};

export function translationLineForUserLanguage(
  text: string | null | undefined,
  userLanguage: UserLanguage,
): string | null {
  const trimmed = text?.trim() ?? "";
  if (!trimmed) return null;
  if (userLanguage === "vi") {
    return isLikelyVietnameseGloss(trimmed) ? trimmed : null;
  }
  return isLikelyVietnameseGloss(trimmed) ? null : trimmed;
}

export function exampleTranslationForUserLanguage(
  example: VocabExample,
  userLanguage: UserLanguage,
): string | null {
  return translationLineForUserLanguage(example.vi, userLanguage);
}

export function primaryMeaningForUserLanguage(
  storedGloss: string | null | undefined,
  userLanguage: UserLanguage,
): string | null {
  const trimmed = storedGloss?.trim() ?? "";
  if (!trimmed) return null;
  if (!isLearnerGlossDisplayReady(trimmed, userLanguage as LearnerLocale)) {
    return null;
  }
  return trimmed;
}

export function resolveWordDisplay(
  source: WordDisplaySource,
  userLanguage: UserLanguage,
): WordDisplayView {
  const primaryMeaning = primaryMeaningForUserLanguage(
    source.vietnamese_meaning,
    userLanguage,
  );
  const primaryMeaningLines = primaryMeaning
    ? formatMeaningsForDisplay(primaryMeaning)
    : [];

  const examples = parseExamples(source.examples).map((item) => ({
    sentence: item.en,
    translation: exampleTranslationForUserLanguage(item, userLanguage),
  }));

  return {
    learningLanguage: learningLanguageId(),
    userLanguage,
    courseId: courseIdFor(userLanguage),
    targetWord: source.word,
    phonetic: source.phonetic?.trim() || null,
    wordType: source.word_type?.trim() || null,
    primaryMeaningLines,
    primaryMeaning,
    examples,
  };
}

export function wordContentFromLegacySource(
  source: WordDisplaySource,
  activeUserLanguage: UserLanguage,
): WordContentRecord {
  const meanings: LocalizedMeanings = {};
  const viGloss = primaryMeaningForUserLanguage(source.vietnamese_meaning, "vi");
  const esGloss = primaryMeaningForUserLanguage(source.vietnamese_meaning, "es");
  if (viGloss) meanings.vi = viGloss;
  if (esGloss) meanings.es = esGloss;
  if (
    !meanings[activeUserLanguage] &&
    source.vietnamese_meaning?.trim() &&
    isLearnerGlossDisplayReady(
      source.vietnamese_meaning,
      activeUserLanguage as LearnerLocale,
    )
  ) {
    meanings[activeUserLanguage] = source.vietnamese_meaning.trim();
  }

  const examples: LocalizedExample[] = parseExamples(source.examples).map(
    (item) => {
      const translations: Partial<Record<UserLanguage, string>> = {};
      const vi = exampleTranslationForUserLanguage(item, "vi");
      const es = exampleTranslationForUserLanguage(item, "es");
      if (vi) translations.vi = vi;
      if (es) translations.es = es;
      return { sentence: item.en, translations };
    },
  );

  return {
    learningLanguage: learningLanguageId(),
    targetWord: source.word,
    phonetic: source.phonetic?.trim() || null,
    wordType: source.word_type?.trim() || null,
    englishDefinition: source.english_definition?.trim() || null,
    primaryMeanings: meanings,
    examples,
  };
}

/** Apply resolved gloss onto discover data for downstream code that reads one string field. */
export function applyUserLanguageToDiscoverData<
  T extends WordDisplaySource & { word: string },
>(data: T, userLanguage: UserLanguage): T {
  const display = resolveWordDisplay(data, userLanguage);
  return {
    ...data,
    vietnamese_meaning: display.primaryMeaning,
    examples: serializeExamplesForDisplay(display),
  };
}

function serializeExamplesForDisplay(display: WordDisplayView): string | null {
  const rows = display.examples.filter((item) => item.sentence.trim());
  if (!rows.length) return null;
  return rows
    .map((item) => {
      const en = item.sentence.trim();
      const tr = item.translation?.trim();
      return tr ? `${en}\n---\n${tr}` : en;
    })
    .join("\n---\n");
}
