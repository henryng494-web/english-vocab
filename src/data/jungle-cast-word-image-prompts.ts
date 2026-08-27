/** Jungle Jokers word prompts — rank 1–500. Shape locked via multi-ref PNGs. */
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
