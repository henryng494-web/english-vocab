/**
 * Jungle Jokers cast (option 3) — locked design + 5 preview word prompts.
 * RULE: body shape/colors NEVER change — only expression + optional outfit/accessories.
 */

import {
  getJungleCastReferencePaths,
  JUNGLE_CAST_SHAPE_REMINDER,
  type JungleCastMember,
} from "@/data/jungle-cast-refs";

export { getJungleCastReferencePaths, JUNGLE_CAST_CHARACTER_REFS } from "@/data/jungle-cast-refs";

export const JUNGLE_CAST_NAME = "Jungle Jokers";

/** Immutable silhouette spec — must match jungle-jokers-lineup.png exactly. */
export const JUNGLE_CAST_SHAPE_LOCK =
  "CRITICAL — copy EXACT silhouettes from attached per-character reference PNGs and lineup. Body proportions are LOCKED; NEVER slim down, fatten up, shorten arms, or resize heads. ONLY change: facial expression and optional clothing/accessories.\n" +
  "(1) MONKEY: purple body #8B5CF6, lavender face/ears/palms #C4B5FD; small round head; tiny body; normal-length arms (hands at waist/hip height — NOT dragging on floor, NOT used as extra legs); exactly TWO arms from shoulders + TWO legs from hips + one curly tail; front view preferred.\n" +
  "(2) ELEPHANT: pink #F472B6; head ALWAYS one giant perfect circle (40% of character height); huge flat semicircle ears; body and legs ALWAYS pencil-thin stick lines (never chubby body, never thick legs, never round fat torso); trunk thin tube curving up with small heart tip.\n" +
  "(3) CROCODILE: lime green #84CC16; body ALWAYS one horizontal rectangle log (width 3x height); jagged dorsal scales; four stubby short legs (never long legs); one blunt white tooth.\n" +
  "(4) TIGER: orange ball #F97316; body ALWAYS one sphere (head+body merged chibi ball); bold dark zigzag stripes; cream muzzle patch; legs ALWAYS tiny stubs (never long legs); small striped tail.";

export const JUNGLE_CAST_MONKEY_POSE_RULE =
  "MONKEY ANATOMY (critical): Purple monkey has EXACTLY two arms and two legs — never three or four arms. Draw monkey SITTING or in SIDE PROFILE (not front-standing). Use simple poses only: hands clasped together, hands on hips, or ONE hand gesturing with other arm hidden behind body. NEVER both arms raised high. NEVER front view with arms and legs all vertical. Do NOT use lineup monkey long-arm pose.";

export const JUNGLE_CAST_ANATOMY_RULES =
  "ANATOMY & PROPS: Monkey has EXACTLY two arms and two legs (four limbs total) — never three arms, never extra limbs. Elephant: four stick legs + trunk (trunk is NOT a third arm). Tiger: two stub arms two stub legs. Crocodile: four stub legs. ALL objects must be physically grounded or held — candy jars, puzzles, props resting on table/floor OR held by a visible hand/arm. NO floating objects in mid-air.";

export const JUNGLE_CAST_DESIGN_ONLY =
  `Flat 2D humorous cartoon illustration, wide 16:9 landscape. NOT realistic. ${JUNGLE_CAST_SHAPE_LOCK} ${JUNGLE_CAST_ANATOMY_RULES} CAST SIZE: use 1–4 characters as scene needs — not all four every time. SETTING: everyday modern life (home, school, park, office, cafe, street) — NOT jungle. NO text, NO letters, NO watermark.`;

export type JungleCastSampleEntry = {
  label: string;
  cast: readonly JungleCastMember[];
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
      "ONLY monkey and tiger on school sidewalk. Large candy jar sits ON the pavement between them (grounded, not floating, no disembodied hand). Both step back refusing.",
    expressions:
      "Monkey: stern refusal — both hands on hips (two arms only, front view). Tiger: both hands on hips, angry frown.",
    outfits: "Monkey: school backpack. Tiger: student cap.",
  },
  think: {
    label: "Suy nghĩ — tò mò",
    cast: ["monkey"],
    scene:
      "ONLY monkey in bright classroom. Monkey sits on chair at desk — puzzle flat on desk, blocks on desk. One hand touches chin thinking, other hand resting flat on desk. Curved hook shapes near head. All props on desk.",
    expressions:
      "Monkey: curious thinking, one eyebrow up. Exactly two arms visible: one on chin, one on desk.",
    outfits: "Monkey: reading glasses on forehead.",
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
  return `${JUNGLE_CAST_DESIGN_ONLY} ${castNote} ${JUNGLE_CAST_SHAPE_REMINDER} Word "${word}": ${sample.scene} EXPRESSIONS: ${sample.expressions}.${outfitNote}`;
}

export function getJungleCastSampleReferences(
  word: string,
): string[] | null {
  const sample = JUNGLE_CAST_EXPRESSION_SAMPLES[word.trim().toLowerCase()];
  if (!sample) return null;
  return getJungleCastReferencePaths(sample.cast);
}
