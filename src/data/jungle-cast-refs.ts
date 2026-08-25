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
  const paths = new Set<string>();
  // Lineup monkey has long ground-touching arms — omit lineup when monkey is in cast
  // to avoid extra-limb generation errors.
  if (!cast.includes("monkey")) {
    paths.add(JUNGLE_CAST_LINEUP_PATH);
  }
  for (const member of cast) {
    paths.add(JUNGLE_CAST_CHARACTER_REFS[member]);
  }
  return [...paths];
}

export const JUNGLE_CAST_SHAPE_REMINDER =
  "Copy EXACT body proportions from attached character reference images — do not redesign, resize, or reinterpret silhouettes. Only change face expression and optional outfit.";
