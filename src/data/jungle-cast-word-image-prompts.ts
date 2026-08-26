/** Jungle Jokers word prompts — rank 1–150. Shape locked via multi-ref PNGs. */
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
