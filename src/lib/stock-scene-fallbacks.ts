import { hashWordSeed } from "@/lib/image-keyword-utils";

/** Concrete stock queries — unique per word via hash, searchable on Pexels/Unsplash. */
export const DIVERSIFIED_STOCK_SCENES = [
  "hands preparing fresh food kitchen counter",
  "person reading open book cozy desk lamp",
  "stack of colorful books library study table",
  "tools craftsman workshop hands making object",
  "green plants garden sunlight watering can",
  "city street crosswalk people walking commute",
  "office whiteboard team planning meeting notes",
  "child drawing crayons paper creative table",
  "coffee cup morning window light workspace",
  "hands typing laptop modern office desk",
  "fresh vegetables market basket colorful produce",
  "person jogging park trail morning exercise",
  "musical instruments practice room wooden floor",
  "scientific microscope laboratory research bench",
  "sewing fabric tailor hands stitching cloth",
  "pottery wheel hands shaping clay studio",
  "map travel planning pins destination table",
  "weather clouds sky landscape horizon view",
  "pet dog playing grass backyard sunshine",
  "construction blueprint hard hat building site",
] as const;

export function diversifiedStockScene(word: string): string {
  const idx = hashWordSeed(word) % DIVERSIFIED_STOCK_SCENES.length;
  return DIVERSIFIED_STOCK_SCENES[idx]!;
}

const LEGACY_SCENE_SET = new Set<string>(
  DIVERSIFIED_STOCK_SCENES.map((scene) =>
    scene.toLowerCase().replace(/\s+/g, " ").trim(),
  ),
);

/** Reject auto-generated rank-band / shared scene phrases stored in DB. */
export function isLegacyStockScenePhrase(phrase: string): boolean {
  const cleaned = phrase.trim().toLowerCase().replace(/\s+/g, " ");
  if (!cleaned) return false;
  if (LEGACY_SCENE_SET.has(cleaned)) return true;
  return cleaned.includes("musical instruments practice room");
}
