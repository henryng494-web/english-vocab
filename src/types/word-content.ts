import type { LearnerLocale } from "@/lib/learner-locale";

/** Learner gloss languages stored in JSONB. */
export type GlossLanguage = LearnerLocale;

/** `word_details.meanings` — per-locale primary gloss. */
export type LocalizedMeaningsJson = Partial<Record<GlossLanguage, string>>;

/** One row per English example sentence in `word_details.examples`. */
export type ExampleTranslationRow = Partial<Record<GlossLanguage, string>>;

/** `word_details.example_translations` — index-aligned with parsed EN examples. */
export type ExampleTranslationsJson = ExampleTranslationRow[];

/** One row in `phrase_translations.collocations` or `.chunks` (matched by `en`). */
export type PhraseTranslationRow = Partial<Record<GlossLanguage, string>> & {
  en?: string;
};

/** Goes-with collocations + useful phrase rows for the card chunk UI. */
export type PhraseTranslationsJson = {
  collocations?: PhraseTranslationRow[];
  chunks?: PhraseTranslationRow[];
};
