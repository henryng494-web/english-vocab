/** Jungle Jokers word prompts — rank 1–100. Shape locked via multi-ref PNGs. */
import {
  JUNGLE_CAST_DESIGN_ONLY,
  JUNGLE_CAST_CROCODILE_SHAPE_RULE,
  JUNGLE_CAST_ELEPHANT_ARM_RULE,
  JUNGLE_CAST_EXPRESSION_SAMPLES,
  JUNGLE_CAST_MONKEY_POSE_RULE,
  JUNGLE_CAST_TIGER_SHAPE_RULE,
  getJungleCastAccentDetail,
} from "@/data/jungle-cast-samples";
import {
  getJungleCastReferencePaths,
  JUNGLE_CAST_SHAPE_REMINDER,
  type JungleCastMember,
} from "@/data/jungle-cast-refs";

export type JungleWordImageEntry = {
  cast: readonly JungleCastMember[];
  scene: string;
  expressions: string;
  outfits?: string;
};

export const JUNGLE_WORD_IMAGE_ENTRIES: Readonly<
  Record<string, JungleWordImageEntry>
> = {
  "you": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY purple monkey and orange tiger on white — two small centered mascots (each max 50% frame height) acting out \"you\". Both entire bodies fully inside frame with wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "the": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on white — two small centered mascots (each max 50% frame height) acting out \"the\". Both entire bodies fully inside frame with wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "to": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"to\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "it": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"it\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "that": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"that\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "and": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on white — two small centered mascots (each max 50% frame height) acting out \"and\". Both entire bodies fully inside frame with wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame. Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "of": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"of\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "what": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"what\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "in": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"in\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "me": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"me\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "is": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"is\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "we": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered line holding paws, wide margins, every body fully inside frame. Crocodile horizontal log low.",
    "expressions": "All four: united team smiles. Tiger: sphere only. Crocodile: log body only."
  },
  "this": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"this\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "he": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"he\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "on": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY orange tiger on white — small centered tiger (max 55% frame height) sits ON TOP of simple brown table, fully inside frame with wide margins.",
    "expressions": "Tiger: comfortable perched ON table, relaxed smile, sphere body unchanged. Exactly two stub arms two stub legs."
  },
  "for": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"for\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "have": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on white — two small centered mascots (each max 50% frame height) acting out \"have\". Both entire bodies fully inside frame with wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "do": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"do\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "no": {
    "cast": [
      "monkey",
      "crocodile"
    ],
    "scene": "ONLY purple monkey and lime-green crocodile on white — small centered pair stepping back from candy jar on ground, wide margins.",
    "expressions": "Monkey: stern refusal, hands on hips, two arms only. Crocodile: firm no nod on log body."
  },
  "know": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"know\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "not": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on white — two small centered mascots (each max 50% frame height) acting out \"not\". Both entire bodies fully inside frame with wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "can": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY orange tiger on white — small centered tiger easily lifts teal dumbbell, entire body inside frame with generous margins.",
    "expressions": "Tiger: confident strong grin, flexing proudly. Sphere body, two stub arms two stub legs."
  },
  "all": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered around simple fruit bowl on table, wide margins, no clipping.",
    "expressions": "All four: excited at abundance. Tiger: merged sphere. Crocodile: horizontal log."
  },
  "with": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on white — small centered pair walking together, wide margins, both fully visible.",
    "expressions": "Elephant: happy walking, stick arms visible. Crocodile: horizontal LOG body low to ground, four stub legs."
  },
  "just": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"just\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "get": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"get\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "here": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"here\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "but": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on white — split contrast, both small and centered with wide margins. Elephant holds teal umbrella left; crocodile horizontal log right.",
    "expressions": "Elephant: conflicted hopeful face, BOTH thin stick arms visible. Crocodile: log body low, four stub legs, fully visible."
  },
  "there": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"there\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "so": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"so\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "they": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"they\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "right": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"right\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "like": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"like\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "out": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"out\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "go": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"go\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "she": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"she\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "up": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"up\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "about": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"about\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "if": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"if\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "at": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"at\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "now": {
    "cast": [
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY lime-green crocodile and orange tiger on white — two small centered mascots (each max 50% frame height) acting out \"now\". Both entire bodies fully inside frame with wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "come": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"come\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "one": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"one\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "how": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"how\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "well": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"well\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "want": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"want\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "think": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"think\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "good": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"good\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "see": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group looking through simple telescope on tripod, all bodies fully inside frame with wide margins.",
    "expressions": "All four: excited looking together. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible."
  },
  "let": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"let\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "why": {
    "cast": [
      "monkey",
      "crocodile"
    ],
    "scene": "ONLY purple monkey and lime-green crocodile on white — two small centered mascots (each max 50% frame height) acting out \"why\". Both entire bodies fully inside frame with wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible. Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "who": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on white — two small centered mascots (each max 50% frame height) acting out \"who\". Both entire bodies fully inside frame with wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame. Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "as": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY purple monkey on white — small centered monkey in chef hat stirring pot on stool, side profile, entire body inside frame.",
    "expressions": "Monkey: proud chef smile, sitting side profile, one hand stirring. Exactly two arms two legs."
  },
  "will": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on white — small centered pair marking calendar, wide margins, no clipping.",
    "expressions": "Monkey: confident planning smile, sitting side profile, two arms only. Elephant: marking calendar, two thin stick arms visible plus trunk."
  },
  "from": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"from\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "when": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"when\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "back": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"back\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "okay": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"okay\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "yes": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"yes\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "time": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"time\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "look": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"look\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "take": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"take\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "an": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"an\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "man": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"man\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "where": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"where\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "would": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"would\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "some": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"some\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "hey": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"hey\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "tell": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"tell\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "or": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"or\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "say": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"say\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "something": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"something\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "down": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered tiger points stub paw at downward arrow on ground, entire body inside frame with wide margins.",
    "expressions": "Tiger: teaching gesture looking down along arrow, orange sphere body unchanged."
  },
  "then": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"then\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "little": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"little\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "way": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"way\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "make": {
    "cast": [
      "crocodile",
      "elephant"
    ],
    "scene": "ONLY lime-green crocodile and pink elephant on white — two small centered mascots (each max 50% frame height) acting out \"make\". Both entire bodies fully inside frame with wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "too": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"too\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "never": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"never\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "by": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"by\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "over": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"over\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "more": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"more\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "mean": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"mean\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "very": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"very\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "off": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"off\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "sorry": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on white — two small centered mascots (each max 50% frame height) acting out \"sorry\". Both entire bodies fully inside frame with wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "give": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"give\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "thank": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"thank\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "love": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"love\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "people": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"people\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "please": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"please\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "sure": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"sure\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "any": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"any\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible, fully inside frame."
  },
  "only": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"only\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs, fully visible inside frame."
  },
  "because": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"because\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "two": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on white — small centered group (each max 40% frame height) acting out \"two\". All four entire bodies fully inside frame with generous margins, no clipping at edges.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "much": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"much\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs, fully inside frame."
  },
  "sir": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on white — small centered mascot (max 55% frame height, max 45% width) acting out meaning of \"sir\". Entire body fully inside frame with at least 12% margin on every side.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs, fully visible."
  },
  "maybe": {
    "cast": [
      "crocodile",
      "elephant"
    ],
    "scene": "ONLY lime-green crocodile and pink elephant on white — small centered pair at path fork, wide margins, entire bodies visible.",
    "expressions": "Crocodile: uncertain shrug on log body. Elephant: thinking, BOTH thin stick arms visible, giant circle head unchanged."
  },
  "help": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY orange tiger and lime-green crocodile on white — small centered pair, tiger helps crocodile carry grocery bags, wide margins.",
    "expressions": "Tiger: supportive helpful smile. Crocodile: relieved grateful face, horizontal log body, four stub legs fully visible."
  }
} as const;

export const JUNGLE_WORD_IMAGE_SCENES = Object.fromEntries(
  Object.entries(JUNGLE_WORD_IMAGE_ENTRIES).map(([w, e]) => [w, e.scene]),
);

export function buildJungleCastWordImagePrompt(word: string): string | null {
  const key = word.trim().toLowerCase();
  const approved =
    JUNGLE_CAST_EXPRESSION_SAMPLES[
      key as keyof typeof JUNGLE_CAST_EXPRESSION_SAMPLES
    ];
  const entry = approved ?? JUNGLE_WORD_IMAGE_ENTRIES[key];
  if (!entry) return null;

  const cast = approved?.cast ?? entry.cast;
  const castNote = `Characters (${cast.length}): ${cast.join(", ")}.`;
  const outfitNote = entry.outfits ? ` OUTFITS: ${entry.outfits}` : "";
  const monkeyNote = cast.includes("monkey")
    ? ` ${JUNGLE_CAST_MONKEY_POSE_RULE}`
    : "";
  const elephantNote = cast.includes("elephant")
    ? ` ${JUNGLE_CAST_ELEPHANT_ARM_RULE}`
    : "";
  const tigerNote = cast.includes("tiger")
    ? ` ${JUNGLE_CAST_TIGER_SHAPE_RULE}`
    : "";
  const crocodileNote = cast.includes("crocodile")
    ? ` ${JUNGLE_CAST_CROCODILE_SHAPE_RULE}`
    : "";

  const accentNote = ` Accent: ${getJungleCastAccentDetail(key)}. Ignore room/location names — white canvas only.`;

  return `${JUNGLE_CAST_DESIGN_ONLY} ${castNote} ${JUNGLE_CAST_SHAPE_REMINDER}${monkeyNote}${elephantNote}${tigerNote}${crocodileNote} Word "${key}": ${entry.scene} EXPRESSIONS: ${entry.expressions}.${outfitNote}${accentNote}`;
}

export function getJungleCastWordReferences(word: string): string[] | null {
  const key = word.trim().toLowerCase();
  const approved =
    JUNGLE_CAST_EXPRESSION_SAMPLES[
      key as keyof typeof JUNGLE_CAST_EXPRESSION_SAMPLES
    ];
  const cast = approved?.cast ?? JUNGLE_WORD_IMAGE_ENTRIES[key]?.cast;
  if (!cast) return null;
  return getJungleCastReferencePaths(cast);
}
