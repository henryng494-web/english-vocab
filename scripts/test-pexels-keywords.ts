/**
 * Test curated keywords → Pexels pipeline (same logic as the app).
 *
 * Usage:
 *   npx tsx scripts/test-pexels-keywords.ts
 *   npx tsx scripts/test-pexels-keywords.ts night family vital
 *   npx tsx scripts/test-pexels-keywords.ts --json
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getStandardSearchKeyword } from "../src/data/standard-vocab";
import {
  buildImageSearchQueries,
  hasCuratedVisualKeyword,
  resolveImageSearchKeyword,
} from "../src/lib/image-keyword";
import { scoreImageMetadata } from "../src/lib/unsplash";

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
    console.warn("Warning: .env.local not found — set PEXELS_API_KEY manually.");
  }
}

type PexelsPhoto = { url: string; alt: string };

type QueryResult = {
  query: string;
  photoCount: number;
  bestScore: number;
  bestAlt: string | null;
  bestUrl: string | null;
  picked: boolean;
};

type WordResult = {
  word: string;
  group: string;
  pos: string;
  curated: boolean;
  standardKeyword: string;
  primaryQuery: string;
  queries: string[];
  winningQuery: string | null;
  winningScore: number;
  winningAlt: string | null;
  winningUrl: string | null;
  source: "pexels" | "none";
  pass: boolean;
  queryResults: QueryResult[];
};

const DEFAULT_WORDS: Array<{ word: string; pos: string; group: string }> = [
  { word: "night", pos: "noun", group: "A-curated-101-300" },
  { word: "family", pos: "noun", group: "A-curated-101-300" },
  { word: "father", pos: "noun", group: "A-curated-101-300" },
  { word: "stop", pos: "verb", group: "A-curated-101-300" },
  { word: "listen", pos: "verb", group: "A-curated-101-300" },
  { word: "water", pos: "noun", group: "B-curated-1-100" },
  { word: "good", pos: "adjective", group: "B-curated-1-100" },
  { word: "between", pos: "preposition", group: "B-curated-1-100" },
  { word: "run", pos: "verb", group: "B-curated-1-100" },
  { word: "train", pos: "noun", group: "C-standard-vocab" },
  { word: "sleep", pos: "verb", group: "C-standard-vocab" },
  { word: "coffee", pos: "noun", group: "C-standard-vocab" },
  { word: "vital", pos: "adjective", group: "D-no-curated" },
  { word: "important", pos: "adjective", group: "D-no-curated" },
  { word: "actually", pos: "adverb", group: "D-no-curated" },
];

async function searchPexelsPhotos(query: string): Promise<PexelsPhoto[]> {
  const apiKey = process.env.PEXELS_API_KEY?.trim();
  if (!apiKey) return [];

  const params = new URLSearchParams({
    query,
    per_page: "8",
    orientation: "landscape",
  });

  const response = await fetch(`https://api.pexels.com/v1/search?${params}`, {
    headers: { Authorization: apiKey },
  });
  if (!response.ok) {
    throw new Error(`Pexels ${response.status} for "${query}"`);
  }

  const data = (await response.json()) as {
    photos?: Array<{
      alt?: string | null;
      src?: { landscape?: string; large?: string };
    }>;
  };

  return (data.photos ?? [])
    .map((photo) => ({
      url: photo.src?.landscape ?? photo.src?.large ?? "",
      alt: photo.alt ?? query,
    }))
    .filter((photo) => photo.url);
}

function pickBestPhoto(
  word: string,
  query: string,
  photos: PexelsPhoto[],
): { score: number; alt: string; url: string } | null {
  let best: { score: number; alt: string; url: string } | null = null;
  for (const photo of photos) {
    const score = scoreImageMetadata(word, query, photo.alt);
    if (score <= 0) continue;
    if (!best || score > best.score) {
      best = { score, alt: photo.alt, url: photo.url };
    }
  }
  return best;
}

async function testWord(
  word: string,
  pos: string,
  group: string,
): Promise<WordResult> {
  const standardKeyword = getStandardSearchKeyword(word);
  const primaryQuery = resolveImageSearchKeyword(word, {
    searchKeyword: standardKeyword,
    pos,
  });
  const queries = buildImageSearchQueries(word, {
    searchKeyword: standardKeyword,
    pos,
  });

  const queryResults: QueryResult[] = [];
  let winningQuery: string | null = null;
  let winningScore = 0;
  let winningAlt: string | null = null;
  let winningUrl: string | null = null;

  for (const query of queries) {
    const photos = await searchPexelsPhotos(query);
    const best = pickBestPhoto(word, query, photos);
    const picked = Boolean(best);
    if (picked && !winningQuery) {
      winningQuery = query;
      winningScore = best!.score;
      winningAlt = best!.alt;
      winningUrl = best!.url;
    }
    queryResults.push({
      query,
      photoCount: photos.length,
      bestScore: best?.score ?? 0,
      bestAlt: best?.alt ?? null,
      bestUrl: best?.url ?? null,
      picked,
    });
    if (picked) break;
  }

  const pass = winningScore > 0;

  return {
    word,
    group,
    pos,
    curated: hasCuratedVisualKeyword(word),
    standardKeyword,
    primaryQuery,
    queries,
    winningQuery,
    winningScore,
    winningAlt,
    winningUrl,
    source: pass ? "pexels" : "none",
    pass,
    queryResults,
  };
}

function printSummary(results: WordResult[]) {
  const passCount = results.filter((r) => r.pass).length;
  console.log("\n=== Pexels keyword test summary ===");
  console.log(`Pass: ${passCount}/${results.length}`);
  console.log("");
  console.log(
    "word".padEnd(12) +
      "group".padEnd(22) +
      "curated".padEnd(10) +
      "primary query".padEnd(36) +
      "win query".padEnd(28) +
      "score".padEnd(7) +
      "pass",
  );
  console.log("-".repeat(120));

  for (const r of results) {
    console.log(
      r.word.padEnd(12) +
        r.group.padEnd(22) +
        (r.curated ? "yes" : "no").padEnd(10) +
        r.primaryQuery.slice(0, 34).padEnd(36) +
        (r.winningQuery ?? "-").slice(0, 26).padEnd(28) +
        String(r.winningScore).padEnd(7) +
        (r.pass ? "PASS" : "FAIL"),
    );
  }

  console.log("\n--- Failures (need curated keyword or better query) ---");
  for (const r of results.filter((x) => !x.pass)) {
    console.log(`• ${r.word} (${r.group}) — tried: ${r.queries.join(" → ")}`);
  }

  console.log("\n--- Sample winning alts ---");
  for (const r of results.filter((x) => x.pass).slice(0, 5)) {
    console.log(`• ${r.word}: "${r.winningAlt}"`);
    console.log(`  ${r.winningUrl}`);
  }
}

async function main() {
  loadEnv();

  const args = process.argv.slice(2);
  const jsonMode = args.includes("--json");
  const wordsArg = args.filter((a) => !a.startsWith("--"));

  const targets =
    wordsArg.length > 0
      ? wordsArg.map((word) => ({
          word: word.toLowerCase(),
          pos: "noun",
          group: "custom",
        }))
      : DEFAULT_WORDS;

  if (!process.env.PEXELS_API_KEY?.trim()) {
    console.error("PEXELS_API_KEY is missing. Add it to .env.local first.");
    process.exit(1);
  }

  console.log(`Testing ${targets.length} word(s) against Pexels...\n`);

  const results: WordResult[] = [];
  for (const target of targets) {
    process.stdout.write(`  ${target.word}... `);
    try {
      const result = await testWord(target.word, target.pos, target.group);
      results.push(result);
      console.log(result.pass ? `PASS (score ${result.winningScore})` : "FAIL");
    } catch (error) {
      console.log("ERROR");
      results.push({
        word: target.word,
        group: target.group,
        pos: target.pos,
        curated: hasCuratedVisualKeyword(target.word),
        standardKeyword: getStandardSearchKeyword(target.word),
        primaryQuery: resolveImageSearchKeyword(target.word, { pos: target.pos }),
        queries: [],
        winningQuery: null,
        winningScore: 0,
        winningAlt: null,
        winningUrl: null,
        source: "none",
        pass: false,
        queryResults: [],
      });
      console.error(error);
    }
  }

  if (jsonMode) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    printSummary(results);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
