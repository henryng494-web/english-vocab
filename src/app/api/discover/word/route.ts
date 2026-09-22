import { hasQualityStandardVocab, getStandardSearchKeyword } from "@/data/standard-vocab";
import { getPresetRank } from "@/data/preset-word-details";
import { createClient } from "@/lib/supabase/server";
import { enrichmentToDiscoverWord } from "@/lib/enrichment-helpers";
import { enrichWord } from "@/lib/enrich-word";
import { isPersistedWordDetailComplete } from "@/lib/persisted-word-detail";
import { generatePhoneticWithGemini } from "@/lib/gemini-core";
import { isPlaceholderPhonetic, formatIpa } from "@/lib/phonetic";
import {
  examplesNeedRegeneration,
  repairWordExamples,
} from "@/lib/repair-word-examples";
import { meaningsNeedRegeneration } from "@/lib/meaning-quality";
import { repairWordMeanings } from "@/lib/repair-word-meanings";
import { getImportanceTier } from "@/lib/word-rank";
import { withWordFamily } from "@/lib/word-family-display";
import { resolveImageSearchKeyword } from "@/lib/image-keyword";
import {
  fetchWordImageUrlDetailed,
  finalizeWordImageDisplayUrl,
  isPersistableWordImageUrl,
} from "@/lib/unsplash";
import { isClosedClassWord } from "@/lib/word-image-strategy";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import { localizeWordContent } from "@/lib/localize-word-content";
import {
  dbPayloadFromMultilangRecord,
  migrateLegacyWordDetail,
  pickPrimaryMeaning,
  splitLegacyExamples,
} from "@/lib/multilang-word-record";
import {
  DEFAULT_LEARNER_LOCALE,
  parseLearnerLocale,
  type LearnerLocale,
} from "@/lib/learner-locale";
import { sanitizeLearnerText } from "@/lib/sanitize-learner";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";
import { resolveWordRegister } from "@/lib/word-meanings";
import { normalizeVocabInput } from "@/lib/word-validation";
import { getFamilyHeadword } from "@/lib/word-family";
import type { WordDetail } from "@/types/database";
import { NextResponse } from "next/server";

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown error";
}

async function resolveImageUrl(
  word: string,
  existingUrl?: string | null,
  searchKeyword?: string | null,
  pos?: string | null,
  meaning?: string | null,
  englishDefinition?: string | null,
): Promise<string> {
  const fetched = await fetchWordImageUrlDetailed(
    word,
    searchKeyword ?? word,
    pos,
    meaning,
    englishDefinition,
    existingUrl,
  );
  return finalizeWordImageDisplayUrl(
    fetched.url,
    existingUrl,
    word,
    pos,
  );
}

function imageSearchKeyword(
  word: string,
  pos?: string | null,
  meaning?: string | null,
  englishDefinition?: string | null,
): string {
  return resolveImageSearchKeyword(word, {
    searchKeyword: getStandardSearchKeyword(word),
    pos,
    meaning,
    englishDefinition,
  });
}

async function applyLearnerLocaleFields(
  word: string,
  detail: WordDetail,
  locale: LearnerLocale,
) {
  const record = migrateLegacyWordDetail(detail);
  const viMeaning =
    sanitizeVietnameseText(record.meanings.vi ?? detail.vietnamese_meaning) ||
    record.meanings.vi ||
    detail.vietnamese_meaning;
  const patch = await localizeWordContent(
    {
      word,
      vietnamese_meaning: viMeaning,
      examples: record.examples,
      word_type: detail.word_type,
      english_definition: detail.english_definition,
      meanings: record.meanings,
      example_translations: record.example_translations,
    },
    locale,
  );
  const merged = {
    ...record,
    meanings: patch.meanings,
    example_translations: patch.example_translations,
    examples: patch.examples ?? record.examples,
  };
  return {
    ...patch,
    record: merged,
    vietnamese_meaning: pickPrimaryMeaning(merged, locale) ?? patch.active_gloss,
    examples: patch.examples,
  };
}

function persistedDetailToDiscoverWord(
  word: string,
  detail: WordDetail,
  rank: number,
  imageUrl: string,
  searchKeyword: string,
  localized?: {
    vietnamese_meaning: string | null;
    examples: string | null;
    meanings?: WordDetail["meanings"];
    example_translations?: WordDetail["example_translations"];
  },
) {
  const record = migrateLegacyWordDetail(detail);
  if (localized?.meanings) {
    record.meanings = localized.meanings;
  }
  if (localized?.example_translations) {
    record.example_translations = localized.example_translations;
  }
  if (localized?.examples != null) {
    record.examples = localized.examples;
  }
  const meaning =
    localized?.vietnamese_meaning ??
    pickPrimaryMeaning(record, DEFAULT_LEARNER_LOCALE);
  const examples = localized?.examples ?? record.examples;
  return withWordFamily({
    word,
    phonetic: detail.phonetic,
    word_type: detail.word_type,
    vietnamese_meaning: meaning,
    english_definition: detail.english_definition,
    examples,
    meanings: record.meanings,
    example_translations: record.example_translations,
    collocations: detail.collocations,
    register: resolveWordRegister(detail),
    image_url: imageUrl,
    rank,
    importance_tier: getImportanceTier(rank),
    from_fallback: false,
    from_static: false,
    from_cache: true,
    source: "database" as const,
    search_keyword: searchKeyword,
  });
}

/** Self-heal: persist a freshly regenerated image URL so it's fixed for good. */
function parseOptionalRank(rankParam: string | null): number | undefined {
  if (!rankParam) return undefined;
  const parsed = Number(rankParam);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function persistRepairField(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  field: "phonetic" | "examples" | "vietnamese_meaning",
  value: string,
  previous: string | null | undefined,
): Promise<void> {
  if (value === previous) return;
  const { error } = await supabase
    .from("word_details")
    .update({ [field]: value })
    .eq("word", word);
  if (error) {
    console.warn(`Failed to persist repaired ${field} for "${word}":`, error.message);
  }
}
/** Self-heal: persist a freshly regenerated image URL so it's fixed for good. */
async function persistImageUrlIfChanged(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  previousUrl: string | null | undefined,
  resolvedUrl: string,
): Promise<void> {
  if (!isPersistableWordImageUrl(resolvedUrl, word)) return;
  if (previousUrl?.trim() === resolvedUrl) return;
  const { error } = await supabase
    .from("word_details")
    .update({ image_url: resolvedUrl })
    .eq("word", word);
  if (error) {
    console.warn(`Failed to persist refreshed image_url for "${word}":`, error.message);
  }
}

async function repairPersistedExamplesIfNeeded(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  detail: WordDetail,
): Promise<string> {
  const previous = detail.examples?.trim() ?? "";
  const repaired = await repairWordExamples(
    word,
    detail.examples,
    detail.word_type,
    detail.vietnamese_meaning,
  );
  if (
    !examplesNeedRegeneration(
      word,
      repaired,
      detail.word_type,
      detail.vietnamese_meaning,
    )
  ) {
    await persistRepairField(supabase, word, "examples", repaired, detail.examples);
    return repaired;
  }
  if (
    previous &&
    !examplesNeedRegeneration(
      word,
      previous,
      detail.word_type,
      detail.vietnamese_meaning,
    )
  ) {
    return previous;
  }
  return repaired.trim() ? repaired : previous;
}

async function repairPhoneticIfNeeded(
  word: string,
  phonetic?: string | null,
): Promise<string> {
  const formatted = formatIpa(phonetic ?? "", word);
  if (!isPlaceholderPhonetic(word, formatted)) return formatted;
  const fromGemini = await generatePhoneticWithGemini(word);
  if (fromGemini && !isPlaceholderPhonetic(word, fromGemini)) return fromGemini;
  return formatted;
}

async function repairPersistedPhoneticIfNeeded(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  detail: WordDetail,
): Promise<string> {
  const repaired = await repairPhoneticIfNeeded(word, detail.phonetic);
  await persistRepairField(supabase, word, "phonetic", repaired, detail.phonetic);
  return repaired;
}

async function repairPersistedMeaningIfNeeded(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  detail: WordDetail,
): Promise<string> {
  const repaired = await repairWordMeanings(
    word,
    detail.vietnamese_meaning,
    detail.word_type,
    detail.examples,
    detail.english_definition,
  );
  if (repaired) {
    await persistRepairField(
      supabase,
      word,
      "vietnamese_meaning",
      repaired,
      detail.vietnamese_meaning,
    );
  }
  return repaired || detail.vietnamese_meaning;
}

async function persistEnrichedWordDetail(
  supabase: Awaited<ReturnType<typeof createClient>>,
  word: string,
  payload: {
    phonetic: string;
    word_type: string;
    vietnamese_meaning: string;
    english_definition: string;
    examples: string;
    collocations: string | null;
    image_url: string | null;
    meanings?: WordDetail["meanings"];
    example_translations?: WordDetail["example_translations"];
  },
): Promise<void> {
  try {
    const { error } = await supabase
      .from("word_details")
      .upsert({ word, ...payload }, { onConflict: "word" });
    if (error) {
      console.warn(`Failed to persist word_details for "${word}":`, error);
    }
  } catch (error) {
    console.warn(`Failed to persist word_details for "${word}":`, error);
  }
}

/**
 * Lazy word detail — Gemini / curated standard vocab only.
 * Free Dictionary is no longer used (it returned slang/secondary senses).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const word = normalizeVocabInput(searchParams.get("word") ?? "");
    const rankParam = searchParams.get("rank");
    const rank = parseOptionalRank(rankParam);
    const skipGemini =
      searchParams.get("skipGemini") === "true" &&
      hasQualityStandardVocab(word ?? "");
    const forceRepair = searchParams.get("forceRepair") === "true";
    const learnerLocale = parseLearnerLocale(searchParams.get("locale"));
    const persistLearnerContent = learnerLocale === DEFAULT_LEARNER_LOCALE;

    if (!word) {
      return NextResponse.json(
        { error: "Word is required or invalid format" },
        { status: 400 },
      );
    }

    if (isExcludedVocabWord(word) || isExcludedVocabWord(getFamilyHeadword(word))) {
      return NextResponse.json(
        { error: "Word not available in this app" },
        { status: 404 },
      );
    }

    const supabase = await createClient();
    const { data: dbDetail } = await supabase
      .from("word_details")
      .select("*")
      .eq("word", word)
      .maybeSingle();

    const frequencyRank = rank ?? getPresetRank(word) ?? 5000;

    let repairedDbDetail = dbDetail ?? null;
    if (dbDetail) {
      const vietnamese_meaning = await repairPersistedMeaningIfNeeded(
        supabase,
        word,
        dbDetail,
      );
      const examples = await repairPersistedExamplesIfNeeded(
        supabase,
        word,
        { ...dbDetail, vietnamese_meaning },
      );
      const phonetic = await repairPersistedPhoneticIfNeeded(
        supabase,
        word,
        { ...dbDetail, examples, vietnamese_meaning },
      );
      repairedDbDetail = { ...dbDetail, examples, phonetic, vietnamese_meaning };
    }

    const examplesStillMisaligned = repairedDbDetail
      ? examplesNeedRegeneration(
          word,
          repairedDbDetail.examples,
          repairedDbDetail.word_type,
          repairedDbDetail.vietnamese_meaning,
        )
      : false;
    const meaningsStillBad = repairedDbDetail
      ? meaningsNeedRegeneration(
          word,
          repairedDbDetail.vietnamese_meaning,
          repairedDbDetail.word_type,
          repairedDbDetail.examples,
          repairedDbDetail.english_definition,
        )
      : false;

    const preferCurated = hasQualityStandardVocab(word);

    if (
      !forceRepair &&
      !preferCurated &&
      !examplesStillMisaligned &&
      !meaningsStillBad &&
      isPersistedWordDetailComplete(repairedDbDetail, word)
    ) {
      const searchKeyword = imageSearchKeyword(
        word,
        repairedDbDetail!.word_type,
        repairedDbDetail!.vietnamese_meaning,
        repairedDbDetail!.english_definition,
      );
      const imageUrl = await resolveImageUrl(
        word,
        repairedDbDetail!.image_url,
        searchKeyword,
        repairedDbDetail!.word_type,
        repairedDbDetail!.vietnamese_meaning,
        repairedDbDetail!.english_definition,
      );
      if (repairedDbDetail!.image_url !== imageUrl) {
        if (isPersistableWordImageUrl(imageUrl, word)) {
          await persistImageUrlIfChanged(
            supabase,
            word,
            repairedDbDetail!.image_url,
            imageUrl,
          );
        } else if (
          isClosedClassWord(word, repairedDbDetail!.word_type) &&
          repairedDbDetail!.image_url
        ) {
          await supabase
            .from("word_details")
            .update({ image_url: null })
            .eq("word", word);
        }
      }
      const localized = await applyLearnerLocaleFields(
        word,
        repairedDbDetail!,
        learnerLocale,
      );
      const localizedRecord = localized.record;
      if (learnerLocale !== DEFAULT_LEARNER_LOCALE && localizedRecord) {
        const dbPayload = dbPayloadFromMultilangRecord(localizedRecord);
        void persistEnrichedWordDetail(supabase, word, {
          phonetic: dbPayload.phonetic ?? "",
          word_type: dbPayload.word_type ?? "unknown",
          vietnamese_meaning: dbPayload.vietnamese_meaning ?? "",
          english_definition: dbPayload.english_definition ?? "",
          examples: dbPayload.examples ?? "",
          collocations: dbPayload.collocations ?? null,
          image_url: dbPayload.image_url ?? null,
          meanings: dbPayload.meanings ?? undefined,
          example_translations: dbPayload.example_translations ?? undefined,
        });
      }
      return NextResponse.json({
        word: persistedDetailToDiscoverWord(
          word,
          repairedDbDetail!,
          frequencyRank,
          imageUrl,
          searchKeyword,
          {
            vietnamese_meaning: localized.vietnamese_meaning,
            examples: localized.examples,
            meanings: localized.meanings,
            example_translations: localized.example_translations,
          },
        ),
      });
    }

    const forceExampleRegen = forceRepair || examplesStillMisaligned || meaningsStillBad;

    const enrichment = await enrichWord(word, {
      rank: frequencyRank,
      skipGemini: forceExampleRegen ? false : skipGemini,
      forceGemini: forceExampleRegen,
      learnerLocale,
    });
    const responseWord = enrichmentToDiscoverWord(word, enrichment, null);
    const searchKeyword = responseWord.search_keyword ?? word;
    const sanitizeMeaning = (value: string | null | undefined) =>
      persistLearnerContent
        ? sanitizeVietnameseText(value) || word
        : sanitizeLearnerText(value, learnerLocale) || word;

    const vietnameseMeaning = sanitizeMeaning(responseWord.vietnamese_meaning);
    const englishDefinition = responseWord.english_definition?.trim() || null;
    const fetched = await fetchWordImageUrlDetailed(
      word,
      searchKeyword,
      responseWord.word_type ?? enrichment.wordType,
      vietnameseMeaning,
      englishDefinition,
      dbDetail?.image_url,
    );
    const imageUrl = finalizeWordImageDisplayUrl(
      fetched.url,
      dbDetail?.image_url,
      word,
      responseWord.word_type ?? enrichment.wordType,
    );
    responseWord.image_url = imageUrl;
    let examples = responseWord.examples ?? "";
    let vietnameseMeaningFinal = sanitizeMeaning(
      responseWord.vietnamese_meaning,
    );
    if (persistLearnerContent) {
      examples = await repairWordExamples(
        word,
        responseWord.examples,
        responseWord.word_type,
        responseWord.vietnamese_meaning,
      );
      if (
        meaningsNeedRegeneration(
          word,
          vietnameseMeaningFinal,
          responseWord.word_type,
          examples,
          responseWord.english_definition,
        )
      ) {
        vietnameseMeaningFinal = await repairWordMeanings(
          word,
          vietnameseMeaningFinal,
          responseWord.word_type,
          examples,
          responseWord.english_definition,
        );
        examples = await repairWordExamples(
          word,
          examples,
          responseWord.word_type,
          vietnameseMeaningFinal,
        );
      }
      if (
        examplesNeedRegeneration(
          word,
          examples,
          responseWord.word_type,
          vietnameseMeaningFinal,
        )
      ) {
        const retried = await repairWordExamples(
          word,
          examples,
          responseWord.word_type,
          vietnameseMeaningFinal,
        );
        if (retried.trim()) examples = retried;
      }
    }
    const phonetic = await repairPhoneticIfNeeded(word, responseWord.phonetic);

    const exampleSplit = splitLegacyExamples(examples);
    const enExamples = exampleSplit.examples ?? examples;
    const meaningsPayload = { vi: vietnameseMeaningFinal };
    const exampleTranslationsPayload = exampleSplit.example_translations;

    const persistPayload = {
      phonetic: phonetic ?? `/${word}/`,
      word_type: responseWord.word_type ?? "unknown",
      vietnamese_meaning: vietnameseMeaningFinal,
      english_definition: responseWord.english_definition ?? "",
      examples: enExamples,
      meanings: meaningsPayload,
      example_translations: exampleTranslationsPayload,
      collocations: responseWord.collocations ?? null,
      image_url: isPersistableWordImageUrl(imageUrl, word) ? imageUrl : null,
    };

    if (
      persistLearnerContent &&
      !examplesNeedRegeneration(
        word,
        examples,
        responseWord.word_type,
        vietnameseMeaningFinal,
      ) &&
      !meaningsNeedRegeneration(
        word,
        vietnameseMeaningFinal,
        responseWord.word_type,
        examples,
        responseWord.english_definition,
      )
    ) {
      void persistEnrichedWordDetail(supabase, word, persistPayload);
    } else if (!persistLearnerContent) {
      const enrichedDetail: WordDetail = {
        id: dbDetail?.id ?? "",
        word,
        phonetic: persistPayload.phonetic,
        word_type: persistPayload.word_type,
        vietnamese_meaning: persistPayload.vietnamese_meaning,
        english_definition: persistPayload.english_definition,
        examples: persistPayload.examples,
        meanings: persistPayload.meanings,
        example_translations: persistPayload.example_translations,
        collocations: persistPayload.collocations,
        image_url: persistPayload.image_url,
      };
      const localizedEs = await applyLearnerLocaleFields(
        word,
        enrichedDetail,
        learnerLocale,
      );
      if (localizedEs.record) {
        const dbPayload = dbPayloadFromMultilangRecord(localizedEs.record);
        void persistEnrichedWordDetail(supabase, word, {
          phonetic: dbPayload.phonetic ?? persistPayload.phonetic,
          word_type: dbPayload.word_type ?? persistPayload.word_type,
          vietnamese_meaning: dbPayload.vietnamese_meaning ?? "",
          english_definition: dbPayload.english_definition ?? "",
          examples: dbPayload.examples ?? persistPayload.examples,
          collocations: dbPayload.collocations ?? null,
          image_url: dbPayload.image_url ?? persistPayload.image_url,
          meanings: dbPayload.meanings ?? undefined,
          example_translations: dbPayload.example_translations ?? undefined,
        });
      }
    } else {
      console.warn(
        `[discover/word] Gemini content still misaligned for "${word}" — not persisting bad rows`,
      );
    }

    if (dbDetail) {
      await persistImageUrlIfChanged(
        supabase,
        word,
        dbDetail.image_url,
        imageUrl,
      );
    }

    const enrichedDetail: WordDetail = {
      id: dbDetail?.id ?? "",
      word,
      phonetic: persistPayload.phonetic,
      word_type: persistPayload.word_type,
      vietnamese_meaning: persistPayload.vietnamese_meaning,
      english_definition: persistPayload.english_definition,
      examples: persistPayload.examples,
      meanings: persistPayload.meanings,
      example_translations: persistPayload.example_translations,
      collocations: persistPayload.collocations,
      image_url: persistPayload.image_url,
    };
    const localizedOut = await applyLearnerLocaleFields(
      word,
      enrichedDetail,
      learnerLocale,
    );

    return NextResponse.json({
      word: persistedDetailToDiscoverWord(
        word,
        enrichedDetail,
        frequencyRank,
        imageUrl,
        searchKeyword,
        {
          vietnamese_meaning: localizedOut.vietnamese_meaning,
          examples: localizedOut.examples,
          meanings: localizedOut.meanings,
          example_translations: localizedOut.example_translations,
        },
      ),
    });
  } catch (error) {
    console.error("Discover word preview error:", error);
    return NextResponse.json(
      { error: "Failed to load word", details: errorMessage(error) },
      { status: 500 },
    );
  }
}
