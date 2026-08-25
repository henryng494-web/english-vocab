/**
 * Diagnose image resolution for one word (pipeline + env + output URL).
 *
 * Usage: npx tsx scripts/diagnose-word-image.ts welfare
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  fetchWordImageUrlDetailed,
  isCurrentPipelineImageUrl,
  shouldRefreshImageUrl,
} from "../src/lib/unsplash";
import { isLegacyStockScenePhrase } from "../src/lib/stock-scene-fallbacks";

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
  const word = (process.argv[2] ?? "welfare").trim().toLowerCase();
  const meaning = process.argv[3] ?? "Phúc lợi, trợ cấp xã hội";
  const pos = process.argv[4] ?? "noun";

  console.log("=== Env ===");
  console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY ? "set" : "MISSING");
  console.log(
    "UNSPLASH_ACCESS_KEY:",
    process.env.UNSPLASH_ACCESS_KEY ? "set" : "MISSING",
  );

  const legacyKw = "musical instruments practice room wooden floor";
  console.log("\n=== Legacy keyword check ===");
  console.log(`"${legacyKw}" legacy:`, isLegacyStockScenePhrase(legacyKw));

  console.log("\n=== Resolve ===");
  const result = await fetchWordImageUrlDetailed(
    word,
    legacyKw,
    pos,
    meaning,
    "government support for people in need",
  );

  console.log("searchKeyword:", result.searchKeyword);
  console.log("imageUrl:", result.url.slice(0, 140) + "…");
  console.log("isCurrentPipeline:", isCurrentPipelineImageUrl(result.url));
  console.log("shouldRefresh:", shouldRefreshImageUrl(result.url, word));
  try {
    const parsed = new URL(result.url);
    console.log("imgpipe:", parsed.searchParams.get("imgpipe"));
    console.log("semantic:", parsed.searchParams.get("semantic"));
  } catch {
    console.log("(not an http url — likely SVG placeholder)");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
