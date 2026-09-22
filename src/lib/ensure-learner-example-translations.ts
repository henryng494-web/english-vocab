import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import { vocabWordToDiscoverData } from "@/components/discover/VocabWordCard";
import {
  applyMultilangToDiscoverWord,
  coerceMultilangRecord,
} from "@/lib/discover-word-multilang";
import { getPresetRank } from "@/data/preset-word-details";
import { readAppSettings } from "@/lib/app-settings";
import { DEFAULT_LEARNER_LOCALE } from "@/lib/learner-locale";
import { getLearnerContentRepository } from "@/lib/learner-content";
import { resolveLearningChunks } from "@/lib/learning-chunks";
import { recordNeedsExampleTranslationsForLanguage } from "@/lib/multilang-word-record";
import {
  parsePhraseTranslationsJson,
  phraseTranslationsNeedLocale,
} from "@/lib/phrase-translations";
import type { UserLanguage } from "@/lib/user-language";
import type { VocabWord } from "@/types/database";

const inflight = new Map<string, Promise<DiscoverWordData | null>>();

function cacheKey(word: string, locale: UserLanguage): string {
  return `${locale}:${word.trim().toLowerCase()}`;
}

export function discoverDataNeedsEsExampleFetch(
  data: Pick<
    DiscoverWordData,
    | "word"
    | "examples"
    | "example_translations"
    | "phrase_translations"
    | "meanings"
    | "vietnamese_meaning"
    | "english_definition"
    | "word_type"
    | "phonetic"
  >,
  userLanguage: UserLanguage = readAppSettings().learnerLocale,
): boolean {
  if (userLanguage === DEFAULT_LEARNER_LOCALE) return false;
  const record = coerceMultilangRecord(data);
  if (recordNeedsExampleTranslationsForLanguage(record, userLanguage)) {
    return true;
  }
  const entry = resolveLearningChunks(data.word, {
    examples: record.examples,
    wordType: data.word_type,
    meaning: record.meanings.es ?? record.meanings.vi ?? data.vietnamese_meaning,
  });
  if (!entry) return false;
  return phraseTranslationsNeedLocale(
    entry,
    parsePhraseTranslationsJson(data.phrase_translations),
    userLanguage,
  );
}

async function fetchLocalizedDiscoverWord(
  word: string,
  rank: number,
  userLanguage: UserLanguage,
): Promise<DiscoverWordData | null> {
  const key = word.trim().toLowerCase();
  if (!key) return null;
  const params = new URLSearchParams({
    word: key,
    rank: String(rank),
    skipGemini: "false",
    locale: userLanguage,
  });
  const res = await fetch(`/api/discover/word?${params}`, { cache: "no-store" });
  if (!res.ok) return null;
  const payload = (await res.json()) as { word?: DiscoverWordData };
  if (!payload.word?.word?.trim()) return null;
  return applyMultilangToDiscoverWord(payload.word, userLanguage);
}

/** Fetch missing ES example glosses via discover API and persist in learner cache. */
export function ensureLearnerExampleTranslations(
  data: DiscoverWordData,
  userLanguage: UserLanguage = readAppSettings().learnerLocale,
): Promise<DiscoverWordData | null> {
  if (!discoverDataNeedsEsExampleFetch(data, userLanguage)) {
    return Promise.resolve(null);
  }
  const key = cacheKey(data.word, userLanguage);
  const existing = inflight.get(key);
  if (existing) return existing;

  const task = fetchLocalizedDiscoverWord(
    data.word,
    data.rank ?? getPresetRank(data.word) ?? 10000,
    userLanguage,
  )
    .then((fresh) => {
      if (!fresh) return null;
      getLearnerContentRepository(userLanguage).putCached(data.word, fresh);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("word-example-translations-ready", {
            detail: {
              word: data.word.trim().toLowerCase(),
              locale: userLanguage,
            },
          }),
        );
      }
      return fresh;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, task);
  return task;
}

export function applyLocaleToVocabWord(
  word: VocabWord,
  userLanguage: UserLanguage = readAppSettings().learnerLocale,
): VocabWord {
  const localized = applyMultilangToDiscoverWord(
    vocabWordToDiscoverData(word),
    userLanguage,
  );
  return {
    ...word,
    vietnamese_meaning: localized.vietnamese_meaning ?? word.vietnamese_meaning,
    examples: localized.examples ?? word.examples,
    meanings: localized.meanings ?? word.meanings,
    example_translations:
      localized.example_translations ?? word.example_translations,
    phrase_translations:
      localized.phrase_translations ?? word.phrase_translations,
  };
}
