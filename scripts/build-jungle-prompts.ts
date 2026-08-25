import { writeFileSync } from "node:fs";
import { CAST_WORD_IMAGE_ENTRIES } from "@/data/cast-word-image-prompts";
import { JUNGLE_CAST_EXPRESSION_SAMPLES } from "@/data/jungle-cast-samples";
import type { JungleCastMember } from "@/data/jungle-cast-refs";

function mapText(s: string): string {
  return s
    .replace(/Gray cat/g, "Purple monkey")
    .replace(/gray cat/g, "purple monkey")
    .replace(/Golden dog/g, "Orange tiger")
    .replace(/golden dog/g, "orange tiger")
    .replace(/Tall blue cow/g, "Pink elephant")
    .replace(/tall blue cow/g, "pink elephant")
    .replace(/blue cow/g, "pink elephant")
    .replace(/Pink pig/g, "Lime-green crocodile")
    .replace(/pink pig/g, "lime-green crocodile")
    .replace(/Cat:/g, "Monkey:")
    .replace(/Dog:/g, "Tiger:")
    .replace(/Cow:/g, "Elephant:")
    .replace(/Pig:/g, "Crocodile:")
    .replace(/sunny meadow/gi, "city park")
    .replace(/green hill/gi, "neighborhood park")
    .replace(/meadow/gi, "city park")
    .replace(/cottage/gi, "suburban house")
    .replace(/forest/gi, "street");
}

function inferCast(scene: string, expressions: string): JungleCastMember[] {
  const text = `${scene} ${expressions}`.toLowerCase();
  if (/all four|all mascots|each looks|all cheering|united team/i.test(text)) {
    return ["monkey", "elephant", "crocodile", "tiger"];
  }
  const cast: JungleCastMember[] = [];
  if (/monkey|purple monkey/.test(text)) cast.push("monkey");
  if (/elephant|pink elephant/.test(text)) cast.push("elephant");
  if (/crocodile|lime-green/.test(text)) cast.push("crocodile");
  if (/tiger|orange tiger/.test(text)) cast.push("tiger");
  if (cast.length === 0) cast.push("monkey");
  return [...new Set(cast)];
}

type Entry = {
  cast: JungleCastMember[];
  scene: string;
  expressions: string;
  outfits?: string;
};

const entries: Record<string, Entry> = {};

for (const [word, entry] of Object.entries(CAST_WORD_IMAGE_ENTRIES)) {
  const approved =
    JUNGLE_CAST_EXPRESSION_SAMPLES[
      word as keyof typeof JUNGLE_CAST_EXPRESSION_SAMPLES
    ];
  if (approved) {
    entries[word] = {
      cast: [...approved.cast],
      scene: approved.scene,
      expressions: approved.expressions,
      outfits: approved.outfits,
    };
    continue;
  }

  const scene = mapText(entry.scene);
  const expressions = mapText(entry.expressions);
  let cast = inferCast(scene, expressions);

  const soloWords = new Set([
    "me",
    "up",
    "go",
    "if",
    "off",
    "hey",
    "sir",
    "well",
    "is",
    "an",
  ]);
  if (soloWords.has(word)) cast = [cast[0] ?? "monkey"];
  if (word === "we" || word === "all" || word === "now" || word === "okay") {
    cast = ["monkey", "elephant", "crocodile", "tiger"];
  }

  entries[word] = { cast, scene, expressions };
}

const body = JSON.stringify(entries, null, 2);

writeFileSync(
  "src/data/jungle-cast-word-image-prompts.ts",
  `/** Jungle Jokers word prompts — rank 1–100. Shape locked via multi-ref PNGs. */
import {
  JUNGLE_CAST_DESIGN_ONLY,
  JUNGLE_CAST_EXPRESSION_SAMPLES,
} from "@/data/jungle-cast-samples";
import {
  getJungleCastReferencePaths,
  JUNGLE_CAST_SHAPE_REMINDER,
  type JungleCastMember,
} from "@/data/jungle-cast-refs";

export type JungleWordImageEntry = {
  cast: readonly JungleCastMember[];
  scene: string;
  expressions: string;
  outfits?: string;
};

export const JUNGLE_WORD_IMAGE_ENTRIES: Readonly<
  Record<string, JungleWordImageEntry>
> = ${body} as const;

export const JUNGLE_WORD_IMAGE_SCENES = Object.fromEntries(
  Object.entries(JUNGLE_WORD_IMAGE_ENTRIES).map(([w, e]) => [w, e.scene]),
);

export function buildJungleCastWordImagePrompt(word: string): string | null {
  const key = word.trim().toLowerCase();
  const approved =
    JUNGLE_CAST_EXPRESSION_SAMPLES[
      key as keyof typeof JUNGLE_CAST_EXPRESSION_SAMPLES
    ];
  if (approved) {
    const castNote = \`Characters (\${approved.cast.length}): \${approved.cast.join(", ")}.\`;
    const outfitNote = approved.outfits ? \` OUTFITS: \${approved.outfits}\` : "";
    return \`\${JUNGLE_CAST_DESIGN_ONLY} \${castNote} \${JUNGLE_CAST_SHAPE_REMINDER} Word "\${key}": \${approved.scene} EXPRESSIONS: \${approved.expressions}.\${outfitNote}\`;
  }
  const entry = JUNGLE_WORD_IMAGE_ENTRIES[key];
  if (!entry) return null;
  const castNote = \`Characters (\${entry.cast.length}): \${entry.cast.join(", ")}.\`;
  const outfitNote = entry.outfits ? \` OUTFITS: \${entry.outfits}\` : "";
  return \`\${JUNGLE_CAST_DESIGN_ONLY} \${castNote} \${JUNGLE_CAST_SHAPE_REMINDER} Word "\${key}": \${entry.scene} EXPRESSIONS: \${entry.expressions}.\${outfitNote}\`;
}

export function getJungleCastWordReferences(word: string): string[] | null {
  const key = word.trim().toLowerCase();
  const approved =
    JUNGLE_CAST_EXPRESSION_SAMPLES[
      key as keyof typeof JUNGLE_CAST_EXPRESSION_SAMPLES
    ];
  const cast = approved?.cast ?? JUNGLE_WORD_IMAGE_ENTRIES[key]?.cast;
  if (!cast) return null;
  return getJungleCastReferencePaths(cast);
}
`,
);

console.log(`Built ${Object.keys(entries).length} jungle prompts`);
