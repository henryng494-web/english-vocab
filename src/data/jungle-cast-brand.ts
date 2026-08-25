/**
 * Jungle Jokers — official app mascot brand.
 * Single source of truth for character identity across word images and UI.
 */

import { JUNGLE_CAST_CHARACTER_REFS } from "@/data/jungle-cast-refs";

export const APP_MASCOT_BRAND = {
  id: "jungle-jokers",
  name: "Jungle Jokers",
  tagline: "Học từ vựng cùng bộ đôi vui nhộn",
} as const;

/** Hex colors — use in UI theming. */
export const MASCOT_BRAND_COLORS = {
  monkey: "#8B5CF6",
  monkeyLight: "#C4B5FD",
  elephant: "#F472B6",
  crocodile: "#84CC16",
  tiger: "#F97316",
  tigerCream: "#FED7AA",
} as const;

/** Locked geometry — must match reference PNGs exactly. */
export const MASCOT_SHAPE_SPEC = {
  monkey:
    "Small purple monkey; round head; normal arms (not floor-length); 2 arms + 2 legs + tail.",
  elephant:
    "Pink giant circle head; stick-thin body/legs; 2 stick arms with 3-finger hands + trunk.",
  crocodile:
    "Lime-green horizontal LOG rectangle (3:1 width:height); low to ground; 4 stub legs; eyes on top; NEVER upright humanoid.",
  tiger:
    "Orange single SPHERE ball (head+body merged); tiny stub limbs; zigzag stripes; cream muzzle on sphere face; NEVER separate head+torso.",
} as const;

/** Public URL paths for in-app mascot display. */
export const MASCOT_PUBLIC_PATHS = {
  lineup: "/mascot/jungle-jokers-lineup.png",
  monkey: "/mascot/jungle-jokers/monkey.png",
  elephant: "/mascot/jungle-jokers/elephant.png",
  crocodile: "/mascot/jungle-jokers/crocodile.png",
  tiger: "/mascot/jungle-jokers/tiger.png",
} as const;

export const MASCOT_GENERATION_REFS = JUNGLE_CAST_CHARACTER_REFS;

export type MascotBrandMember = keyof typeof MASCOT_PUBLIC_PATHS extends infer K
  ? K extends "lineup"
    ? never
    : K
  : never;

export function getMascotPublicPath(member: MascotBrandMember): string {
  return MASCOT_PUBLIC_PATHS[member];
}
