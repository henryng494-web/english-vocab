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
    "scene": "ONLY monkey and tiger — Sunny park path — purple monkey SITS on wooden bench side profile, waving one hand toward viewer, other arm on bench. Orange tiger stands on path with welcoming paws open.",
    "expressions": "Monkey: warm friendly smile, sitting side profile, one hand waving only (exactly two arms). Tiger: cheerful welcoming grin, paws open toward viewer (NOT frozen shocked O-mouth)."
  },
  "the": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY monkey and elephant — Modern kitchen — purple monkey SITS on chair side profile, ONE arm pointing at ONE bright red apple on wooden table while other apples are faded gray. Pink elephant stands beside table.",
    "expressions": "Monkey: focused teaching expression, sitting side profile, one arm pointing only (other arm hidden behind body). Elephant: interested lean-in, stick body unchanged."
  },
  "to": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: eager excited trot beside cat, happy anticipation (NOT O-mouth shock)."
  },
  "it": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: impressed admiring eyes, small clap (NOT shocked)."
  },
  "that": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: looking where cat points, curious interested face (NOT frozen shock)."
  },
  "and": {
    "cast": [
      "tiger",
      "elephant"
    ],
    "scene": "ONLY tiger and elephant —",
    "expressions": "Tiger: delighted grateful grin eating together (NOT O-mouth). Cow and pig: cozy together on same bench, content smiles."
  },
  "of": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: gentle pleased smile, mouth closed."
  },
  "what": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Orange tiger staring at a closed mystery gift box with colorful ribbons, question-curve shapes floating nearby (no letters).",
    "expressions": "Tiger: curious puzzled wonder — head tilt, wide questioning eyes but calm mouth (NOT frozen O-shock)."
  },
  "in": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY crocodile —",
    "expressions": "Crocodile: giggling."
  },
  "me": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY monkey —",
    "expressions": "Monkey: warm acknowledging nod."
  },
  "is": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: impressed wide happy eyes."
  },
  "we": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — sunny park lawn holding paws/hands in a line. Crocodile horizontal log low between others. Tiger orange sphere. Elephant circle head + stick arms visible.",
    "expressions": "All four: united team smiles linked together. Tiger: sphere only. Crocodile: log body only, not standing upright."
  },
  "this": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY monkey — Purple monkey taps a green book on the desk right in front of it, ignoring books on a distant shelf.",
    "expressions": "Monkey: emphatic this-one gesture, focused eyes on nearby book (NOT lazy)."
  },
  "he": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: waving back cheerfully."
  },
  "on": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger — cozy living room. Tiger sits ON TOP of brown wooden round table (clearly on surface, not beside). Simple room, one table, pink rug.",
    "expressions": "Tiger: comfortable perched ON table, relaxed smile, sphere body unchanged. Exactly two stub arms two stub legs."
  },
  "for": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: touched aww expression."
  },
  "have": {
    "cast": [
      "elephant",
      "tiger"
    ],
    "scene": "ONLY elephant and tiger —",
    "expressions": "Tiger: amazed happy eyes at pile. Elephant: gentle laugh at pig's hoard."
  },
  "do": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: drying dishes helpfully, earnest helpful smile."
  },
  "no": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY monkey and tiger — ONLY monkey and tiger on school sidewalk. Large candy jar sits ON the pavement between them (grounded, not floating, no disembodied hand). Both step back refusing.",
    "expressions": "Monkey: stern refusal — both hands on hips (two arms only, front view). Tiger: both hands on hips, angry frown.",
    "outfits": "Monkey: school backpack. Tiger: student cap."
  },
  "know": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Purple monkey with a lightbulb glowing above its head, smiling confidently — I know!",
    "expressions": "Monkey: eureka confident grin, bright eyes, chest puffed (NOT bored half-lidded)."
  },
  "not": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY monkey and tiger — Purple monkey pushes away a slice of cake with a firm paw — not eating that.",
    "expressions": "Monkey: firm refusal face, pushing plate away, decisive eyes (NOT lazy). Tiger: supporting head-shake no."
  },
  "can": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger — bright gym room. Tiger easily lifts heavy teal dumbbell, flexing — I can!",
    "expressions": "Tiger: confident strong grin, flexing proudly. Sphere body, two stub arms two stub legs."
  },
  "all": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — round table full of colorful fruit. Tiger sphere leaning toward fruit. Crocodile log body at table height on four legs. Elephant stick arms visible.",
    "expressions": "All four: excited at abundance. Tiger: merged sphere ball. Crocodile: horizontal log shape."
  },
  "with": {
    "cast": [
      "tiger",
      "crocodile"
    ],
    "scene": "ONLY orange tiger and lime-green crocodile — rainy sidewalk. Tiger holds blue umbrella over both. Crocodile walks low as horizontal log beside tiger.",
    "expressions": "Tiger: orange SPHERE body unchanged, happy walking together. Crocodile: horizontal LOG body low to ground, four stub legs, NEVER upright."
  },
  "just": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: understanding nod at single cookie."
  },
  "get": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": ""
  },
  "here": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: looking down at exact spot, understanding nod."
  },
  "but": {
    "cast": [
      "elephant",
      "tiger"
    ],
    "scene": "ONLY pink elephant (rainy left) and orange tiger (sunny right) — split-scene contrast. Elephant holds teal umbrella in rain puddles; tiger enjoys sunshine on park bench.",
    "expressions": "Elephant: conflicted hopeful-yet-resigned rain face, BOTH thin stick arms visible holding umbrella + trunk, four stick legs. Tiger: happy sunny-side smile on bench."
  },
  "there": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Orange tiger pointing across a city park at a tiny house on the far hill — over there.",
    "expressions": "Tiger: pointing arm extended, eyes on distant house (NOT O-mouth shock)."
  },
  "so": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY crocodile — Lime-green crocodile eating a very spicy red pepper with steam from ears — so hot!",
    "expressions": "Crocodile: comedic spicy reaction — watering eyes, open panting mouth, steam puffs (NOT tired default — active spicy reaction)."
  },
  "they": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Three identical teal birds on a branch while all four mascots watch together — they.",
    "expressions": "All mascots: collective watching — pointing at the three birds together (Cat interested, Dog curious calm, Cow gentle smile, Pig excited pointing). Group observing THEY."
  },
  "right": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Orange tiger gives a big green checkmark card to",
    "expressions": "Tiger: approving proud grin presenting checkmark (NOT shocked)."
  },
  "like": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: warm smile watching."
  },
  "out": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": ""
  },
  "go": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Orange tiger mid-run on a path with motion lines, eager expression — go!",
    "expressions": "Tiger: energetic running grin, forward momentum (NOT frozen shocked O)."
  },
  "she": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: kind warm expression."
  },
  "up": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: jumping trying to reach."
  },
  "about": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: thoughtful nod at each icon."
  },
  "if": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY monkey — Purple monkey at a fork in the road with two paths, thinking hard — if this or that.",
    "expressions": "Monkey: weighing options, one eyebrow up, paw on chin (thoughtful NOT bored)."
  },
  "at": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Orange tiger sitting at a bus stop bench under a clock — at the stop.",
    "expressions": "Tiger: patient waiting sit, calm content eyes checking clock (NOT shocked O)."
  },
  "now": {
    "cast": [
      "tiger",
      "elephant"
    ],
    "scene": "ONLY tiger and elephant — All mascots looking at a wall clock whose hands point to current moment — now.",
    "expressions": "All four: urgent present-moment focus — eyes on clock, slight hurry or attention (Cat alert, Dog attentive calm, Cow serious gentle, Pig excited ready). NOW urgency."
  },
  "come": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Orange tiger beckoning with paw toward a cozy open door with warm light — come here.",
    "expressions": "Tiger: inviting beckoning wave, warm welcoming eyes (NOT shocked)."
  },
  "one": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: counting on paw confirming one."
  },
  "how": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY crocodile —",
    "expressions": "Crocodile: confused by instructions."
  },
  "well": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Lime-green crocodile drinking water and giving thumbs up, rosy cheeks — feeling well.",
    "expressions": "Crocodile: healthy refreshed grin, thumbs up, rosy cheeks (NOT tired sweat — vibrant wellness)."
  },
  "want": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Purple monkey reaching toward a shiny star cookie on a high shelf — want it.",
    "expressions": "Monkey: longing reaching eyes, eager open mouth wanting (NOT bored lazy)."
  },
  "think": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — puzzle flat on desk surface, blocks on desk. One hand touches chin, OTHER arm hangs down long to floor. Curved hook shapes near head. All props on desk, nothing floating.",
    "expressions": "Monkey: curious thinking, one eyebrow up. Exactly two arms: one on chin, one hanging down.",
    "outfits": "Monkey: reading glasses on forehead."
  },
  "good": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Orange tiger presenting a gold star sticker to",
    "expressions": "Tiger: proud praising smile giving star (NOT shocked)."
  },
  "see": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY orange tiger — grassy cliff overlooking blue ocean. Tiger looks through telescope on tripod at sailboat.",
    "expressions": "Tiger: excited wink pointing at ocean, sphere body, two stub arms on telescope."
  },
  "let": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY monkey — Purple monkey holding a gate open for",
    "expressions": "Monkey: generous permitting gesture, kind smile holding gate (NOT lazy)."
  },
  "why": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY monkey and tiger — Living room with scattered puzzle pieces on floor. Orange tiger shrugging confused. Purple monkey SITS on sofa cushion side profile, hands on hips — puzzled head tilt.",
    "expressions": "Tiger: baffled shrug, raised eyebrows, palms up (NOT O-mouth shock). Monkey: confused head tilt, sitting side profile, hands on hips (two arms only)."
  },
  "who": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY monkey and tiger — School stage with purple curtain — mascots guessing mystery. Purple monkey SITS on stage edge side profile, one hand on chin thinking, other arm hidden behind body.",
    "expressions": "All four: mystery guessing game — curious playful faces. Monkey: sitting side profile, one hand on chin only (exactly two arms total). Tiger: peeking from curtain."
  },
  "as": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey — modern kitchen, chef hat. Monkey sits on stool side profile stirring pot.",
    "expressions": "Monkey: proud chef smile, sitting side profile, one hand stirring. Exactly two arms two legs."
  },
  "will": {
    "cast": [
      "tiger",
      "elephant"
    ],
    "scene": "ONLY orange tiger and pink elephant — home living room. Tiger points at wall calendar future picnic date; elephant marks calendar with trunk. BOTH elephant stick arms visible at sides.",
    "expressions": "Tiger: confident future-planning smile pointing. Elephant: marking calendar, two thin stick arms visible plus trunk."
  },
  "from": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": ""
  },
  "when": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant — All mascots watching an hourglass with sand falling — when time comes.",
    "expressions": "All four: patient anticipation watching sand fall (Cat focused, Dog eager waiting, Cow calm, Pig impatient cute foot-tap). Waiting for WHEN."
  },
  "back": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": ""
  },
  "okay": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Orange tiger and",
    "expressions": "Tiger: relaxed OK sign, easygoing grin (NOT shocked). Cow and pig: thumbs up / OK hooves, all agreed."
  },
  "yes": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — All four at city park birthday picnic — checkmark flag in cake, confetti, playground behind.",
    "expressions": "All cheering — happy faces only. Elephant MUST keep giant round head + pencil stick body (NOT fat). Tiger MUST stay spherical ball.",
    "outfits": "Monkey: party cone hat. Elephant: blue birthday sash. Crocodile: none. Tiger: none."
  },
  "time": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: calm punctual nod."
  },
  "look": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Orange tiger with binoculars staring at a colorful bird in a tree — look!",
    "expressions": "Tiger: excited discovery pointing with binoculars (NOT O-mouth shock — eager look)."
  },
  "take": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY monkey — Purple monkey taking the last cookie from a plate carefully — take one.",
    "expressions": "Monkey: careful gentle taking, respectful eyes on last cookie (NOT greedy bored)."
  },
  "an": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Orange tiger presenting a single orange to",
    "expressions": "Tiger: offering one orange warmly (NOT shocked)."
  },
  "man": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: courteous bow."
  },
  "where": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: rotating map helpfully."
  },
  "would": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: imagining same dream happily."
  },
  "some": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots —",
    "expressions": "Elephant: indicating SOME remaining on bush."
  },
  "hey": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Orange tiger waving both paws loudly from behind a fence — hey!",
    "expressions": "Tiger: loud friendly HEY wave, big open smile calling attention (NOT scared shock)."
  },
  "tell": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY monkey — Purple monkey whispering a secret into",
    "expressions": "Monkey: conspiratorial whisper, hand cupped at mouth, sly smile (NOT bored)."
  },
  "or": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: pointing at both options helpfully."
  },
  "say": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY monkey —",
    "expressions": "Monkey: listening attentively nodding."
  },
  "something": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Mystery object under a teal cloth on a table — something hidden.",
    "expressions": "Tiger: excited reaching for cloth (NOT horror shock)."
  },
  "down": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on white — tiger points one stub paw toward a large downward arrow on the ground. NO other mascots.",
    "expressions": "Tiger: teaching gesture looking down along arrow, orange sphere body unchanged."
  },
  "then": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: pointing from plate to door teaching sequence."
  },
  "little": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY crocodile —",
    "expressions": "Crocodile: small cute proud standing on stool, happy little smile (NOT tired)."
  },
  "way": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Orange tiger at start of a winding path leading to a small white house — the way home.",
    "expressions": "Tiger: hopeful path-finding expression, pointing down road (NOT shocked)."
  },
  "make": {
    "cast": [
      "tiger",
      "elephant"
    ],
    "scene": "ONLY tiger and elephant —",
    "expressions": "Tiger: cracking eggs helpfully. Elephant: stirring gently."
  },
  "too": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — White mug overflowing with hot cocoa down the sides — too full.",
    "expressions": "Tiger: grabbing napkins alarmed."
  },
  "never": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots —",
    "expressions": "Tiger: supporting stern head-shake."
  },
  "by": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY crocodile —",
    "expressions": "Crocodile: signing painting proudly."
  },
  "over": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger — Orange tiger jumping over a low teal hurdle on a track — over.",
    "expressions": "Tiger: athletic mid-jump determined grin (NOT shocked O — athletic focus)."
  },
  "more": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots —",
    "expressions": "Tiger: excited at growing pile."
  },
  "mean": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: sad disapproving look."
  },
  "very": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: measuring tower height."
  },
  "off": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": ""
  },
  "sorry": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY monkey and elephant — cozy home living room. Monkey offers flower bouquet to elephant on sofa after broken blue vase on carpet.",
    "expressions": "Monkey: guilty teary eyes, ears back (NOT wink). Elephant: sad forgiving, trunk drooped — SAME giant circle head and stick-thin body as lineup.",
    "outfits": "Monkey: none. Elephant: none."
  },
  "give": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots —",
    "expressions": "Monkey: surprised-touched receiving, happy eyes (NOT bored)."
  },
  "thank": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots —",
    "expressions": "Elephant: touched hand on heart."
  },
  "love": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Three only (no crocodile) — group hug on park bench at sunset, floating hearts.",
    "expressions": "Warm closed-eye smiles. Elephant: stick-thin body + giant round head unchanged. Tiger: sphere unchanged.",
    "outfits": "Monkey: red scarf. Elephant: none. Tiger: none."
  },
  "people": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Four diverse stick-figure people silhouettes chatting in a park while mascots picnic nearby.",
    "expressions": "Mascots: friendly observing PEOPLE — warm curious smiles watching humans (Cat interested, Dog happy calm, Cow gentle wave to people, Pig excited pointing). Not interacting as main focus."
  },
  "please": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots —",
    "expressions": "Elephant: kindly reaching to help."
  },
  "sure": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Orange tiger nodding confidently with a thumbs up — sure!",
    "expressions": "Tiger: confident sure nod, relaxed thumbs up grin (NOT shocked O)."
  },
  "any": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: opening one door experimentally."
  },
  "only": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY tiger —",
    "expressions": "Tiger: negotiating trade."
  },
  "because": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots — Orange tiger pointing at dark clouds as reason for carrying umbrella — because of rain.",
    "expressions": "Tiger: explaining BECAUSE gesture at clouds, teaching face (NOT shocked). Elephant: logical connecting dots gesture."
  },
  "two": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots —",
    "expressions": "Tiger: confirming count nodding. Elephant: holding up two hooves."
  },
  "much": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: concerned gentle rescue."
  },
  "sir": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY elephant —",
    "expressions": "Elephant: curtsy-like polite nod."
  },
  "maybe": {
    "cast": [
      "tiger",
      "elephant"
    ],
    "scene": "ONLY orange tiger and pink elephant — park fork in path. Tiger balances on fence post shrugging unsure; elephant holds clipboard listing pros.",
    "expressions": "Tiger: uncertain maybe shrug. Elephant: thinking, BOTH thin stick arms visible (one holds clipboard, one on chin), giant circle head unchanged."
  },
  "help": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY orange tiger and lime-green crocodile — suburban steps. Tiger helps tired crocodile carry heavy grocery bags upstairs.",
    "expressions": "Tiger: supportive helpful smile carrying bags. Crocodile: relieved grateful face, four stub legs."
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
