/**
 * Jungle Jokers — per-character reference paths + prompt helpers.
 * Use individual refs + lineup when generating to lock body shape.
 */

export const JUNGLE_CAST_LINEUP_PATH = "public/mascot/jungle-jokers-lineup.png";

export const JUNGLE_CAST_CHARACTER_REFS = {
  monkey: "public/mascot/jungle-jokers/monkey.png",
  elephant: "public/mascot/jungle-jokers/elephant.png",
  crocodile: "public/mascot/jungle-jokers/crocodile.png",
  tiger: "public/mascot/jungle-jokers/tiger.png",
} as const;

export type JungleCastMember = keyof typeof JUNGLE_CAST_CHARACTER_REFS;

/** Reference images to pass to GenerateImage for a scene. */
export function getJungleCastReferencePaths(
  cast: readonly JungleCastMember[],
): string[] {
  // Never use lineup — it encourages all-four casts and long-arm monkey errors.
  return cast.map((member) => JUNGLE_CAST_CHARACTER_REFS[member]);
}

export const JUNGLE_CAST_SHAPE_REMINDER =
  "Copy EXACT body proportions from attached character reference PNGs — match silhouette pixel-perfect. Do not redesign, resize, or reinterpret. Tiger = orange sphere. Crocodile = horizontal log. Elephant = circle head + stick limbs. Monkey = compact purple. Only change face expression and optional outfit.";
