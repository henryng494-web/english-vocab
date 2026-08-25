/**
 * Jungle Jokers cast (option 3) — locked design + 5 preview word prompts.
 * RULE: body shape/colors NEVER change — only expression + optional outfit/accessories.
 */

export const JUNGLE_CAST_NAME = "Jungle Jokers";

/** Immutable silhouette spec — must match jungle-jokers-lineup.png exactly. */
export const JUNGLE_CAST_SHAPE_LOCK =
  "CRITICAL — match reference lineup EXACTLY every time. Body proportions are LOCKED; NEVER slim down, fatten up, or resize any character. ONLY change: facial expression (eyes, mouth, eyebrows) and optional clothing/accessories (hat, scarf, backpack, apron). NEVER change species colors or silhouette.\n" +
  "(1) MONKEY: purple body #8B5CF6, lavender face/ears/palms #C4B5FD; tiny rectangular torso; arms ALWAYS extremely long thin tubes reaching the ground (never short arms); small curly tail.\n" +
  "(2) ELEPHANT: pink #F472B6; head ALWAYS one giant perfect circle (40% of character height); huge flat semicircle ears; body and legs ALWAYS pencil-thin stick lines (never chubby body, never thick legs, never round fat torso); trunk thin tube curving up with small heart tip.\n" +
  "(3) CROCODILE: lime green #84CC16; body ALWAYS one horizontal rectangle log (width 3x height); jagged dorsal scales; four stubby short legs (never long legs); one blunt white tooth.\n" +
  "(4) TIGER: orange ball #F97316; body ALWAYS one sphere (head+body merged chibi ball); bold dark zigzag stripes; cream muzzle patch; legs ALWAYS tiny stubs (never long legs); small striped tail.";

export const JUNGLE_CAST_DESIGN_ONLY =
  `Flat 2D humorous cartoon illustration, wide 16:9 landscape. NOT realistic. ${JUNGLE_CAST_SHAPE_LOCK} CAST SIZE: use 1–4 characters as scene needs — not all four every time. SETTING: everyday modern life (home, school, park, office, cafe, street) — NOT jungle. NO text, NO letters, NO watermark.`;

export type JungleCastSampleEntry = {
  label: string;
  cast: readonly string[];
  scene: string;
  expressions: string;
  /** Optional outfit tweaks — never body shape. */
  outfits?: string;
};

export const JUNGLE_CAST_EXPRESSION_SAMPLES: Readonly<
  Record<string, JungleCastSampleEntry>
> = {
  sorry: {
    label: "Xin lỗi — buồn / hối hận",
    cast: ["monkey", "elephant"],
    scene:
      "ONLY monkey and elephant — cozy home living room. Monkey offers flower bouquet to elephant on sofa after broken blue vase on carpet.",
    expressions:
      "Monkey: guilty teary eyes, ears back (NOT wink). Elephant: sad forgiving, trunk drooped — SAME giant circle head and stick-thin body as lineup.",
    outfits: "Monkey: none. Elephant: none.",
  },
  yes: {
    label: "Đồng ý — vui / phấn khích",
    cast: ["monkey", "elephant", "tiger", "crocodile"],
    scene:
      "All four at city park birthday picnic — checkmark flag in cake, confetti, playground behind.",
    expressions:
      "All cheering — happy faces only. Elephant MUST keep giant round head + pencil stick body (NOT fat). Tiger MUST stay spherical ball.",
    outfits: "Monkey: party cone hat. Elephant: blue birthday sash. Crocodile: none. Tiger: none.",
  },
  no: {
    label: "Từ chối — kiên quyết",
    cast: ["monkey", "tiger"],
    scene:
      "ONLY monkey and tiger — school gate sidewalk, refuse giant candy jar from off-screen hand.",
    expressions:
      "Monkey: stern stop gesture. Tiger: serious head-shake — tiger stays round ball shape.",
    outfits: "Monkey: school backpack. Tiger: student cap.",
  },
  think: {
    label: "Suy nghĩ — tò mò",
    cast: ["monkey"],
    scene:
      "ONLY monkey — bright classroom desk with puzzle and blocks, hand on chin, curved hook shapes floating.",
    expressions:
      "Monkey: curious thinking, one eyebrow up — arms still long reaching near floor.",
    outfits: "Monkey: reading glasses pushed on forehead.",
  },
  love: {
    label: "Yêu thương — ấm áp",
    cast: ["monkey", "elephant", "tiger"],
    scene:
      "Three only (no crocodile) — group hug on park bench at sunset, floating hearts.",
    expressions:
      "Warm closed-eye smiles. Elephant: stick-thin body + giant round head unchanged. Tiger: sphere unchanged.",
    outfits: "Monkey: red scarf. Elephant: none. Tiger: none.",
  },
};

export function buildJungleCastSamplePrompt(word: string): string | null {
  const sample = JUNGLE_CAST_EXPRESSION_SAMPLES[word.trim().toLowerCase()];
  if (!sample) return null;
  const castNote = `Characters (${sample.cast.length}): ${sample.cast.join(", ")}.`;
  const outfitNote = sample.outfits ? ` OUTFITS: ${sample.outfits}` : "";
  return `${JUNGLE_CAST_DESIGN_ONLY} ${castNote} Word "${word}": ${sample.scene} EXPRESSIONS: ${sample.expressions}.${outfitNote} Match reference lineup body shapes exactly.`;
}
