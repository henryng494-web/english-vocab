/**
 * Jungle Jokers cast (option 3) — locked design + 5 preview word prompts.
 * Style: flat 2D silly exaggerated animals, NOT realistic.
 * Settings: everyday life (school, work, park, home) — NOT jungle backgrounds.
 */

export const JUNGLE_CAST_NAME = "Jungle Jokers";

export const JUNGLE_CAST_DESIGN_ONLY =
  "Flat 2D humorous cartoon illustration, wide 16:9 landscape. Keep exact character DESIGNS only — silly exaggerated shapes, NOT realistic: (1) purple monkey with lavender face/ears/hands, extremely long arms reaching the ground, tiny torso, curly tail; (2) pink elephant with giant round head, huge semicircle ears, pencil-thin stick body and legs, trunk curled upward; (3) lime-green crocodile with horizontal rectangle log body, jagged back scales, stubby legs, one blunt tooth; (4) orange tiger cub with spherical chibi ball body, bold dark zigzag stripes, cream muzzle, tiny stubby legs. Same colors and body shapes every time. IMPORTANT: Do NOT lock one default face — change eyes, mouth, eyebrows, and body language to match each word. SETTING: everyday modern life — classroom, office, city park, home living room, cafe, playground, bus stop, supermarket — NOT jungle NOT rainforest NOT wilderness. NO text, NO letters, NO watermark.";

export type JungleCastSampleEntry = {
  label: string;
  scene: string;
  expressions: string;
};

/** Five preview words before bulk regen. */
export const JUNGLE_CAST_EXPRESSION_SAMPLES: Readonly<
  Record<string, JungleCastSampleEntry>
> = {
  sorry: {
    label: "Xin lỗi — buồn / hối hận",
    scene:
      "In a cozy home living room: purple monkey offering a small flower bouquet with both long arms to pink elephant sitting with drooped ears on a sofa after a broken blue vase on the carpet.",
    expressions:
      "Monkey: guilty apologetic face — downturned mouth, ears back, teary eyes (NOT mischievous wink). Elephant: sad disappointed but forgiving — soft eyes, small frown, trunk drooped (NOT cheerful default). Tiger in background: concerned look. Crocodile: gentle worried head tilt, mouth closed.",
  },
  yes: {
    label: "Đồng ý — vui / phấn khích",
    scene:
      "All four mascots at a sunny city park picnic celebrating a birthday — green checkmark flag planted in a cake on a checkered blanket, confetti in air, playground and trees in background.",
    expressions:
      "Monkey: big happy squint-smile, long arms up cheering (NOT sly wink). Elephant: joyful open smile, trunk raised happily (NOT tiny default eyes only). Crocodile: delighted toothy grin. Tiger: laughing with closed happy crescents for eyes, bouncy ball body.",
  },
  no: {
    label: "Từ chối — kiên quyết",
    scene:
      "Outside a colorful school gate: purple monkey and orange tiger firmly refuse a giant tempting candy jar offered by a shadowy hand from off-screen — arms crossed, stepping back on sidewalk.",
    expressions:
      "Monkey: stern firm NO — narrowed eyes, flat mouth, one long arm in stop gesture (NOT playful wink). Tiger: serious head-shake, lips pressed (NOT goofy tongue-out). Elephant: disapproving look, thin legs planted. Crocodile: skeptical one eye raised, arms folded.",
  },
  think: {
    label: "Suy nghĩ — tò mò",
    scene:
      "In a bright classroom: purple monkey at a student desk with puzzle pieces and colorful block tower, one hand on chin, looking up at floating curved hook shapes (no letters). Chalkboard and backpacks in background.",
    expressions:
      "Monkey: curious thinking — one eyebrow up, eyes looking upward, hand on chin (thoughtful wonder, NOT mischievous grin). Elephant: leaning in interested, calm curious eyes. Crocodile: pondering with claw on chin. Tiger: scratching head confused-cute.",
  },
  love: {
    label: "Yêu thương — ấm áp",
    scene:
      "All four mascots forming a group hug on a park hill at golden sunset — city skyline soft in distance, small floating heart shapes (no text) in warm orange-pink sky, bench and lamp post nearby.",
    expressions:
      "Monkey: warm gentle closed-eye smile, long arms wrapping hug (affectionate, NOT sly). Elephant: tender happy eyes, trunk around friends (NOT default round stare). Crocodile: soft closed-eye smile. Tiger: blissful happy grin, rosy cheeks on round face.",
  },
};

export function buildJungleCastSamplePrompt(word: string): string | null {
  const sample = JUNGLE_CAST_EXPRESSION_SAMPLES[word.trim().toLowerCase()];
  if (!sample) return null;
  return `${JUNGLE_CAST_DESIGN_ONLY} Word "${word}": ${sample.scene} EXPRESSIONS: ${sample.expressions}`;
}
