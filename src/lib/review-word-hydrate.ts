import { getPresetRank } from "@/data/preset-word-details";
import { vocabWordToDiscoverData } from "@/components/discover/VocabWordCard";
import { readAppSettings } from "@/lib/app-settings";
import { getLearnerContentRepository } from "@/lib/learner-content";
import {
  DEFAULT_LEARNER_LOCALE,
  isLearnerGlossDisplayReady,
  type LearnerLocale,
} from "@/lib/learner-locale";
import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import { prefetchCardContent } from "@/lib/card-content-prefetch";
import { examplesNeedLearnerLocaleRefresh } from "@/lib/localize-examples";
import { parseExamples } from "@/lib/parse-examples";
import {
  isPlaceholderIllustrationUrl,
  isRealCardImageUrl,
} from "@/lib/unsplash";
import type { VocabWord } from "@/types/database";

export function hasReviewClueFields(word: {
  english_definition?: string | null;
  vietnamese_meaning?: string | null;
}): boolean {
  return Boolean(
    word.english_definition?.trim() || word.vietnamese_meaning?.trim(),
  );
}

function currentLearnerLocale(): LearnerLocale {
  return typeof window !== "undefined"
    ? readAppSettings().learnerLocale
    : DEFAULT_LEARNER_LOCALE;
}

/** Clue text matches the learner gloss locale (ES cards must not keep Vietnamese lines). */
export function isReviewClueReadyForLocale(
  word: {
    vietnamese_meaning?: string | null;
    english_definition?: string | null;
    examples?: string | null;
  },
  locale: LearnerLocale = currentLearnerLocale(),
): boolean {
  if (!hasReviewClueFields(word)) return false;
  const meaning = word.vietnamese_meaning?.trim();
  if (meaning && !isLearnerGlossDisplayReady(meaning, locale)) {
    return false;
  }
  if (
    examplesNeedLearnerLocaleRefresh(parseExamples(word.examples), locale)
  ) {
    return false;
  }
  return Boolean(meaning || word.english_definition?.trim());
}

/** Apply discover/API gloss + examples (overwrites stale Vietnamese when switching to ES). */
export function mergeReviewLearnerContent(
  word: VocabWord,
  patch: Partial<VocabWord>,
): VocabWord {
  let next = mergeHydratedFields(word, patch);
  if (patch.vietnamese_meaning?.trim()) {
    next = { ...next, vietnamese_meaning: patch.vietnamese_meaning.trim() };
  }
  if (patch.examples?.trim()) {
    next = { ...next, examples: patch.examples.trim() };
  }
  if (patch.word_type?.trim()) {
    next = { ...next, word_type: patch.word_type.trim() };
  }
  if (patch.phonetic?.trim()) {
    next = { ...next, phonetic: patch.phonetic.trim() };
  }
  return next;
}

function mergeHydratedFields(
  word: VocabWord,
  patch: Partial<VocabWord>,
): VocabWord {
  const next: VocabWord = { ...word };
  if (!next.phonetic?.trim() && patch.phonetic?.trim()) {
    next.phonetic = patch.phonetic;
  }
  if (!next.word_type?.trim() && patch.word_type?.trim()) {
    next.word_type = patch.word_type;
  }
  if (!next.vietnamese_meaning?.trim() && patch.vietnamese_meaning?.trim()) {
    next.vietnamese_meaning = patch.vietnamese_meaning;
  }
  if (!next.english_definition?.trim() && patch.english_definition?.trim()) {
    next.english_definition = patch.english_definition;
  }
  if (!next.examples?.trim() && patch.examples?.trim()) {
    next.examples = patch.examples;
  }
  if (patch.image_url?.trim()) {
    const nextUrl = patch.image_url.trim();
    const currentUrl = next.image_url?.trim();
    if (
      !currentUrl ||
      isPlaceholderIllustrationUrl(currentUrl) ||
      (isRealCardImageUrl(nextUrl, next.word) &&
        !isRealCardImageUrl(currentUrl, next.word))
    ) {
      next.image_url = nextUrl;
    }
  }
  if (!next.search_keyword?.trim() && patch.search_keyword?.trim()) {
    next.search_keyword = patch.search_keyword;
  }
  if (!hasReviewClueFields(next)) return word;
  if (!next.search_keyword?.trim()) {
    next.search_keyword = resolveImageSearchKeyword(next.word, {
      pos: next.word_type,
      meaning: next.vietnamese_meaning,
      englishDefinition: next.english_definition,
      searchKeyword: next.search_keyword,
    });
  }
  return next;
}

/** Instant clue/meaning from the active learner content store (bundled + session cache). */
export function hydrateReviewWordLocal(word: VocabWord): VocabWord {
  return getLearnerContentRepository().hydrateVocabWord(word);
}

/** Gemini enrich via discover API when DB/local cache has no clue text. */
export async function fetchDiscoverWordEnrichment(
  word: VocabWord,
): Promise<Partial<VocabWord> | null> {
  const key = word.word.trim().toLowerCase();
  if (!key) return null;
  try {
    const learnerLocale =
      typeof window !== "undefined"
        ? readAppSettings().learnerLocale
        : DEFAULT_LEARNER_LOCALE;
    const params = new URLSearchParams({
      word: key,
      rank: String(word.rank ?? getPresetRank(key) ?? 10000),
      skipGemini: "false",
      locale: learnerLocale,
    });
    const res = await fetch(`/api/discover/word?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { word?: VocabWord };
    const enriched = data.word;
    if (!enriched || !hasReviewClueFields(enriched)) return null;
    const merged: VocabWord = { ...word, ...enriched };
    getLearnerContentRepository(learnerLocale).putCached(
      key,
      vocabWordToDiscoverData(merged),
    );
    return {
      phonetic: enriched.phonetic,
      word_type: enriched.word_type,
      vietnamese_meaning: enriched.vietnamese_meaning,
      english_definition: enriched.english_definition,
      examples: enriched.examples,
      image_url: enriched.image_url,
      search_keyword: enriched.search_keyword,
    };
  } catch {
    return null;
  }
}

/** Enrich due queue slots missing meanings via discover (limited concurrency). */
export async function enrichReviewQueueClues(
  queue: VocabWord[],
  limit = 12,
): Promise<VocabWord[]> {
  const enriched = [...queue];
  const targets: { index: number; word: VocabWord }[] = [];

  for (let index = 0; index < enriched.length && targets.length < limit; index++) {
    const word = enriched[index]!;
    const hydrated = hydrateReviewWordLocal(word);
    if (!isReviewClueReadyForLocale(hydrated)) {
      targets.push({ index, word: hydrated });
    }
  }

  const concurrency = 3;
  for (let offset = 0; offset < targets.length; offset += concurrency) {
    const batch = targets.slice(offset, offset + concurrency);
    await Promise.all(
      batch.map(async ({ index, word }) => {
        const discovered = await fetchDiscoverWordEnrichment(word);
        if (discovered) {
          enriched[index] = mergeReviewLearnerContent(word, discovered);
          prefetchCardContent(enriched[index]!);
        }
      }),
    );
  }

  return enriched;
}

/** Localize review pool glosses used as sense-quiz distractors (ES must not keep DB Vietnamese). */
export async function enrichReviewPoolClues(
  pool: VocabWord[],
  limit = 48,
): Promise<VocabWord[]> {
  const locale = currentLearnerLocale();
  if (locale === DEFAULT_LEARNER_LOCALE) return pool;

  const enriched = pool.map((item) => hydrateReviewWordLocal(item));
  const targets: { index: number; word: VocabWord }[] = [];

  for (let index = 0; index < enriched.length && targets.length < limit; index++) {
    const word = enriched[index]!;
    const meaning = word.vietnamese_meaning?.trim();
    if (meaning && isLearnerGlossDisplayReady(meaning, locale)) continue;
    if (!meaning && !word.english_definition?.trim()) continue;
    targets.push({ index, word });
  }

  const concurrency = 3;
  for (let offset = 0; offset < targets.length; offset += concurrency) {
    const batch = targets.slice(offset, offset + concurrency);
    await Promise.all(
      batch.map(async ({ index, word }) => {
        const discovered = await fetchDiscoverWordEnrichment(word);
        if (!discovered) return;
        const merged = mergeReviewLearnerContent(word, discovered);
        if (
          isLearnerGlossDisplayReady(merged.vietnamese_meaning, locale) ||
          merged.english_definition?.trim()
        ) {
          enriched[index] = merged;
        }
      }),
    );
  }

  return enriched;
}

/** Local hydrate, then DB, then discover enrich — for the active review card. */
export async function ensureReviewWordClue(word: VocabWord): Promise<VocabWord> {
  const locale = currentLearnerLocale();
  let merged = hydrateReviewWordLocal(word);
  if (isReviewClueReadyForLocale(merged, locale)) {
    prefetchCardContent(merged);
    return merged;
  }

  const discovered = await fetchDiscoverWordEnrichment(word);
  if (discovered) {
    merged = mergeReviewLearnerContent(merged, discovered);
    if (isReviewClueReadyForLocale(merged, locale)) {
      prefetchCardContent(merged);
      return merged;
    }
  }

  if (locale === "vi") {
    const details = await fetchReviewWordDetails(word.word);
    if (details) {
      merged = mergeHydratedFields(merged, details);
      if (isReviewClueReadyForLocale(merged, locale)) {
        prefetchCardContent(merged);
        return merged;
      }
    }
  }

  prefetchCardContent(merged);
  return merged;
}

export async function fetchReviewWordDetails(
  word: string,
): Promise<Partial<VocabWord> | null> {
  const key = word.trim().toLowerCase();
  if (!key) return null;
  try {
    const res = await fetch(
      `/api/words?scope=details&words=${encodeURIComponent(key)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { words?: VocabWord[] };
    const match = (data.words ?? []).find(
      (item) => item.word.trim().toLowerCase() === key,
    );
    if (!match || !hasReviewClueFields(match)) return null;
    return match;
  } catch {
    return null;
  }
}

/** Warm DB word_details for upcoming review slots (fast clue text). */
export async function prefetchReviewClues(
  queue: VocabWord[],
  startIndex = 0,
  count = 12,
): Promise<Record<string, Partial<VocabWord>>> {
  const updates: Record<string, Partial<VocabWord>> = {};
  const pending: string[] = [];

  for (let offset = 0; offset < count; offset++) {
    const word = queue[startIndex + offset];
    if (!word) break;
    const hydrated = hydrateReviewWordLocal(word);
    if (isReviewClueReadyForLocale(hydrated)) {
      const key = word.word.trim().toLowerCase();
      updates[key] = hydrated;
      prefetchCardContent(hydrated);
      continue;
    }
    pending.push(word.word.trim().toLowerCase());
  }

  const unique = [...new Set(pending)];
  if (unique.length === 0) return updates;

  try {
    const res = await fetch(
      `/api/words?scope=details&words=${encodeURIComponent(unique.join(","))}`,
      { cache: "no-store" },
    );
    if (!res.ok) return updates;
    const data = (await res.json()) as { words?: VocabWord[] };
    for (const item of data.words ?? []) {
      const key = item.word.trim().toLowerCase();
      if (!hasReviewClueFields(item)) continue;
      updates[key] = item;
      prefetchCardContent(item);
    }
  } catch {
    /* best-effort */
  }

  const stillPending = unique.filter(
    (key) => !updates[key] || !hasReviewClueFields(updates[key] as VocabWord),
  );
  const queueByKey = new Map(
    queue.map((word) => [word.word.trim().toLowerCase(), word]),
  );
  await Promise.all(
    stillPending.slice(0, 4).map(async (key) => {
      const source = queueByKey.get(key);
      if (!source) return;
      const discovered = await fetchDiscoverWordEnrichment(source);
      if (discovered) {
        const merged = mergeReviewLearnerContent(source, discovered);
        updates[key] = merged;
        prefetchCardContent(merged);
      }
    }),
  );

  return updates;
}
