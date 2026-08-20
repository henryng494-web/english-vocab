import {
  canonicalizeVocabWord,
  hasCorruptWordSuffix,
  isValidVocabWord,
} from "@/lib/word-validation";
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
