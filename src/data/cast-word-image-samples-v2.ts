/**
 * Expression-flexible sample prompts (v2) — character DESIGN fixed,
 * but faces/emotions change to match each word. For preview before bulk regen.
 */

export const CAST_DESIGN_ONLY =
  "Flat 2D children's-book illustration, wide 16:9 landscape. Keep exact character DESIGNS only: (1) gray tabby cat, teal collar, gold bell; (2) tall tubular light-blue cow, one dark-blue head patch, cream horns, navy hooves; (3) golden-yellow dog, blue collar; (4) round fat pink pig. Same body shapes and colors every time. IMPORTANT: Do NOT copy default expressions — adapt eyes, mouth, eyebrows, and body language to the word meaning. Full rich environment. NO text, NO letters, NO watermark.";

/** Five preview words with explicit per-character expression direction. */
export const CAST_EXPRESSION_SAMPLES: Readonly<
  Record<
    string,
    {
      label: string;
      scene: string;
      expressions: string;
    }
  >
> = {
  sorry: {
    label: "Xin lỗi — buồn / hối hận",
    scene:
      "Gray cat offering a small flower bouquet with both paws to golden dog who sits with drooped ears on a park bench after a broken vase on the ground.",
    expressions:
      "Cat: guilty apologetic face — downturned mouth, ears back, teary eyes (NOT bored lazy). Dog: sad disappointed but forgiving — soft eyes, small frown (NOT shocked O-mouth). Pig in background: concerned sympathetic look. Cow: gentle worried tilt of head (mouth closed, NO silly tongue).",
  },
  yes: {
    label: "Đồng ý — vui / phấn khích",
    scene:
      "All four mascots at a picnic celebrating — green checkmark flag planted in cake, confetti in air, sunny meadow.",
    expressions:
      "Cat: big happy squint-smile, paws up cheering (NOT half-lidded bored). Dog: joyful open smile with normal round eyes (NOT frozen shocked O). Cow: delighted grin, one eye wink, horns bouncing (NO tongue out unless laughing). Pig: laughing with closed happy crescents for eyes (NOT tired squeezed / sweat drop).",
  },
  no: {
    label: "Từ chối — kiên quyết",
    scene:
      "Gray cat and golden dog firmly refuse a giant tempting candy jar offered by a shadowy hand from off-screen — arms crossed, stepping back.",
    expressions:
      "Cat: stern firm NO — narrowed eyes, flat mouth, one paw in stop gesture (NOT lazy unamused default). Dog: serious head-shake, lips pressed, eyebrows angled down (NOT surprised). Cow: disapproving look with arms crossed. Pig: skeptical one eyebrow raised, arms folded.",
  },
  think: {
    label: "Suy nghĩ — tò mò",
    scene:
      "Gray cat at desk with puzzle pieces and a half-built teal block tower, one paw on chin, looking up at floating question-mark shapes (no letters, just curved hook shapes).",
    expressions:
      "Cat: curious thinking — one eyebrow up, eyes looking upward, paw on chin (thoughtful wonder, NOT default bored half-lidded). Dog: leaning in interested, curious wide eyes but calm mouth (NOT shocked gasp). Cow: pondering with finger on chin. Pig: scratching head confused-cute.",
  },
  love: {
    label: "Yêu thương — ấm áp",
    scene:
      "All four mascots forming a group hug in front of a sunset hill, small floating heart shapes (no text) in warm orange-pink sky.",
    expressions:
      "Cat: warm gentle closed-eye smile, leaning into hug (affectionate, NOT bored). Dog: happy soft smile, eyes closed content (NOT O-mouth shock). Cow: tender happy eyes, slight smile, leaning down to hug (NO silly tongue). Pig: blissful happy grin, rosy cheeks, eyes as happy arcs (NOT tired / sweat).",
  },
};

export function buildExpressionSamplePrompt(word: string): string | null {
  const sample = CAST_EXPRESSION_SAMPLES[word.trim().toLowerCase()];
  if (!sample) return null;
  return `${CAST_DESIGN_ONLY} Word "${word}": ${sample.scene} EXPRESSIONS: ${sample.expressions}`;
}
