import type { MascotCharacter } from "@/lib/mascot-cast";

/** Display size of each transparent sprite PNG in `public/mascot/cast/`. */
export const MASCOT_SPRITE_SIZES: Readonly<
  Record<MascotCharacter, { w: number; h: number }>
> = {
  cat: { w: 228, h: 442 },
  cow: { w: 255, h: 841 },
  dog: { w: 287, h: 564 },
  pig: { w: 426, h: 622 },
};
