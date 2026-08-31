import { getStaticWordDetail } from "@/data/preset-word-details";
import { hasQualityStandardVocab } from "@/data/standard-vocab";
import { loadPersistedWordCache } from "@/lib/discover-word-cache";
import { standardToDiscoverFields } from "@/lib/enrichment-helpers";
import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import { serializeExamples } from "@/lib/parse-examples";
import type { VocabWord } from "@/types/database";

let discoverCache: ReturnType<typeof loadPersistedWordCache> | null = null;

function getDiscoverCache() {
  if (!discoverCache) {
    discoverCache = loadPersistedWordCache();
  }
  return discoverCache;
}

export function hasReviewClueFields(word: {
  english_definition?: string | null;
  vietnamese_meaning?: string | null;
}): boolean {
  return Boolean(
    word.english_definition?.trim() || word.vietnamese_meaning?.trim(),
  );
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
  if (!next.image_url?.trim() && patch.image_url?.trim()) {
    next.image_url = patch.image_url;
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

/** Curated standard cards override stale DB meanings for review clues. */
function applyCuratedReviewFields(word: VocabWord): VocabWord | null {
  const key = word.word.trim().toLowerCase();
  if (!hasQualityStandardVocab(key)) return null;

  const standard = standardToDiscoverFields(key);
  if (!standard || !hasReviewClueFields(standard)) return null;

  const next: VocabWord = {
    ...word,
    phonetic: standard.phonetic || word.phonetic,
    word_type: standard.word_type || word.word_type,
    vietnamese_meaning: standard.vietnamese_meaning,
    english_definition: standard.english_definition,
    examples: standard.examples ?? word.examples,
    search_keyword: standard.search_keyword || word.search_keyword,
  };
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

/** Instant clue/meaning from discover cache, curated vocab, or preset JSON. */
export function hydrateReviewWordLocal(word: VocabWord): VocabWord {
  const curated = applyCuratedReviewFields(word);
  if (curated) return curated;

  if (hasReviewClueFields(word)) return word;

  const key = word.word.trim().toLowerCase();
  const cached = getDiscoverCache().get(key);
  if (cached && hasReviewClueFields(cached)) {
    return mergeHydratedFields(word, {
      phonetic: cached.phonetic ?? "",
      word_type: cached.word_type ?? "",
      vietnamese_meaning: cached.vietnamese_meaning ?? "",
      english_definition: cached.english_definition ?? "",
      examples: cached.examples ?? "",
      image_url: cached.image_url,
      search_keyword: cached.search_keyword,
    });
  }

  const standard = standardToDiscoverFields(key);
  if (standard && hasReviewClueFields(standard)) {
    return mergeHydratedFields(word, {
      phonetic: standard.phonetic,
      word_type: standard.word_type,
      vietnamese_meaning: standard.vietnamese_meaning,
      english_definition: standard.english_definition,
      examples: standard.examples ?? "",
      search_keyword: standard.search_keyword,
    });
  }

  const preset = getStaticWordDetail(key);
  if (preset) {
    return mergeHydratedFields(word, {
      phonetic: preset.ipa,
      word_type: preset.pos,
      vietnamese_meaning: preset.vietnamese,
      english_definition: preset.definition,
      examples: serializeExamples(preset.examples),
      search_keyword: resolveImageSearchKeyword(key, {
        pos: preset.pos,
        meaning: preset.vietnamese,
        englishDefinition: preset.definition,
      }),
    });
  }

  return word;
}

/** Local hydrate, then one fast DB lookup — for the active review card. */
export async function ensureReviewWordClue(word: VocabWord): Promise<VocabWord> {
  const local = hydrateReviewWordLocal(word);
  if (hasReviewClueFields(local)) return local;
  const details = await fetchReviewWordDetails(word.word);
  if (!details) return local;
  return mergeHydratedFields(local, details);
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
    if (hasReviewClueFields(hydrated)) {
      const key = word.word.trim().toLowerCase();
      updates[key] = hydrated;
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
    }
  } catch {
    /* best-effort */
  }

  return updates;
}
