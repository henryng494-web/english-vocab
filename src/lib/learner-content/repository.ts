import type { DiscoverWordData } from "@/components/discover/DiscoverCard";
import type { DiscoverListItem } from "@/lib/discover-fetch";
import {
  discoverCacheKeyForWord,
  loadPersistedWordCache,
  persistWordCache,
  stubFromListItem,
} from "@/lib/discover-word-cache";
import { getBundledLearnerContent } from "@/lib/learner-content/bundled";
import type { LearnerContentSlice } from "@/lib/learner-content/types";
import {
  isLearnerGlossDisplayReady,
  type LearnerLocale,
} from "@/lib/learner-locale";
import { readAppSettings } from "@/lib/app-settings";
import { DEFAULT_LEARNER_LOCALE } from "@/lib/learner-locale";
import { examplesNeedLearnerLocaleRefresh } from "@/lib/localize-examples";
import { parseExamples } from "@/lib/parse-examples";
import { applyLocaleToVocabWord } from "@/lib/ensure-learner-example-translations";
import type { VocabWord } from "@/types/database";

let cacheSingleton: Map<string, DiscoverWordData> | null = null;

function wordCache(): Map<string, DiscoverWordData> {
  if (!cacheSingleton) {
    cacheSingleton = loadPersistedWordCache();
  }
  return cacheSingleton;
}

function sliceToPartial(
  slice: LearnerContentSlice,
): Partial<DiscoverWordData> {
  return {
    phonetic: slice.phonetic ?? null,
    word_type: slice.word_type ?? null,
    vietnamese_meaning: slice.vietnamese_meaning ?? null,
    english_definition: slice.english_definition ?? null,
    examples: slice.examples ?? null,
    search_keyword: slice.search_keyword ?? null,
    collocations: slice.collocations ?? null,
    register: slice.register ?? null,
  };
}

function mergeSliceOnto<T extends DiscoverWordData | VocabWord>(
  base: T,
  slice: LearnerContentSlice,
  locale: LearnerLocale,
): T {
  const meaning = slice.vietnamese_meaning?.trim();
  const next: T = { ...base };
  if (slice.phonetic?.trim()) next.phonetic = slice.phonetic;
  if (slice.word_type?.trim()) next.word_type = slice.word_type;
  if (slice.english_definition?.trim()) {
    next.english_definition = slice.english_definition;
  }
  if (slice.examples?.trim()) next.examples = slice.examples;
  if (slice.search_keyword?.trim()) next.search_keyword = slice.search_keyword;
  if ("collocations" in next && slice.collocations !== undefined) {
    next.collocations = slice.collocations;
  }
  if ("register" in next && slice.register !== undefined) {
    next.register = slice.register;
  }
  if (meaning && isLearnerGlossDisplayReady(meaning, locale)) {
    next.vietnamese_meaning = meaning;
  }
  return next;
}

export class LearnerContentRepository {
  constructor(readonly locale: LearnerLocale) {}

  cacheKey(word: string): string {
    return discoverCacheKeyForWord(word, this.locale);
  }

  getCached(word: string): DiscoverWordData | null {
    const hit = wordCache().get(this.cacheKey(word));
    if (!hit) return null;
    if (
      hit.vietnamese_meaning?.trim() &&
      !isLearnerGlossDisplayReady(hit.vietnamese_meaning, this.locale)
    ) {
      return null;
    }
    if (
      examplesNeedLearnerLocaleRefresh(parseExamples(hit.examples), this.locale)
    ) {
      return null;
    }
    return hit;
  }

  getBundled(word: string): LearnerContentSlice | null {
    return getBundledLearnerContent(word, this.locale);
  }

  /** Best local slice: session store for this locale, then bundled store. */
  resolveLocalSlice(word: string): LearnerContentSlice | null {
    const cached = this.getCached(word);
    if (cached?.vietnamese_meaning?.trim()) {
      return {
        phonetic: cached.phonetic,
        word_type: cached.word_type,
        vietnamese_meaning: cached.vietnamese_meaning,
        english_definition: cached.english_definition,
        examples: cached.examples,
        search_keyword: cached.search_keyword,
        collocations: cached.collocations,
        register: cached.register,
      };
    }
    return this.getBundled(word);
  }

  putCached(word: string, data: DiscoverWordData): void {
    const key = this.cacheKey(word);
    wordCache().set(key, data);
    persistWordCache(wordCache());
  }

  listItemToCard(item: DiscoverListItem): DiscoverWordData {
    const base = stubFromListItem(item);
    const preview = item.preview;
    const slice =
      this.resolveLocalSlice(item.word) ??
      (preview?.vietnamese_meaning?.trim() &&
      isLearnerGlossDisplayReady(preview.vietnamese_meaning, this.locale)
        ? ({
            phonetic: preview.phonetic,
            word_type: preview.word_type,
            vietnamese_meaning: preview.vietnamese_meaning,
            english_definition: preview.english_definition,
            examples: preview.examples,
            search_keyword: preview.search_keyword,
          } satisfies LearnerContentSlice)
        : null);

    if (!slice?.vietnamese_meaning?.trim()) {
      const bundled = this.getBundled(item.word);
      if (bundled) {
        return mergeSliceOnto(base, bundled, this.locale);
      }
      return base;
    }

    return mergeSliceOnto(base, slice, this.locale);
  }

  hydrateVocabWord(word: VocabWord): VocabWord {
    if (
      word.vietnamese_meaning?.trim() &&
      isLearnerGlossDisplayReady(word.vietnamese_meaning, this.locale) &&
      !examplesNeedLearnerLocaleRefresh(
        parseExamples(word.examples),
        this.locale,
      )
    ) {
      return applyLocaleToVocabWord(word, this.locale);
    }

    const slice = this.resolveLocalSlice(word.word);
    if (!slice) return applyLocaleToVocabWord(word, this.locale);
    return applyLocaleToVocabWord(
      mergeSliceOnto(word, slice, this.locale),
      this.locale,
    );
  }

  mergeDiscoverData(
    item: DiscoverListItem,
    apiWord: DiscoverWordData,
  ): DiscoverWordData {
    const merged = { ...apiWord };
    this.putCached(item.word, merged);
    return merged;
  }

  listSubtitle(word: string): string | null {
    const slice = this.resolveLocalSlice(word);
    const gloss = slice?.vietnamese_meaning?.trim();
    if (!gloss || !isLearnerGlossDisplayReady(gloss, this.locale)) {
      return null;
    }
    return gloss.split("\n")[0]?.trim() ?? gloss;
  }

  applySliceToDiscoverData(
    base: DiscoverWordData,
    slice: LearnerContentSlice,
  ): DiscoverWordData {
    return mergeSliceOnto(base, slice, this.locale);
  }
}

export function getLearnerContentRepository(
  locale?: LearnerLocale,
): LearnerContentRepository {
  const active =
    locale ??
    (typeof window !== "undefined"
      ? readAppSettings().learnerLocale
      : DEFAULT_LEARNER_LOCALE);
  return new LearnerContentRepository(active);
}
