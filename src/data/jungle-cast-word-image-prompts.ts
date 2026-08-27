/** Jungle Jokers word prompts — rank 1–1000, 3000–3500. Shape locked via multi-ref PNGs. */
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
    "scene": "ONLY purple monkey and orange tiger on plain white #FFFFFF — orange tiger and purple monkey face the viewer with welcoming paws outstretched in a sunny park path.. PROPS (grounded on white): sunny path, welcome mat, small flower pot. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"you\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: warm friendly smile, bright open eyes inviting the viewer . cheerful welcoming grin, paws open toward viewer . Cow and p — sitting side profile, exactly two arms two legs. Tiger: warm friendly smile, bright open eyes inviting the viewer . cheerful welcoming grin, paws open toward viewer . Cow and p — orange sphere body, two stub arms two stub legs."
  },
  "the": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — purple monkey points its paw at ONE bright red apple on a wooden table while other apples are faded gray — definite article.. PROPS (grounded on white): one bright red apple on wooden table, faded gray apples behind. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"the\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: focused teaching expression, one paw pointing precisely, confident eyes . attentive curious look following the cat's poi — sitting side profile, exactly two arms two legs. Elephant: focused teaching expression, one paw pointing precisely, confident eyes . attentive curious look following the cat's poi — BOTH thin stick arms visible, circle head unchanged."
  },
  "to": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey walks along a teal arrow path toward an open cottage door — movement to a destination.. PROPS (grounded on white): teal arrow path leading to open cottage door. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"to\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: determined forward-looking eyes, purposeful stride . eager excited trot beside cat, happy anticipation . gentle encourag — sitting side profile, exactly two arms two legs."
  },
  "it": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant sits proudly on a small brown wooden platform in a spotlight — the cat is 'it'.. PROPS: 2-3 simple objects that clearly teach the word meaning. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"it\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: proud spotlight pose, chest out, satisfied smile . impressed admiring eyes, small clap . applauding gently. star-struck  — BOTH thin stick arms visible, circle head unchanged."
  },
  "that": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile points far away at a red kite in the sky while ignoring a blue ball at its feet — distant 'that'.. PROPS: 2-3 simple objects that clearly teach the word meaning. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"that\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: arm stretched pointing far, eyes squinting at distance . looking where cat points, curious interested face . shading eye — horizontal log body low, four stub legs."
  },
  "and": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — pink elephant and lime-green crocodile share one plate of cookies together at a picnic table — connection 'and'.. PROPS (grounded on white): shared plate of cookies on picnic blanket. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"and\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: happy sharing smile, offering cookie . delighted grateful grin eating together . Cow and cozy together on same bench, co — BOTH thin stick arms visible, circle head unchanged. Crocodile: happy sharing smile, offering cookie . delighted grateful grin eating together . Cow and cozy together on same bench, co — horizontal log body low, four stub legs."
  },
  "of": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger proudly holds a glass jar full of cookies — a jar of treats.. PROPS: 2-3 simple objects that clearly teach the word meaning. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"of\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: proud possessive happy grin showing jar contents . admiring the jar, interested eyes. excited hopeful look at cookies. g — orange sphere body, two stub arms two stub legs."
  },
  "what": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey staring at a closed mystery gift box with colorful ribbons, question-curve shapes floating nearby (no letters).. PROPS (grounded on white): closed mystery gift box with ribbons, question-curve shapes. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"what\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: curious puzzled wonder — head tilt, wide questioning eyes but calm mouth . equally curious, one eyebrow raised. confused — sitting side profile, exactly two arms two legs."
  },
  "in": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant peeking out from inside a large orange cardboard box, only head and paws visible.. PROPS (grounded on white): large orange cardboard box, peeking out. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"in\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: playful peek-a-boo eyes, mischievous smile from inside box . surprised-delighted discovery face finding cat (happy surpr — BOTH thin stick arms visible, circle head unchanged."
  },
  "me": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile points both paws at its own chest with a shy smile — means 'me'.. PROPS: 2-3 simple objects that clearly teach the word meaning. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"me\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: shy self-pointing, soft blush, gentle smile . warm acknowledging nod. kind encouraging look. supportive thumbs-up. — horizontal log body low, four stub legs."
  },
  "is": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger strikes a proud pose on a small stage pedestal like a statue — something IS here.. PROPS: 2-3 simple objects that clearly teach the word meaning. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"is\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: dignified proud statue pose, calm confident eyes, mouth closed (NO silly tongue). presenting cow with open paw, proud cu — orange sphere body, two stub arms two stub legs."
  },
  "we": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — all four mascots stand together as a team on a green hill, arms linked — 'we' together.. PROPS (grounded on white): four mascots holding paws in line. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"we\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: All four: united team pride — warm smiles, linked arms, belonging (Cat NOT bored, Dog NOT O-mouth, Cow NO tongue, Pig NO — sitting side profile, exactly two arms two legs. Elephant: All four: united team pride — warm smiles, linked arms, belonging (Cat NOT bored, Dog NOT O-mouth, Cow NO tongue, Pig NO — BOTH thin stick arms visible, circle head unchanged. Crocodile: All four: united team pride — warm smiles, linked arms, belonging (Cat NOT bored, Dog NOT O-mouth, Cow NO tongue, Pig NO — horizontal log body low, four stub legs. Tiger: All four: united team pride — warm smiles, linked arms, belonging (Cat NOT bored, Dog NOT O-mouth, Cow NO tongue, Pig NO — orange sphere body, two stub arms two stub legs."
  },
  "this": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey taps a green book on the desk right in front of it, ignoring books on a distant shelf.. PROPS: 2-3 simple objects that clearly teach the word meaning. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"this\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: emphatic this-one gesture, focused eyes on nearby book . leaning in looking at same book, interested . nodding at near b — sitting side profile, exactly two arms two legs."
  },
  "he": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant watches a male stick-figure silhouette waving from a doorway — 'he'.. PROPS (grounded on white): male stick-figure silhouette waving in doorway. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"he\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: observant pointing toward silhouette, neutral friendly face . waving back cheerfully. gentle wave. curious peek. — BOTH thin stick arms visible, circle head unchanged."
  },
  "on": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile sitting on top of a brown wooden table, not beside it — clearly ON the surface.. PROPS (grounded on white): brown wooden table, mascot clearly ON top. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"on\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: comfortable perched ON table, relaxed satisfied smile . looking up pointing at cat ON table, teaching expression. confir — horizontal log body low, four stub legs."
  },
  "for": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger offers a red heart-shaped cookie to orange tiger — gift for you.. PROPS (grounded on white): heart-shaped cookie gift. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"for\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: generous giving smile, offering cookie warmly . touched grateful happy eyes receiving gift . touched aww expression. cla — orange sphere body, two stub arms two stub legs."
  },
  "have": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — pink elephant hugging a huge stack of colorful donuts — has many treats.. PROPS (grounded on white): stack of colorful donuts. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"have\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: delighted possessive hug, big happy grin . jealous-amused look. amazed happy eyes at pile. gentle laugh at pig's hoard. — sitting side profile, exactly two arms two legs. Elephant: delighted possessive hug, big happy grin . jealous-amused look. amazed happy eyes at pile. gentle laugh at pig's hoard. — BOTH thin stick arms visible, circle head unchanged."
  },
  "do": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey washing dishes at a sink with soap bubbles — doing a chore.. PROPS (grounded on white): sink with soap bubbles, washing dishes. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"do\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: focused diligent scrubbing, determined but not angry face . drying dishes helpfully, earnest helpful smile. stacking cle — sitting side profile, exactly two arms two legs."
  },
  "no": {
    "cast": [
      "monkey",
      "crocodile"
    ],
    "scene": "ONLY purple monkey and lime-green crocodile on plain white #FFFFFF — purple monkey and lime-green crocodile firmly refuse a giant tempting candy jar offered by a shadowy hand from off-screen — arms crossed, stepping back.. PROPS (grounded on white): giant candy jar, stop gesture, stepping back. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"no\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: stern firm NO — narrowed eyes, flat mouth, one paw in stop gesture . serious head-shake, lips pressed, eyebrows angled d — sitting side profile, exactly two arms two legs. Crocodile: stern firm NO — narrowed eyes, flat mouth, one paw in stop gesture . serious head-shake, lips pressed, eyebrows angled d — horizontal log body low, four stub legs."
  },
  "know": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot with a lightbulb glowing above its head, smiling confidently — I know!. PROPS (grounded on white): glowing lightbulb above head. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"know\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: eureka confident grin, bright eyes, chest puffed . impressed amazed smile . nodding wise approval. applauding the idea. — sitting side profile, exactly two arms two legs. Elephant: eureka confident grin, bright eyes, chest puffed . impressed amazed smile . nodding wise approval. applauding the idea. — BOTH thin stick arms visible, circle head unchanged. Crocodile: eureka confident grin, bright eyes, chest puffed . impressed amazed smile . nodding wise approval. applauding the idea. — horizontal log body low, four stub legs. Tiger: eureka confident grin, bright eyes, chest puffed . impressed amazed smile . nodding wise approval. applauding the idea. — orange sphere body, two stub arms two stub legs."
  },
  "not": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — purple monkey pushes away a slice of cake with a firm paw — not eating that.. PROPS (grounded on white): cake slice being pushed away on plate. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"not\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: firm refusal face, pushing plate away, decisive eyes . supporting head-shake no. arms crossed declining. turning away po — sitting side profile, exactly two arms two legs. Elephant: firm refusal face, pushing plate away, decisive eyes . supporting head-shake no. arms crossed declining. turning away po — BOTH thin stick arms visible, circle head unchanged."
  },
  "can": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant lifting a heavy teal dumbbell easily, flexing — I can!. PROPS (grounded on white): teal dumbbell, flex pose. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"can\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: confident strong grin, flexing proudly . impressed cheering. amazed proud smile. fan cheering with paws up. — BOTH thin stick arms visible, circle head unchanged."
  },
  "all": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — all four mascots gather around a table covered with every kind of fruit — all of them.. PROPS (grounded on white): table full of every fruit type. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"all\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: All four: excited abundance — happy eyes at full table (Cat alert not bored, Dog joyful not shocked, Cow delighted mouth — sitting side profile, exactly two arms two legs. Elephant: All four: excited abundance — happy eyes at full table (Cat alert not bored, Dog joyful not shocked, Cow delighted mouth — BOTH thin stick arms visible, circle head unchanged. Crocodile: All four: excited abundance — happy eyes at full table (Cat alert not bored, Dog joyful not shocked, Cow delighted mouth — horizontal log body low, four stub legs. Tiger: All four: excited abundance — happy eyes at full table (Cat alert not bored, Dog joyful not shocked, Cow delighted mouth — orange sphere body, two stub arms two stub legs."
  },
  "with": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot and mascot walking side by side sharing one umbrella in gentle rain — with each other.. PROPS (grounded on white): shared blue umbrella in gentle rain. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"with\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: cozy companion smile under shared umbrella . happy walking together, content side-glance . Cow and also paired under sec — sitting side profile, exactly two arms two legs. Elephant: cozy companion smile under shared umbrella . happy walking together, content side-glance . Cow and also paired under sec — BOTH thin stick arms visible, circle head unchanged. Crocodile: cozy companion smile under shared umbrella . happy walking together, content side-glance . Cow and also paired under sec — horizontal log body low, four stub legs. Tiger: cozy companion smile under shared umbrella . happy walking together, content side-glance . Cow and also paired under sec — orange sphere body, two stub arms two stub legs."
  },
  "just": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile holding up a single tiny cookie while a huge empty jar sits behind — just one.. PROPS (grounded on white): single tiny cookie vs huge empty jar. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"just\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: emphasizing ONE with raised single paw, slightly smug small smile . understanding nod at single cookie. surprised-at-sma — horizontal log body low, four stub legs."
  },
  "get": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger catching a falling star-shaped cookie mid-air — get it!. PROPS (grounded on white): star-shaped cookie falling mid-air, catching leap. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"get\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: athletic focused leap, determined happy eyes catching cookie . cheering excited. watching tensely then relieved smile. p — orange sphere body, two stub arms two stub legs."
  },
  "here": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey planting a small flag on the ground right at its feet — right here.. PROPS (grounded on white): small flag planted at feet, HERE spot marker. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"here\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: proud HERE gesture stomping paw on spot, confident smile . looking down at exact spot, understanding nod. pointing at gr — sitting side profile, exactly two arms two legs."
  },
  "but": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — pink elephant wants sunshine yet holds a teal umbrella in rain — contrast, but.. PROPS (grounded on white): sunshine on one side, rain umbrella on other. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"but\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: conflicted expression — half hopeful sun-side, half resigned rain-side . sympathetic confused tilt. gentle shrug. split  — BOTH thin stick arms visible, circle head unchanged. Crocodile: conflicted expression — half hopeful sun-side, half resigned rain-side . sympathetic confused tilt. gentle shrug. split  — horizontal log body low, four stub legs."
  },
  "there": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant pointing across a meadow at a tiny house on the far hill — over there.. PROPS (grounded on white): distant tiny house on hill, pointing arm. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"there\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: pointing arm extended, eyes on distant house . squinting far away. shading eyes looking there. tiptoeing to see farther. — BOTH thin stick arms visible, circle head unchanged."
  },
  "so": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile eating a very spicy red pepper with steam from ears — so hot!. PROPS (grounded on white): spicy red pepper, steam from ears. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"so\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: comedic spicy reaction — watering eyes, open panting mouth, steam puffs . wincing sympathetically. fanning pig. offering — horizontal log body low, four stub legs."
  },
  "they": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — Three identical teal birds on a branch while all four mascots watch together — they.. PROPS (grounded on white): three identical teal birds on branch. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"they\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: All mascots: collective watching — pointing at the three birds together (Cat interested, Dog curious calm, Cow gentle sm — sitting side profile, exactly two arms two legs. Elephant: All mascots: collective watching — pointing at the three birds together (Cat interested, Dog curious calm, Cow gentle sm — BOTH thin stick arms visible, circle head unchanged. Crocodile: All mascots: collective watching — pointing at the three birds together (Cat interested, Dog curious calm, Cow gentle sm — horizontal log body low, four stub legs. Tiger: All mascots: collective watching — pointing at the three birds together (Cat interested, Dog curious calm, Cow gentle sm — orange sphere body, two stub arms two stub legs."
  },
  "right": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger gives a big green checkmark card to orange tiger — correct, right answer.. PROPS (grounded on white): big green checkmark card. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"right\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: approving proud grin presenting checkmark . pleased relieved correct-answer smile . clapping approval. victory dance. — orange sphere body, two stub arms two stub legs."
  },
  "like": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey hugging a fish-shaped plush toy lovingly — I like this.. PROPS (grounded on white): fish-shaped plush toy hug. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"like\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: affectionate hugging plush, eyes closed happy smile . warm smile watching. gentle fond expression. heart-eyes admiring t — sitting side profile, exactly two arms two legs."
  },
  "out": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant stepping out through an open front door into bright sunshine — going out.. PROPS (grounded on white): open front door, sunshine rays. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"out\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: eager exit stride, excited eyes toward sunshine . holding door open helpfully, encouraging smile. waving goodbye from in — BOTH thin stick arms visible, circle head unchanged."
  },
  "go": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile mid-run on a path with motion lines, eager expression — go!. PROPS (grounded on white): motion lines on path, running pose. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"go\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: energetic running grin, forward momentum . running alongside determined. jogging gently. waddling fast with effort face. — horizontal log body low, four stub legs."
  },
  "she": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger offering flowers to a female stick-figure silhouette in a window — she.. PROPS (grounded on white): female stick-figure silhouette in window, flower bouquet. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"she\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: gentle respectful offering smile . supportive smile from behind. kind warm expression. shy happy clasped paws. — orange sphere body, two stub arms two stub legs."
  },
  "up": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey stretching neck even higher toward fluffy clouds — up above.. PROPS (grounded on white): upward arrow, fluffy cloud above. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"up\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: stretching upward curious wonder, eyes on clouds, mouth closed (NO tongue). pointing up amazed. jumping trying to reach. — sitting side profile, exactly two arms two legs."
  },
  "about": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant surrounded by floating icons: clock, heart, book, apple — talking about many things.. PROPS (grounded on white): floating icons: clock, heart, book, apple. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"about\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: animated explaining gesture, engaged storyteller face . listening fascinated. thoughtful nod at each icon. curious point — BOTH thin stick arms visible, circle head unchanged."
  },
  "if": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile at a fork in the road with two paths, thinking hard — if this or that.. PROPS (grounded on white): two teal arrow signs at path fork, dotted path lines. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"if\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: weighing options, one eyebrow up, paw on chin (thoughtful NOT bored). equally torn looking both ways. pondering. scratch — horizontal log body low, four stub legs."
  },
  "at": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger sitting at a bus stop bench under a clock — at the stop.. PROPS (grounded on white): bus stop bench, round clock on post, simple stop sign. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"at\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: patient waiting sit, calm content eyes checking clock . sitting AT bench too, relaxed. standing AT stop sign. reading sc — orange sphere body, two stub arms two stub legs."
  },
  "now": {
    "cast": [
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY lime-green crocodile and orange tiger on plain white #FFFFFF — lime-green crocodile and orange tiger looking at a wall clock whose hands point to current moment — now.. PROPS (grounded on white): large wall clock with hands at current time, calendar page. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"now\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: All four: urgent present-moment focus — eyes on clock, slight hurry or attention (Cat alert, Dog attentive calm, Cow ser — horizontal log body low, four stub legs. Tiger: All four: urgent present-moment focus — eyes on clock, slight hurry or attention (Cat alert, Dog attentive calm, Cow ser — orange sphere body, two stub arms two stub legs."
  },
  "come": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot beckoning with paw toward a cozy open door with warm light — come here.. PROPS (grounded on white): cozy open door with warm light, beckoning paw. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"come\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: inviting beckoning wave, warm welcoming eyes . also beckoning from doorway, friendly smile. holding door open kindly. pa — sitting side profile, exactly two arms two legs. Elephant: inviting beckoning wave, warm welcoming eyes . also beckoning from doorway, friendly smile. holding door open kindly. pa — BOTH thin stick arms visible, circle head unchanged. Crocodile: inviting beckoning wave, warm welcoming eyes . also beckoning from doorway, friendly smile. holding door open kindly. pa — horizontal log body low, four stub legs. Tiger: inviting beckoning wave, warm welcoming eyes . also beckoning from doorway, friendly smile. holding door open kindly. pa — orange sphere body, two stub arms two stub legs."
  },
  "one": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey holding up exactly one finger while other paw hides a pile — only one.. PROPS (grounded on white): one finger up, single item shown. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"one\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: precise ONE gesture, sly smile showing single item . counting on paw confirming one. holding up one hoof. trying to grab — sitting side profile, exactly two arms two legs."
  },
  "how": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant with tools and blueprint, scratching head — how to build.. PROPS (grounded on white): tools, blueprint, wrench. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"how\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: puzzled builder face, scratching head with wrench, curious frown . studying blueprint seriously. measuring with tape. co — BOTH thin stick arms visible, circle head unchanged."
  },
  "well": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot drinking water and giving thumbs up, rosy cheeks — feeling well.. PROPS (grounded on white): water glass, thumbs up, rosy cheeks. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"well\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: healthy refreshed grin, thumbs up, rosy cheeks . relieved happy for pig. cheerful check-up approval. gentle approving no — sitting side profile, exactly two arms two legs. Elephant: healthy refreshed grin, thumbs up, rosy cheeks . relieved happy for pig. cheerful check-up approval. gentle approving no — BOTH thin stick arms visible, circle head unchanged. Crocodile: healthy refreshed grin, thumbs up, rosy cheeks . relieved happy for pig. cheerful check-up approval. gentle approving no — horizontal log body low, four stub legs. Tiger: healthy refreshed grin, thumbs up, rosy cheeks . relieved happy for pig. cheerful check-up approval. gentle approving no — orange sphere body, two stub arms two stub legs."
  },
  "want": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot reaching toward a shiny star cookie on a high shelf — want it.. PROPS (grounded on white): shiny star cookie on high shelf, reaching. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"want\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: longing reaching eyes, eager open mouth wanting . also reaching helpfully. lifting cat up to shelf. drooling hopeful cut — sitting side profile, exactly two arms two legs. Elephant: longing reaching eyes, eager open mouth wanting . also reaching helpfully. lifting cat up to shelf. drooling hopeful cut — BOTH thin stick arms visible, circle head unchanged. Crocodile: longing reaching eyes, eager open mouth wanting . also reaching helpfully. lifting cat up to shelf. drooling hopeful cut — horizontal log body low, four stub legs. Tiger: longing reaching eyes, eager open mouth wanting . also reaching helpfully. lifting cat up to shelf. drooling hopeful cut — orange sphere body, two stub arms two stub legs."
  },
  "think": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot at desk with puzzle pieces and a half-built teal block tower, one paw on chin, looking up at floating question-mark shapes (no letters, just curved hook shapes).. PROPS (grounded on white): puzzle pieces, half-built block tower, question-hook shapes. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"think\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: curious thinking — one eyebrow up, eyes looking upward, paw on chin (thoughtful wonder, NOT default bored half-lidded).  — sitting side profile, exactly two arms two legs. Elephant: curious thinking — one eyebrow up, eyes looking upward, paw on chin (thoughtful wonder, NOT default bored half-lidded).  — BOTH thin stick arms visible, circle head unchanged. Crocodile: curious thinking — one eyebrow up, eyes looking upward, paw on chin (thoughtful wonder, NOT default bored half-lidded).  — horizontal log body low, four stub legs. Tiger: curious thinking — one eyebrow up, eyes looking upward, paw on chin (thoughtful wonder, NOT default bored half-lidded).  — orange sphere body, two stub arms two stub legs."
  },
  "good": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot presenting a gold star sticker to mascot — good job.. PROPS (grounded on white): gold star sticker being awarded. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"good\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: proud praising smile giving star . pleased proud receiving, happy eyes . applauding. cheering confetti toss. — sitting side profile, exactly two arms two legs. Elephant: proud praising smile giving star . pleased proud receiving, happy eyes . applauding. cheering confetti toss. — BOTH thin stick arms visible, circle head unchanged. Crocodile: proud praising smile giving star . pleased proud receiving, happy eyes . applauding. cheering confetti toss. — horizontal log body low, four stub legs. Tiger: proud praising smile giving star . pleased proud receiving, happy eyes . applauding. cheering confetti toss. — orange sphere body, two stub arms two stub legs."
  },
  "see": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot looking through a teal telescope at a sailboat on the sea — see far away.. PROPS (grounded on white): telescope on tripod, sailboat on horizon. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"see\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: focused peering through telescope, wonder-smile . pointing at horizon excited discovery . shading eyes looking. amazed a — sitting side profile, exactly two arms two legs. Elephant: focused peering through telescope, wonder-smile . pointing at horizon excited discovery . shading eyes looking. amazed a — BOTH thin stick arms visible, circle head unchanged. Crocodile: focused peering through telescope, wonder-smile . pointing at horizon excited discovery . shading eyes looking. amazed a — horizontal log body low, four stub legs. Tiger: focused peering through telescope, wonder-smile . pointing at horizon excited discovery . shading eyes looking. amazed a — orange sphere body, two stub arms two stub legs."
  },
  "let": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile holding a gate open for lime-green crocodile to pass — let through.. PROPS (grounded on white): open gate, passing through. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"let\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: generous permitting gesture, kind smile holding gate . grateful passing through, thankful eyes. waiting turn patiently.  — horizontal log body low, four stub legs."
  },
  "why": {
    "cast": [
      "monkey",
      "crocodile"
    ],
    "scene": "ONLY purple monkey and lime-green crocodile on plain white #FFFFFF — lime-green crocodile shrugging with confused expression, scattered puzzle pieces — why?. PROPS (grounded on white): scattered puzzle pieces, shrug pose. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"why\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: baffled shrug, raised eyebrows, palms up . equally confused head tilt. pondering deeply. question-curve shapes above hea — sitting side profile, exactly two arms two legs. Crocodile: baffled shrug, raised eyebrows, palms up . equally confused head tilt. pondering deeply. question-curve shapes above hea — horizontal log body low, four stub legs."
  },
  "who": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — pink elephant and lime-green crocodile in a lineup behind a curtain, one peeking — who is it?. PROPS (grounded on white): curtain lineup, mystery peek. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"who\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: All four: mystery guessing game — curious suspicious playful faces (Cat sly peek, Dog excited guess, Cow thoughtful, Pig — BOTH thin stick arms visible, circle head unchanged. Crocodile: All four: mystery guessing game — curious suspicious playful faces (Cat sly peek, Dog excited guess, Cow thoughtful, Pig — horizontal log body low, four stub legs."
  },
  "as": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger dressed in a chef hat pretending to cook like a pro — as a chef.. PROPS (grounded on white): chef hat, stirring pot. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"as\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: proud chef roleplay, confident cooking smile in hat . impressed customer eyes. sous-chef helping seriously. tasting soup — orange sphere body, two stub arms two stub legs."
  },
  "will": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — pink elephant pointing at a calendar future date with a planned picnic marked — will happen.. PROPS (grounded on white): wall calendar with future picnic date circled. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"will\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: confident future-planning smile pointing ahead . excited anticipation for future event. marking calendar carefully. pack — sitting side profile, exactly two arms two legs. Elephant: confident future-planning smile pointing ahead . excited anticipation for future event. marking calendar carefully. pack — BOTH thin stick arms visible, circle head unchanged."
  },
  "from": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey receiving a letter delivered from a distant blue mailbox — from far away.. PROPS (grounded on white): blue mailbox, letter envelope. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"from\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: surprised-happy receiving letter, reading envelope . pointing back to far mailbox. post carrier wave from distance. curi — sitting side profile, exactly two arms two legs."
  },
  "when": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant watching an hourglass with sand falling — when time comes.. PROPS (grounded on white): hourglass with falling sand. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"when\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: All four: patient anticipation watching sand fall (Cat focused, Dog eager waiting, Cow calm, Pig impatient cute foot-tap — BOTH thin stick arms visible, circle head unchanged."
  },
  "back": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile walking back along footprints toward a cozy house — coming back.. PROPS (grounded on white): footprints leading to cozy house. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"back\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: relieved homeward smile following footprints . running back excited to house. carrying home groceries happily. waving at — horizontal log body low, four stub legs."
  },
  "okay": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot and mascot doing an OK paw circle gesture together — okay!. PROPS (grounded on white): OK paw circle gesture. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"okay\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: relaxed OK sign, easygoing grin . matching OK gesture, satisfied smile . Cow and thumbs up / OK hooves, all agreed. — sitting side profile, exactly two arms two legs. Elephant: relaxed OK sign, easygoing grin . matching OK gesture, satisfied smile . Cow and thumbs up / OK hooves, all agreed. — BOTH thin stick arms visible, circle head unchanged. Crocodile: relaxed OK sign, easygoing grin . matching OK gesture, satisfied smile . Cow and thumbs up / OK hooves, all agreed. — horizontal log body low, four stub legs. Tiger: relaxed OK sign, easygoing grin . matching OK gesture, satisfied smile . Cow and thumbs up / OK hooves, all agreed. — orange sphere body, two stub arms two stub legs."
  },
  "yes": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — all four mascots at a picnic celebrating — green checkmark flag planted in cake, confetti in air, sunny meadow.. PROPS (grounded on white): checkmark flag in birthday cake, confetti dots. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"yes\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: big happy squint-smile, paws up cheering . joyful open smile with normal round eyes . delighted grin, one eye wink, horn — sitting side profile, exactly two arms two legs. Elephant: big happy squint-smile, paws up cheering . joyful open smile with normal round eyes . delighted grin, one eye wink, horn — BOTH thin stick arms visible, circle head unchanged. Crocodile: big happy squint-smile, paws up cheering . joyful open smile with normal round eyes . delighted grin, one eye wink, horn — horizontal log body low, four stub legs. Tiger: big happy squint-smile, paws up cheering . joyful open smile with normal round eyes . delighted grin, one eye wink, horn — orange sphere body, two stub arms two stub legs."
  },
  "time": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger holding a round analog clock with visible hands, no numbers — time.. PROPS (grounded on white): round analog clock with visible hands. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"time\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: serious timekeeper face checking clock . worried about being late, glancing at clock. calm punctual nod. rushing with to — orange sphere body, two stub arms two stub legs."
  },
  "look": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey with binoculars staring at a colorful bird in a tree — look!. PROPS (grounded on white): binoculars, colorful bird in tree. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"look\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: excited discovery pointing with binoculars . also looking up alert. bending down to child's-eye view. gasping at colorfu — sitting side profile, exactly two arms two legs."
  },
  "take": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant taking the last cookie from a plate carefully — take one.. PROPS (grounded on white): last cookie on plate, careful taking. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"take\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: careful gentle taking, respectful eyes on last cookie . watching politely waiting turn. offering plate kindly. hopeful b — BOTH thin stick arms visible, circle head unchanged."
  },
  "an": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile presenting a single orange to lime-green crocodile — an orange (one of many types).. PROPS (grounded on white): single orange fruit offered. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"an\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: offering one orange warmly . accepting with pleased smile . basket of varied fruits behind showing one type. sniffing or — horizontal log body low, four stub legs."
  },
  "man": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger tipping a hat to a friendly adult stick-figure gardener with a rake.. PROPS (grounded on white): gardener stick-figure with rake. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"man\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: polite respectful nod tipping hat . friendly wave to man. courteous bow. offering flower to gardener. — orange sphere body, two stub arms two stub legs."
  },
  "where": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey studying a simple map with a red X destination — where?. PROPS (grounded on white): map with red X destination. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"where\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: lost searching face studying map . pointing different directions confused. rotating map helpfully. looking under bench c — sitting side profile, exactly two arms two legs."
  },
  "would": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant daydreaming in a thought cloud of flying on a dragon — would imagine.. PROPS (grounded on white): thought cloud with fantasy dragon. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"would\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: dreamy wishful smile eyes half-closed imagining . imagining same dream happily. wistful gentle smile. starry-eyed fantas — BOTH thin stick arms visible, circle head unchanged."
  },
  "some": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot picking some (not all) strawberries from a bush into a small basket.. PROPS (grounded on white): strawberry bush, small basket partially full. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"some\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: selective picking satisfied smile, basket partially full . showing full bush vs small basket. eating one sneaked berry g — sitting side profile, exactly two arms two legs. Elephant: selective picking satisfied smile, basket partially full . showing full bush vs small basket. eating one sneaked berry g — BOTH thin stick arms visible, circle head unchanged. Crocodile: selective picking satisfied smile, basket partially full . showing full bush vs small basket. eating one sneaked berry g — horizontal log body low, four stub legs. Tiger: selective picking satisfied smile, basket partially full . showing full bush vs small basket. eating one sneaked berry g — orange sphere body, two stub arms two stub legs."
  },
  "hey": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile waving both paws loudly from behind a fence — hey!. PROPS (grounded on white): waving both paws from behind fence. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hey\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: loud friendly HEY wave, big open smile calling attention . surprised-turned-happy wave back. calling over fence. popping — horizontal log body low, four stub legs."
  },
  "tell": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger whispering a secret into orange tiger's ear — tell you.. PROPS (grounded on white): whispering secret, cupped paw at ear. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tell\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: conspiratorial whisper, hand cupped at mouth, sly smile . surprised-interested listening ear (mild surprise OK, NOT froz — orange sphere body, two stub arms two stub legs."
  },
  "or": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey choosing between a cupcake OR an ice cream cone on two plates.. PROPS (grounded on white): cupcake on left plate, ice cream cone on right plate. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"or\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: torn decision face looking left-right between choices . pointing at both options helpfully. weighing choices with scales — sitting side profile, exactly two arms two legs."
  },
  "say": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant speaking with speech-bubble shapes but NO letters inside — saying something.. PROPS (grounded on white): speech-bubble shapes with NO letters. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"say\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: animated talking mouth open mid-speech, expressive paws . listening attentively nodding. responding with own bubble. exc — BOTH thin stick arms visible, circle head unchanged."
  },
  "something": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — Mystery object under a teal cloth on a table — something hidden.. PROPS (grounded on white): mystery object under teal cloth. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"something\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: curious finger on chin guessing . excited reaching for cloth . guessing shapes with hands. peeking under cloth edge snea — horizontal log body low, four stub legs."
  },
  "down": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger sliding down a playground slide toward orange sand — down.. PROPS (grounded on white): playground slide, downward arrow on sand. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"down\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: thrilled sliding face wind-in-fur, eyes wide joy . waiting at bottom arms open. watching from top gentle smile. queued e — orange sphere body, two stub arms two stub legs."
  },
  "then": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey finishing breakfast, empty plate, then walking toward open door — first eat, then leave.. PROPS (grounded on white): empty breakfast plate then open door — sequence. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"then\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: sequence shown — satisfied after-eating smile then eager exit face . pointing from plate to door teaching sequence. firs — sitting side profile, exactly two arms two legs."
  },
  "little": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant looking down at a tiny pink elephant on a stool — little vs big.. PROPS (grounded on white): tiny stool vs tall comparison. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"little\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: gentle giant kind smile looking down, mouth closed (NO tongue). small cute proud standing on stool, happy little smile . — BOTH thin stick arms visible, circle head unchanged."
  },
  "way": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile at start of a winding path leading to a small white house — the way home.. PROPS (grounded on white): winding path to small white house. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"way\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: hopeful path-finding expression, pointing down road . reading path confidently. pointing direction kindly. marching on p — horizontal log body low, four stub legs."
  },
  "make": {
    "cast": [
      "crocodile",
      "elephant"
    ],
    "scene": "ONLY lime-green crocodile and pink elephant on plain white #FFFFFF — lime-green crocodile mixing batter in a bowl with flour and eggs — make a cake.. PROPS (grounded on white): mixing bowl, flour, eggs — baking. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"make\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: focused baker concentration, slight flour on cheek . cracking eggs helpfully. stirring gently. watching oven excited ant — horizontal log body low, four stub legs. Elephant: focused baker concentration, slight flour on cheek . cracking eggs helpfully. stirring gently. watching oven excited ant — BOTH thin stick arms visible, circle head unchanged."
  },
  "too": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — White mug overflowing with hot cocoa down the sides — too full.. PROPS (grounded on white): mug overflowing hot cocoa. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"too\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: panicked too-much face as mug overflows . backing away from spill. grabbing napkins alarmed. gentle oops expression offe — orange sphere body, two stub arms two stub legs."
  },
  "never": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot crossing arms, turning from a 'closed forever' treasure chest — never.. PROPS (grounded on white): treasure chest with NEVER X sign. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"never\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: firm NEVER face, arms crossed, looking away . supporting stern head-shake. blocking chest with arm. X gesture with paws. — sitting side profile, exactly two arms two legs. Elephant: firm NEVER face, arms crossed, looking away . supporting stern head-shake. blocking chest with arm. X gesture with paws. — BOTH thin stick arms visible, circle head unchanged. Crocodile: firm NEVER face, arms crossed, looking away . supporting stern head-shake. blocking chest with arm. X gesture with paws. — horizontal log body low, four stub legs. Tiger: firm NEVER face, arms crossed, looking away . supporting stern head-shake. blocking chest with arm. X gesture with paws. — orange sphere body, two stub arms two stub legs."
  },
  "by": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey painting a picture beside purple monkey at easels — by each other / created by.. PROPS (grounded on white): two easels side by side, paintings. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"by\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: focused painting beside partner, collaborative smile . painting at adjacent easel, happy side-by-side . displaying finis — sitting side profile, exactly two arms two legs."
  },
  "over": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant jumping over a low teal hurdle on a track — over.. PROPS (grounded on white): low teal hurdle mid-jump. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"over\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: athletic mid-jump determined grin . cheering from sideline. holding hurdle steady. impressed jaw-drop happy. — BOTH thin stick arms visible, circle head unchanged."
  },
  "more": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot pouring more cookies from a jar onto a plate that already has cookies.. PROPS (grounded on white): cookie jar pouring onto already-full plate. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"more\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: eager MORE gesture pouring happily . trying to stop overflow amused. excited at growing pile. gentle caution hand up. — sitting side profile, exactly two arms two legs. Elephant: eager MORE gesture pouring happily . trying to stop overflow amused. excited at growing pile. gentle caution hand up. — BOTH thin stick arms visible, circle head unchanged. Crocodile: eager MORE gesture pouring happily . trying to stop overflow amused. excited at growing pile. gentle caution hand up. — horizontal log body low, four stub legs. Tiger: eager MORE gesture pouring happily . trying to stop overflow amused. excited at growing pile. gentle caution hand up. — orange sphere body, two stub arms two stub legs."
  },
  "mean": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile with stern face pointing at broken vase while dog looks guilty — mean behavior.. PROPS (grounded on white): broken blue vase on ground. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mean\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: stern scolding disappointed face . guilty ashamed drooped ears . sad disapproving look. hiding behind cow worried. — horizontal log body low, four stub legs."
  },
  "very": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger beside a VERY giant ice cream tower twice its height — very big.. PROPS (grounded on white): giant ice cream tower twice mascot height. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"very\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: awestruck amazed eyes at giant tower (wonder not horror shock). tiny comparison gesture. measuring tower height. ready t — orange sphere body, two stub arms two stub legs."
  },
  "off": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey switching off a lamp, room going dark — off.. PROPS (grounded on white): lamp switch, going dark. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"off\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: sleepy satisfied click-OFF face, drowsy eyes . yawning ready for sleep. dimming lights gently. already asleep sitting up — sitting side profile, exactly two arms two legs."
  },
  "sorry": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — purple monkey offering a small flower bouquet with both paws to pink elephant who sits with drooped ears on a park bench after a broken vase on the ground.. PROPS (grounded on white): flower bouquet, broken vase. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sorry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: guilty apologetic face — downturned mouth, ears back, teary eyes . sad disappointed but forgiving — soft eyes, small fro — sitting side profile, exactly two arms two legs. Elephant: guilty apologetic face — downturned mouth, ears back, teary eyes . sad disappointed but forgiving — soft eyes, small fro — BOTH thin stick arms visible, circle head unchanged."
  },
  "give": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot handing a wrapped gift box to mascot — give a gift.. PROPS (grounded on white): wrapped gift box being handed over. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"give\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: generous giving smile extending gift . surprised-touched receiving, happy eyes . applauding the giving. warm approving n — sitting side profile, exactly two arms two legs. Elephant: generous giving smile extending gift . surprised-touched receiving, happy eyes . applauding the giving. warm approving n — BOTH thin stick arms visible, circle head unchanged. Crocodile: generous giving smile extending gift . surprised-touched receiving, happy eyes . applauding the giving. warm approving n — horizontal log body low, four stub legs. Tiger: generous giving smile extending gift . surprised-touched receiving, happy eyes . applauding the giving. warm approving n — orange sphere body, two stub arms two stub legs."
  },
  "thank": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot bowing with a thank-you bouquet to mascot — thank you.. PROPS (grounded on white): thank-you flower bouquet, bow. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"thank\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: grateful bow, sincere thankful eyes . modest accepting smile, paws together . touched hand on heart. blowing kiss gratit — sitting side profile, exactly two arms two legs. Elephant: grateful bow, sincere thankful eyes . modest accepting smile, paws together . touched hand on heart. blowing kiss gratit — BOTH thin stick arms visible, circle head unchanged. Crocodile: grateful bow, sincere thankful eyes . modest accepting smile, paws together . touched hand on heart. blowing kiss gratit — horizontal log body low, four stub legs. Tiger: grateful bow, sincere thankful eyes . modest accepting smile, paws together . touched hand on heart. blowing kiss gratit — orange sphere body, two stub arms two stub legs."
  },
  "love": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — all four mascots forming a group hug in front of a sunset hill, small floating heart shapes (no text) in warm orange-pink sky.. PROPS (grounded on white): floating heart shapes, group hug. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"love\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: warm gentle closed-eye smile, leaning into hug (affectionate, NOT bored). happy soft smile, eyes closed content . tender — sitting side profile, exactly two arms two legs. Elephant: warm gentle closed-eye smile, leaning into hug (affectionate, NOT bored). happy soft smile, eyes closed content . tender — BOTH thin stick arms visible, circle head unchanged. Crocodile: warm gentle closed-eye smile, leaning into hug (affectionate, NOT bored). happy soft smile, eyes closed content . tender — horizontal log body low, four stub legs. Tiger: warm gentle closed-eye smile, leaning into hug (affectionate, NOT bored). happy soft smile, eyes closed content . tender — orange sphere body, two stub arms two stub legs."
  },
  "people": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — Four diverse stick-figure people silhouettes chatting in a park while mascots picnic nearby.. PROPS (grounded on white): four stick-figure people silhouettes in park. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"people\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: Mascots: friendly observing PEOPLE — warm curious smiles watching humans (Cat interested, Dog happy calm, Cow gentle wav — sitting side profile, exactly two arms two legs. Elephant: Mascots: friendly observing PEOPLE — warm curious smiles watching humans (Cat interested, Dog happy calm, Cow gentle wav — BOTH thin stick arms visible, circle head unchanged. Crocodile: Mascots: friendly observing PEOPLE — warm curious smiles watching humans (Cat interested, Dog happy calm, Cow gentle wav — horizontal log body low, four stub legs. Tiger: Mascots: friendly observing PEOPLE — warm curious smiles watching humans (Cat interested, Dog happy calm, Cow gentle wav — orange sphere body, two stub arms two stub legs."
  },
  "please": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot with pleading eyes offering a small empty cup — please?. PROPS (grounded on white): empty cup, pleading paws together. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"please\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: big pleading puppy-dog eyes, paws together begging . sympathetic considering. kindly reaching to help. passing teapot ge — sitting side profile, exactly two arms two legs. Elephant: big pleading puppy-dog eyes, paws together begging . sympathetic considering. kindly reaching to help. passing teapot ge — BOTH thin stick arms visible, circle head unchanged. Crocodile: big pleading puppy-dog eyes, paws together begging . sympathetic considering. kindly reaching to help. passing teapot ge — horizontal log body low, four stub legs. Tiger: big pleading puppy-dog eyes, paws together begging . sympathetic considering. kindly reaching to help. passing teapot ge — orange sphere body, two stub arms two stub legs."
  },
  "sure": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot nodding confidently with a thumbs up — sure!. PROPS (grounded on white): thumbs up, confident nod. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sure\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: confident sure nod, relaxed thumbs up grin . agreeing nod smile. hoof thumbs up. enthusiastic double thumbs up. — sitting side profile, exactly two arms two legs. Elephant: confident sure nod, relaxed thumbs up grin . agreeing nod smile. hoof thumbs up. enthusiastic double thumbs up. — BOTH thin stick arms visible, circle head unchanged. Crocodile: confident sure nod, relaxed thumbs up grin . agreeing nod smile. hoof thumbs up. enthusiastic double thumbs up. — horizontal log body low, four stub legs. Tiger: confident sure nod, relaxed thumbs up grin . agreeing nod smile. hoof thumbs up. enthusiastic double thumbs up. — orange sphere body, two stub arms two stub legs."
  },
  "any": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — pink elephant pointing at any of three identical teal doors — any one works.. PROPS (grounded on white): three identical teal doors, pick any. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"any\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: casual any-will-do shrug, relaxed pick-any face . opening one door experimentally. counting doors. eeny-meeny choosing c — BOTH thin stick arms visible, circle head unchanged."
  },
  "only": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — lime-green crocodile guarding the ONLY cookie left on an otherwise empty plate.. PROPS (grounded on white): single cookie on empty plate, guarding pose. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"only\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: protective possessive guarding face over last cookie . reaching sneaky. negotiating trade. gentle sharing suggestion. — horizontal log body low, four stub legs."
  },
  "because": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot pointing at dark clouds as reason for carrying umbrella — because of rain.. PROPS (grounded on white): dark rain clouds, open umbrella, puddle. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"because\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: explaining BECAUSE gesture at clouds, teaching face . understanding ah-ha nod. logical connecting dots gesture. already  — sitting side profile, exactly two arms two legs. Elephant: explaining BECAUSE gesture at clouds, teaching face . understanding ah-ha nod. logical connecting dots gesture. already  — BOTH thin stick arms visible, circle head unchanged. Crocodile: explaining BECAUSE gesture at clouds, teaching face . understanding ah-ha nod. logical connecting dots gesture. already  — horizontal log body low, four stub legs. Tiger: explaining BECAUSE gesture at clouds, teaching face . understanding ah-ha nod. logical connecting dots gesture. already  — orange sphere body, two stub arms two stub legs."
  },
  "two": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot holding up two fingers next to exactly two cupcakes on a tray.. PROPS (grounded on white): exactly two cupcakes on tray, two fingers up. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"two\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: counting TWO proudly, clear V fingers . confirming count nodding. holding up two hooves. trying to eat one of two guilty — sitting side profile, exactly two arms two legs. Elephant: counting TWO proudly, clear V fingers . confirming count nodding. holding up two hooves. trying to eat one of two guilty — BOTH thin stick arms visible, circle head unchanged. Crocodile: counting TWO proudly, clear V fingers . confirming count nodding. holding up two hooves. trying to eat one of two guilty — horizontal log body low, four stub legs. Tiger: counting TWO proudly, clear V fingers . confirming count nodding. holding up two hooves. trying to eat one of two guilty — orange sphere body, two stub arms two stub legs."
  },
  "much": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — orange tiger buried under a mountain of pillows — too much stuff.. PROPS (grounded on white): mountain of pillows burying mascot. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"much\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: overwhelmed buried face, muffled help expression . adding one more pillow mischievous. digging pig out. concerned gentle — orange sphere body, two stub arms two stub legs."
  },
  "sir": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — purple monkey politely tipping hat to a kind elderly gentleman silhouette with cane.. PROPS (grounded on white): elderly gentleman silhouette with cane. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sir\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: formal polite bow, respectful eyes . straight posture salute. curtsy-like polite nod. offering seat to sir kindly. — sitting side profile, exactly two arms two legs."
  },
  "maybe": {
    "cast": [
      "crocodile",
      "elephant"
    ],
    "scene": "ONLY lime-green crocodile and pink elephant on plain white #FFFFFF — pink elephant balancing on a fence looking unsure between two paths — maybe.. PROPS (grounded on white): fence balance between two paths. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"maybe\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: uncertain maybe shrug, wobbly balance, hesitant eyes . equally undecided. listing pros on hooves. flipping coin comedic. — horizontal log body low, four stub legs. Elephant: uncertain maybe shrug, wobbly balance, hesitant eyes . equally undecided. listing pros on hooves. flipping coin comedic. — BOTH thin stick arms visible, circle head unchanged."
  },
  "help": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — mascot helping tired mascot carry heavy grocery bags up steps — help.. PROPS (grounded on white): heavy grocery bags on steps. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"help\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: supportive helpful strain smile carrying bags . relieved grateful tired-but-thankful face . holding door open. carrying  — sitting side profile, exactly two arms two legs. Elephant: supportive helpful strain smile carrying bags . relieved grateful tired-but-thankful face . holding door open. carrying  — BOTH thin stick arms visible, circle head unchanged. Crocodile: supportive helpful strain smile carrying bags . relieved grateful tired-but-thankful face . holding door open. carrying  — horizontal log body low, four stub legs. Tiger: supportive helpful strain smile carrying bags . relieved grateful tired-but-thankful face . holding door open. carrying  — orange sphere body, two stub arms two stub legs."
  },
  "anything": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"anything\" clearly on white canvas. PROPS (grounded on white): open basket with many different objects to pick from, question-curve shapes. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"anything\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "god": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"god\" clearly on white canvas. PROPS (grounded on white): simple stained-glass window arch with warm light rays, no text. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"god\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "even": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"even\" clearly on white canvas. PROPS (grounded on white): two equal balance scales perfectly level. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"even\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "night": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"night\" clearly on white canvas. PROPS (grounded on white): crescent moon, few stars, small night lamp. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"night\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "call": {
    "cast": [
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY lime-green crocodile and orange tiger on plain white #FFFFFF — acting out the meaning of \"call\" clearly on white canvas. PROPS (grounded on white): ringing teal smartphone on small table. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"call\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "talk": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"talk\" clearly on white canvas. PROPS (grounded on white): two speech-bubble shapes with NO letters, facing each other. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"talk\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "into": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"into\" clearly on white canvas. PROPS (grounded on white): teal arrow entering open cardboard box. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"into\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "first": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"first\" clearly on white canvas. PROPS (grounded on white): gold medal ribbon with number 1, winner podium step. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"first\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "three": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"three\" clearly on white canvas. PROPS (grounded on white): exactly three identical teal blocks in a row. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"three\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "find": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY purple monkey and orange tiger on plain white #FFFFFF — acting out the meaning of \"find\" clearly on white canvas. PROPS (grounded on white): magnifying glass over hidden star sticker under cloth. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"find\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "wait": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"wait\" clearly on white canvas. PROPS (grounded on white): bench beside hourglass with falling sand. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wait\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "put": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"put\" clearly on white canvas. PROPS (grounded on white): book being placed on simple wooden shelf. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"put\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "great": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"great\" clearly on white canvas. PROPS (grounded on white): gold star cluster, celebratory confetti dots. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"great\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "day": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"day\" clearly on white canvas. PROPS (grounded on white): bright yellow sun, blue sky arc, daytime window light. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"day\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "work": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"work\" clearly on white canvas. PROPS (grounded on white): small desk with laptop silhouette, coffee mug, pencil cup. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"work\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "life": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"life\" clearly on white canvas. PROPS (grounded on white): tiny green sprout in soil, heart shape, simple timeline arrow. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"life\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "before": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"before\" clearly on white canvas. PROPS (grounded on white): split panel: empty plate BEFORE vs full plate AFTER. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"before\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "better": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"better\" clearly on white canvas. PROPS (grounded on white): small wilted plant vs taller healthy plant with upward arrow. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"better\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "four": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"four\" clearly on white canvas. PROPS (grounded on white): exactly four colorful pencils lined up. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"four\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "again": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"again\" clearly on white canvas. PROPS (grounded on white): circular redo arrow around simple puzzle piece. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"again\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "still": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"still\" clearly on white canvas. PROPS (grounded on white): frozen pause symbol, unmoving hourglass. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"still\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "home": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"home\" clearly on white canvas. PROPS (grounded on white): small cozy house with chimney and welcome mat. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"home\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "guy": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"guy\" clearly on white canvas. PROPS (grounded on white): simple stick-figure gentleman silhouette waving. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"guy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "won": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"won\" clearly on white canvas. PROPS (grounded on white): trophy cup with WIN ribbon, podium. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"won\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "than": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"than\" clearly on white canvas. PROPS (grounded on white): comparison scale — one side heavier with blocks. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"than\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "around": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"around\" clearly on white canvas. PROPS (grounded on white): circular path arrow looping a small tree. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"around\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "other": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"other\" clearly on white canvas. PROPS (grounded on white): two teal doors side by side, pointing at the other door. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"other\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "away": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"away\" clearly on white canvas. PROPS (grounded on white): footprints trail leading to distant tiny house. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"away\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "five": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"five\" clearly on white canvas. PROPS (grounded on white): five star stickers in a row, five fingers up. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"five\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "new": {
    "cast": [
      "elephant",
      "tiger"
    ],
    "scene": "ONLY pink elephant and orange tiger on plain white #FFFFFF — acting out the meaning of \"new\" clearly on white canvas. PROPS (grounded on white): shiny NEW tag sticker on wrapped box. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"new\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "last": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"last\" clearly on white canvas. PROPS (grounded on white): finish line ribbon at end of race track. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"last\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "ever": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"ever\" clearly on white canvas. PROPS (grounded on white): very long winding path to horizon line. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ever\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "stop": {
    "cast": [
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY lime-green crocodile and orange tiger on plain white #FFFFFF — acting out the meaning of \"stop\" clearly on white canvas. PROPS (grounded on white): red octagon stop sign on stick, halt hand gesture. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stop\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "keep": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"keep\" clearly on white canvas. PROPS (grounded on white): small treasure chest being hugged, KEEP arrow loop. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"keep\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "big": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"big\" clearly on white canvas. PROPS (grounded on white): tiny stool next to giant oversized apple for scale. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"big\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "six": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"six\" clearly on white canvas. PROPS (grounded on white): six dice showing six dots arranged neatly. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"six\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "after": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"after\" clearly on white canvas. PROPS (grounded on white): sequence panels: breakfast plate then open door leaving. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"after\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "long": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"long\" clearly on white canvas. PROPS (grounded on white): very long measuring tape stretched out. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"long\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "everything": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"everything\" clearly on white canvas. PROPS (grounded on white): open suitcase overflowing with every item type. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"everything\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "nice": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"nice\" clearly on white canvas. PROPS (grounded on white): flower bouquet gift with warm smile props. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nice\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "name": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"name\" clearly on white canvas. PROPS (grounded on white): blank name-tag sticker on shirt, pointing at tag. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"name\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "money": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"money\" clearly on white canvas. PROPS (grounded on white): stack of gold coins, small piggy bank. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"money\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "seven": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"seven\" clearly on white canvas. PROPS (grounded on white): seven rainbow color stripes in arc. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"seven\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "feel": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"feel\" clearly on white canvas. PROPS (grounded on white): soft fluffy fabric swatch, gentle touch on heart. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"feel\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "believe": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"believe\" clearly on white canvas. PROPS (grounded on white): hand on heart, trust stars, warm glow. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"believe\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "old": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"old\" clearly on white canvas. PROPS (grounded on white): dusty antique clock, cobweb corner detail. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"old\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "place": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"place\" clearly on white canvas. PROPS (grounded on white): map with red location pin marker. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"place\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "fine": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"fine\" clearly on white canvas. PROPS (grounded on white): OK thumbs-up card, green checkmark. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fine\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "kind": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"kind\" clearly on white canvas. PROPS (grounded on white): helping hand offering flower to friend silhouette. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"kind\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "eight": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"eight\" clearly on white canvas. PROPS (grounded on white): eight crayons lined up in color order. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"eight\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "hello": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"hello\" clearly on white canvas. PROPS (grounded on white): friendly open waving hand gesture, welcoming doorway entrance. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hello\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "lot": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"lot\" clearly on white canvas. PROPS (grounded on white): huge overflowing pile of colorful building blocks vs single small block. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lot\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "leave": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY purple monkey and orange tiger on plain white #FFFFFF — acting out the meaning of \"leave\" clearly on white canvas. PROPS (grounded on white): open doorway with footprints walking out toward sunshine, waving goodbye. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"leave\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hi": {
    "cast": [
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY lime-green crocodile and orange tiger on plain white #FFFFFF — acting out the meaning of \"hi\" clearly on white canvas. PROPS (grounded on white): casual cheerful paw wave, sunny path with happy flowers. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hi\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "girl": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"girl\" clearly on white canvas. PROPS (grounded on white): stick-figure young girl silhouette with pigtails holding a flower. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"girl\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "hear": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"hear\" clearly on white canvas. PROPS (grounded on white): sound waves arc radiating into cupped listening ear, musical note silhouette. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hear\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "father": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"father\" clearly on white canvas. PROPS (grounded on white): tall gentle stick-figure father silhouette holding child silhouette hand. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"father\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "through": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"through\" clearly on white canvas. PROPS (grounded on white): teal arrow path passing completely through a tunnel arch from one side to other. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"through\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "every": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"every\" clearly on white canvas. PROPS (grounded on white): row of gift boxes where EVERY single box has a shiny gold ribbon bow. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"every\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "nine": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"nine\" clearly on white canvas. PROPS (grounded on white): exactly nine colorful marbles arranged neatly in a 3x3 grid. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nine\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "bad": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"bad\" clearly on white canvas. PROPS (grounded on white): spoiled brown banana peel with small flies doodle. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bad\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "listen": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"listen\" clearly on white canvas. PROPS (grounded on white): large cupped ear gesture listening to acoustic sound wave rings. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"listen\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "remember": {
    "cast": [
      "elephant",
      "tiger"
    ],
    "scene": "ONLY pink elephant and orange tiger on plain white #FFFFFF — acting out the meaning of \"remember\" clearly on white canvas. PROPS (grounded on white): glowing yellow lightbulb popping above head with thought cloud. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"remember\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "boy": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"boy\" clearly on white canvas. PROPS (grounded on white): young boy stick-figure silhouette kicking small teal soccer ball. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"boy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "wrong": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"wrong\" clearly on white canvas. PROPS (grounded on white): large red X mark on test paper with unhappy head shake. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wrong\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "stay": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"stay\" clearly on white canvas. PROPS (grounded on white): wooden garden bench with 'STAY HERE' grounded arrow sign. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stay\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "house": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"house\" clearly on white canvas. PROPS (grounded on white): small cozy red-roof cottage with stone chimney and garden fence. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"house\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "ten": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"ten\" clearly on white canvas. PROPS (grounded on white): ten shiny gold stars arranged in neat double rows of five. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ten\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "baby": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"baby\" clearly on white canvas. PROPS (grounded on white): tiny sleeping baby silhouette wrapped in soft blue blanket with pacifier. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"baby\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "another": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"another\" clearly on white canvas. PROPS (grounded on white): cookie jar with hand reaching in to take another fresh cookie. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"another\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "dad": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"dad\" clearly on white canvas. PROPS (grounded on white): tall gentle dad stick-figure silhouette tossing child up happily in air. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dad\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "enough": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"enough\" clearly on white canvas. PROPS (grounded on white): balanced full plate of fruits with satisfied hand push-back gesture. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"enough\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "eleven": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"eleven\" clearly on white canvas. PROPS (grounded on white): neat desk clock showing exactly eleven o'clock with two hands. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"eleven\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "show": {
    "cast": [
      "monkey",
      "crocodile"
    ],
    "scene": "ONLY purple monkey and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"show\" clearly on white canvas. PROPS (grounded on white): theater stage curtain drawn back revealing sparkling surprise pedestal. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"show\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "course": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"course\" clearly on white canvas. PROPS (grounded on white): three-course dinner setting: soup bowl, plate, dessert dish lined up. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"course\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "care": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"care\" clearly on white canvas. PROPS (grounded on white): first aid kit box, gentle bandage being placed with loving heart sparkles. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"care\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "mind": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"mind\" clearly on white canvas. PROPS (grounded on white): sparkling glowing brain silhouette surrounded by floating idea stars. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mind\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "left": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"left\" clearly on white canvas. PROPS (grounded on white): bold teal directional arrow curving sharply to the left on a sidewalk. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"left\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "ask": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY purple monkey and orange tiger on plain white #FFFFFF — acting out the meaning of \"ask\" clearly on white canvas. PROPS (grounded on white): raised hand with floating question mark curve shape. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ask\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "twelve": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"twelve\" clearly on white canvas. PROPS (grounded on white): wall clock showing twelve o'clock high noon with both hands aligned. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"twelve\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "understand": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"understand\" clearly on white canvas. PROPS (grounded on white): two puzzle pieces clicking perfectly together with bright light flash. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"understand\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "mother": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"mother\" clearly on white canvas. PROPS (grounded on white): mother silhouette gently hugging young child with floating heart dots. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mother\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "which": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"which\" clearly on white canvas. PROPS (grounded on white): two different colorful gift boxes with wondering hand pointing between them. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"which\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "try": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"try\" clearly on white canvas. PROPS (grounded on white): jumping high to reach a shiny star dangling on a string with determination. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"try\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "hell": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"hell\" clearly on white canvas. PROPS (grounded on white): funny cartoon comic heatwave steam puffs with melting red ice cream cone. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hell\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "miss": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"miss\" clearly on white canvas. PROPS (grounded on white): target dartboard with dart landed just outside the bullseye ring. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"miss\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "fifteen": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"fifteen\" clearly on white canvas. PROPS (grounded on white): fifteen colorful marbles counted out into neat groups of five. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fifteen\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "own": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"own\" clearly on white canvas. PROPS (grounded on white): stamping personal crown emblem onto wooden toy chest. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"own\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "world": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"world\" clearly on white canvas. PROPS (grounded on white): colorful globe stand showing blue oceans and green continents. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"world\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "guess": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"guess\" clearly on white canvas. PROPS (grounded on white): closed mystery treasure box with question mark hook shape above it. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"guess\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "next": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"next\" clearly on white canvas. PROPS (grounded on white): row of stepping stones with glowing arrow pointing to the very NEXT stone. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"next\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "kill": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"kill\" clearly on white canvas. PROPS (grounded on white): comical fly swatter tapping a tiny pesky mosquito doodle flat on table. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"kill\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "else": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"else\" clearly on white canvas. PROPS (grounded on white): menu board with two items crossed out and pointing to third option. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"else\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "dead": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"dead\" clearly on white canvas. PROPS (grounded on white): wilted drooping brown sunflower losing its last petal. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dead\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "someone": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"someone\" clearly on white canvas. PROPS (grounded on white): mysterious hooded silhouette outline under a warm street lamp. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"someone\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "real": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"real\" clearly on white canvas. PROPS (grounded on white): magnifying glass inspecting authentic sparkling genuine gemstone vs plastic fake. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"real\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sixteen": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sixteen\" clearly on white canvas. PROPS (grounded on white): sixteen bright birthday cake candles glowing in neat rows. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sixteen\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "room": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"room\" clearly on white canvas. PROPS (grounded on white): four simple cozy floor walls showing bed, rug, and window with sun. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"room\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "hold": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"hold\" clearly on white canvas. PROPS (grounded on white): both hands firmly gripping a warm steaming mug of cocoa. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hold\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "woman": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"woman\" clearly on white canvas. PROPS (grounded on white): friendly woman stick-figure silhouette with wavy hair waving hello. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"woman\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "yourself": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"yourself\" clearly on white canvas. PROPS (grounded on white): standing before a large clean mirror smiling at own reflection. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"yourself\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "today": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"today\" clearly on white canvas. PROPS (grounded on white): calendar page with large bold TODAY circle and bright sunshine doodle. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"today\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "twenty": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"twenty\" clearly on white canvas. PROPS (grounded on white): twenty crisp shiny coins stacked into two equal towers of ten. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"twenty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "mom": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"mom\" clearly on white canvas. PROPS (grounded on white): loving mom silhouette baking cookies and offering one with a warm smile. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mom\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "friend": {
    "cast": [
      "tiger",
      "monkey"
    ],
    "scene": "ONLY orange tiger and purple monkey on plain white #FFFFFF — acting out the meaning of \"friend\" clearly on white canvas. PROPS (grounded on white): two mascots locking arms in a friendly high-five handshake. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"friend\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs. Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "move": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"move\" clearly on white canvas. PROPS (grounded on white): trio of packed cardboard moving boxes on a teal hand dolly cart. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"move\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "same": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"same\" clearly on white canvas. PROPS (grounded on white): two identical twin blue teddy bears sitting side by side. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"same\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "job": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"job\" clearly on white canvas. PROPS (grounded on white): office desk with laptop, work clipboard, and hardhat tool belt. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"job\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "tonight": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"tonight\" clearly on white canvas. PROPS (grounded on white): dark crescent moon night sky poster framed with cozy bedside table lamp. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tonight\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "son": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"son\" clearly on white canvas. PROPS (grounded on white): little boy silhouette proudly walking beside parent matching strides. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"son\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "thirty": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"thirty\" clearly on white canvas. PROPS (grounded on white): calendar showing date number 30 with celebration star sticker. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"thirty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "found": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"found\" clearly on white canvas. PROPS (grounded on white): metal detector digging up a buried gleaming gold coin in sand. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"found\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "pretty": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"pretty\" clearly on white canvas. PROPS (grounded on white): vase with fresh blooming pink and purple flowers with butterfly. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pretty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "ready": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"ready\" clearly on white canvas. PROPS (grounded on white): laced running shoes on start line awaiting the starter whistle. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ready\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "whole": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"whole\" clearly on white canvas. PROPS (grounded on white): complete unbroken circular pizza pie with all eight slices intact. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"whole\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "together": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"together\" clearly on white canvas. PROPS (grounded on white): four mascots holding hands in a unified circle on grassy patch. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"together\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "minute": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"minute\" clearly on white canvas. PROPS (grounded on white): sand timer hourglass running out with tiny seconds hand ticking. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"minute\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "forty": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"forty\" clearly on white canvas. PROPS (grounded on white): odometer dial rolling to number 40 with speed lines. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"forty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "head": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"head\" clearly on white canvas. PROPS (grounded on white): pointing both paws to own round smiling head with graduation cap. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"head\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "matter": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"matter\" clearly on white canvas. PROPS (grounded on white): balance scales weighing an important gold brick vs light feather. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"matter\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "haven": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"haven\" clearly on white canvas. PROPS (grounded on white): safe cozy birdhouse sheltered under a sturdy wooden roof. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"haven\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "excuse": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"excuse\" clearly on white canvas. PROPS (grounded on white): polite bow with hand over chest apologizing gently. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"excuse\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "many": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"many\" clearly on white canvas. PROPS (grounded on white): huge overflowing basket containing dozens of ripe red apples. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"many\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "idea": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"idea\" clearly on white canvas. PROPS (grounded on white): bright glowing yellow lightbulb with sparkle rays around head. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"idea\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "without": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"without\" clearly on white canvas. PROPS (grounded on white): open empty pocket turned inside out with sad empty shrug. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"without\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "play": {
    "cast": [
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY lime-green crocodile and orange tiger on plain white #FFFFFF — acting out the meaning of \"play\" clearly on white canvas. PROPS (grounded on white): colorful toy xylophone and building block castle on play rug. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"play\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "family": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"family\" clearly on white canvas. PROPS (grounded on white): cozy family portrait frame with parents and two young children. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"family\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "fifty": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"fifty\" clearly on white canvas. PROPS (grounded on white): large shiny gold 50 medal ribbon with winner laurel leaves. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fifty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "meet": {
    "cast": [
      "elephant",
      "tiger"
    ],
    "scene": "ONLY pink elephant and orange tiger on plain white #FFFFFF — acting out the meaning of \"meet\" clearly on white canvas. PROPS (grounded on white): two friends walking from opposite sides shaking hands warmly at a signpost. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"meet\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "most": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"most\" clearly on white canvas. PROPS (grounded on white): tallest tower of blocks towering high above two much shorter stacks. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"most\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "run": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"run\" clearly on white canvas. PROPS (grounded on white): speed lines trailing behind energetic running shoes on running track. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"run\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "while": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"while\" clearly on white canvas. PROPS (grounded on white): reading a book on sofa WHILE listening to music through headphones. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"while\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "wife": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"wife\" clearly on white canvas. PROPS (grounded on white): smiling wife silhouette wearing wedding ring standing beside garden. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wife\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "once": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"once\" clearly on white canvas. PROPS (grounded on white): single candle being lit for the first time with '1' cake topper. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"once\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "live": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"live\" clearly on white canvas. PROPS (grounded on white): green potted plant bursting with fresh flowers and healthy leaves. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"live\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "somebody": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"somebody\" clearly on white canvas. PROPS (grounded on white): knock on the front door with friendly silhouette peeking through window. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"somebody\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "everybody": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"everybody\" clearly on white canvas. PROPS (grounded on white): cheering crowd of varied animal silhouettes waving confetti together. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"everybody\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "hundred": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"hundred\" clearly on white canvas. PROPS (grounded on white): giant 10x10 grid of one hundred colorful square tiles fully filled. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hundred\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "use": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"use\" clearly on white canvas. PROPS (grounded on white): holding a hammer driving a nail cleanly into wooden plank. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"use\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "myself": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"myself\" clearly on white canvas. PROPS (grounded on white): pointing thumbs proudly at own chest with confident happy grin. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"myself\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "yet": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"yet\" clearly on white canvas. PROPS (grounded on white): present wrapped in box with 'DO NOT OPEN YET' ribbon clock tag. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"yet\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "start": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"start\" clearly on white canvas. PROPS (grounded on white): checkered start-line flag waving at the beginning of a race track. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"start\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "kid": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"kid\" clearly on white canvas. PROPS (grounded on white): young energetic kid silhouette skipping rope in sunny park. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"kid\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "tomorrow": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"tomorrow\" clearly on white canvas. PROPS (grounded on white): calendar arrow flipping forward from today page to tomorrow sunrise. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tomorrow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "happy": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"happy\" clearly on white canvas. PROPS (grounded on white): giant bright yellow smiley face balloon floating high with rainbow. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"happy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "thousand": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"thousand\" clearly on white canvas. PROPS (grounded on white): large treasure chest overflowing with countless gold coins. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"thousand\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "school": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"school\" clearly on white canvas. PROPS (grounded on white): charming brick schoolhouse with bell tower and playground swing. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"school\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "problem": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"problem\" clearly on white canvas. PROPS (grounded on white): tangled knot of colorful string being carefully unraveled. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"problem\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "watch": {
    "cast": [
      "monkey",
      "crocodile"
    ],
    "scene": "ONLY purple monkey and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"watch\" clearly on white canvas. PROPS (grounded on white): classic wristwatch with leather strap showing moving gear hands. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"watch\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "business": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"business\" clearly on white canvas. PROPS (grounded on white): briefcase and blueprint chart showing upward profit arrow. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"business\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hope": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"hope\" clearly on white canvas. PROPS (grounded on white): wishing upon a bright falling star in twilight sky with clasped paws. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hope\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "open": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"open\" clearly on white canvas. PROPS (grounded on white): wide open wooden front door welcoming sunlight into room. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"open\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "already": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"already\" clearly on white canvas. PROPS (grounded on white): checklist with every single box checked with green checkmarks. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"already\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "since": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"since\" clearly on white canvas. PROPS (grounded on white): timeline chart tracing a growth line starting from small seedling year. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"since\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sit": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sit\" clearly on white canvas. PROPS (grounded on white): relaxing comfortably on a soft padded armchair with footstool. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "cause": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"cause\" clearly on white canvas. PROPS (grounded on white): first domino tipping over triggering a chain reaction of falling tiles. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cause\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "alone": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"alone\" clearly on white canvas. PROPS (grounded on white): single solitary lighthouse beam on quiet peaceful ocean cliff. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"alone\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "hard": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"hard\" clearly on white canvas. PROPS (grounded on white): heavy solid steel anvil struck by hammer with small spark. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hard\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "stuff": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"stuff\" clearly on white canvas. PROPS (grounded on white): open toy box packed with assorted toys, balls, and gadgets. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stuff\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "white": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"white\" clearly on white canvas. PROPS (grounded on white): clean pristine white canvas easel with white daisy flower in vase. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"white\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "turn": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"turn\" clearly on white canvas. PROPS (grounded on white): winding road sign with curved U-turn arrow pointing to new direction. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"turn\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "until": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"until\" clearly on white canvas. PROPS (grounded on white): alarm clock set to ring when hands reach 5:00 mark with dotted trail. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"until\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "few": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"few\" clearly on white canvas. PROPS (grounded on white): plate with only three small grapes scattered sparingly. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"few\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "honey": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"honey\" clearly on white canvas. PROPS (grounded on white): dripping honeycomb wooden dipper over ceramic jar of golden honey. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"honey\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "blue": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"blue\" clearly on white canvas. PROPS (grounded on white): paint bucket spilling vivid bright sky blue paint onto paper. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"blue\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "both": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"both\" clearly on white canvas. PROPS (grounded on white): two hands simultaneously holding two ice cream cones (strawberry & mint). Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"both\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "door": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"door\" clearly on white canvas. PROPS (grounded on white): polished oak front door with brass handle and keyhole. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"door\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "later": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"later\" clearly on white canvas. PROPS (grounded on white): clock face with dashed curved arrow pointing to future evening hours. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"later\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "such": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"such\" clearly on white canvas. PROPS (grounded on white): magnifying glass highlighting a uniquely sparkling patterned seashell. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"such\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "face": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"face\" clearly on white canvas. PROPS (grounded on white): pointing to own cheerful smiling face with rosy pink cheeks. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"face\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "worry": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY purple monkey and orange tiger on plain white #FFFFFF — acting out the meaning of \"worry\" clearly on white canvas. PROPS (grounded on white): fretting with paws on cheeks looking at a wobbly teetering cup tower. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"worry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "ago": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"ago\" clearly on white canvas. PROPS (grounded on white): sepia-toned antique photograph album with dates from the past. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ago\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "green": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"green\" clearly on white canvas. PROPS (grounded on white): lush green leaf sprout bathed in fresh morning dewdrop. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"green\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "second": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"second\" clearly on white canvas. PROPS (grounded on white): silver medal with number 2 on the second-place podium step. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"second\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "brother": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY purple monkey and orange tiger on plain white #FFFFFF — acting out the meaning of \"brother\" clearly on white canvas. PROPS (grounded on white): two boy silhouettes in baseball caps sharing high-five in yard. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"brother\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "damn": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"damn\" clearly on white canvas. PROPS (grounded on white): stubbed toe comedic reaction with swirly dizzy cartoon stars. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"damn\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "case": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"case\" clearly on white canvas. PROPS (grounded on white): sturdy vintage leather travel suitcase with brass luggage tags. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"case\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "probably": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"probably\" clearly on white canvas. PROPS (grounded on white): weather forecast board showing 80% sunshine with tiny cloud chance. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"probably\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "beautiful": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"beautiful\" clearly on white canvas. PROPS (grounded on white): vibrant rainbow arching over blooming botanical garden meadow. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"beautiful\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "hand": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"hand\" clearly on white canvas. PROPS (grounded on white): open friendly paw palm facing viewer showing clean lines. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hand\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "check": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"check\" clearly on white canvas. PROPS (grounded on white): green highlighter ticking off items on a clear checklist clipboard. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"check\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "year": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"year\" clearly on white canvas. PROPS (grounded on white): four seasons wheel displaying spring blossom, summer sun, autumn leaf, winter snowflake. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"year\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "yellow": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"yellow\" clearly on white canvas. PROPS (grounded on white): bright sunny sunflower in full bloom with yellow paint palette. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"yellow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "forget": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"forget\" clearly on white canvas. PROPS (grounded on white): scratching head with empty thought bubble and question marks. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"forget\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "hit": {
    "cast": [
      "tiger",
      "monkey"
    ],
    "scene": "ONLY orange tiger and purple monkey on plain white #FFFFFF — acting out the meaning of \"hit\" clearly on white canvas. PROPS (grounded on white): wooden baseball bat cleanly striking a baseball with impact starburst. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs. Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "lost": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"lost\" clearly on white canvas. PROPS (grounded on white): spinning compass with wandering confused footprint trails in sand. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lost\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "crazy": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"crazy\" clearly on white canvas. PROPS (grounded on white): fun carnival roller coaster car zooming through dizzy loop-de-loop. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"crazy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "phone": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"phone\" clearly on white canvas. PROPS (grounded on white): retro teal rotary telephone ringing with sound vibration arcs. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"phone\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "nobody": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"nobody\" clearly on white canvas. PROPS (grounded on white): empty theater auditorium seats with quiet spotlight on stage. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nobody\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "end": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"end\" clearly on white canvas. PROPS (grounded on white): black-and-white checkered finish line ribbon torn at end of sprint. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"end\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "black": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"black\" clearly on white canvas. PROPS (grounded on white): sleek shiny black bowler hat resting on white pedestal. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"black\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "easy": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"easy\" clearly on white canvas. PROPS (grounded on white): simple two-piece baby puzzle assembled in one second with thumbs-up. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"easy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "doctor": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"doctor\" clearly on white canvas. PROPS (grounded on white): doctor stethoscope and medical clipboard with red cross emblem. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"doctor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "shut": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"shut\" clearly on white canvas. PROPS (grounded on white): solid wooden window shutters closed tight with sturdy latch bolt. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shut\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "under": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"under\" clearly on white canvas. PROPS (grounded on white): small friendly turtle sheltered under a large mushroom cap umbrella. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"under\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "part": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"part\" clearly on white canvas. PROPS (grounded on white): single missing jigsaw puzzle piece fitting into larger landscape puzzle. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"part\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "deal": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"deal\" clearly on white canvas. PROPS (grounded on white): firm handshake over signed agreement document with gold seal. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"deal\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "die": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"die\" clearly on white canvas. PROPS (grounded on white): single candle wick with wisp of white smoke after being blown out. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"die\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "soon": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"soon\" clearly on white canvas. PROPS (grounded on white): sand timer with just a few grains left before ringing bell. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"soon\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "anyone": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"anyone\" clearly on white canvas. PROPS (grounded on white): open welcome gate inviting any passerby into sunny orchard. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"anyone\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "orange": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"orange\" clearly on white canvas. PROPS (grounded on white): fresh orange fruit sliced on plate — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"orange\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "pay": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"pay\" clearly on white canvas. PROPS (grounded on white): person paying with credit card at counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pay\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "happen": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"happen\" clearly on white canvas. PROPS (grounded on white): unexpected surprise moment outdoors — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"happen\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "true": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"true\" clearly on white canvas. PROPS (grounded on white): green check mark correct answer — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"true\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "each": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"each\" clearly on white canvas. PROPS (grounded on white): person handing out one gift each — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"each\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "eat": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"eat\" clearly on white canvas. PROPS (grounded on white): person eating meal — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"eat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "mine": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"mine\" clearly on white canvas. PROPS (grounded on white): person holding personal backpack belongings — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mine\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "brown": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"brown\" clearly on white canvas. PROPS (grounded on white): brown leather wallet on wooden table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"brown\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "town": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"town\" clearly on white canvas. PROPS (grounded on white): small town main street shops — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"town\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "afraid": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"afraid\" clearly on white canvas. PROPS (grounded on white): person scared covering face hands — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"afraid\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "drink": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"drink\" clearly on white canvas. PROPS (grounded on white): glass of water — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"drink\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "whatever": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"whatever\" clearly on white canvas. PROPS (grounded on white): person shrugging shoulders indifferent — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"whatever\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hurt": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"hurt\" clearly on white canvas. PROPS (grounded on white): bandage on injured knee closeup — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hurt\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "heart": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"heart\" clearly on white canvas. PROPS (grounded on white): red heart shape hands gesture love — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"heart\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "young": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"young\" clearly on white canvas. PROPS (grounded on white): young couple smiling outdoors together — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"young\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "everyone": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"everyone\" clearly on white canvas. PROPS (grounded on white): diverse crowd of people together — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"everyone\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "pink": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"pink\" clearly on white canvas. PROPS (grounded on white): pink flower bouquet soft petals — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pink\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "chance": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"chance\" clearly on white canvas. PROPS (grounded on white): rolling dice on game table luck — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"chance\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "read": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"read\" clearly on white canvas. PROPS (grounded on white): person reading book in cozy chair — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"read\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "number": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"number\" clearly on white canvas. PROPS (grounded on white): numbers written on classroom chalkboard — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"number\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "change": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"change\" clearly on white canvas. PROPS (grounded on white): coins and cash money exchange — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"change\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "anyway": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"anyway\" clearly on white canvas. PROPS (grounded on white): person continuing walk down road — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"anyway\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "week": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"week\" clearly on white canvas. PROPS (grounded on white): weekly calendar planner on desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"week\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "point": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"point\" clearly on white canvas. PROPS (grounded on white): finger pointing at map location — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"point\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "purple": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"purple\" clearly on white canvas. PROPS (grounded on white): purple grapes bunch on table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"purple\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "police": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"police\" clearly on white canvas. PROPS (grounded on white): police officer uniform street patrol — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"police\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "word": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"word\" clearly on white canvas. PROPS (grounded on white): dictionary open on wooden desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"word\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "fun": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"fun\" clearly on white canvas. PROPS (grounded on white): friends laughing playing board game — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fun\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "wish": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"wish\" clearly on white canvas. PROPS (grounded on white): person blowing dandelion seeds wish — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wish\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "bit": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"bit\" clearly on white canvas. PROPS (grounded on white): small bite taken from cookie — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "game": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"game\" clearly on white canvas. PROPS (grounded on white): family playing board game table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"game\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "party": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"party\" clearly on white canvas. PROPS (grounded on white): birthday party balloons and cake — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"party\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "gray": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"gray\" clearly on white canvas. PROPS (grounded on white): gray cloudy sky over city — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gray\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "set": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"set\" clearly on white canvas. PROPS (grounded on white): table place setting dinner plate — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"set\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "cut": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"cut\" clearly on white canvas. PROPS (grounded on white): kitchen knife cutting fresh vegetables — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cut\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sleep": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sleep\" clearly on white canvas. PROPS (grounded on white): person sleeping peacefully in bed — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sleep\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "shot": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"shot\" clearly on white canvas. PROPS (grounded on white): basketball player shooting hoop — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shot\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "anybody": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"anybody\" clearly on white canvas. PROPS (grounded on white): open welcome door for anyone — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"anybody\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "stand": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"stand\" clearly on white canvas. PROPS (grounded on white): person standing in queue line indoors — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stand\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "water": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"water\" clearly on white canvas. PROPS (grounded on white): clear water glass — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"water\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "monday": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"monday\" clearly on white canvas. PROPS (grounded on white): calendar showing monday start week — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"monday\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "trouble": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"trouble\" clearly on white canvas. PROPS (grounded on white): person worried looking at broken car — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"trouble\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "dear": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"dear\" clearly on white canvas. PROPS (grounded on white): handwritten dear letter envelope — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dear\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "couple": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"couple\" clearly on white canvas. PROPS (grounded on white): romantic couple holding hands park — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"couple\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "break": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"break\" clearly on white canvas. PROPS (grounded on white): broken glass — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"break\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "story": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"story\" clearly on white canvas. PROPS (grounded on white): storytelling book children bedtime reading lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"story\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "far": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"far\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"far\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "tuesday": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"tuesday\" clearly on white canvas. PROPS (grounded on white): calendar showing tuesday weekday — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tuesday\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "close": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"close\" clearly on white canvas. PROPS (grounded on white): closed door — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"close\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "funny": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"funny\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"funny\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "lady": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"lady\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lady\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "death": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"death\" clearly on white canvas. PROPS (grounded on white): memorial candle remembrance quiet scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"death\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "walk": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"walk\" clearly on white canvas. PROPS (grounded on white): person walking street — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"walk\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "fire": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"fire\" clearly on white canvas. PROPS (grounded on white): campfire flames — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fire\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "wednesday": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"wednesday\" clearly on white canvas. PROPS (grounded on white): calendar showing wednesday weekday — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wednesday\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hate": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"hate\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "gun": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"gun\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gun\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "person": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"person\" clearly on white canvas. PROPS (grounded on white): person portrait candid smile natural light — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"person\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "inside": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"inside\" clearly on white canvas. PROPS (grounded on white): person sitting inside tent — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"inside\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "different": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"different\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"different\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "captain": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"captain\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"captain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "least": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"least\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"least\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "thursday": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"thursday\" clearly on white canvas. PROPS (grounded on white): calendar showing thursday weekday — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"thursday\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "important": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"important\" clearly on white canvas. PROPS (grounded on white): important document highlight — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"important\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "also": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"also\" clearly on white canvas. PROPS (grounded on white): two matching coffee cups — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"also\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "line": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"line\" clearly on white canvas. PROPS (grounded on white): people standing queue line waiting — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"line\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "office": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"office\" clearly on white canvas. PROPS (grounded on white): modern office workspace desk computer — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"office\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "dinner": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"dinner\" clearly on white canvas. PROPS (grounded on white): dinner person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dinner\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "quite": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"quite\" clearly on white canvas. PROPS (grounded on white): measuring cup partial fill kitchen — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"quite\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "against": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"against\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"against\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "fight": {
    "cast": [
      "tiger",
      "monkey"
    ],
    "scene": "ONLY orange tiger and purple monkey on plain white #FFFFFF — acting out the meaning of \"fight\" clearly on white canvas. PROPS (grounded on white): boxing training sport gym fighters — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fight\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs. Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "friday": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"friday\" clearly on white canvas. PROPS (grounded on white): calendar showing friday weekday — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"friday\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "side": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"side\" clearly on white canvas. PROPS (grounded on white): side by side comparison two products table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"side\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "half": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"half\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"half\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "pick": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"pick\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pick\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "question": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"question\" clearly on white canvas. PROPS (grounded on white): question mark chalkboard curiosity thinking student — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"question\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "ahead": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"ahead\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ahead\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "cool": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"cool\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cool\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "body": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"body\" clearly on white canvas. PROPS (grounded on white): fitness body workout gym health — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"body\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "saturday": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"saturday\" clearly on white canvas. PROPS (grounded on white): calendar showing saturday weekday — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"saturday\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "high": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"high\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"high\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "husband": {
    "cast": [
      "elephant",
      "tiger"
    ],
    "scene": "ONLY pink elephant and orange tiger on plain white #FFFFFF — acting out the meaning of \"husband\" clearly on white canvas. PROPS (grounded on white): married couple wedding rings hands love — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"husband\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "reason": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"reason\" clearly on white canvas. PROPS (grounded on white): lightbulb reason logic thinking desk notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"reason\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "almost": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"almost\" clearly on white canvas. PROPS (grounded on white): finish line runner nearly complete race — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"almost\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "dog": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"dog\" clearly on white canvas. PROPS (grounded on white): golden retriever dog park happy — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dog\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "buy": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"buy\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"buy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "truth": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"truth\" clearly on white canvas. PROPS (grounded on white): magnifying glass on document truth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"truth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sunday": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sunday\" clearly on white canvas. PROPS (grounded on white): calendar showing sunday weekday — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sunday\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "hot": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"hot\" clearly on white canvas. PROPS (grounded on white): hot sunny weather — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hot\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "anymore": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"anymore\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"anymore\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "behind": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"behind\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"behind\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "speak": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"speak\" clearly on white canvas. PROPS (grounded on white): person speaking into microphone — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"speak\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "bed": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"bed\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bed\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "moment": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"moment\" clearly on white canvas. PROPS (grounded on white): camera capturing special moment candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"moment\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "blood": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"blood\" clearly on white canvas. PROPS (grounded on white): blood donation medical healthcare hospital — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"blood\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "march": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"march\" clearly on white canvas. PROPS (grounded on white): calendar page march month — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"march\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "ma": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"ma\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ma\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "shall": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"shall\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shall\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "stupid": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"stupid\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stupid\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "along": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"along\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"along\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "either": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"either\" clearly on white canvas. PROPS (grounded on white): either person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"either\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "though": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"though\" clearly on white canvas. PROPS (grounded on white): person climbing mountain despite challenge — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"though\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "front": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"front\" clearly on white canvas. PROPS (grounded on white): house front door entrance welcome mat — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"front\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sister": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY purple monkey and orange tiger on plain white #FFFFFF — acting out the meaning of \"sister\" clearly on white canvas. PROPS (grounded on white): sister person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sister\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "april": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"april\" clearly on white canvas. PROPS (grounded on white): calendar page april month — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"april\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "bye": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"bye\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bye\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "send": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"send\" clearly on white canvas. PROPS (grounded on white): hand placing letter in mailbox — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"send\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "welcome": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY purple monkey and orange tiger on plain white #FFFFFF — acting out the meaning of \"welcome\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"welcome\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "trust": {
    "cast": [
      "elephant",
      "monkey"
    ],
    "scene": "ONLY pink elephant and purple monkey on plain white #FFFFFF — acting out the meaning of \"trust\" clearly on white canvas. PROPS (grounded on white): handshake trust partnership agreement business deal — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"trust\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "free": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"free\" clearly on white canvas. PROPS (grounded on white): open birdcage door bird flying free — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"free\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "book": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"book\" clearly on white canvas. PROPS (grounded on white): open book reading cozy library — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"book\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "answer": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"answer\" clearly on white canvas. PROPS (grounded on white): student answering question in classroom — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"answer\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "between": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"between\" clearly on white canvas. PROPS (grounded on white): person standing between two trees — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"between\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "children": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"children\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"children\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "may": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"may\" clearly on white canvas. PROPS (grounded on white): calendar page may month — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"may\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "war": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"war\" clearly on white canvas. PROPS (grounded on white): anti war peace dove symbol white bird — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"war\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "hurry": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"hurry\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hurry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "fact": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"fact\" clearly on white canvas. PROPS (grounded on white): checked facts list on clipboard — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fact\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "brought": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"brought\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"brought\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "clear": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"clear\" clearly on white canvas. PROPS (grounded on white): clear blue sky after rain — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"clear\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "bet": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"bet\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bet\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "glad": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"glad\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"glad\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "daughter": {
    "cast": [
      "monkey",
      "crocodile"
    ],
    "scene": "ONLY purple monkey and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"daughter\" clearly on white canvas. PROPS (grounded on white): daughter person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"daughter\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "june": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"june\" clearly on white canvas. PROPS (grounded on white): calendar page june month — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"june\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "outside": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"outside\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"outside\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "city": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"city\" clearly on white canvas. PROPS (grounded on white): city skyline aerial view buildings — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"city\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "full": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"full\" clearly on white canvas. PROPS (grounded on white): glass filled to brim with water — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"full\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "till": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"till\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"till\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sick": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sick\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sick\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "light": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"light\" clearly on white canvas. PROPS (grounded on white): sunlight window — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"light\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "july": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"july\" clearly on white canvas. PROPS (grounded on white): calendar page july month — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"july\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "shoot": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"shoot\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shoot\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "wonderful": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"wonderful\" clearly on white canvas. PROPS (grounded on white): happy satisfied person smiling achievement moment — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wonderful\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "save": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"save\" clearly on white canvas. PROPS (grounded on white): piggy bank saving money coins finance — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"save\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hour": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"hour\" clearly on white canvas. PROPS (grounded on white): clock hour time waiting office wall — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hour\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "country": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"country\" clearly on white canvas. PROPS (grounded on white): countryside green hills landscape flag — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"country\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "august": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"august\" clearly on white canvas. PROPS (grounded on white): calendar page august month — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"august\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "able": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"able\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"able\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "perfect": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"perfect\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"perfect\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "order": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"order\" clearly on white canvas. PROPS (grounded on white): order person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"order\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "september": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"september\" clearly on white canvas. PROPS (grounded on white): calendar page september month — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"september\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "alive": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"alive\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"alive\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "food": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"food\" clearly on white canvas. PROPS (grounded on white): healthy food plate — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"food\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "gentlemen": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"gentlemen\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gentlemen\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "luck": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"luck\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"luck\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "hair": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"hair\" clearly on white canvas. PROPS (grounded on white): hair salon styling mirror haircut — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hair\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "drive": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"drive\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"drive\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "promise": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"promise\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"promise\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "sex": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sex\" clearly on white canvas. PROPS (grounded on white): gender symbols equality diversity people together — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sex\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "music": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"music\" clearly on white canvas. PROPS (grounded on white): person listening headphones enjoying music — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"music\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "october": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"october\" clearly on white canvas. PROPS (grounded on white): calendar page october month — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"october\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "ya": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"ya\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ya\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "power": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"power\" clearly on white canvas. PROPS (grounded on white): electric power lines sunset energy grid — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"power\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sort": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sort\" clearly on white canvas. PROPS (grounded on white): sorting laundry colors baskets organization home — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sort\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "special": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"special\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"special\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "serious": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"serious\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"serious\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "street": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"street\" clearly on white canvas. PROPS (grounded on white): busy city street crosswalk people — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"street\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "dance": {
    "cast": [
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY lime-green crocodile and orange tiger on plain white #FFFFFF — acting out the meaning of \"dance\" clearly on white canvas. PROPS (grounded on white): couple dance ballroom elegant motion — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dance\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hang": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"hang\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hang\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "november": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"november\" clearly on white canvas. PROPS (grounded on white): calendar page november month — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"november\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "touch": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"touch\" clearly on white canvas. PROPS (grounded on white): hand touching soft fabric — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"touch\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "team": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"team\" clearly on white canvas. PROPS (grounded on white): team huddle sports cooperation motivation circle — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"team\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "company": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"company\" clearly on white canvas. PROPS (grounded on white): team meeting office collaboration laptop — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"company\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "pull": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"pull\" clearly on white canvas. PROPS (grounded on white): person pulling suitcase airport travel walk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pull\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "plan": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"plan\" clearly on white canvas. PROPS (grounded on white): architect planning blueprint desk ruler pencil — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"plan\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sweet": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sweet\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sweet\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "coffee": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"coffee\" clearly on white canvas. PROPS (grounded on white): hot coffee cup morning table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"coffee\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "lucky": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"lucky\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lucky\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sound": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sound\" clearly on white canvas. PROPS (grounded on white): sound waves music speaker audio studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sound\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "safe": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"safe\" clearly on white canvas. PROPS (grounded on white): safe lock vault security metal bank — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"safe\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "date": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"date\" clearly on white canvas. PROPS (grounded on white): calendar date circled red marker planner — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"date\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "president": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"president\" clearly on white canvas. PROPS (grounded on white): presidential podium flags speech — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"president\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "himself": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"himself\" clearly on white canvas. PROPS (grounded on white): man looking at himself in mirror — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"himself\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "seem": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"seem\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"seem\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "air": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"air\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"air\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "picture": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"picture\" clearly on white canvas. PROPS (grounded on white): picture frame wall home decor interior — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"picture\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "fast": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"fast\" clearly on white canvas. PROPS (grounded on white): fast car speed — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fast\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "perhaps": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"perhaps\" clearly on white canvas. PROPS (grounded on white): person thinking uncertain chin hand — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"perhaps\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "catch": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"catch\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"catch\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "ride": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"ride\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ride\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "win": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"win\" clearly on white canvas. PROPS (grounded on white): winner trophy celebration victory sport team happy — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"win\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "top": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"top\" clearly on white canvas. PROPS (grounded on white): mountain top summit view achievement flag peak — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"top\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "dream": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"dream\" clearly on white canvas. PROPS (grounded on white): person dreaming sleep peaceful bedroom — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dream\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sign": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sign\" clearly on white canvas. PROPS (grounded on white): road sign traffic direction street urban — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sign\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sense": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sense\" clearly on white canvas. PROPS (grounded on white): five senses icons taste smell touch chart — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sense\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "beat": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"beat\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"beat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "control": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"control\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"control\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "drop": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"drop\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"drop\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "cold": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"cold\" clearly on white canvas. PROPS (grounded on white): cold winter snow — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cold\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "darling": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"darling\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"darling\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "figure": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"figure\" clearly on white canvas. PROPS (grounded on white): human figure silhouette sunset beach — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"figure\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "king": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"king\" clearly on white canvas. PROPS (grounded on white): chess king piece strategy board game — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"king\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "poor": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"poor\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"poor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "throw": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"throw\" clearly on white canvas. PROPS (grounded on white): person throwing frisbee park outdoor fun action — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"throw\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "write": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"write\" clearly on white canvas. PROPS (grounded on white): person writing in notebook at desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"write\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "suppose": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"suppose\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"suppose\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "small": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"small\" clearly on white canvas. PROPS (grounded on white): small kitten — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"small\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "human": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"human\" clearly on white canvas. PROPS (grounded on white): diverse people faces together portrait — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"human\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "piece": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"piece\" clearly on white canvas. PROPS (grounded on white): jigsaw puzzle piece fitting together hands — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"piece\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "boss": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"boss\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"boss\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hospital": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"hospital\" clearly on white canvas. PROPS (grounded on white): hospital building healthcare medical entrance — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hospital\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "uncle": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"uncle\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"uncle\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "past": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"past\" clearly on white canvas. PROPS (grounded on white): old photo album memories vintage nostalgic — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"past\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "follow": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"follow\" clearly on white canvas. PROPS (grounded on white): people walking one following another on sidewalk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"follow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "movie": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"movie\" clearly on white canvas. PROPS (grounded on white): cinema movie theater popcorn screen dark — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"movie\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "straight": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"straight\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"straight\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "weren": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"weren\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"weren\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "clean": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"clean\" clearly on white canvas. PROPS (grounded on white): clean tidy room — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"clean\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "kiss": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY purple monkey and orange tiger on plain white #FFFFFF — acting out the meaning of \"kiss\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"kiss\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "feet": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"feet\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"feet\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "million": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"million\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"million\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "lie": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"lie\" clearly on white canvas. PROPS (grounded on white): person telling lie with guilty nervous expression — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lie\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "step": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"step\" clearly on white canvas. PROPS (grounded on white): footsteps stairs climbing upward progress path — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"step\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "learn": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"learn\" clearly on white canvas. PROPS (grounded on white): student studying books — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"learn\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "fall": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"fall\" clearly on white canvas. PROPS (grounded on white): autumn fall leaves forest orange — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fall\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "bill": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"bill\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bill\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "class": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"class\" clearly on white canvas. PROPS (grounded on white): classroom students desks teacher board — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"class\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "quiet": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"quiet\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"quiet\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "goodbye": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"goodbye\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"goodbye\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "law": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"law\" clearly on white canvas. PROPS (grounded on white): law scales justice courthouse columns — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"law\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "become": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"become\" clearly on white canvas. PROPS (grounded on white): caterpillar becoming butterfly transformation — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"become\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "general": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"general\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"general\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "rather": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"rather\" clearly on white canvas. PROPS (grounded on white): person choosing between two coffee cups — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rather\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "possible": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"possible\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"possible\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "goddamn": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"goddamn\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"goddamn\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "unless": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"unless\" clearly on white canvas. PROPS (grounded on white): rain storm window person staying indoors — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"unless\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "mad": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"mad\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mad\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "murder": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"murder\" clearly on white canvas. PROPS (grounded on white): murder person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"murder\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "road": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"road\" clearly on white canvas. PROPS (grounded on white): empty road countryside travel adventure horizon — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"road\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "eye": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"eye\" clearly on white canvas. PROPS (grounded on white): human eye closeup iris detail — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"eye\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "except": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"except\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"except\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "somewhere": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"somewhere\" clearly on white canvas. PROPS (grounded on white): open country road leading distant hills — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"somewhere\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "explain": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"explain\" clearly on white canvas. PROPS (grounded on white): teacher explaining lesson whiteboard — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"explain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "less": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"less\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"less\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "none": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"none\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"none\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "secret": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"secret\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"secret\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "wear": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"wear\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wear\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "worth": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"worth\" clearly on white canvas. PROPS (grounded on white): worth value coins savings jar financial planning — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"worth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "act": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"act\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"act\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "quick": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"quick\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"quick\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "handle": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"handle\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"handle\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "pass": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"pass\" clearly on white canvas. PROPS (grounded on white): mountain pass road winding scenic drive — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pass\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "report": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"report\" clearly on white canvas. PROPS (grounded on white): news reporter microphone live broadcast — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"report\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "state": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"state\" clearly on white canvas. PROPS (grounded on white): state map usa geography highlighted region — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"state\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "busy": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"busy\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"busy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "table": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"table\" clearly on white canvas. PROPS (grounded on white): wooden dining table set family home interior — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"table\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "wake": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"wake\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wake\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "ball": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"ball\" clearly on white canvas. PROPS (grounded on white): soccer ball grass field sport — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ball\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "major": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"major\" clearly on white canvas. PROPS (grounded on white): major person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"major\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "mouth": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"mouth\" clearly on white canvas. PROPS (grounded on white): smile mouth teeth happy laughing closeup — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mouth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "marry": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"marry\" clearly on white canvas. PROPS (grounded on white): wedding rings on hands ceremony — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"marry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "fault": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"fault\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fault\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "lunch": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"lunch\" clearly on white canvas. PROPS (grounded on white): healthy lunch box office desk meal — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lunch\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "lieutenant": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"lieutenant\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lieutenant\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "expect": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"expect\" clearly on white canvas. PROPS (grounded on white): person waiting looking at watch — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"expect\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "mama": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"mama\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mama\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "future": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"future\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"future\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "paper": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"paper\" clearly on white canvas. PROPS (grounded on white): white paper blank sheet desk pen — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"paper\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "hotel": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"hotel\" clearly on white canvas. PROPS (grounded on white): hotel lobby reception travel luggage — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hotel\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "buddy": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"buddy\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"buddy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "agent": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"agent\" clearly on white canvas. PROPS (grounded on white): real estate agent showing house keys — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"agent\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "american": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"american\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"american\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "mistake": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"mistake\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mistake\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "tv": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"tv\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tv\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "wedding": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"wedding\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wedding\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "weird": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"weird\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"weird\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "court": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"court\" clearly on white canvas. PROPS (grounded on white): basketball court game sport indoor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"court\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "floor": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"floor\" clearly on white canvas. PROPS (grounded on white): wooden floor interior home clean — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"floor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "earth": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"earth\" clearly on white canvas. PROPS (grounded on white): planet earth globe environment nature — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"earth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "dude": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"dude\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dude\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "finish": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"finish\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"finish\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "ship": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"ship\" clearly on white canvas. PROPS (grounded on white): cargo ship ocean freight transport sailing — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ship\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "club": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"club\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"club\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "attention": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"attention\" clearly on white canvas. PROPS (grounded on white): raised hand classroom student question — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"attention\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "pain": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"pain\" clearly on white canvas. PROPS (grounded on white): person holding knee pain injury support — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "th": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"th\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"th\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "blow": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"blow\" clearly on white canvas. PROPS (grounded on white): person blowing birthday candles — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"blow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "ls": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"ls\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ls\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "birthday": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"birthday\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"birthday\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "stick": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"stick\" clearly on white canvas. PROPS (grounded on white): walking stick hike mountain trail outdoor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stick\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "relax": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"relax\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"relax\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "yesterday": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"yesterday\" clearly on white canvas. PROPS (grounded on white): calendar yesterday date crossed planner reflection journal — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"yesterday\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "honor": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"honor\" clearly on white canvas. PROPS (grounded on white): honor person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"honor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "smart": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"smart\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"smart\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "colonel": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"colonel\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"colonel\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "boat": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"boat\" clearly on white canvas. PROPS (grounded on white): small boat lake calm water rowing — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"boat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "month": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"month\" clearly on white canvas. PROPS (grounded on white): calendar month planner schedule organizer — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"month\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "train": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"train\" clearly on white canvas. PROPS (grounded on white): train station — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"train\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "fair": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"fair\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fair\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "security": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"security\" clearly on white canvas. PROPS (grounded on white): secur concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"security\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "cover": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"cover\" clearly on white canvas. PROPS (grounded on white): book cover design magazine stack — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cover\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "across": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"across\" clearly on white canvas. PROPS (grounded on white): person walking across street — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"across\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "bag": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"bag\" clearly on white canvas. PROPS (grounded on white): leather handbag shopping city street — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bag\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "terrible": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"terrible\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"terrible\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "song": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"song\" clearly on white canvas. PROPS (grounded on white): singer microphone music studio recording song — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"song\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "spend": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"spend\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"spend\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "horse": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"horse\" clearly on white canvas. PROPS (grounded on white): horse riding meadow countryside gallop — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"horse\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sell": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sell\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sell\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "return": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"return\" clearly on white canvas. PROPS (grounded on white): product return store counter customer service — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"return\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "message": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"message\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"message\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "system": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"system\" clearly on white canvas. PROPS (grounded on white): computer system network servers technology data center — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"system\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "afternoon": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"afternoon\" clearly on white canvas. PROPS (grounded on white):  sunny afternoon park bench shade — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"afternoon\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "tough": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"tough\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tough\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "count": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"count\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"count\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "box": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"box\" clearly on white canvas. PROPS (grounded on white): cardboard box package delivery doorstep — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"box\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "present": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"present\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"present\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "charge": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"charge\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"charge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "information": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"information\" clearly on white canvas. PROPS (grounded on white): informa concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"information\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "fool": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"fool\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fool\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "simple": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"simple\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"simple\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "middle": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"middle\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"middle\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "calm": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"calm\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"calm\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "surprise": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"surprise\" clearly on white canvas. PROPS (grounded on white): surprise gift box celebration party excited — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"surprise\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "forever": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"forever\" clearly on white canvas. PROPS (grounded on white): forever person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"forever\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "dark": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"dark\" clearly on white canvas. PROPS (grounded on white): dark night sky — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dark\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "anywhere": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"anywhere\" clearly on white canvas. PROPS (grounded on white): world map travel pins destinations — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"anywhere\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "swear": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"swear\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"swear\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "land": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"land\" clearly on white canvas. PROPS (grounded on white): airplane landing runway airport travel — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"land\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "master": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"master\" clearly on white canvas. PROPS (grounded on white): master person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"master\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "dress": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"dress\" clearly on white canvas. PROPS (grounded on white): elegant dress fashion model studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dress\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "strong": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"strong\" clearly on white canvas. PROPS (grounded on white): strong person lifting weights gym fitness — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"strong\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "key": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"key\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"key\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "fix": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"fix\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fix\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "strange": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"strange\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"strange\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "voice": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"voice\" clearly on white canvas. PROPS (grounded on white): singer recording voice microphone studio music — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"voice\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "rock": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"rock\" clearly on white canvas. PROPS (grounded on white): rock climbing outdoor sport adventure cliff — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rock\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "cop": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"cop\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cop\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "window": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"window\" clearly on white canvas. PROPS (grounded on white): window rain drops cozy interior view outside — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"window\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "bar": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"bar\" clearly on white canvas. PROPS (grounded on white): coffee bar counter espresso machine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bar\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "appreciate": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"appreciate\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"appreciate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "army": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"army\" clearly on white canvas. PROPS (grounded on white): soldiers marching uniform formation — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"army\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "short": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"short\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"short\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "record": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"record\" clearly on white canvas. PROPS (grounded on white): vinyl record spinning on turntable — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"record\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "card": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"card\" clearly on white canvas. PROPS (grounded on white): credit card payment shopping checkout — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"card\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "certain": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"certain\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"certain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "college": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"college\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"college\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "evidence": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"evidence\" clearly on white canvas. PROPS (grounded on white): court evidence folder documents — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"evidence\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "bank": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"bank\" clearly on white canvas. PROPS (grounded on white): bank building finance city exterior — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bank\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "history": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"history\" clearly on white canvas. PROPS (grounded on white): old history books antique library archive — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"history\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "born": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"born\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"born\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "proud": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"proud\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"proud\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "fish": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"fish\" clearly on white canvas. PROPS (grounded on white): fish swimming aquarium underwater blue — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fish\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "join": {
    "cast": [
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY lime-green crocodile and orange tiger on plain white #FFFFFF — acting out the meaning of \"join\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"join\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "lead": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"lead\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lead\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "smell": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"smell\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"smell\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "near": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"near\" clearly on white canvas. PROPS (grounded on white): house near lake — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"near\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "apartment": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"apartment\" clearly on white canvas. PROPS (grounded on white): modern apartment living room interior — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"apartment\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "enjoy": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"enjoy\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"enjoy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "situation": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"situation\" clearly on white canvas. PROPS (grounded on white): situa concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"situation\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "trip": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"trip\" clearly on white canvas. PROPS (grounded on white): road trip car highway adventure friends fun — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"trip\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "mark": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"mark\" clearly on white canvas. PROPS (grounded on white): red mark highlighter document important text — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mark\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "star": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"star\" clearly on white canvas. PROPS (grounded on white): night sky stars milky way astronomy dark — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"star\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "accident": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"accident\" clearly on white canvas. PROPS (grounded on white): car accident traffic road emergency — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"accident\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "imagine": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"imagine\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"imagine\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "doc": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"doc\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"doc\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "pleasure": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"pleasure\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pleasure\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "ought": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"ought\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ought\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "rich": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"rich\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rich\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "service": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"service\" clearly on white canvas. PROPS (grounded on white): customer service headset support agent smile — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"service\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "entire": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"entire\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"entire\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "difference": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"difference\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"difference\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "judge": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"judge\" clearly on white canvas. PROPS (grounded on white): judge gavel courtroom law justice — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"judge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "ice": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"ice\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ice\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "lawyer": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"lawyer\" clearly on white canvas. PROPS (grounded on white): lawyer person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lawyer\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "fat": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"fat\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "alright": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"alright\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"alright\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "instead": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"instead\" clearly on white canvas. PROPS (grounded on white): swap exchange two different products hands — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"instead\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "age": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"age\" clearly on white canvas. PROPS (grounded on white): birthday cake candles aging celebration — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"age\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "realize": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"realize\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"realize\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "gold": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"gold\" clearly on white canvas. PROPS (grounded on white): gold bars wealth finance shiny — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gold\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "seat": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"seat\" clearly on white canvas. PROPS (grounded on white): empty seat train window travel waiting — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"seat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "summer": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"summer\" clearly on white canvas. PROPS (grounded on white): summer beach sunshine vacation tropical palm — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"summer\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "mess": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"mess\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mess\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "chief": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"chief\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"chief\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "radio": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"radio\" clearly on white canvas. PROPS (grounded on white): vintage radio music retro device wooden — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"radio\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "hungry": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"hungry\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hungry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "marriage": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"marriage\" clearly on white canvas. PROPS (grounded on white): wedding couple rings ceremony flowers — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"marriage\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "brain": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"brain\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"brain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "soul": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"soul\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"soul\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "forgive": {
    "cast": [
      "elephant",
      "monkey"
    ],
    "scene": "ONLY pink elephant and purple monkey on plain white #FFFFFF — acting out the meaning of \"forgive\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"forgive\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "drunk": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"drunk\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"drunk\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "deep": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"deep\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"deep\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "girlfriend": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"girlfriend\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"girlfriend\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "slow": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"slow\" clearly on white canvas. PROPS (grounded on white): snail slow — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"slow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "private": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"private\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"private\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "attack": {
    "cast": [
      "tiger",
      "monkey"
    ],
    "scene": "ONLY orange tiger and purple monkey on plain white #FFFFFF — acting out the meaning of \"attack\" clearly on white canvas. PROPS (grounded on white): self defense martial arts training — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"attack\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs. Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "beer": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"beer\" clearly on white canvas. PROPS (grounded on white): glass beer pub restaurant table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"beer\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "partner": {
    "cast": [
      "elephant",
      "tiger"
    ],
    "scene": "ONLY pink elephant and orange tiger on plain white #FFFFFF — acting out the meaning of \"partner\" clearly on white canvas. PROPS (grounded on white): partner person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"partner\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "area": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"area\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"area\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "dangerous": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"dangerous\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dangerous\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "offer": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"offer\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"offer\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "scene": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"scene\" clearly on white canvas. PROPS (grounded on white): movie scene filming camera set production — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"scene\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "third": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"third\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"third\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "upset": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"upset\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"upset\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "bus": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"bus\" clearly on white canvas. PROPS (grounded on white): city bus public transport street — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bus\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "owe": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"owe\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"owe\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "english": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"english\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"english\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "group": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"group\" clearly on white canvas. PROPS (grounded on white): diverse group people team together smiling — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"group\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "ln": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"ln\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ln\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "kick": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"kick\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"kick\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "evil": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"evil\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"evil\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "joke": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"joke\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"joke\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "truck": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"truck\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"truck\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "teach": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"teach\" clearly on white canvas. PROPS (grounded on white): teacher classroom — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"teach\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "ground": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"ground\" clearly on white canvas. PROPS (grounded on white): ground soil earth gardening hands — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ground\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "cash": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"cash\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cash\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "forward": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"forward\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"forward\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "boyfriend": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"boyfriend\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"boyfriend\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "park": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"park\" clearly on white canvas. PROPS (grounded on white): city park bench trees green relaxing — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"park\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "single": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"single\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"single\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "position": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"position\" clearly on white canvas. PROPS (grounded on white): yoga position balance exercise mat studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"position\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "respect": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"respect\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"respect\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "crime": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"crime\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"crime\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "public": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"public\" clearly on white canvas. PROPS (grounded on white): public transport bus city commuters crowd — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"public\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "grab": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"grab\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"grab\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "art": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"art\" clearly on white canvas. PROPS (grounded on white): art gallery painting museum wall — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"art\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "favor": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"favor\" clearly on white canvas. PROPS (grounded on white): favor person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"favor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "wall": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"wall\" clearly on white canvas. PROPS (grounded on white): brick wall texture pattern urban background detail — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wall\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "force": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"force\" clearly on white canvas. PROPS (grounded on white): strong wind tree bending force nature — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"force\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "jail": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"jail\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"jail\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "push": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"push\" clearly on white canvas. PROPS (grounded on white): person pushing shopping cart supermarket aisle — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"push\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "prove": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"prove\" clearly on white canvas. PROPS (grounded on white): legal proof document certificate — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"prove\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "normal": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"normal\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"normal\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "protect": {
    "cast": [
      "elephant",
      "tiger"
    ],
    "scene": "ONLY pink elephant and orange tiger on plain white #FFFFFF — acting out the meaning of \"protect\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"protect\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "machine": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"machine\" clearly on white canvas. PROPS (grounded on white): industrial machine factory production gear — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"machine\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "field": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"field\" clearly on white canvas. PROPS (grounded on white): green field wheat agriculture horizon — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"field\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "jump": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"jump\" clearly on white canvas. PROPS (grounded on white): person jumping trampoline fun action air — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"jump\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "nose": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"nose\" clearly on white canvas. PROPS (grounded on white): dog nose closeup smell sniff macro — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nose\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hide": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"hide\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hide\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sun": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sun\" clearly on white canvas. PROPS (grounded on white): bright sun sky sunshine warm golden light — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sun\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "church": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"church\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"church\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "peace": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"peace\" clearly on white canvas. PROPS (grounded on white): dove peace symbol white bird sky — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"peace\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "professor": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"professor\" clearly on white canvas. PROPS (grounded on white): professor person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"professor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "share": {
    "cast": [
      "monkey",
      "crocodile"
    ],
    "scene": "ONLY purple monkey and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"share\" clearly on white canvas. PROPS (grounded on white): sharing food friends picnic divide plate — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"share\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "french": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"french\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"french\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "billy": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"billy\" clearly on white canvas. PROPS (grounded on white): candid daily life street photography person walking — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"billy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "fear": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"fear\" clearly on white canvas. PROPS (grounded on white): person afraid dark shadow nervous — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fear\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "la": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"la\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"la\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "tape": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"tape\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tape\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "suit": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"suit\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"suit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "gas": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"gas\" clearly on white canvas. PROPS (grounded on white): gas station fuel pump car refuel — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gas\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "relationship": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"relationship\" clearly on white canvas. PROPS (grounded on white): relation relationship people together — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"relationship\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "neither": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"neither\" clearly on white canvas. PROPS (grounded on white): neither person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"neither\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "pop": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"pop\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pop\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "nervous": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"nervous\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nervous\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "whether": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"whether\" clearly on white canvas. PROPS (grounded on white): person choosing between two options hands — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"whether\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "round": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"round\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"round\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "dirty": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"dirty\" clearly on white canvas. PROPS (grounded on white): dirty muddy shoes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dirty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "cat": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"cat\" clearly on white canvas. PROPS (grounded on white): cat sitting window sunlight pet — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "breakfast": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"breakfast\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"breakfast\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "idiot": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"idiot\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"idiot\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "space": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"space\" clearly on white canvas. PROPS (grounded on white): outer space stars galaxy universe dark — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"space\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "prison": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"prison\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"prison\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "carry": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"carry\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"carry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "cry": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"cry\" clearly on white canvas. PROPS (grounded on white): person crying tears emotional closeup — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "bastard": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"bastard\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bastard\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "smoke": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"smoke\" clearly on white canvas. PROPS (grounded on white): smoke steam coffee cup morning warm — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"smoke\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "arm": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"arm\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"arm\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "film": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"film\" clearly on white canvas. PROPS (grounded on white): movie film clapperboard cinema production — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"film\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "government": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"government\" clearly on white canvas. PROPS (grounded on white): govern concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"government\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "tree": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"tree\" clearly on white canvas. PROPS (grounded on white): large tree green park shade nature sunlight — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tree\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "contact": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"contact\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"contact\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "knock": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"knock\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"knock\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "agree": {
    "cast": [
      "elephant",
      "crocodile"
    ],
    "scene": "ONLY pink elephant and lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"agree\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"agree\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible. Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "pardon": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"pardon\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pardon\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "gift": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"gift\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gift\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "south": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"south\" clearly on white canvas. PROPS (grounded on white): compass south navigation map travel direction — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"south\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sake": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sake\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sake\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sweetheart": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sweetheart\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sweetheart\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "board": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"board\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"board\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "north": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"north\" clearly on white canvas. PROPS (grounded on white): compass north direction navigation map travel — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"north\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "department": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"department\" clearly on white canvas. PROPS (grounded on white): depart concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"department\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "patient": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"patient\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"patient\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "awful": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"awful\" clearly on white canvas. PROPS (grounded on white): happy satisfied person smiling achievement moment — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"awful\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "sad": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"sad\" clearly on white canvas. PROPS (grounded on white): sad person face — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sad\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "roll": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"roll\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"roll\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "grand": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"grand\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"grand\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sergeant": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sergeant\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sergeant\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "laugh": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"laugh\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"laugh\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "doubt": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"doubt\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"doubt\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "upon": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"upon\" clearly on white canvas. PROPS (grounded on white): cat sitting on sofa — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"upon\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "double": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"double\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"double\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "twice": {
    "cast": [
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY lime-green crocodile and orange tiger on plain white #FFFFFF — acting out the meaning of \"twice\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"twice\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "outta": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"outta\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"outta\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "plenty": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"plenty\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"plenty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "guilty": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"guilty\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"guilty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "race": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"race\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"race\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "crap": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"crap\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"crap\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "chicken": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"chicken\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"chicken\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "bathroom": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"bathroom\" clearly on white canvas. PROPS (grounded on white): clean modern bathroom sink mirror — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bathroom\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "spot": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"spot\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"spot\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "weekend": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"weekend\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"weekend\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "detective": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"detective\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"detective\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "action": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"action\" clearly on white canvas. PROPS (grounded on white): ac concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"action\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sheriff": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sheriff\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sheriff\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "glass": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"glass\" clearly on white canvas. PROPS (grounded on white): water glass clear table refreshment — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"glass\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "type": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"type\" clearly on white canvas. PROPS (grounded on white): keyboard typing laptop work office hands closeup — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"type\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "experience": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"experience\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"experience\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "west": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"west\" clearly on white canvas. PROPS (grounded on white): western sunset desert cactus golden hour landscape — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"west\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "press": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"press\" clearly on white canvas. PROPS (grounded on white): newspaper press printing media journalism office — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"press\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "difficult": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"difficult\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"difficult\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sea": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sea\" clearly on white canvas. PROPS (grounded on white): calm sea horizon blue water boat sailing — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sea\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "flight": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"flight\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"flight\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "neck": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"neck\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"neck\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "grow": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"grow\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"grow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "mention": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"mention\" clearly on white canvas. PROPS (grounded on white): men concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mention\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "favorite": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"favorite\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"favorite\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "wind": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"wind\" clearly on white canvas. PROPS (grounded on white): wind turbine renewable energy field sky clouds — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wind\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "notice": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"notice\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"notice\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "admit": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"admit\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"admit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "extra": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"extra\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"extra\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "within": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"within\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"within\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "low": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"low\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"low\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "impossible": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"impossible\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"impossible\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "gay": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"gay\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gay\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "computer": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"computer\" clearly on white canvas. PROPS (grounded on white): laptop computer desk workspace modern — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"computer\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "angry": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"angry\" clearly on white canvas. PROPS (grounded on white): angry person face — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"angry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "bunch": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"bunch\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bunch\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "blame": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"blame\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"blame\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "visit": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"visit\" clearly on white canvas. PROPS (grounded on white): visit friends welcome door greeting smile home — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"visit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "clock": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"clock\" clearly on white canvas. PROPS (grounded on white): wall clock time office interior — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"clock\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "tea": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"tea\" clearly on white canvas. PROPS (grounded on white): hot tea cup steam cozy morning window — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tea\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "fellow": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"fellow\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fellow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "kitchen": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"kitchen\" clearly on white canvas. PROPS (grounded on white): modern kitchen cooking food preparation — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"kitchen\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "lay": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"lay\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lay\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "hole": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"hole\" clearly on white canvas. PROPS (grounded on white): hole in ground — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hole\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "guard": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"guard\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"guard\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "smile": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"smile\" clearly on white canvas. PROPS (grounded on white): genuine smile portrait happy person closeup — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"smile\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "fit": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"fit\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "pal": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"pal\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pal\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "bear": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"bear\" clearly on white canvas. PROPS (grounded on white): brown bear forest wildlife nature — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bear\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "often": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"often\" clearly on white canvas. PROPS (grounded on white): person watering plants routine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"often\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "wild": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"wild\" clearly on white canvas. PROPS (grounded on white): wild lion — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wild\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "camera": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"camera\" clearly on white canvas. PROPS (grounded on white): camera photography dslr hands — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"camera\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "begin": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"begin\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"begin\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "reach": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"reach\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"reach\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "beach": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"beach\" clearly on white canvas. PROPS (grounded on white): sandy beach ocean waves sunny day — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"beach\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "heaven": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"heaven\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"heaven\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "lock": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"lock\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lock\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "leg": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"leg\" clearly on white canvas. PROPS (grounded on white): running legs marathon sport motion — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"leg\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "kelly": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"kelly\" clearly on white canvas. PROPS (grounded on white): candid daily life street photography person walking — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"kelly\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "track": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"track\" clearly on white canvas. PROPS (grounded on white): running track athlete training sport stadium lanes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"track\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "ridiculous": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"ridiculous\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ridiculous\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "river": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"river\" clearly on white canvas. PROPS (grounded on white): river flowing forest landscape peaceful water — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"river\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "dare": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"dare\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dare\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "burn": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"burn\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"burn\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "raise": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"raise\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"raise\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "aunt": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"aunt\" clearly on white canvas. PROPS (grounded on white): family aunt niece hug smiling — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"aunt\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "decision": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"decision\" clearly on white canvas. PROPS (grounded on white): crossroads fork path choice decision — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"decision\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "cross": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"cross\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cross\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "cost": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"cost\" clearly on white canvas. PROPS (grounded on white): price tag shopping cost money receipt — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cost\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "queen": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"queen\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"queen\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "fresh": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"fresh\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fresh\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "innocent": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"innocent\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"innocent\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "emergency": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"emergency\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"emergency\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "medical": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"medical\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"medical\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "cell": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"cell\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cell\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "bomb": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"bomb\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bomb\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "note": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"note\" clearly on white canvas. PROPS (grounded on white): sticky notes reminder board planning office — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"note\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "shop": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"shop\" clearly on white canvas. PROPS (grounded on white): small shop storefront street local business — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shop\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "band": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"band\" clearly on white canvas. PROPS (grounded on white): live music band concert stage lights — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"band\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "price": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"price\" clearly on white canvas. PROPS (grounded on white): price tag retail shopping store sale — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"price\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "steal": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"steal\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"steal\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "waste": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"waste\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"waste\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "client": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"client\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"client\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "pressure": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"pressure\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pressure\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "code": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"code\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"code\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "accept": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"accept\" clearly on white canvas. PROPS (grounded on white): handshake accepting job offer — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"accept\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "further": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"further\" clearly on white canvas. PROPS (grounded on white): further person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"further\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "excellent": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"excellent\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"excellent\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "magic": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"magic\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"magic\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "corner": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"corner\" clearly on white canvas. PROPS (grounded on white): corner person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"corner\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "consider": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"consider\" clearly on white canvas. PROPS (grounded on white): person thinking chin hand decision — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"consider\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "ourselves": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"ourselves\" clearly on white canvas. PROPS (grounded on white): friends taking a selfie together — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ourselves\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "herself": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"herself\" clearly on white canvas. PROPS (grounded on white): woman looking at herself in mirror — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"herself\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "address": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"address\" clearly on white canvas. PROPS (grounded on white): envelope home address mail delivery — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"address\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "warm": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"warm\" clearly on white canvas. PROPS (grounded on white): warm blanket cozy fireplace winter home comfort — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"warm\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "pregnant": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"pregnant\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pregnant\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "hall": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"hall\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hall\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "treat": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"treat\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"treat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "everywhere": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"everywhere\" clearly on white canvas. PROPS (grounded on white): busy city street crowd people walking — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"everywhere\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "van": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"van\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"van\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "complete": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"complete\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"complete\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "cup": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"cup\" clearly on white canvas. PROPS (grounded on white): ceramic coffee cup steam morning — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cup\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "level": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"level\" clearly on white canvas. PROPS (grounded on white): spirit level tool construction straight line — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"level\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "witness": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"witness\" clearly on white canvas. PROPS (grounded on white): wit concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"witness\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "taste": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"taste\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"taste\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "camp": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"camp\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"camp\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "beg": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"beg\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"beg\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "duty": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"duty\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"duty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "tight": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"tight\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tight\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "bottle": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"bottle\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bottle\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "support": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"support\" clearly on white canvas. PROPS (grounded on white): hands supporting stacked books together — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"support\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "decide": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"decide\" clearly on white canvas. PROPS (grounded on white): person choosing between two doors — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"decide\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "moon": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"moon\" clearly on white canvas. PROPS (grounded on white): full moon night sky stars dark — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"moon\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "bottom": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"bottom\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bottom\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "conversation": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"conversation\" clearly on white canvas. PROPS (grounded on white): two people conversation cafe table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"conversation\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "hero": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"hero\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hero\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "asleep": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"asleep\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"asleep\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "final": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"final\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"final\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "continue": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"continue\" clearly on white canvas. PROPS (grounded on white): hiker continuing path through forest — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"continue\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "east": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"east\" clearly on white canvas. PROPS (grounded on white): sunrise east horizon golden sky — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"east\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "match": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"match\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"match\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "apologize": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"apologize\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"apologize\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "trial": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"trial\" clearly on white canvas. PROPS (grounded on white): court trial judge gavel law justice scales — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"trial\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "spirit": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"spirit\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"spirit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "chair": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"chair\" clearly on white canvas. PROPS (grounded on white): wooden chair empty room minimal — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"chair\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "risk": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"risk\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"risk\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "study": {
    "cast": [
      "crocodile",
      "tiger"
    ],
    "scene": "ONLY lime-green crocodile and orange tiger on plain white #FFFFFF — acting out the meaning of \"study\" clearly on white canvas. PROPS (grounded on white): student study desk lamp books notes night — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"study\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs. Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "possibly": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"possibly\" clearly on white canvas. PROPS (grounded on white): candid daily life street photography person walking — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"possibly\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "rain": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"rain\" clearly on white canvas. PROPS (grounded on white): rain drops window glass storm weather city — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "above": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"above\" clearly on white canvas. PROPS (grounded on white): lamp hanging above table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"above\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "cousin": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"cousin\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cousin\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "cream": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"cream\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cream\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "memory": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"memory\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"memory\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "breathe": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"breathe\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"breathe\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "enemy": {
    "cast": [
      "tiger",
      "monkey"
    ],
    "scene": "ONLY orange tiger and purple monkey on plain white #FFFFFF — acting out the meaning of \"enemy\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"enemy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs. Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "huge": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"huge\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"huge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "search": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"search\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"search\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "beauty": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"beauty\" clearly on white canvas. PROPS (grounded on white): flower beauty nature soft petals macro — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"beauty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "rule": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"rule\" clearly on white canvas. PROPS (grounded on white): rule book law handbook desk official document — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rule\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "build": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"build\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"build\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "choose": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"choose\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"choose\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "advice": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"advice\" clearly on white canvas. PROPS (grounded on white): friendly advice conversation two people — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"advice\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "teeth": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"teeth\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"teeth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "victim": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"victim\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"victim\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "coach": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"coach\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"coach\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "crew": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"crew\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"crew\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "heavy": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"heavy\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"heavy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "trick": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"trick\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"trick\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "empty": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"empty\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"empty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "comfortable": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"comfortable\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"comfortable\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "destroy": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"destroy\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"destroy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "mission": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"mission\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mission\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "plus": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"plus\" clearly on white canvas. PROPS (grounded on white): plus sign addition math notebook — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"plus\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "pool": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"pool\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pool\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "dumb": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"dumb\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dumb\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "knife": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"knife\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"knife\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "weapon": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"weapon\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"weapon\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "restaurant": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"restaurant\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"restaurant\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "shirt": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"shirt\" clearly on white canvas. PROPS (grounded on white): folded shirt clothing store fashion retail — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shirt\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "faith": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"faith\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"faith\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "dig": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"dig\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dig\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "size": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"size\" clearly on white canvas. PROPS (grounded on white): measuring size tape tailor clothing fit — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"size\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "necessary": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"necessary\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"necessary\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "themselves": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"themselves\" clearly on white canvas. PROPS (grounded on white): kids admiring their own drawing — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"themselves\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "credit": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"credit\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"credit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "blind": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"blind\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"blind\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "center": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"center\" clearly on white canvas. PROPS (grounded on white): center person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"center\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "bridge": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"bridge\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bridge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "practice": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"practice\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"practice\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "discuss": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"discuss\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"discuss\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "mister": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"mister\" clearly on white canvas. PROPS (grounded on white): mister person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mister\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "grandma": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"grandma\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"grandma\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "cook": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"cook\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cook\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "ticket": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"ticket\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ticket\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "strike": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"strike\" clearly on white canvas. PROPS (grounded on white): bowling strike pins sport indoor alley — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"strike\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "stage": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"stage\" clearly on white canvas. PROPS (grounded on white): empty stage spotlight theater performance curtains — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stage\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "animal": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"animal\" clearly on white canvas. PROPS (grounded on white): cute animal wildlife nature closeup — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"animal\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "bird": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"bird\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bird\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sight": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sight\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sight\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "somehow": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"somehow\" clearly on white canvas. PROPS (grounded on white): person solving puzzle lightbulb idea — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"somehow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "drug": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"drug\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"drug\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "nature": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"nature\" clearly on white canvas. PROPS (grounded on white): nature forest trail hiking green trees — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nature\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "however": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"however\" clearly on white canvas. PROPS (grounded on white): surprised person unexpected change reaction — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"however\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "responsible": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"responsible\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"responsible\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "cake": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"cake\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cake\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "famous": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"famous\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"famous\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "nurse": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"nurse\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nurse\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "correct": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"correct\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"correct\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sky": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sky\" clearly on white canvas. PROPS (grounded on white): blue sky white clouds sunny day wide — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sky\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "account": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"account\" clearly on white canvas. PROPS (grounded on white): online banking account laptop screen — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"account\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "due": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"due\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"due\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "common": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"common\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"common\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "afford": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"afford\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"afford\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "tie": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"tie\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tie\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "chinese": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"chinese\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"chinese\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "bright": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"bright\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bright\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "allow": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"allow\" clearly on white canvas. PROPS (grounded on white): person action everyday activity candid photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"allow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "belong": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"belong\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"belong\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "escape": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"escape\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"escape\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "suspect": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"suspect\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"suspect\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "skin": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"skin\" clearly on white canvas. PROPS (grounded on white): skincare skin care cream spa treatment — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"skin\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "file": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"file\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"file\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "madam": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"madam\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"madam\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "fill": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"fill\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fill\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "operation": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"operation\" clearly on white canvas. PROPS (grounded on white): opera concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"operation\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "desk": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"desk\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"desk\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "aye": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"aye\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"aye\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "pack": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"pack\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pack\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "deserve": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"deserve\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"deserve\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "danger": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"danger\" clearly on white canvas. PROPS (grounded on white): warning sign danger cliff edge — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"danger\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "meat": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"meat\" clearly on white canvas. PROPS (grounded on white): grilled meat steak barbecue restaurant plate — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"meat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "command": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"command\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"command\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "whoever": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"whoever\" clearly on white canvas. PROPS (grounded on white): whoever person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"whoever\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "beyond": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"beyond\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"beyond\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "student": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots on plain white #FFFFFF — acting out the meaning of \"student\" clearly on white canvas. PROPS (grounded on white): student studying library books laptop focus — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"student\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "All four: expressive faces matching word meaning. Tiger: sphere only. Crocodile: log low. Elephant: stick arms visible. Monkey: two arms two legs only."
  },
  "dry": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"dry\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "jury": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"jury\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"jury\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "form": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"form\" clearly on white canvas. PROPS (grounded on white): application form pen signing document — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"form\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "northern": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"northern\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"northern\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "submarine": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"submarine\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"submarine\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "haul": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"haul\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"haul\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "strain": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"strain\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"strain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "compound": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"compound\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"compound\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "ridge": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"ridge\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ridge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "expose": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"expose\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"expose\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "european": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"european\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"european\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "gag": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"gag\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gag\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sector": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sector\" clearly on white canvas. PROPS (grounded on white): sector person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sector\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "herd": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"herd\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"herd\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "sentimental": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"sentimental\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sentimental\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "pursuit": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"pursuit\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pursuit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "strict": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"strict\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"strict\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "congratulate": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"congratulate\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"congratulate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "narrow": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"narrow\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"narrow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "compromise": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"compromise\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"compromise\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "length": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"length\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"length\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "cord": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"cord\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cord\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "guardian": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"guardian\" clearly on white canvas. PROPS (grounded on white): professional guardian worker portrait — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"guardian\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "mule": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"mule\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mule\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "plead": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"plead\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"plead\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "fax": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"fax\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fax\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "lonesome": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"lonesome\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lonesome\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "automatic": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"automatic\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"automatic\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "tobacco": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"tobacco\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tobacco\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "satisfaction": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"satisfaction\" clearly on white canvas. PROPS (grounded on white): satisfac concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"satisfaction\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "intimate": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"intimate\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"intimate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "shelf": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"shelf\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shelf\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "nun": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"nun\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nun\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "tolerate": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"tolerate\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tolerate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "subtle": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"subtle\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"subtle\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "household": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"household\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"household\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "volume": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"volume\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"volume\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "grease": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"grease\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"grease\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "hobby": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"hobby\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hobby\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "moonlight": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"moonlight\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"moonlight\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "semester": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"semester\" clearly on white canvas. PROPS (grounded on white): semester person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"semester\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "geek": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"geek\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"geek\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "resort": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"resort\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"resort\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "pervert": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"pervert\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pervert\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "myth": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"myth\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"myth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "fountain": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"fountain\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fountain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "crab": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"crab\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"crab\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "domestic": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"domestic\" clearly on white canvas. PROPS (grounded on white): airport terminal interior — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"domestic\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "teenager": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"teenager\" clearly on white canvas. PROPS (grounded on white): teenager person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"teenager\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "gravity": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"gravity\" clearly on white canvas. PROPS (grounded on white): grav concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gravity\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "label": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"label\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"label\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "razor": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"razor\" clearly on white canvas. PROPS (grounded on white): razor person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"razor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "pledge": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"pledge\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pledge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "bolt": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"bolt\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bolt\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "eager": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"eager\" clearly on white canvas. PROPS (grounded on white): eager person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"eager\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "messy": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"messy\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"messy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "slick": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"slick\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"slick\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "eighth": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"eighth\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"eighth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "dispatch": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"dispatch\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dispatch\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "electronic": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"electronic\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"electronic\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sorrow": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sorrow\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sorrow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "clearance": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"clearance\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"clearance\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "chow": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"chow\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"chow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "clamp": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"clamp\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"clamp\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "maintenance": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"maintenance\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"maintenance\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "mug": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"mug\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mug\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "shovel": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"shovel\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shovel\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "bean": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"bean\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bean\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "hardware": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"hardware\" clearly on white canvas. PROPS (grounded on white): software technology computer screen office — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hardware\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sensible": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sensible\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sensible\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "jackass": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"jackass\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"jackass\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "pose": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"pose\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pose\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "colleague": {
    "cast": [
      "monkey",
      "elephant"
    ],
    "scene": "ONLY purple monkey and pink elephant on plain white #FFFFFF — acting out the meaning of \"colleague\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"colleague\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs. Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "nickname": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"nickname\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nickname\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "anxiety": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"anxiety\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"anxiety\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "loop": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"loop\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"loop\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "african": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"african\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"african\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "theft": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"theft\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"theft\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "obligation": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"obligation\" clearly on white canvas. PROPS (grounded on white): obliga concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"obligation\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "med": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"med\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"med\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "psych": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"psych\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"psych\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "lottery": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"lottery\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lottery\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "psychological": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"psychological\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"psychological\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "driveway": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"driveway\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"driveway\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "confidential": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"confidential\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"confidential\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "negotiate": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"negotiate\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"negotiate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "online": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"online\" clearly on white canvas. PROPS (grounded on white): online newspaper headline media closeup — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"online\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "feast": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"feast\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"feast\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sponge": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sponge\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sponge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "preacher": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"preacher\" clearly on white canvas. PROPS (grounded on white): preacher person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"preacher\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "rabbi": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"rabbi\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rabbi\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "lodge": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"lodge\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lodge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "circuit": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"circuit\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"circuit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "leap": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"leap\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"leap\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "urge": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"urge\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"urge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "enforcement": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"enforcement\" clearly on white canvas. PROPS (grounded on white): enforce concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"enforcement\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "galaxy": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"galaxy\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"galaxy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "disagree": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"disagree\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"disagree\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "endless": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"endless\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"endless\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "inappropriate": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"inappropriate\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"inappropriate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "greedy": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"greedy\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"greedy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "element": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"element\" clearly on white canvas. PROPS (grounded on white): ele concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"element\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "feather": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"feather\" clearly on white canvas. PROPS (grounded on white): feather person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"feather\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "dot": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"dot\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dot\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "disk": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"disk\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"disk\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "bicycle": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"bicycle\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bicycle\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "withdraw": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"withdraw\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"withdraw\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "frequency": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"frequency\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"frequency\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "mattress": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"mattress\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mattress\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "democracy": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"democracy\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"democracy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "memo": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"memo\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"memo\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "melody": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"melody\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"melody\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "polly": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"polly\" clearly on white canvas. PROPS (grounded on white): candid daily life street photography person walking — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"polly\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "notion": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"notion\" clearly on white canvas. PROPS (grounded on white): no concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"notion\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "innocence": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"innocence\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"innocence\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "copper": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"copper\" clearly on white canvas. PROPS (grounded on white): copper person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"copper\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "coal": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"coal\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"coal\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "amateur": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"amateur\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"amateur\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "gown": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"gown\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gown\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "ninth": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"ninth\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ninth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "pregnancy": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"pregnancy\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pregnancy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "pier": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"pier\" clearly on white canvas. PROPS (grounded on white): skilled pier person activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pier\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "internet": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"internet\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"internet\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "salmon": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"salmon\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"salmon\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "architect": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"architect\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"architect\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "starboard": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"starboard\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"starboard\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "hike": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"hike\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hike\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "registration": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"registration\" clearly on white canvas. PROPS (grounded on white): registra concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"registration\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "gasoline": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"gasoline\" clearly on white canvas. PROPS (grounded on white): gasoline newspaper headline media closeup — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gasoline\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "detention": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"detention\" clearly on white canvas. PROPS (grounded on white): deten concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"detention\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "vain": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"vain\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"vain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "urine": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"urine\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"urine\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "beep": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"beep\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"beep\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "pronounce": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"pronounce\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pronounce\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "significant": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"significant\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"significant\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "riot": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"riot\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"riot\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "kidnap": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"kidnap\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"kidnap\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "laboratory": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"laboratory\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"laboratory\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "rehab": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"rehab\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rehab\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "airline": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"airline\" clearly on white canvas. PROPS (grounded on white): airline newspaper headline media closeup — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"airline\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "morphine": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"morphine\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"morphine\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "involve": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"involve\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"involve\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "choke": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"choke\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"choke\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "wardrobe": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"wardrobe\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wardrobe\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "granddaughter": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"granddaughter\" clearly on white canvas. PROPS (grounded on white): granddaughter person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"granddaughter\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "naive": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"naive\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"naive\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "growth": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"growth\" clearly on white canvas. PROPS (grounded on white): plant seedling growth soil green sprout — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"growth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "mustard": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"mustard\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mustard\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "mansion": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"mansion\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mansion\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "cheerleader": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"cheerleader\" clearly on white canvas. PROPS (grounded on white): cheerleader person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cheerleader\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "stew": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"stew\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stew\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "fart": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"fart\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fart\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "ram": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"ram\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ram\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "extend": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"extend\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"extend\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "pursue": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"pursue\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pursue\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "altogether": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"altogether\" clearly on white canvas. PROPS (grounded on white): altogether person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"altogether\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "drift": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"drift\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"drift\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "offensive": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"offensive\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"offensive\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "discharge": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"discharge\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"discharge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "click": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"click\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"click\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "ginger": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"ginger\" clearly on white canvas. PROPS (grounded on white): ginger person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ginger\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "luckily": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"luckily\" clearly on white canvas. PROPS (grounded on white): candid daily life street photography person walking — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"luckily\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "persuade": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"persuade\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"persuade\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "literature": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"literature\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"literature\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "psychotic": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"psychotic\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"psychotic\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "tech": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"tech\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tech\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "canal": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"canal\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"canal\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "carrier": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"carrier\" clearly on white canvas. PROPS (grounded on white): skilled carrier person activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"carrier\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "torpedo": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"torpedo\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"torpedo\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "initial": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"initial\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"initial\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "hereby": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"hereby\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hereby\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "purchase": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"purchase\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"purchase\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hay": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"hay\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hay\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "tribe": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"tribe\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tribe\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "earthquake": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"earthquake\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"earthquake\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "congressman": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"congressman\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"congressman\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "intact": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"intact\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"intact\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "frighten": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"frighten\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"frighten\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "wealth": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"wealth\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wealth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "chap": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"chap\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"chap\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "cereal": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"cereal\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cereal\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "bein": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"bein\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bein\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "peach": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"peach\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"peach\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "convict": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"convict\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"convict\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "surf": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"surf\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"surf\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "establish": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"establish\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"establish\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "outrageous": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"outrageous\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"outrageous\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "companion": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"companion\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"companion\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "underwater": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"underwater\" clearly on white canvas. PROPS (grounded on white): underwater person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"underwater\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "pond": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"pond\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pond\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "absence": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"absence\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"absence\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "tasty": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"tasty\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tasty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hairy": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"hairy\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hairy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "swiss": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"swiss\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"swiss\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "global": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"global\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"global\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "prophecy": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"prophecy\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"prophecy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "whew": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"whew\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"whew\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "elegant": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"elegant\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"elegant\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "bunk": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"bunk\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bunk\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "spark": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"spark\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"spark\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "lease": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"lease\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lease\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "syndrome": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"syndrome\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"syndrome\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "velvet": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"velvet\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"velvet\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "ignorant": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"ignorant\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ignorant\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "compassion": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"compassion\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"compassion\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "scenario": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"scenario\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"scenario\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "puke": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"puke\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"puke\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "bourbon": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"bourbon\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bourbon\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "overtime": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"overtime\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"overtime\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "define": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"define\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"define\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "straw": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"straw\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"straw\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "coverage": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"coverage\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"coverage\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "baggage": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"baggage\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"baggage\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "scrub": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"scrub\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"scrub\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sperm": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sperm\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sperm\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "explore": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"explore\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"explore\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "brat": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"brat\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"brat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "erase": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"erase\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"erase\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "breach": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"breach\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"breach\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "bluff": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"bluff\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bluff\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "cavalry": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"cavalry\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cavalry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "ashore": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"ashore\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ashore\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "unnecessary": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"unnecessary\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"unnecessary\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "bedtime": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"bedtime\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bedtime\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "overcome": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"overcome\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"overcome\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "alcoholic": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"alcoholic\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"alcoholic\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "stain": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"stain\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "wheelchair": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"wheelchair\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wheelchair\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "crib": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"crib\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"crib\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "elsewhere": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"elsewhere\" clearly on white canvas. PROPS (grounded on white): open road distant hills unknown destination — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"elsewhere\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "dental": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"dental\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dental\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "est": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"est\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"est\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "accountant": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"accountant\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"accountant\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "definite": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"definite\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"definite\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "starve": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"starve\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"starve\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "countess": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"countess\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"countess\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "acknowledge": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"acknowledge\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"acknowledge\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "elbow": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"elbow\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"elbow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "physician": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"physician\" clearly on white canvas. PROPS (grounded on white): professional physician worker portrait — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"physician\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "scam": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"scam\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"scam\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "platform": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"platform\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"platform\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "booty": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"booty\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"booty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "essay": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"essay\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"essay\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "heavily": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"heavily\" clearly on white canvas. PROPS (grounded on white): candid daily life street photography person walking — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"heavily\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "ironic": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"ironic\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ironic\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "pinch": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"pinch\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pinch\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "rendezvous": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"rendezvous\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rendezvous\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "stadium": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"stadium\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stadium\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "yen": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"yen\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"yen\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "stack": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"stack\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stack\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "unpleasant": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"unpleasant\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"unpleasant\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "vast": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"vast\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"vast\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "cloth": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"cloth\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cloth\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "bathtub": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"bathtub\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bathtub\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "lawsuit": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"lawsuit\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lawsuit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "investigator": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"investigator\" clearly on white canvas. PROPS (grounded on white): investigator person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"investigator\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "journalist": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"journalist\" clearly on white canvas. PROPS (grounded on white): professional journalist worker portrait — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"journalist\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "contain": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"contain\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"contain\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "fiction": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"fiction\" clearly on white canvas. PROPS (grounded on white): fic concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fiction\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "chorus": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"chorus\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"chorus\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "invention": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"invention\" clearly on white canvas. PROPS (grounded on white): inven concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"invention\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "ketchup": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"ketchup\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ketchup\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "es": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"es\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"es\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "antique": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"antique\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"antique\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sunrise": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sunrise\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sunrise\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "comb": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"comb\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"comb\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "encourage": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"encourage\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"encourage\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "bribe": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"bribe\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bribe\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "dash": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"dash\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dash\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "musician": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"musician\" clearly on white canvas. PROPS (grounded on white): professional musician worker portrait — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"musician\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "luxury": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"luxury\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"luxury\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "ahold": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"ahold\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ahold\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "mi": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"mi\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mi\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "passionate": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"passionate\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"passionate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "exotic": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"exotic\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"exotic\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "furious": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"furious\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"furious\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "voyage": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"voyage\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"voyage\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "garlic": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"garlic\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"garlic\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "dolly": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"dolly\" clearly on white canvas. PROPS (grounded on white): candid daily life street photography person walking — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dolly\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "eliminate": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"eliminate\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"eliminate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sincere": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sincere\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sincere\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "steer": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"steer\" clearly on white canvas. PROPS (grounded on white): skilled steer person activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"steer\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "brake": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"brake\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"brake\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "shade": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"shade\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shade\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "supervisor": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"supervisor\" clearly on white canvas. PROPS (grounded on white): supervisor person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"supervisor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "scent": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"scent\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"scent\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "stereo": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"stereo\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stereo\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "compartment": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"compartment\" clearly on white canvas. PROPS (grounded on white): compart concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"compartment\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "boil": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"boil\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"boil\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "behold": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"behold\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"behold\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "parlor": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"parlor\" clearly on white canvas. PROPS (grounded on white): parlor person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"parlor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "peak": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"peak\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"peak\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "slack": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"slack\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"slack\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "wit": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"wit\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "stamp": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"stamp\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stamp\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "flashlight": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"flashlight\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"flashlight\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "spaghetti": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"spaghetti\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"spaghetti\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "assassin": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"assassin\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"assassin\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "wolves": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"wolves\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wolves\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "colony": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"colony\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"colony\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "reliable": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"reliable\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"reliable\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "stir": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"stir\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"stir\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "shallow": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"shallow\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shallow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "nevertheless": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"nevertheless\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nevertheless\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "holler": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"holler\" clearly on white canvas. PROPS (grounded on white): holler person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"holler\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "handwriting": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"handwriting\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"handwriting\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "mortgage": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"mortgage\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mortgage\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "rib": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"rib\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rib\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "tomato": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"tomato\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tomato\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "nude": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"nude\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"nude\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "pigeon": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"pigeon\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pigeon\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "skate": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"skate\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"skate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sloppy": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sloppy\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sloppy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "destination": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"destination\" clearly on white canvas. PROPS (grounded on white): destina concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"destination\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "cycle": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"cycle\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cycle\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "biological": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"biological\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"biological\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "glue": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"glue\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"glue\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "ammunition": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"ammunition\" clearly on white canvas. PROPS (grounded on white): ammuni concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ammunition\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "harassment": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"harassment\" clearly on white canvas. PROPS (grounded on white): harass concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"harassment\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "dd": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"dd\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dd\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "wander": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"wander\" clearly on white canvas. PROPS (grounded on white): wander person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wander\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "despair": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"despair\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"despair\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sofa": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sofa\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sofa\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "deadline": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"deadline\" clearly on white canvas. PROPS (grounded on white): deadline newspaper headline media closeup — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"deadline\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "tequila": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"tequila\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tequila\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "universal": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"universal\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"universal\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "probation": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"probation\" clearly on white canvas. PROPS (grounded on white): proba concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"probation\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "accomplish": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"accomplish\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"accomplish\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "divide": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"divide\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"divide\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "feature": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"feature\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"feature\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "housekeeper": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"housekeeper\" clearly on white canvas. PROPS (grounded on white): housekeeper person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"housekeeper\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "battalion": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"battalion\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"battalion\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "documentary": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"documentary\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"documentary\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sour": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sour\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sour\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "fuzzy": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"fuzzy\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fuzzy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "muffin": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"muffin\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"muffin\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "slam": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"slam\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"slam\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "definition": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"definition\" clearly on white canvas. PROPS (grounded on white): defini concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"definition\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "economy": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"economy\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"economy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "queer": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"queer\" clearly on white canvas. PROPS (grounded on white): skilled queer person activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"queer\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "vet": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"vet\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"vet\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "martial": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"martial\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"martial\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "troop": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"troop\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"troop\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "hilarious": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"hilarious\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hilarious\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "streak": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"streak\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"streak\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "tow": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"tow\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "senor": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"senor\" clearly on white canvas. PROPS (grounded on white): senor person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"senor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "variety": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"variety\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"variety\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "classy": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"classy\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"classy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "tab": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"tab\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tab\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "vacuum": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"vacuum\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"vacuum\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "disco": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"disco\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"disco\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "cheque": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"cheque\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cheque\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "curly": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"curly\" clearly on white canvas. PROPS (grounded on white): candid daily life street photography person walking — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"curly\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "resent": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"resent\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"resent\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "spine": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"spine\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"spine\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "facial": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"facial\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"facial\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "glow": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"glow\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"glow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "jealousy": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"jealousy\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"jealousy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "consistent": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"consistent\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"consistent\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "wheat": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"wheat\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"wheat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "orphan": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"orphan\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"orphan\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "suing": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"suing\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"suing\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "dam": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"dam\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dam\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sticky": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sticky\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sticky\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "beware": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"beware\" clearly on white canvas. PROPS (grounded on white): software technology computer screen office — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"beware\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "janitor": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"janitor\" clearly on white canvas. PROPS (grounded on white): janitor person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"janitor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "naval": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"naval\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"naval\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "bodyguard": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"bodyguard\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bodyguard\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "exposure": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"exposure\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"exposure\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "vegetable": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"vegetable\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"vegetable\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "cuff": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"cuff\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cuff\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "millionaire": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"millionaire\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"millionaire\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "flood": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"flood\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"flood\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "automobile": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"automobile\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"automobile\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "resume": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"resume\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"resume\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "accuse": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"accuse\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"accuse\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "database": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"database\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"database\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "clip": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"clip\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"clip\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "attaboy": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"attaboy\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"attaboy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "generator": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"generator\" clearly on white canvas. PROPS (grounded on white): generator person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"generator\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "toad": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"toad\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"toad\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "spectacular": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"spectacular\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"spectacular\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "lethal": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"lethal\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lethal\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "obsession": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"obsession\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"obsession\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "cafeteria": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"cafeteria\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cafeteria\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "interrogation": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"interrogation\" clearly on white canvas. PROPS (grounded on white): interroga concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"interrogation\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "scoop": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"scoop\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"scoop\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "craft": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"craft\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"craft\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "crook": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"crook\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"crook\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "intel": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"intel\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"intel\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "expedition": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"expedition\" clearly on white canvas. PROPS (grounded on white): expedi concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"expedition\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "inevitable": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"inevitable\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"inevitable\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "cozy": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"cozy\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"cozy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "shack": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"shack\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shack\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "orbit": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"orbit\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"orbit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "adjust": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"adjust\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"adjust\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "essence": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"essence\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"essence\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "preserve": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"preserve\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"preserve\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "suction": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"suction\" clearly on white canvas. PROPS (grounded on white): suc concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"suction\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "chauffeur": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"chauffeur\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"chauffeur\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "tomb": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"tomb\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tomb\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "satisfy": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"satisfy\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"satisfy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "sleeve": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"sleeve\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sleeve\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "relevant": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"relevant\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"relevant\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "fade": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"fade\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fade\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "quarrel": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"quarrel\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"quarrel\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "scope": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"scope\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"scope\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "oak": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"oak\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"oak\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "evacuate": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"evacuate\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"evacuate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "doom": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"doom\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"doom\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "owl": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"owl\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"owl\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "difficulty": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"difficulty\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"difficulty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "consult": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"consult\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"consult\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "felony": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"felony\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"felony\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "rubbish": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"rubbish\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rubbish\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "poop": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"poop\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"poop\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "presidential": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"presidential\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"presidential\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "homecoming": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"homecoming\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"homecoming\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "quantum": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"quantum\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"quantum\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "encounter": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"encounter\" clearly on white canvas. PROPS (grounded on white): encounter person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"encounter\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "heartbeat": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"heartbeat\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"heartbeat\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "relieve": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"relieve\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"relieve\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "lust": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"lust\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lust\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "corridor": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"corridor\" clearly on white canvas. PROPS (grounded on white): corridor person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"corridor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "audio": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"audio\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"audio\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "dove": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"dove\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dove\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "misunderstood": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"misunderstood\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"misunderstood\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "execute": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"execute\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"execute\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "collapse": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"collapse\" clearly on white canvas. PROPS (grounded on white): hands typing laptop modern office desk — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"collapse\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "foreman": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"foreman\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"foreman\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "gorilla": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"gorilla\" clearly on white canvas. PROPS (grounded on white): sewing fabric tailor hands stitching cloth — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"gorilla\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "rodeo": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"rodeo\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rodeo\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "identical": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"identical\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"identical\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "submit": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"submit\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"submit\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "grid": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"grid\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"grid\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "freeway": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"freeway\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"freeway\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "strawberry": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"strawberry\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"strawberry\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "burglar": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"burglar\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"burglar\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "ghetto": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"ghetto\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ghetto\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "shuttle": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"shuttle\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"shuttle\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "moose": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"moose\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"moose\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sane": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sane\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sane\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "scumbag": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"scumbag\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"scumbag\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "prey": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"prey\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"prey\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "examination": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"examination\" clearly on white canvas. PROPS (grounded on white): examina concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"examination\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "tactical": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"tactical\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tactical\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "lemonade": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"lemonade\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"lemonade\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "orchestra": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"orchestra\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"orchestra\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "butterfly": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"butterfly\" clearly on white canvas. PROPS (grounded on white): candid daily life street photography person walking — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"butterfly\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "bloom": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"bloom\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bloom\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "oui": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"oui\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"oui\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "unlock": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"unlock\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"unlock\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "grocery": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"grocery\" clearly on white canvas. PROPS (grounded on white): person reading open book cozy desk lamp — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"grocery\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "sew": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"sew\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sew\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "bark": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"bark\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bark\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "slot": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"slot\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"slot\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "weep": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"weep\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"weep\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "artillery": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"artillery\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"artillery\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "warp": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"warp\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"warp\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "hesitate": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"hesitate\" clearly on white canvas. PROPS (grounded on white): scientific microscope laboratory research bench — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hesitate\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sidewalk": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sidewalk\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sidewalk\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "psychology": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"psychology\" clearly on white canvas. PROPS (grounded on white): scientific research laboratory study photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"psychology\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "dismiss": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"dismiss\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"dismiss\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "waltz": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"waltz\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"waltz\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "puppet": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"puppet\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"puppet\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "squirrel": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"squirrel\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"squirrel\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "barber": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"barber\" clearly on white canvas. PROPS (grounded on white): barber person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"barber\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "runway": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"runway\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"runway\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "defensive": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"defensive\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"defensive\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "slaughter": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"slaughter\" clearly on white canvas. PROPS (grounded on white): slaughter person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"slaughter\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "puppies": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"puppies\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"puppies\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "anyplace": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"anyplace\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"anyplace\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "sixty": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"sixty\" clearly on white canvas. PROPS (grounded on white): child drawing crayons paper creative table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sixty\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "mint": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"mint\" clearly on white canvas. PROPS (grounded on white): fresh vegetables market basket colorful produce — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mint\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "ambush": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"ambush\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ambush\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "portrait": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"portrait\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"portrait\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "hee": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"hee\" clearly on white canvas. PROPS (grounded on white): map travel planning pins destination table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hee\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "hatred": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"hatred\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hatred\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "vengeance": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"vengeance\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"vengeance\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "vow": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"vow\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"vow\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "asian": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"asian\" clearly on white canvas. PROPS (grounded on white): professional asian worker portrait — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"asian\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "leopard": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"leopard\" clearly on white canvas. PROPS (grounded on white): city street crosswalk people walking commute — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"leopard\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "clumsy": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"clumsy\" clearly on white canvas. PROPS (grounded on white): construction blueprint hard hat building site — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"clumsy\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "extension": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"extension\" clearly on white canvas. PROPS (grounded on white): pottery wheel hands shaping clay studio — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"extension\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "departure": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"departure\" clearly on white canvas. PROPS (grounded on white): green plants garden sunlight watering can — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"departure\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "pause": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"pause\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"pause\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "digital": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"digital\" clearly on white canvas. PROPS (grounded on white): coffee cup morning window light workspace — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"digital\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "fag": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"fag\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"fag\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "hideous": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"hideous\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"hideous\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "employer": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"employer\" clearly on white canvas. PROPS (grounded on white): employer person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"employer\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "mock": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"mock\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"mock\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "ammo": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"ammo\" clearly on white canvas. PROPS (grounded on white): office whiteboard team planning meeting notes — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ammo\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "bin": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"bin\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"bin\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "tango": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"tango\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"tango\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "ambition": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"ambition\" clearly on white canvas. PROPS (grounded on white): ambi concept workplace professional scene — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"ambition\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "acquaintance": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"acquaintance\" clearly on white canvas. PROPS (grounded on white): person jogging park trail morning exercise — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"acquaintance\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "finance": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"finance\" clearly on white canvas. PROPS (grounded on white): pet dog playing grass backyard sunshine — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"finance\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "addict": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"addict\" clearly on white canvas. PROPS (grounded on white): weather clouds sky landscape horizon view — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"addict\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "peel": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"peel\" clearly on white canvas. PROPS (grounded on white): musical instruments practice room wooden floor — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"peel\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
  },
  "sponsor": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY purple monkey on plain white #FFFFFF — acting out the meaning of \"sponsor\" clearly on white canvas. PROPS (grounded on white): sponsor person working activity photo — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"sponsor\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Monkey: expressive face matching word meaning, sitting side profile, exactly two arms two legs."
  },
  "rebel": {
    "cast": [
      "elephant"
    ],
    "scene": "ONLY pink elephant on plain white #FFFFFF — acting out the meaning of \"rebel\" clearly on white canvas. PROPS (grounded on white): stack of colorful books library study table — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"rebel\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Elephant: expressive face, giant circle head + stick body unchanged, BOTH thin stick arms visible."
  },
  "donkey": {
    "cast": [
      "crocodile"
    ],
    "scene": "ONLY lime-green crocodile on plain white #FFFFFF — acting out the meaning of \"donkey\" clearly on white canvas. PROPS (grounded on white): hands preparing fresh food kitchen counter — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"donkey\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Crocodile: expressive face on horizontal log body low to ground, four stub legs."
  },
  "orphanage": {
    "cast": [
      "tiger"
    ],
    "scene": "ONLY orange tiger on plain white #FFFFFF — acting out the meaning of \"orphanage\" clearly on white canvas. PROPS (grounded on white): tools craftsman workshop hands making object — simplified flat cartoon props on white floor. Accent doodle: small grass tuft OR swing silhouette OR flower. Word \"orphanage\" meaning must be obvious instantly. Mascots max 55% frame height, centered, wide margins, no clipping.",
    "expressions": "Tiger: expressive face, orange sphere body unchanged, two stub arms two stub legs."
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

  const accentNote = ` Accent: ${getJungleCastAccentDetail(key)}.`;

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
