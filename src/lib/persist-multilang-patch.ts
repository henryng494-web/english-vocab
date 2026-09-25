import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ExampleTranslationsJson,
  LocalizedMeaningsJson,
  PhraseTranslationsJson,
} from "@/types/word-content";

export type MultilangPersistPatch = {
  meanings?: LocalizedMeaningsJson;
  example_translations?: ExampleTranslationsJson;
  phrase_translations?: PhraseTranslationsJson;
};

let cachedColumns: Set<string> | null = null;

export async function probeMultilangColumns(
  supabase: SupabaseClient,
): Promise<Set<string>> {
  if (cachedColumns) return cachedColumns;
  const candidates = [
    "meanings",
    "example_translations",
    "phrase_translations",
  ] as const;
  const present = new Set<string>();
  for (const col of candidates) {
    const { error } = await supabase.from("word_details").select(col).limit(1);
    if (!error) present.add(col);
  }
  cachedColumns = present;
  return present;
}

/** Persist ES hydrate fields that exist on `word_details` (skips missing columns). */
export async function persistMultilangPatch(
  supabase: SupabaseClient,
  word: string,
  patch: MultilangPersistPatch,
): Promise<{ ok: boolean; persisted: string[]; error?: string }> {
  const columns = await probeMultilangColumns(supabase);
  const payload: Record<string, unknown> = {};
  if (columns.has("meanings") && patch.meanings) {
    payload.meanings = patch.meanings;
  }
  if (columns.has("example_translations") && patch.example_translations) {
    payload.example_translations = patch.example_translations;
  }
  if (columns.has("phrase_translations") && patch.phrase_translations) {
    payload.phrase_translations = patch.phrase_translations;
  }

  if (Object.keys(payload).length === 0) {
    return {
      ok: false,
      persisted: [],
      error: "No multilang columns available on word_details",
    };
  }

  const { error } = await supabase
    .from("word_details")
    .update(payload)
    .eq("word", word);

  if (error) {
    return { ok: false, persisted: [], error: error.message };
  }
  return { ok: true, persisted: Object.keys(payload) };
}
