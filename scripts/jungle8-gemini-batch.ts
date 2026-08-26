#!/usr/bin/env npx tsx
/**
 * Generate pending jungle8 word images via Gemini (same prompts/refs as GenerateImage).
 * Writes artifact + copies JPEG with ffmpeg conversion.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execSync } from "node:child_process";
import { resolve } from "node:path";
import {
  buildJungleCastWordImagePrompt,
  getJungleCastWordReferences,
} from "@/data/jungle-cast-word-image-prompts";
import { getWordsInRange } from "@/data/preset-vocabulary";
import manifest from "./jungle8-manifest.json";

const ART_DIR = "/opt/cursor/artifacts/assets";
const OUT_DIR = resolve(process.cwd(), "public/word-images");
const DELAY_MS = Number(process.env.CAST_IMAGE_DELAY_MS ?? 8000);
const FORCE = process.env.JUNGLE8_FORCE === "true";

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function loadReferenceParts(word: string): Array<Record<string, unknown>> {
  const refs = getJungleCastWordReferences(word) ?? [];
  const parts: Array<Record<string, unknown>> = [];
  for (const rel of refs) {
    const abs = resolve(process.cwd(), rel);
    if (!existsSync(abs)) continue;
    parts.push({
      inlineData: {
        mimeType: abs.endsWith(".png") ? "image/png" : "image/jpeg",
        data: readFileSync(abs).toString("base64"),
      },
    });
  }
  return parts;
}

function extractInlineImage(
  payload: unknown,
): { mime: string; data: string } | null {
  const candidates =
    (payload as { candidates?: Array<{ content?: { parts?: unknown[] } }> })
      .candidates ?? [];
  for (const candidate of candidates) {
    for (const part of candidate.content?.parts ?? []) {
      const raw = part as Record<
        string,
        { mimeType?: string; mime_type?: string; data?: string } | undefined
      >;
      const inline = raw.inlineData ?? raw.inline_data;
      const mime = inline?.mimeType ?? inline?.mime_type;
      const data = inline?.data;
      if (mime && data) return { mime, data };
    }
  }
  return null;
}

async function generateViaGemini(
  word: string,
  prompt: string,
  apiKey: string,
): Promise<Buffer | null> {
  const models = ["gemini-2.5-flash-image"];
  const refParts = loadReferenceParts(word);

  for (const model of models) {
    try {
      const parts: Array<Record<string, unknown>> = [
        ...refParts,
        { text: prompt },
        {
          text: "Wide 16:9 landscape. Match attached character reference PNGs for exact body proportions.",
        },
      ];

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts }],
            generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
          }),
          signal: AbortSignal.timeout(180_000),
        },
      );

      if (!response.ok) {
        const body = await response.text();
        console.warn(`[${word}] ${model} HTTP ${response.status}: ${body.slice(0, 200)}`);
        continue;
      }

      const inline = extractInlineImage(await response.json());
      if (!inline) continue;
      return Buffer.from(inline.data, "base64");
    } catch (error) {
      console.warn(
        `[${word}] ${model} failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
  return null;
}

function copyAsJpeg(word: string): void {
  execSync(`./scripts/jungle8-copy-artifact.sh ${word}`, { stdio: "inherit" });
}

async function main(): Promise<void> {
  mkdirSync(ART_DIR, { recursive: true });
  mkdirSync(OUT_DIR, { recursive: true });

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error("GEMINI_API_KEY required");
    process.exit(1);
  }

  const cliWords = process.argv.slice(2).map((w) => w.toLowerCase());
  const allWords =
    cliWords.length > 0
      ? cliWords
      : getWordsInRange(1, 100).map((e) => e.word);

  const pending = allWords.filter((word) => {
    const art = `${ART_DIR}/jungle8-word-${word}`;
    if (FORCE) return true;
    return !existsSync(art);
  });

  console.log(`jungle8 gemini batch: ${pending.length} pending of ${allWords.length}`);

  let ok = 0;
  let fail = 0;
  const failed: string[] = [];

  for (let i = 0; i < pending.length; i++) {
    const word = pending[i]!;
    const prompt = buildJungleCastWordImagePrompt(word);
    if (!prompt) {
      console.warn(`Skip ${word}: no prompt`);
      fail++;
      failed.push(word);
      continue;
    }

    if (i > 0) await sleep(DELAY_MS);

    console.log(`[${i + 1}/${pending.length}] ${word}…`);
    const buf = await generateViaGemini(word, prompt, apiKey);
    if (!buf) {
      console.error(`  ✗ failed`);
      fail++;
      failed.push(word);
      continue;
    }

    const artPath = `${ART_DIR}/jungle8-word-${word}`;
    writeFileSync(artPath, buf);
    try {
      copyAsJpeg(word);
      console.log(`  ✓ ${word}`);
      ok++;
    } catch (e) {
      console.error(`  ✗ copy failed:`, e);
      fail++;
      failed.push(word);
    }
  }

  // Update report for all words with valid jpgs
  const okWords = allWords.filter((w) => {
    const jpg = resolve(OUT_DIR, `${w}.jpg`);
    return existsSync(jpg) && readFileSync(jpg).length > 10_000;
  });
  const report = {
    bundle: "jungle8",
    target: 100,
    ok: okWords.length,
    fail: 100 - okWords.length,
    failed: allWords.filter((w) => !okWords.includes(w)).sort(),
    okWords: okWords.sort(),
    at: new Date().toISOString(),
  };
  writeFileSync(
    resolve(OUT_DIR, "cast-generation-report.json"),
    JSON.stringify(report, null, 2) + "\n",
  );

  console.log(`Done: ${ok} generated this run, ${okWords.length}/100 total ok, ${report.fail} fail`);
  if (failed.length) console.log("Failed:", failed.join(", "));
  if (report.fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
