/**
 * Scan → fix failures → rescan loop until clean or max rounds.
 * Run: npx tsx scripts/qa-fix-jungle-loop.ts
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";
import { scanImage } from "./scan-jungle-word-images";
import { fixWord } from "./fix-jungle-word-images";

const REPORT_PATH = resolve(process.cwd(), "public/word-images/jungle-qa-report.json");
const MAX_ROUNDS = Number(process.env.JUNGLE_QA_MAX_ROUNDS ?? 3);
const DELAY_MS = Number(process.env.CAST_IMAGE_DELAY_MS ?? 12_000);

function loadEnv(): void {
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

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function scanAll(apiKey: string, words: string[]) {
  const results: Awaited<ReturnType<typeof scanImage>>[] = [];
  const existing = existsSync(REPORT_PATH)
    ? (JSON.parse(readFileSync(REPORT_PATH, "utf8")) as {
        results?: Awaited<ReturnType<typeof scanImage>>[];
      })
    : null;
  const done = new Map(
    (existing?.results ?? []).map((r) => [r.word, r] as const),
  );

  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    if (done.has(word) && done.get(word)!.ok) {
      results.push(done.get(word)!);
      continue;
    }
    if (i > 0) await sleep(Number(process.env.GEMINI_QA_DELAY_MS ?? 3000));
    process.stdout.write(`scan ${word}… `);
    try {
      const r = await scanImage(word, apiKey);
      results.push(r);
      console.log(r.ok ? "OK" : "FAIL");
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({
        word,
        expectedCast: [],
        expectedCount: 0,
        ok: false,
        issues: [`scan error: ${msg}`],
        visibleCharacters: [],
        visibleCount: 0,
        confidence: "low",
      });
      console.log("ERROR");
    }
    const failures = results.filter((r) => !r.ok);
    writeFileSync(
      REPORT_PATH,
      JSON.stringify(
        {
          scannedAt: new Date().toISOString(),
          total: words.length,
          passed: results.filter((r) => r.ok).length,
          failed: failures.length,
          failures,
          results,
        },
        null,
        2,
      ),
    );
  }
  return results.filter((r) => !r.ok);
}

async function main(): Promise<void> {
  loadEnv();
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error("GEMINI_API_KEY required");
    process.exit(1);
  }

  const words = getWordsInRange(1, 100).map((e) => e.word);

  for (let round = 1; round <= MAX_ROUNDS; round++) {
    console.log(`\n=== Round ${round}: SCAN ===`);
    const failures = await scanAll(apiKey, words);
    console.log(`Failed: ${failures.length}/${words.length}`);
    if (failures.length === 0) {
      console.log("All images passed QA.");
      return;
    }

    console.log(`\n=== Round ${round}: FIX ${failures.length} words ===`);
    let fixed = 0;
    for (let i = 0; i < failures.length; i++) {
      const word = failures[i]!.word;
      if (i > 0) await sleep(DELAY_MS);
      process.stdout.write(`${word}… `);
      const ok = await fixWord(word, apiKey, true);
      console.log(ok ? "OK" : "FAIL");
      if (ok) fixed++;
    }
    console.log(`Fixed ${fixed}/${failures.length}`);
  }

  const final = JSON.parse(readFileSync(REPORT_PATH, "utf8")) as {
    failed: number;
  };
  if (final.failed > 0) {
    console.error(`Still ${final.failed} failures after ${MAX_ROUNDS} rounds.`);
    process.exit(2);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
