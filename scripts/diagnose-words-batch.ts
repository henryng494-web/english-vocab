/**
 * Diagnose image resolution for sample words.
 * Usage: npx tsx scripts/diagnose-words-batch.ts surgical dreadful
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@supabase/supabase-js";
import { resolveImageSearchKeyword } from "../src/lib/image-keyword";
import {
  fetchWordImageUrlDetailed,
  isCurrentPipelineImageUrl,
  shouldRefreshImageUrl,
} from "../src/lib/unsplash";

function loadEnv() {
  try {
    const content = readFileSync(resolve(process.cwd(), ".env.local"), "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq);
      const val = trimmed.slice(eq + 1);
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    /* optional */
  }
}

async function main() {
  loadEnv();
  const words = process.argv.slice(2);
  if (words.length === 0) words.push("surgical", "dreadful");

  const sb = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  for (const word of words) {
    const { data } = await sb
      .from("word_details")
      .select("image_url, vietnamese_meaning, english_definition, word_type")
      .eq("word", word)
      .maybeSingle();

    const kw = resolveImageSearchKeyword(word, {
      meaning: data?.vietnamese_meaning,
      englishDefinition: data?.english_definition,
      pos: data?.word_type,
    });

    console.log(`\n=== ${word} ===`);
    console.log("DB url:", data?.image_url?.slice(0, 110) ?? "(none)");
    console.log("meaning:", data?.vietnamese_meaning);
    console.log("pos:", data?.word_type);
    console.log("rule keyword:", kw);
    console.log("shouldRefresh DB:", shouldRefreshImageUrl(data?.image_url, word));
    console.log("isPipeline DB:", isCurrentPipelineImageUrl(data?.image_url));

    const fresh = await fetchWordImageUrlDetailed(
      word,
      null,
      data?.word_type,
      data?.vietnamese_meaning,
      data?.english_definition,
    );
    console.log("fresh keyword:", fresh.searchKeyword);
    console.log("fresh url:", fresh.url.slice(0, 110));
    console.log("fresh pipeline:", isCurrentPipelineImageUrl(fresh.url));
  }
}

main().catch(console.error);
