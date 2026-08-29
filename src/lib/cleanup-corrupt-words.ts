import {
  canonicalizeVocabWord,
  hasCorruptWordSuffix,
  isValidVocabWord,
} from "@/lib/word-validation";
import { isExcludedVocabWord } from "@/lib/proper-noun";
import type { Database } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function cleanupCorruptWords(
  supabase: SupabaseClient<Database>,
): Promise<number> {
  const { data: details, error } = await supabase
    .from("word_details")
    .select("word");

  if (error || !details?.length) return 0;

  let cleaned = 0;

  for (const row of details) {
    const corruptWord = row.word;
    if (!hasCorruptWordSuffix(corruptWord)) continue;

    const canonical = canonicalizeVocabWord(corruptWord);
    if (!isValidVocabWord(canonical)) continue;

    const { data: canonicalDetail } = await supabase
      .from("word_details")
      .select("word")
      .eq("word", canonical)
      .maybeSingle();

    if (canonicalDetail) {
      await supabase.from("user_learning").delete().eq("word", corruptWord);
      await supabase.from("word_details").delete().eq("word", corruptWord);
      await supabase.from("word_bank").delete().eq("word", corruptWord);
    } else {
      await supabase.from("word_bank").update({ word: canonical }).eq("word", corruptWord);
      await supabase
        .from("word_details")
        .update({ word: canonical })
        .eq("word", corruptWord);
      await supabase
        .from("user_learning")
        .update({ word: canonical })
        .eq("word", corruptWord);
    }

    cleaned += 1;
  }

  return cleaned;
}

/** Remove learning rows and cached details for words excluded from the inventory. */
export async function cleanupExcludedVocabWords(
  supabase: SupabaseClient<Database>,
): Promise<number> {
  const { data: learningRows, error: learningError } = await supabase
    .from("user_learning")
    .select("word");

  if (learningError) return 0;

  const excluded = new Set(
    (learningRows ?? [])
      .map((row) => row.word)
      .filter((word) => isExcludedVocabWord(word)),
  );

  if (excluded.size === 0) return 0;

  for (const word of excluded) {
    await supabase.from("user_learning").delete().eq("word", word);
    await supabase.from("word_bank").delete().eq("word", word);
    await supabase.from("word_details").delete().eq("word", word);
  }

  return excluded.size;
}
