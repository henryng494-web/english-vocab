/**
 * Jungle Jokers cast (option 3) — locked design + 5 preview word prompts.
 * Style: flat 2D silly exaggerated animals, NOT realistic.
 * Settings: everyday life (school, work, park, home) — NOT jungle backgrounds.
 * Cast size: use 1–4 characters per scene as the word needs — NOT all four every time.
 */

export const JUNGLE_CAST_NAME = "Jungle Jokers";

export const JUNGLE_CAST_DESIGN_ONLY =
  "Flat 2D humorous cartoon illustration, wide 16:9 landscape. Keep exact character DESIGNS only — silly exaggerated shapes, NOT realistic: (1) purple monkey with lavender face/ears/hands, extremely long arms reaching the ground, tiny torso, curly tail; (2) pink elephant with giant round head, huge semicircle ears, pencil-thin stick body and legs, trunk curled upward; (3) lime-green crocodile with horizontal rectangle log body, jagged back scales, stubby legs, one blunt tooth; (4) orange tiger cub with spherical chibi ball body, bold dark zigzag stripes, cream muzzle, tiny stubby legs. Same colors and body shapes every time. CAST SIZE: include only the characters the scene needs — one, two, three, or all four. Do NOT force all four into every image. IMPORTANT: Do NOT lock one default face — change eyes, mouth, eyebrows, and body language to match each word. SETTING: everyday modern life — classroom, office, city park, home living room, cafe, playground, bus stop, supermarket — NOT jungle NOT rainforest NOT wilderness. NO text, NO letters, NO watermark.";

export type JungleCastSampleEntry = {
  label: string;
  /** Which cast members appear (1–4). */
  cast: readonly string[];
  scene: string;
  expressions: string;
};

/** Five preview words before bulk regen. */
export const JUNGLE_CAST_EXPRESSION_SAMPLES: Readonly<
  Record<string, JungleCastSampleEntry>
> = {
  sorry: {
    label: "Xin lỗi — buồn / hối hận",
    cast: ["monkey", "elephant"],
    scene:
      "ONLY two characters in frame — in a cozy home living room: purple monkey offering a small flower bouquet to pink elephant sitting with drooped ears on a sofa after a broken blue vase on the carpet. Empty room details, no other mascots.",
    expressions:
      "Monkey: guilty apologetic face — downturned mouth, ears back, teary eyes (NOT mischievous wink). Elephant: sad disappointed but forgiving — soft eyes, small frown, trunk drooped (NOT cheerful default).",
  },
  yes: {
    label: "Đồng ý — vui / phấn khích",
    cast: ["monkey", "elephant", "tiger", "crocodile"],
    scene:
      "All four mascots at a sunny city park picnic celebrating a birthday — green checkmark flag planted in a cake on a checkered blanket, confetti in air, playground in background.",
    expressions:
      "Monkey: big happy squint-smile, long arms up cheering (NOT sly wink). Elephant: joyful open smile, trunk raised happily. Crocodile: delighted toothy grin. Tiger: laughing with closed happy crescents for eyes.",
  },
  no: {
    label: "Từ chối — kiên quyết",
    cast: ["monkey", "tiger"],
    scene:
      "ONLY two characters — outside a colorful school gate: purple monkey and orange tiger firmly refuse a giant tempting candy jar offered by a shadowy hand from off-screen, arms crossed on sidewalk. No elephant or crocodile in scene.",
    expressions:
      "Monkey: stern firm NO — narrowed eyes, flat mouth, one long arm in stop gesture (NOT playful wink). Tiger: serious head-shake, lips pressed (NOT goofy tongue-out).",
  },
  think: {
    label: "Suy nghĩ — tò mò",
    cast: ["monkey"],
    scene:
      "ONLY one character — in a bright classroom: purple monkey alone at a student desk with puzzle pieces and colorful block tower, one hand on chin, looking up at floating curved hook shapes (no letters). Chalkboard and backpacks in background. No other mascots visible.",
    expressions:
      "Monkey: curious thinking — one eyebrow up, eyes looking upward, hand on chin (thoughtful wonder, NOT mischievous grin).",
  },
  love: {
    label: "Yêu thương — ấm áp",
    cast: ["monkey", "elephant", "tiger"],
    scene:
      "Three characters only — purple monkey, pink elephant, and orange tiger forming a warm group hug on a park bench at golden sunset. Lime-green crocodile NOT in frame. Small floating heart shapes in sky, city soft in distance.",
    expressions:
      "Monkey: warm gentle closed-eye smile, long arms wrapping hug (affectionate, NOT sly). Elephant: tender happy eyes, trunk around friends. Tiger: blissful happy grin, rosy cheeks on round face.",
  },
};

export function buildJungleCastSamplePrompt(word: string): string | null {
  const sample = JUNGLE_CAST_EXPRESSION_SAMPLES[word.trim().toLowerCase()];
  if (!sample) return null;
  const castNote = `Characters in scene (${sample.cast.length}): ${sample.cast.join(", ")}.`;
  return `${JUNGLE_CAST_DESIGN_ONLY} ${castNote} Word "${word}": ${sample.scene} EXPRESSIONS: ${sample.expressions}`;
}
