/**
 * Jungle Jokers — official app mascot brand.
 * Single source of truth for character identity across word images and UI.
 */

import { JUNGLE_CAST_CHARACTER_REFS } from "@/data/jungle-cast-refs";

export const APP_MASCOT_BRAND = {
  id: "jungle-jokers",
  name: "Jungle Jokers",
  tagline: "Học từ vựng cùng bộ Jokers vui nhộn",
} as const;

/** Splash: official Jungle Jokers welcome splash illustration. */
export const WELCOME_SPLASH_ART = {
  path: "/mascot/welcome/welcome-splash.png?v=jungle9",
  mode: "illustration" as const,
} as const;

/** @deprecated use WELCOME_SPLASH_ART */
export const WELCOME_SPLASH_IMAGE = {
  path: "/mascot/welcome/welcome-splash.png?v=jungle9",
  alt: "Jungle Jokers mascots welcome illustration",
  mode: "illustration" as const,
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

/** Public URL paths for in-app mascot display (transparent PNGs). */
export const MASCOT_PUBLIC_PATHS = {
  lineup: "/mascot/jungle-jokers-lineup.png",
  monkey: "/mascot/jungle-jokers/header/monkey.png?v=1",
  elephant: "/mascot/jungle-jokers/header/elephant.png?v=1",
  crocodile: "/mascot/jungle-jokers/header/crocodile.png?v=1",
  tiger: "/mascot/jungle-jokers/header/tiger.png?v=1",
} as const;

/** Header branch interaction sizes — matches each PNG's natural aspect ratio. */
export const MASCOT_HEADER_SIZES = {
  /* Monkey: waist rests on branch, legs & tail dangle below */
  monkey: { width: 47, height: 64 },
  /* Elephant: seated on branch, both legs dangle below */
  elephant: { width: 49, height: 68 },
  /* Crocodile: body lies along the branch */
  crocodile: { width: 62, height: 34 },
  /* Tiger: round body perched on top of the branch */
  tiger: { width: 48, height: 46 },
} as const;

/** Fraction (0–1) down each mascot's image where it should visually contact the branch. */
export const MASCOT_HEADER_CONTACT = {
  /* Branch crosses near the hands/shoulders — body & tail hang well below (swinging) */
  monkey: 0.32,
  elephant: 0.65,
  crocodile: 0.72,
  tiger: 0.88,
} as const;

/** Slight tilt (deg) for a natural swinging/perching feel. */
export const MASCOT_HEADER_TILT = {
  monkey: -7,
  elephant: 0,
  crocodile: 0,
  tiger: 0,
} as const;

/** Trimmed PNGs — tight bounds for splash wordmark (mascots on letters). */
export const MASCOT_SPLASH_PATHS = {
  monkey: "/mascot/jungle-jokers/splash/monkey.png?v=2",
  elephant: "/mascot/jungle-jokers/splash/elephant.png?v=2",
  crocodile: "/mascot/jungle-jokers/splash/crocodile.png?v=2",
  tiger: "/mascot/jungle-jokers/splash/tiger.png?v=2",
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

/** Welcome/onboarding hero banners — all four mascots, varied moods. */
export const WELCOME_HERO_IMAGES = [
  {
    id: "park",
    path: "/mascot/welcome/welcome-01-park.jpg",
    style: "Sunny city park picnic",
    mood: "friendly",
  },
  {
    id: "classroom",
    path: "/mascot/welcome/welcome-02-classroom.jpg",
    style: "Bright school classroom",
    mood: "learn",
  },
  {
    id: "cozy-home",
    path: "/mascot/welcome/welcome-03-cozy-home.jpg",
    style: "Cozy evening living room",
    mood: "warm",
  },
  {
    id: "sunset-rooftop",
    path: "/mascot/welcome/welcome-04-sunset-rooftop.jpg",
    style: "Golden sunset rooftop",
    mood: "dreamy",
  },
  {
    id: "party",
    path: "/mascot/welcome/welcome-05-party.jpg",
    style: "Festive birthday party",
    mood: "celebrate",
  },
] as const;

export type WelcomeHeroId = (typeof WELCOME_HERO_IMAGES)[number]["id"];

export function getWelcomeHeroPath(id: WelcomeHeroId): string {
  return WELCOME_HERO_IMAGES.find((h) => h.id === id)?.path ?? WELCOME_HERO_IMAGES[0].path;
}

/** Pick a welcome hero by index or random (e.g. day-of-week rotation). */
export function getWelcomeHeroByIndex(index: number): (typeof WELCOME_HERO_IMAGES)[number] {
  const i = ((index % WELCOME_HERO_IMAGES.length) + WELCOME_HERO_IMAGES.length) % WELCOME_HERO_IMAGES.length;
  return WELCOME_HERO_IMAGES[i]!;
}
