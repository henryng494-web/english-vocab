import type { UserLanguage } from "@/lib/user-language";

/** App always teaches English headwords and English example sentences. */
export const LEARNING_LANGUAGE_ID = "en" as const;
export type LearningLanguageId = typeof LEARNING_LANGUAGE_ID;

/** Course key: English vocabulary explained in the user's language. */
export type CourseId = `en-${UserLanguage}`;

export type LocalizedMeanings = Partial<Record<UserLanguage, string>>;

/** Stored in DB / cache JSON (`meanings` column). */
export type LocalizedMeaningsJson = LocalizedMeanings;

/** Parallel to English examples — index-aligned translation rows. */
export type ExampleTranslationsJson = Array<Partial<Record<UserLanguage, string>>>;

/** Goes-with + useful phrase glosses keyed by English line. */
export type PhraseTranslationRow = { en: string } & Partial<
  Record<UserLanguage, string>
>;

export type PhraseTranslationsJson = {
  collocations?: PhraseTranslationRow[];
  chunks?: PhraseTranslationRow[];
};

export type LocalizedExample = {
  /** English sentence (learning language). */
  sentence: string;
  translations: Partial<Record<UserLanguage, string>>;
};

/** Logical word record for UI and caches (may map from legacy DB fields). */
export type WordContentRecord = {
  learningLanguage: LearningLanguageId;
  targetWord: string;
  phonetic: string | null;
  wordType: string | null;
  englishDefinition: string | null;
  primaryMeanings: LocalizedMeanings;
  examples: LocalizedExample[];
};

/** Resolved view for flashcard / review reveal binding. */
export type WordDisplayView = {
  learningLanguage: LearningLanguageId;
  userLanguage: UserLanguage;
  courseId: CourseId;
  targetWord: string;
  phonetic: string | null;
  wordType: string | null;
  /** Gloss lines in `userLanguage` only (empty when wrong locale cached). */
  primaryMeaningLines: string[];
  /** Serialized gloss for APIs that still use a single string field. */
  primaryMeaning: string | null;
  examples: Array<{
    sentence: string;
    translation: string | null;
  }>;
};
