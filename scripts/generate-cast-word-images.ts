/**
 * Generate full-scene cast mascot JPEGs (fox-trial style).
 * Providers: pollinations (default), gemini (if quota available)
 *
 * Run: npm run generate:cast-word-images
 * Force: CAST_IMAGE_FORCE=true npm run generate:cast-word-images
 * Subset: npm run generate:cast-word-images -- you the and
 */

import { mkdirSync, writeFileSync, existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";
import {
  buildCastWordImagePrompt,
  CAST_WORD_IMAGE_SCENES,
} from "@/data/cast-word-image-prompts";

const OUT_DIR = resolve(process.cwd(), "public/word-images");
const DELAY_MS = Number(process.env.CAST_IMAGE_DELAY_MS ?? 14_000);
const PROVIDER = (process.env.CAST_IMAGE_PROVIDER ?? "pollinations").toLowerCase();
const REFERENCE_PATH = resolve(process.cwd(), "public/mascot/cast-lineup.png");

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
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

async function generateViaPollinations(
  word: string,
  prompt: string,
  seed: number,
): Promise<Buffer | null> {
  const apiKey = process.env.POLLINATIONS_API_KEY?.trim();
  const encoded = encodeURIComponent(prompt);
  const urls = apiKey
    ? [
        `https://gen.pollinations.ai/image/${encoded}?model=flux&width=1280&height=720&seed=${seed}`,
      ]
    : [
        `https://image.pollinations.ai/prompt/${encoded}?model=flux&width=1280&height=720&seed=${seed}`,
      ];

  for (const url of urls) {
    try {
      const headers: Record<string, string> = {};
      if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
      const res = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(120_000),
      });
      if (!res.ok) {
        const body = await res.text();
        console.warn(`[${word}] Pollinations HTTP ${res.status}: ${body.slice(0, 120)}`);
        continue;
      }
      const type = res.headers.get("content-type") ?? "";
      if (!type.startsWith("image/")) {
        console.warn(`[${word}] Pollinations not image: ${type}`);
        continue;
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (error) {
      console.warn(
        `[${word}] Pollinations failed:`,
        error instanceof Error ? error.message : error,
      );
    }
  }
  return null;
}

async function generateViaGemini(
  word: string,
  prompt: string,
  apiKey: string,
): Promise<Buffer | null> {
  const models = [
    process.env.GEMINI_IMAGE_MODEL?.trim(),
    "gemini-2.5-flash-image",
  ].filter((name): name is string => Boolean(name));

  const referenceB64 = existsSync(REFERENCE_PATH)
    ? readFileSync(REFERENCE_PATH).toString("base64")
    : null;

  for (const model of models) {
    try {
      const parts: Array<Record<string, unknown>> = [{ text: prompt }];
      if (referenceB64) {
        parts.unshift({
          inlineData: { mimeType: "image/png", data: referenceB64 },
        });
        parts.push({
          text: "Match the reference lineup for exact character designs.",
        });
      }

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
        console.warn(`[${word}] ${model} HTTP ${response.status}: ${body.slice(0, 120)}`);
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

async function generateImage(
  word: string,
  prompt: string,
  seed: number,
): Promise<Buffer | null> {
  if (PROVIDER === "gemini") {
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) return null;
    return generateViaGemini(word, prompt, apiKey);
  }
  const geminiKey = process.env.GEMINI_API_KEY?.trim();
  if (PROVIDER === "auto" && geminiKey) {
    const gemini = await generateViaGemini(word, prompt, geminiKey);
    if (gemini) return gemini;
  }
  return generateViaPollinations(word, prompt, seed);
}

async function main(): Promise<void> {
  mkdirSync(OUT_DIR, { recursive: true });

  const cliWords = process.argv.slice(2).map((w) => w.toLowerCase());
  const words =
    cliWords.length > 0
      ? cliWords
      : getWordsInRange(1, 100).map((entry) => entry.word);

  const missing = words.filter((w) => !CAST_WORD_IMAGE_SCENES[w]);
  if (missing.length) {
    console.warn("Missing prompts:", missing.join(", "));
  }

  console.log(
    `Generating ${words.length} full-scene cast images via ${PROVIDER} → ${OUT_DIR}`,
  );
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    const prompt = buildCastWordImagePrompt(word);
    if (!prompt) {
      console.warn(`Skip "${word}": no prompt`);
      fail++;
      continue;
    }

    const outPath = resolve(OUT_DIR, `${word}.jpg`);
    if (existsSync(outPath) && process.env.CAST_IMAGE_FORCE !== "true") {
      console.log(`[${i + 1}/${words.length}] ${word} — exists, skip`);
      ok++;
      continue;
    }

    if (i > 0) {
      console.log(`Waiting ${DELAY_MS / 1000}s…`);
      await sleep(DELAY_MS);
    }

    console.log(`[${i + 1}/${words.length}] ${word}…`);
    const buf = await generateImage(word, prompt, 5000 + i);
    if (!buf) {
      console.error(`  ✗ failed`);
      fail++;
      continue;
    }

    writeFileSync(outPath, buf);
    console.log(`  ✓ ${outPath} (${buf.length} bytes)`);
    ok++;
  }

  writeFileSync(
    resolve(OUT_DIR, "cast-generation-report.json"),
    JSON.stringify({ ok, fail, words, bundle: "cast2", provider: PROVIDER }, null, 2),
  );
  console.log(`Done: ${ok} ok, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
