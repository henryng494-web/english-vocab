#!/usr/bin/env npx tsx
/** Write locked framework manifest to public/word-images/jungle-cast-framework.json */
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import {
  JUNGLE_CAST_FRAMEWORK_VERSION,
  JUNGLE_CAST_IMAGE_FRAMEWORK,
} from "@/data/jungle-cast-image-framework";
import { JUNGLE_WORD_IMAGE_ENTRIES } from "@/data/jungle-cast-word-image-prompts";
import { buildJungleCastWordImagePrompt } from "@/data/jungle-cast-word-image-prompts";

const OUT = resolve(process.cwd(), "public/word-images/jungle-cast-framework.json");
const reportPath = resolve(process.cwd(), "public/word-images/cast-generation-report.json");

const report = existsSync(reportPath)
  ? JSON.parse(readFileSync(reportPath, "utf8"))
  : null;

const words = Object.keys(JUNGLE_WORD_IMAGE_ENTRIES).sort();
const manifest = {
  ...JUNGLE_CAST_IMAGE_FRAMEWORK,
  exportedAt: new Date().toISOString(),
  frameworkVersion: JUNGLE_CAST_FRAMEWORK_VERSION,
  generationReport: report,
  wordCount: words.length,
  words,
  samplePrompts: Object.fromEntries(
    ["you", "the", "if", "at", "now", "we"].map((w) => [
      w,
      {
        cast: JUNGLE_WORD_IMAGE_ENTRIES[w]?.cast,
        scene: JUNGLE_WORD_IMAGE_ENTRIES[w]?.scene,
        promptPreview: buildJungleCastWordImagePrompt(w)?.slice(0, 400) + "...",
      },
    ]),
  ),
};

writeFileSync(OUT, JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${OUT} (${words.length} words, ${JUNGLE_CAST_FRAMEWORK_VERSION})`);
