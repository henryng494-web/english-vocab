/**
 * Regenerate failed Jungle Jokers images from QA report.
 * Run: npm run fix:jungle-word-images
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildJungleCastWordImagePrompt,
  getJungleCastWordReferences,
} from "@/data/jungle-cast-word-image-prompts";
import { scanImage } from "./scan-jungle-word-images";

const OUT_DIR = resolve(process.cwd(), "public/word-images");
const REPORT_PATH = resolve(OUT_DIR, "jungle-qa-report.json");
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
  attempt: number,
): Promise<Buffer | null> {
  const models = [
    process.env.GEMINI_IMAGE_MODEL?.trim(),
    "gemini-2.5-flash-image",
  ].filter((name): name is string => Boolean(name));

  const refParts = loadReferenceParts(word);
  const extra =
    attempt > 1
      ? " RETRY: EXACT cast count only. Monkey 2 arms 2 legs sitting side profile. Elephant two stick arms with hands. NO extra mascots."
      : "";

  for (const model of models) {
    try {
      const parts: Array<Record<string, unknown>> = [
        ...refParts,
        { text: prompt + extra },
        {
          text: "Use ONLY characters listed. Do NOT add unlisted mascots.",
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

      if (!response.ok) continue;
      const inline = extractInlineImage(await response.json());
      if (!inline) continue;
      return Buffer.from(inline.data, "base64");
    } catch {
      /* next model */
    }
  }
  return null;
}

export async function fixWord(
  word: string,
  apiKey: string,
  verify: boolean,
): Promise<boolean> {
  const prompt = buildJungleCastWordImagePrompt(word);
  if (!prompt) return false;

  for (let attempt = 1; attempt <= 2; attempt++) {
    const buf = await generateViaGemini(word, prompt, apiKey, attempt);
    if (!buf) continue;
    writeFileSync(resolve(OUT_DIR, `${word}.jpg`), buf);
    if (!verify) return true;
    const qa = await scanImage(word, apiKey);
    if (qa.ok) return true;
    console.log(`    retry (${qa.issues.join("; ")})`);
  }
  return false;
}

async function main(): Promise<void> {
  loadEnv();
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error("GEMINI_API_KEY required");
    process.exit(1);
  }

  const verify = !process.argv.includes("--no-verify");
  const cliWords = process.argv
    .slice(2)
    .filter((a) => !a.startsWith("--"))
    .map((w) => w.toLowerCase());

  let words = cliWords;
  if (words.length === 0 && existsSync(REPORT_PATH)) {
    const report = JSON.parse(readFileSync(REPORT_PATH, "utf8")) as {
      failures: Array<{ word: string }>;
    };
    words = report.failures.map((f) => f.word);
  }

  if (words.length === 0) {
    console.error("No words. Run scan:jungle-word-images first.");
    process.exit(1);
  }

  console.log(`Fixing ${words.length} words (verify=${verify})…`);
  let ok = 0;
  let fail = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    if (i > 0) {
      console.log(`Waiting ${DELAY_MS / 1000}s…`);
      await sleep(DELAY_MS);
    }
    process.stdout.write(`[${i + 1}/${words.length}] ${word}… `);
    const success = await fixWord(word, apiKey, verify);
    if (success) {
      console.log("OK");
      ok++;
    } else {
      console.log("FAIL");
      fail++;
    }
  }

  console.log(`Done: ${ok} ok, ${fail} failed`);
  if (fail > 0) process.exit(1);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
