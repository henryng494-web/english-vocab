/**
 * Generate mascot scene manifest for preset rank 1–1000.
 * Run: npm run generate:mascot-manifest
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getWordsInRange } from "@/data/preset-vocabulary";
import { MASCOT_TOP_RANK_LIMIT, type MascotSceneType } from "@/lib/mascot-cast";

// Inline planner logic (avoid importing manifest we're generating).
import { lookupCuratedImageKeyword } from "@/data/curated-image-keywords-loader";

const WORD_SCENE: Readonly<Record<string, MascotSceneType>> = {
  lazy: "lazy_cat",
  sleep: "sleep",
  rest: "sleep",
  tired: "tired_pig",
  exhaust: "tired_pig",
  stress: "tired_pig",
  surprise: "surprised_dog",
  surprised: "surprised_dog",
  shock: "surprised_dog",
  funny: "silly_cow",
  silly: "silly_cow",
  tall: "tall_contrast",
  height: "tall_contrast",
  between: "between",
  under: "under",
  below: "under",
  above: "above",
  over: "above",
  in: "in_box",
  into: "in_box",
  inside: "in_box",
  on: "on_top",
  upon: "on_top",
  rain: "rain",
  rainy: "rain",
  cold: "cold",
  snow: "cold",
  winter: "cold",
  hot: "hot",
  warm: "hot",
  sunny: "hot",
  eat: "eat",
  food: "eat",
  meal: "eat",
  drink: "eat",
  run: "run",
  walk: "run",
  fast: "run",
  slow: "tired_pig",
  give: "give",
  gift: "give",
  help: "help",
  support: "help",
  learn: "learn",
  study: "learn",
  teach: "learn",
  home: "home",
  house: "home",
  time: "time",
  clock: "time",
  money: "money",
  cash: "money",
  pay: "money",
  happy: "happy_group",
  broken: "broken_thing",
  important: "important_badge",
  fighting: "angry_cat",
  fight: "angry_cat",
  sad: "sad_pig",
  angry: "angry_cat",
  big: "big_small",
  small: "big_small",
  work: "work",
  office: "work",
  break: "broken_thing",
  open: "surprised_dog",
  close: "default_duo",
  love: "happy_group",
  think: "lazy_cat",
  clean: "default_duo",
  dirty: "tired_pig",
  fire: "hot",
  water: "eat",
  light: "hot",
  dark: "sleep",
  color: "happy_group",
  make: "work",
  way: "run",
};

function matchKeywordScene(keyword: string): MascotSceneType | null {
  const k = keyword.toLowerCase();
  const rules: Array<[RegExp, MascotSceneType]> = [
    [/\b(lazy|sleep|rest|nap|bed)\b/, "lazy_cat"],
    [/\b(surprise|shock|amaze|astonish)\b/, "surprised_dog"],
    [/\b(tired|exhaust|stress|weary|fatigue)\b/, "tired_pig"],
    [/\b(silly|funny|tongue|playful)\b/, "silly_cow"],
    [/\b(tall|height|tower|skyscraper)\b/, "tall_contrast"],
    [/\bbetween\b/, "between"],
    [/\b(under|below|beneath)\b/, "under"],
    [/\b(above|over)\b/, "above"],
    [/\b(in|into|inside|box)\b/, "in_box"],
    [/\b(on|upon|table|sofa)\b/, "on_top"],
    [/\b(rain|rainy|umbrella|storm)\b/, "rain"],
    [/\b(cold|snow|winter|ice|scarf)\b/, "cold"],
    [/\b(hot|warm|sun|sunny|heat)\b/, "hot"],
    [/\b(eat|food|meal|drink|plate|kitchen|cook)\b/, "eat"],
    [/\b(run|walk|jog|sprint|speed)\b/, "run"],
    [/\b(give|gift|share|offer)\b/, "give"],
    [/\b(help|support|assist)\b/, "help"],
    [/\b(learn|study|teach|book|classroom|student)\b/, "learn"],
    [/\b(home|house|cozy|exterior)\b/, "home"],
    [/\b(time|clock|hour|minute)\b/, "time"],
    [/\b(money|cash|coin|pay|wallet)\b/, "money"],
    [/\b(happy|smil|joy|celebrat)\b/, "happy_group"],
    [/\b(broken|break|crack|shatter|smash)\b/, "broken_thing"],
    [/\b(important|crucial|vital|significant)\b/, "important_badge"],
    [/\b(fight|fighting|battle|punch|conflict)\b/, "angry_cat"],
    [/\b(sad|cry|tear|unhappy)\b/, "sad_pig"],
    [/\b(angry|mad|furious|annoy)\b/, "angry_cat"],
    [/\b(big|large|huge|elephant|small|tiny|kitten)\b/, "big_small"],
    [/\b(office|desk|laptop|work)\b/, "work"],
  ];
  for (const [pattern, scene] of rules) {
    if (pattern.test(k)) return scene;
  }
  return null;
}

function planScene(word: string): MascotSceneType {
  const normalized = word.toLowerCase();
  const direct = WORD_SCENE[normalized];
  if (direct) return direct;
  const curated = lookupCuratedImageKeyword(normalized);
  if (curated) {
    const fromCurated = matchKeywordScene(curated);
    if (fromCurated) return fromCurated;
  }
  return "default_duo";
}

const words = getWordsInRange(1, MASCOT_TOP_RANK_LIMIT);
const manifest: Record<string, MascotSceneType> = {};
for (const entry of words) {
  manifest[entry.word] = planScene(entry.word);
}

const outPath = resolve(
  process.cwd(),
  "src/data/mascot-scene-manifest-top1000.ts",
);
const body = `/** Auto-generated — npm run generate:mascot-manifest */
import type { MascotSceneType } from "@/lib/mascot-cast";

export const MASCOT_SCENE_MANIFEST_TOP1000: Readonly<Record<string, MascotSceneType>> = ${JSON.stringify(manifest, null, 2)} as const;
`;

writeFileSync(outPath, body, "utf8");
console.log(`Wrote ${Object.keys(manifest).length} entries → ${outPath}`);

const counts = new Map<string, number>();
for (const scene of Object.values(manifest)) {
  counts.set(scene, (counts.get(scene) ?? 0) + 1);
}
console.log("Scene distribution:");
for (const [scene, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${scene}: ${count}`);
}
