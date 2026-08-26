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
  "(2) ELEPHANT: pink #F472B6; head ALWAYS one giant perfect circle (40% of character height); huge flat semicircle ears; body and legs ALWAYS pencil-thin stick lines (never chubby body, never thick legs, never round fat torso); trunk thin tube curving up with small heart tip; ALWAYS two thin stick ARMS with small three-finger hands visible at sides or holding objects — NEVER armless, NEVER trunk-only.\n" +
  "(3) CROCODILE: lime green #84CC16; body ALWAYS one horizontal rectangle log (width 3x height); jagged dorsal scales; four stubby short legs (never long legs); one blunt white tooth.\n" +
  "(4) TIGER: orange ball #F97316; body ALWAYS one sphere (head+body merged chibi ball); bold dark zigzag stripes; cream muzzle patch; legs ALWAYS tiny stubs (never long legs); small striped tail.";

export const JUNGLE_CAST_TIGER_SHAPE_RULE =
  "TIGER SHAPE (critical): Copy reference exactly — ONE orange sphere #F97316 (head+body merged ball). Cream muzzle patch on front of sphere. Dark zigzag stripes. Tiny stub arms + tiny stub legs only. NEVER separate round head on oval body. NEVER humanoid tiger. NEVER long legs.";

export const JUNGLE_CAST_CROCODILE_SHAPE_RULE =
  "CROCODILE SHAPE (critical): Copy reference exactly — ONE horizontal lime-green LOG rectangle #84CC16 (width 3× height), low to ground. Eyes on top of log. Four short stub legs pointing down. Side view crawling/walking. NEVER upright standing like human. NEVER vertical body. NEVER thick rounded torso.";

export const JUNGLE_CAST_ELEPHANT_ARM_RULE =
  "ELEPHANT ANATOMY (critical): Pink elephant ALWAYS has TWO thin stick arms with small three-finger hands visible — at sides, on hips, or holding props. Trunk is separate from arms. NEVER draw elephant without arms.";

export const JUNGLE_CAST_CAST_SIZE_RULE =
  "CAST SIZE (critical): Use ONLY the characters listed — do NOT add extra mascots. Default 1–2 characters per scene. Use 3–4 ONLY for group words (we/all/yes/people). Solo scenes must rotate evenly across monkey, elephant, crocodile, and tiger — do NOT default to tiger.";

/** Keep mascots inside frame — prevents clipping at edges. */
export const JUNGLE_CAST_FRAMING_RULE =
  "FRAMING (critical): Characters occupy at most 55% of frame height and 45% of frame width. Center the cast with generous white margin on all sides (at least 12% padding top/bottom/left/right). ENTIRE body of every mascot must be fully visible — no cropping, no cut-off limbs, heads, tails, or ears at frame edges. Props stay small beside characters, never push mascots to overflow the canvas.";

export const JUNGLE_CAST_MONKEY_POSE_RULE =
  "MONKEY ANATOMY (critical): Purple monkey has EXACTLY two arms and two legs — never three or four arms. Draw monkey SITTING or in SIDE PROFILE (not front-standing). Use simple poses only: hands clasped together, hands on hips, or ONE hand gesturing with other arm hidden behind body. NEVER both arms raised high. NEVER front view with arms and legs all vertical. Do NOT use lineup monkey long-arm pose.";

export const JUNGLE_CAST_ANATOMY_RULES =
  "ANATOMY & PROPS: Monkey has EXACTLY two arms and two legs (four limbs total) — never three arms, never extra limbs. Elephant: TWO thin stick arms with hands + four stick legs + trunk (trunk is NOT an arm). Tiger: two stub arms two stub legs. Crocodile: four stub legs. ALL objects must be physically grounded or held — candy jars, puzzles, props resting on table/floor OR held by a visible hand/arm. NO floating objects in mid-air.";

/** Minimal white canvas — mascots + word props only; tiny accent doodles optional. */
export const JUNGLE_CAST_BACKGROUND_RULE =
  "BACKGROUND (critical): Clean plain white #FFFFFF canvas. Mascots and word-meaning props are the ONLY focus. Add at most 1–2 tiny flat accent doodles for flavor (e.g. small grass tuft, simple swing silhouette, single flower, tiny cloud, small star) — keep accents small and sparse. NO full rooms, NO walls, NO floors with texture, NO detailed landscapes, NO busy environments, NOT jungle, NO gradients.";

/** Rotate sparse accent hints so images are not identical. */
export const JUNGLE_CAST_ACCENT_DETAILS = [
  "small grass tuft in bottom corner",
  "simple swing silhouette far behind",
  "single small flower near edge",
  "tiny flat cloud shape",
  "small star doodle",
  "simple bench outline far back",
  "tiny butterfly silhouette",
  "small potted plant outline",
] as const;

export function getJungleCastAccentDetail(word: string): string {
  const key = word.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i) * (i + 1)) % 997;
  return JUNGLE_CAST_ACCENT_DETAILS[hash % JUNGLE_CAST_ACCENT_DETAILS.length]!;
}

export const JUNGLE_CAST_DESIGN_ONLY =
  `Flat 2D humorous cartoon illustration, wide 16:9 landscape. NOT realistic. ${JUNGLE_CAST_SHAPE_LOCK} ${JUNGLE_CAST_ANATOMY_RULES} ${JUNGLE_CAST_CAST_SIZE_RULE} ${JUNGLE_CAST_FRAMING_RULE} ${JUNGLE_CAST_BACKGROUND_RULE} NO text, NO letters, NO watermark.`;

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
      "ONLY monkey and elephant — white background. Monkey offers flower bouquet to elephant; broken blue vase on simple table. Accent: small grass tuft.",
    expressions:
      "Monkey: guilty teary eyes, ears back (NOT wink). Elephant: sad forgiving, trunk drooped — SAME giant circle head and stick-thin body as lineup.",
    outfits: "Monkey: none. Elephant: none.",
  },
  yes: {
    label: "Đồng ý — vui / phấn khích",
    cast: ["monkey", "elephant", "tiger", "crocodile"],
    scene:
      "All four on white — checkmark flag in simple birthday cake, tiny confetti dots. Accent: simple swing silhouette far back.",
    expressions:
      "All cheering — happy faces only. Elephant MUST keep giant round head + pencil stick body (NOT fat). Tiger MUST stay spherical ball.",
    outfits: "Monkey: party cone hat. Elephant: blue birthday sash. Crocodile: none. Tiger: none.",
  },
  no: {
    label: "Từ chối — kiên quyết",
    cast: ["monkey", "tiger"],
    scene:
      "ONLY monkey and tiger on white. Large candy jar grounded between them (not floating). Both step back refusing. Accent: tiny cloud.",
    expressions:
      "Monkey: stern refusal — both hands on hips (two arms only, front view). Tiger: both hands on hips, angry frown.",
    outfits: "Monkey: school backpack. Tiger: student cap.",
  },
  think: {
    label: "Suy nghĩ — tò mò",
    cast: ["monkey"],
    scene:
      "ONLY monkey on white. Simple desk with puzzle flat on surface, blocks on desk. One hand on chin, other on desk. Curved hook shapes near head. Accent: small star doodle.",
    expressions:
      "Monkey: curious thinking, one eyebrow up. Exactly two arms visible: one on chin, one on desk.",
    outfits: "Monkey: reading glasses on forehead.",
  },
  love: {
    label: "Yêu thương — ấm áp",
    cast: ["monkey", "elephant", "tiger"],
    scene:
      "Three only (no crocodile) on white — group hug, small floating hearts. Accent: single small flower.",
    expressions:
      "Warm closed-eye smiles. Elephant: stick-thin body + giant round head unchanged. Tiger: sphere unchanged.",
    outfits: "Monkey: red scarf. Elephant: none. Tiger: none.",
  },
};

export function buildJungleCastSamplePrompt(word: string): string | null {
  const sample = JUNGLE_CAST_EXPRESSION_SAMPLES[word.trim().toLowerCase()];
  if (!sample) return null;
  const key = word.trim().toLowerCase();
  const castNote = `Characters (${sample.cast.length}): ${sample.cast.join(", ")}.`;
  const outfitNote = sample.outfits ? ` OUTFITS: ${sample.outfits}` : "";
  const accentNote = ` Accent: ${getJungleCastAccentDetail(key)}. Ignore room/location names — white canvas only.`;
  return `${JUNGLE_CAST_DESIGN_ONLY} ${castNote} ${JUNGLE_CAST_SHAPE_REMINDER} Word "${word}": ${sample.scene} EXPRESSIONS: ${sample.expressions}.${outfitNote}${accentNote}`;
}

export function getJungleCastSampleReferences(
  word: string,
): string[] | null {
  const sample = JUNGLE_CAST_EXPRESSION_SAMPLES[word.trim().toLowerCase()];
  if (!sample) return null;
  return getJungleCastReferencePaths(sample.cast);
}
