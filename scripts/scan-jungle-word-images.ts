/**
 * Vision QA scan for Jungle Jokers word images.
 * Run: npm run scan:jungle-word-images
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";
import { JUNGLE_CAST_EXPRESSION_SAMPLES } from "@/data/jungle-cast-samples";
import { JUNGLE_WORD_IMAGE_ENTRIES } from "@/data/jungle-cast-word-image-prompts";

const OUT_DIR = resolve(process.cwd(), "public/word-images");
const REPORT_PATH = resolve(OUT_DIR, "jungle-qa-report.json");
const MODEL = process.env.GEMINI_QA_MODEL?.trim() ?? "gemini-3-flash-preview";
const DELAY_MS = Number(process.env.GEMINI_QA_DELAY_MS ?? 3000);
const MAX_RETRIES = Number(process.env.GEMINI_QA_RETRIES ?? 4);

type CastMember = "monkey" | "elephant" | "crocodile" | "tiger";

export type QaResult = {
  word: string;
  expectedCast: CastMember[];
  expectedCount: number;
  ok: boolean;
  issues: string[];
  visibleCharacters: CastMember[];
  visibleCount: number;
  monkeyArms?: number;
  monkeyLegs?: number;
  elephantHasArms?: boolean;
  confidence: "high" | "medium" | "low";
};

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

export function expectedCast(word: string): CastMember[] {
  const key = word.toLowerCase();
  const approved =
    JUNGLE_CAST_EXPRESSION_SAMPLES[
      key as keyof typeof JUNGLE_CAST_EXPRESSION_SAMPLES
    ];
  const entry = JUNGLE_WORD_IMAGE_ENTRIES[key];
  return [...(approved?.cast ?? entry?.cast ?? [])] as CastMember[];
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  label: string,
): Promise<Response> {
  let lastErr = "";
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      const wait = DELAY_MS * 2 ** attempt;
      console.warn(`  retry ${attempt}/${MAX_RETRIES} for ${label} in ${wait}ms…`);
      await sleep(wait);
    }
    try {
      const res = await fetch(url, init);
      if (res.status === 429 || res.status === 503) {
        lastErr = await res.text();
        continue;
      }
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`${label}: Gemini ${res.status} ${body.slice(0, 200)}`);
      }
      return res;
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
      if (!lastErr.includes("429") && !lastErr.includes("503")) throw err;
    }
  }
  throw new Error(`${label}: Gemini quota/rate limit after retries: ${lastErr.slice(0, 200)}`);
}

export async function scanImage(word: string, apiKey: string): Promise<QaResult> {
  const cast = expectedCast(word);
  const imagePath = resolve(OUT_DIR, `${word}.jpg`);
  if (!existsSync(imagePath)) {
    return {
      word,
      expectedCast: cast,
      expectedCount: cast.length,
      ok: false,
      issues: ["missing image file"],
      visibleCharacters: [],
      visibleCount: 0,
      confidence: "high",
    };
  }

  const b64 = readFileSync(imagePath).toString("base64");
  const prompt = `Strict QA for Jungle Jokers cartoon word illustration.

EXPECTED characters only (${cast.length}): ${cast.join(", ") || "none"}.

Character IDs:
- monkey: purple/lavender monkey
- elephant: pink giant circle head, thin stick limbs
- crocodile: lime-green log-shaped body
- tiger: orange striped sphere

Return ONLY JSON:
{
  "visibleCharacters": ["monkey"|"elephant"|"crocodile"|"tiger"],
  "visibleCount": number,
  "monkeyArmCount": number|null,
  "monkeyLegCount": number|null,
  "monkeyLimbOk": boolean|null,
  "elephantHasTwoArms": boolean|null,
  "elephantArmOk": boolean|null,
  "extraCharacters": boolean,
  "tigerSphereOk": boolean|null,
  "crocodileLogOk": boolean|null,
  "issues": [string],
  "confidence": "high"|"medium"|"low"
}

Rules:
- monkeyLimbOk: exactly 2 arms AND 2 legs (no extras)
- elephantArmOk: two thin stick arms with hands visible if elephant present
- tigerSphereOk: if tiger present, body must be ONE merged orange sphere (not separate head+torso)
- crocodileLogOk: if crocodile present, body must be horizontal log low to ground (not upright humanoid)
- extraCharacters: any mascot not in [${cast.join(", ")}]
- visibleCount must not exceed ${cast.length}`;

  const res = await fetchWithRetry(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inlineData: { mimeType: "image/jpeg", data: b64 } },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: "application/json",
        },
      }),
      signal: AbortSignal.timeout(90_000),
    },
    word,
  );

  const payload = (await res.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const text =
    payload.candidates?.[0]?.content?.parts?.find((p) => p.text)?.text ?? "{}";
  const parsed = JSON.parse(text) as {
    visibleCharacters?: CastMember[];
    visibleCount?: number;
    monkeyArmCount?: number | null;
    monkeyLegCount?: number | null;
    monkeyLimbOk?: boolean | null;
    elephantHasTwoArms?: boolean | null;
    elephantArmOk?: boolean | null;
    tigerSphereOk?: boolean | null;
    crocodileLogOk?: boolean | null;
    extraCharacters?: boolean;
    issues?: string[];
    confidence?: "high" | "medium" | "low";
  };

  const visible = (parsed.visibleCharacters ?? []).filter((c) =>
    ["monkey", "elephant", "crocodile", "tiger"].includes(c),
  );
  const issues = [...(parsed.issues ?? [])];

  if (parsed.extraCharacters || visible.length > cast.length) {
    issues.push(
      `cast overflow: expected ${cast.length} got ${visible.length} [${visible.join(",")}]`,
    );
  }
  if (cast.includes("monkey") && parsed.monkeyLimbOk === false) {
    issues.push(
      `monkey limbs: arms=${parsed.monkeyArmCount} legs=${parsed.monkeyLegCount}`,
    );
  }
  if (cast.includes("elephant") && parsed.elephantArmOk === false) {
    issues.push("elephant missing arms");
  }
  for (const c of visible) {
    if (!cast.includes(c)) issues.push(`unexpected: ${c}`);
  }

  const uniqueIssues = [...new Set(issues)];

  return {
    word,
    expectedCast: cast,
    expectedCount: cast.length,
    ok: uniqueIssues.length === 0,
    issues: uniqueIssues,
    visibleCharacters: visible,
    visibleCount: parsed.visibleCount ?? visible.length,
    monkeyArms: parsed.monkeyArmCount ?? undefined,
    monkeyLegs: parsed.monkeyLegCount ?? undefined,
    elephantHasArms: parsed.elephantHasTwoArms ?? undefined,
    confidence: parsed.confidence ?? "medium",
  };
}

async function main(): Promise<void> {
  loadEnv();
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.error("GEMINI_API_KEY required");
    process.exit(1);
  }

  const cliWords = process.argv.slice(2).filter((a) => !a.startsWith("--"));
  const words =
    cliWords.length > 0
      ? cliWords
      : getWordsInRange(1, 100).map((e) => e.word);

  console.log(`Scanning ${words.length} images via ${MODEL}…`);
  const results: QaResult[] = [];
  let fail = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i]!;
    if (i > 0) await sleep(DELAY_MS);
    process.stdout.write(`[${i + 1}/${words.length}] ${word}… `);
    try {
      const r = await scanImage(word, apiKey);
      results.push(r);
      if (r.ok) console.log("OK");
      else {
        console.log("FAIL:", r.issues.join("; "));
        fail++;
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({
        word,
        expectedCast: expectedCast(word),
        expectedCount: expectedCast(word).length,
        ok: false,
        issues: [`scan error: ${msg}`],
        visibleCharacters: [],
        visibleCount: 0,
        confidence: "low",
      });
      console.log("ERROR");
      fail++;
    }
  }

  const report = {
    scannedAt: new Date().toISOString(),
    model: MODEL,
    total: words.length,
    passed: words.length - fail,
    failed: fail,
    failures: results.filter((r) => !r.ok),
    results,
  };

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));
  console.log(`\nReport: ${REPORT_PATH}`);
  console.log(`Passed: ${report.passed}/${report.total}, Failed: ${report.failed}`);
  if (fail > 0) process.exit(2);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
