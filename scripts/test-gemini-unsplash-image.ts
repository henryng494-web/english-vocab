/**
 * Example: Gemini → Unsplash vocabulary illustration pipeline.
 *
 * Usage:
 *   npm run test:gemini-unsplash-image
 *   npx tsx scripts/test-gemini-unsplash-image.ts devoted adjective "Tận tụy, hết lòng"
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  fetchUnsplashImageUrl,
  fetchVocabIllustrationImage,
  generateStockSearchPhraseWithGemini,
} from "../src/lib/gemini-unsplash-image";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  try {
    const content = readFileSync(envPath, "utf8");
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
    console.warn("Warning: .env.local not found — set API keys in the environment.");
  }
}

async function main() {
  loadEnv();

  const word = process.argv[2] ?? "devoted";
  const partOfSpeech = process.argv[3] ?? "adjective";
  const meaning = process.argv[4] ?? "Tận tụy, hết lòng";

  console.log("=== Step 1: Gemini search phrase ===");
  console.log({ word, partOfSpeech, meaning });

  const phrase = await generateStockSearchPhraseWithGemini({
    word,
    partOfSpeech,
    meaning,
  });
  console.log("Gemini phrase:", phrase ?? "(null)");

  if (phrase) {
    console.log("\n=== Step 2: Unsplash image ===");
    const unsplashUrl = await fetchUnsplashImageUrl(word, phrase);
    console.log("Unsplash URL:", unsplashUrl ?? "(null)");
  }

  console.log("\n=== Full pipeline ===");
  const result = await fetchVocabIllustrationImage({
    word,
    partOfSpeech,
    meaning,
  });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
