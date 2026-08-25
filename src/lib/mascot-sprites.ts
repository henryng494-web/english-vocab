import type { MascotCharacter } from "@/lib/mascot-cast";

/** Approved cast lineup — `public/mascot/cast-lineup.png` (1536×1024). */
export const MASCOT_CAST_LINEUP_PATH = "/mascot/cast-lineup.png";
export const MASCOT_CAST_LINEUP_WIDTH = 1536;
export const MASCOT_CAST_LINEUP_HEIGHT = 1024;

export type MascotSpriteDef = {
  /** Crop origin inside the lineup sheet. */
  imgX: number;
  imgY: number;
  imgW: number;
  imgH: number;
  /** Distance from sprite bottom to character feet (for ground alignment). */
  footY: number;
};

/** Crop boxes tuned to `cast-v3-final-with-exact-cow.png`. */
export const MASCOT_SPRITES: Readonly<Record<MascotCharacter, MascotSpriteDef>> =
  {
    cat: { imgX: 24, imgY: 48, imgW: 310, imgH: 920, footY: 900 },
    cow: { imgX: 338, imgY: 8, imgW: 268, imgH: 992, footY: 980 },
    dog: { imgX: 632, imgY: 36, imgW: 350, imgH: 932, footY: 910 },
    pig: { imgX: 1000, imgY: 110, imgW: 500, imgH: 858, footY: 840 },
  };
