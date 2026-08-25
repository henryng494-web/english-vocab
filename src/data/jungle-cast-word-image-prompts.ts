/** Jungle Jokers word prompts — rank 1–100. Shape locked via multi-ref PNGs. */
import {
  JUNGLE_CAST_DESIGN_ONLY,
  JUNGLE_CAST_EXPRESSION_SAMPLES,
  JUNGLE_CAST_MONKEY_POSE_RULE,
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
    "scene": "Orange tiger and purple monkey face the viewer with welcoming paws outstretched in a sunny park path.",
    "expressions": "Monkey: warm friendly smile, bright open eyes inviting the viewer (NOT bored half-lidded). Tiger: cheerful welcoming grin, paws open toward viewer (NOT frozen shocked O-mouth). Cow and pig in background: happy wave, friendly eyes."
  },
  "the": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey points its paw at ONE bright red apple on a wooden table while other apples are faded gray — definite article.",
    "expressions": "Monkey: focused teaching expression, one paw pointing precisely, confident eyes (NOT lazy). Tiger: attentive curious look following the cat's point (NOT shocked). Elephant: interested lean-in. Crocodile: nodding understanding."
  },
  "to": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey walks along a teal arrow path toward an open suburban house door — movement to a destination.",
    "expressions": "Monkey: determined forward-looking eyes, purposeful stride (NOT bored). Tiger: eager excited trot beside cat, happy anticipation (NOT O-mouth shock). Elephant: gentle encouraging smile from behind. Crocodile: waddling happily along."
  },
  "it": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey sits proudly on a small brown wooden platform in a spotlight — the cat is 'it'.",
    "expressions": "Monkey: proud spotlight pose, chest out, satisfied smile (NOT lazy unamused). Tiger: impressed admiring eyes, small clap (NOT shocked). Elephant: applauding gently. Crocodile: star-struck happy look."
  },
  "that": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey points far away at a red kite in the sky while ignoring a blue ball at its feet — distant 'that'.",
    "expressions": "Monkey: arm stretched pointing far, eyes squinting at distance (NOT bored). Tiger: looking where cat points, curious interested face (NOT frozen shock). Elephant: shading eyes looking far. Crocodile: leaning forward curious."
  },
  "and": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "Purple monkey and orange tiger share one plate of cookies together at a picnic table — connection 'and'.",
    "expressions": "Monkey: happy sharing smile, offering cookie (NOT half-lidded bored). Tiger: delighted grateful grin eating together (NOT O-mouth). Cow and pig: cozy together on same bench, content smiles."
  },
  "of": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Lime-green crocodile proudly holds a glass jar full of cookies — a jar of treats.",
    "expressions": "Crocodile: proud possessive happy grin showing jar contents (NOT tired sweat). Monkey: admiring the jar, interested eyes. Tiger: excited hopeful look at cookies. Elephant: gentle pleased smile, mouth closed."
  },
  "what": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger staring at a closed mystery gift box with colorful ribbons, question-curve shapes floating nearby (no letters).",
    "expressions": "Tiger: curious puzzled wonder — head tilt, wide questioning eyes but calm mouth (NOT frozen O-shock). Monkey: equally curious, one eyebrow raised. Elephant: confused cute head tilt. Crocodile: scratching head puzzled."
  },
  "in": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey peeking out from inside a large orange cardboard box, only head and paws visible.",
    "expressions": "Monkey: playful peek-a-boo eyes, mischievous smile from inside box (NOT bored). Tiger: surprised-delighted discovery face finding cat (happy surprise, NOT horror shock). Elephant: amused chuckle. Crocodile: giggling."
  },
  "me": {
    "cast": [
      "monkey"
    ],
    "scene": "Orange tiger points both paws at its own chest with a shy smile — means 'me'.",
    "expressions": "Tiger: shy self-pointing, soft blush, gentle smile (NOT O-mouth). Monkey: warm acknowledging nod. Elephant: kind encouraging look. Crocodile: supportive thumbs-up."
  },
  "is": {
    "cast": [
      "monkey"
    ],
    "scene": "Pink elephant strikes a proud pose on a small stage pedestal like a statue — something IS here.",
    "expressions": "Elephant: dignified proud statue pose, calm confident eyes, mouth closed (NO silly tongue). Monkey: presenting cow with open paw, proud curator face. Tiger: impressed wide happy eyes. Crocodile: applauding."
  },
  "we": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots stand together as a team on a neighborhood park, arms linked — 'we' together.",
    "expressions": "All four: united team pride — warm smiles, linked arms, belonging (Cat NOT bored, Dog NOT O-mouth, Cow NO tongue, Pig NOT tired). Each looks happy to be together."
  },
  "this": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey taps a green book on the desk right in front of it, ignoring books on a distant shelf.",
    "expressions": "Monkey: emphatic this-one gesture, focused eyes on nearby book (NOT lazy). Tiger: leaning in looking at same book, interested (NOT shocked). Elephant: nodding at near book. Crocodile: ignoring far shelf like cat."
  },
  "he": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey watches a male stick-figure silhouette waving from a doorway — 'he'.",
    "expressions": "Monkey: observant pointing toward silhouette, neutral friendly face (NOT bored). Tiger: waving back cheerfully. Elephant: gentle wave. Crocodile: curious peek."
  },
  "on": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey sitting on top of a brown wooden table, not beside it — clearly ON the surface.",
    "expressions": "Monkey: comfortable perched ON table, relaxed satisfied smile (NOT bored default). Tiger: looking up pointing at cat ON table, teaching expression. Elephant: confirming nod. Crocodile: impressed look up."
  },
  "for": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger offers a red heart-shaped cookie to purple monkey — gift for you.",
    "expressions": "Tiger: generous giving smile, offering cookie warmly (NOT shocked). Monkey: touched grateful happy eyes receiving gift (NOT lazy unamused). Elephant: touched aww expression. Crocodile: clasped paws happy."
  },
  "have": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Lime-green crocodile hugging a huge stack of colorful donuts — has many treats.",
    "expressions": "Crocodile: delighted possessive hug, big happy grin (NOT tired sweat). Monkey: jealous-amused look. Tiger: amazed happy eyes at pile. Elephant: gentle laugh at pig's hoard."
  },
  "do": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey washing dishes at a sink with soap bubbles — doing a chore.",
    "expressions": "Monkey: focused diligent scrubbing, determined but not angry face (NOT bored lazy — actively working). Tiger: drying dishes helpfully, earnest helpful smile. Elephant: stacking clean plates. Crocodile: wiping counter diligently."
  },
  "no": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "ONLY monkey and tiger on school sidewalk. Large candy jar sits ON the pavement between them (grounded, not floating, no disembodied hand). Both step back refusing.",
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
    "scene": "Purple monkey with a lightbulb glowing above its head, smiling confidently — I know!",
    "expressions": "Monkey: eureka confident grin, bright eyes, chest puffed (NOT bored half-lidded). Tiger: impressed amazed smile (NOT O-mouth shock). Elephant: nodding wise approval. Crocodile: applauding the idea."
  },
  "not": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey pushes away a slice of cake with a firm paw — not eating that.",
    "expressions": "Monkey: firm refusal face, pushing plate away, decisive eyes (NOT lazy). Tiger: supporting head-shake no. Elephant: arms crossed declining. Crocodile: turning away politely from cake."
  },
  "can": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger lifting a heavy teal dumbbell easily, flexing — I can!",
    "expressions": "Tiger: confident strong grin, flexing proudly (NOT shocked O-mouth). Monkey: impressed cheering. Elephant: amazed proud smile. Crocodile: fan cheering with paws up."
  },
  "all": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All four mascots gather around a table covered with every kind of fruit — all of them.",
    "expressions": "All four: excited abundance — happy eyes at full table (Cat alert not bored, Dog joyful not shocked, Cow delighted mouth closed, Pig happy not tired). Gesturing at ALL the fruit."
  },
  "with": {
    "cast": [
      "monkey",
      "tiger"
    ],
    "scene": "Purple monkey and orange tiger walking side by side sharing one umbrella in gentle rain — with each other.",
    "expressions": "Monkey: cozy companion smile under shared umbrella (NOT bored). Tiger: happy walking together, content side-glance (NOT O-mouth). Cow and pig: also paired under second umbrella, warm friendship."
  },
  "just": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey holding up a single tiny cookie while a huge empty jar sits behind — just one.",
    "expressions": "Monkey: emphasizing ONE with raised single paw, slightly smug small smile (NOT bored). Tiger: understanding nod at single cookie. Elephant: surprised-at-small-amount raised eyebrow. Crocodile: disappointed cute pout at empty jar."
  },
  "get": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger catching a falling star-shaped cookie mid-air — get it!",
    "expressions": "Tiger: athletic focused leap, determined happy eyes catching cookie (NOT frozen shock). Monkey: cheering excited. Elephant: watching tensely then relieved smile. Crocodile: paws over eyes then celebrating."
  },
  "here": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey planting a small flag on the ground right at its feet — right here.",
    "expressions": "Monkey: proud HERE gesture stomping paw on spot, confident smile (NOT lazy). Tiger: looking down at exact spot, understanding nod. Elephant: pointing at ground. Crocodile: circling the spot curiously."
  },
  "but": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey wants sunshine yet holds a teal umbrella in rain — contrast, but.",
    "expressions": "Monkey: conflicted expression — half hopeful sun-side, half resigned rain-side (NOT flat bored). Tiger: sympathetic confused tilt. Elephant: gentle shrug. Crocodile: split reaction amused."
  },
  "there": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger pointing across a city park at a tiny house on the far hill — over there.",
    "expressions": "Tiger: pointing arm extended, eyes on distant house (NOT O-mouth shock). Monkey: squinting far away. Elephant: shading eyes looking there. Crocodile: tiptoeing to see farther."
  },
  "so": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Lime-green crocodile eating a very spicy red pepper with steam from ears — so hot!",
    "expressions": "Crocodile: comedic spicy reaction — watering eyes, open panting mouth, steam puffs (NOT tired default — active spicy reaction). Monkey: wincing sympathetically. Tiger: fanning pig. Elephant: offering milk glass."
  },
  "they": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Three identical teal birds on a branch while all four mascots watch together — they.",
    "expressions": "All mascots: collective watching — pointing at the three birds together (Cat interested, Dog curious calm, Cow gentle smile, Pig excited pointing). Group observing THEY."
  },
  "right": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger gives a big green checkmark card to purple monkey — correct, right answer.",
    "expressions": "Tiger: approving proud grin presenting checkmark (NOT shocked). Monkey: pleased relieved correct-answer smile (NOT bored). Elephant: clapping approval. Crocodile: victory dance."
  },
  "like": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey hugging a fish-shaped plush toy lovingly — I like this.",
    "expressions": "Monkey: affectionate hugging plush, eyes closed happy smile (NOT lazy unamused). Tiger: warm smile watching. Elephant: gentle fond expression. Crocodile: heart-eyes admiring the plush."
  },
  "out": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey stepping out through an open front door into bright sunshine — going out.",
    "expressions": "Monkey: eager exit stride, excited eyes toward sunshine (NOT bored). Tiger: holding door open helpfully, encouraging smile. Elephant: waving goodbye from inside. Crocodile: following cat out happily."
  },
  "go": {
    "cast": [
      "monkey"
    ],
    "scene": "Orange tiger mid-run on a path with motion lines, eager expression — go!",
    "expressions": "Tiger: energetic running grin, forward momentum (NOT frozen shocked O). Monkey: running alongside determined. Elephant: jogging gently. Crocodile: waddling fast with effort face."
  },
  "she": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger offering flowers to a female stick-figure silhouette in a window — she.",
    "expressions": "Tiger: gentle respectful offering smile (NOT O-mouth). Monkey: supportive smile from behind. Elephant: kind warm expression. Crocodile: shy happy clasped paws."
  },
  "up": {
    "cast": [
      "monkey"
    ],
    "scene": "Pink elephant stretching neck even higher toward fluffy clouds — up above.",
    "expressions": "Elephant: stretching upward curious wonder, eyes on clouds, mouth closed (NO tongue). Monkey: pointing up amazed. Tiger: jumping trying to reach. Crocodile: looking up with wide happy eyes."
  },
  "about": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey surrounded by floating icons: clock, heart, book, apple — talking about many things.",
    "expressions": "Monkey: animated explaining gesture, engaged storyteller face (NOT bored half-lidded). Tiger: listening fascinated. Elephant: thoughtful nod at each icon. Crocodile: curious pointing at icons."
  },
  "if": {
    "cast": [
      "monkey"
    ],
    "scene": "Purple monkey at a fork in the road with two paths, thinking hard — if this or that.",
    "expressions": "Monkey: weighing options, one eyebrow up, paw on chin (thoughtful NOT bored). Tiger: equally torn looking both ways. Elephant: pondering. Crocodile: scratching head uncertain cute."
  },
  "at": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger sitting at a bus stop bench under a clock — at the stop.",
    "expressions": "Tiger: patient waiting sit, calm content eyes checking clock (NOT shocked O). Monkey: sitting AT bench too, relaxed. Elephant: standing AT stop sign. Crocodile: reading schedule board AT stop."
  },
  "now": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All mascots looking at a wall clock whose hands point to current moment — now.",
    "expressions": "All four: urgent present-moment focus — eyes on clock, slight hurry or attention (Cat alert, Dog attentive calm, Cow serious gentle, Pig excited ready). NOW urgency."
  },
  "come": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger beckoning with paw toward a cozy open door with warm light — come here.",
    "expressions": "Tiger: inviting beckoning wave, warm welcoming eyes (NOT shocked). Monkey: also beckoning from doorway, friendly smile. Elephant: holding door open kindly. Crocodile: patting seat inviting."
  },
  "one": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey holding up exactly one finger while other paw hides a pile — only one.",
    "expressions": "Monkey: precise ONE gesture, sly smile showing single item (NOT bored). Tiger: counting on paw confirming one. Elephant: holding up one hoof. Crocodile: trying to grab hidden pile playfully."
  },
  "how": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger with tools and blueprint, scratching head — how to build.",
    "expressions": "Tiger: puzzled builder face, scratching head with wrench, curious frown (NOT O-mouth shock). Monkey: studying blueprint seriously. Elephant: measuring with tape. Crocodile: confused by instructions."
  },
  "well": {
    "cast": [
      "monkey"
    ],
    "scene": "Lime-green crocodile drinking water and giving thumbs up, rosy cheeks — feeling well.",
    "expressions": "Crocodile: healthy refreshed grin, thumbs up, rosy cheeks (NOT tired sweat — vibrant wellness). Monkey: relieved happy for pig. Tiger: cheerful check-up approval. Elephant: gentle approving nod."
  },
  "want": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey reaching toward a shiny star cookie on a high shelf — want it.",
    "expressions": "Monkey: longing reaching eyes, eager open mouth wanting (NOT bored lazy). Tiger: also reaching helpfully. Elephant: lifting cat up to shelf. Crocodile: drooling hopeful cute face."
  },
  "think": {
    "cast": [
      "monkey"
    ],
    "scene": "ONLY monkey in bright classroom. Monkey sits on chair behind desk — puzzle flat on desk surface, blocks on desk. One hand touches chin, OTHER arm hangs down long to floor. Curved hook shapes near head. All props on desk, nothing floating.",
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
    "scene": "Orange tiger presenting a gold star sticker to purple monkey — good job.",
    "expressions": "Tiger: proud praising smile giving star (NOT shocked). Monkey: pleased proud receiving, happy eyes (NOT bored). Elephant: applauding. Crocodile: cheering confetti toss."
  },
  "see": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey looking through a teal telescope at a sailboat on the sea — see far away.",
    "expressions": "Monkey: focused peering through telescope, wonder-smile (NOT bored). Tiger: pointing at horizon excited discovery (NOT O-mouth). Elephant: shading eyes looking. Crocodile: amazed at view."
  },
  "let": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey holding a gate open for orange tiger to pass — let through.",
    "expressions": "Monkey: generous permitting gesture, kind smile holding gate (NOT lazy). Tiger: grateful passing through, thankful eyes. Elephant: waiting turn patiently. Crocodile: skipping through happily."
  },
  "why": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger shrugging with confused expression, scattered puzzle pieces — why?",
    "expressions": "Tiger: baffled shrug, raised eyebrows, palms up (NOT O-mouth shock — puzzled not scared). Monkey: equally confused head tilt. Elephant: pondering deeply. Crocodile: question-curve shapes above head."
  },
  "who": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All mascots in a lineup behind a curtain, one peeking — who is it?",
    "expressions": "All four: mystery guessing game — curious suspicious playful faces (Cat sly peek, Dog excited guess, Cow thoughtful, Pig wide curious eyes). Identity mystery."
  },
  "as": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey dressed in a chef hat pretending to cook like a pro — as a chef.",
    "expressions": "Monkey: proud chef roleplay, confident cooking smile in hat (NOT bored). Tiger: impressed customer eyes. Elephant: sous-chef helping seriously. Crocodile: tasting soup happily."
  },
  "will": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger pointing at a calendar future date with a planned picnic marked — will happen.",
    "expressions": "Tiger: confident future-planning smile pointing ahead (NOT shocked). Monkey: excited anticipation for future event. Elephant: marking calendar carefully. Crocodile: packing picnic basket early."
  },
  "from": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey receiving a letter delivered from a distant blue mailbox — from far away.",
    "expressions": "Monkey: surprised-happy receiving letter, reading envelope (NOT bored). Tiger: pointing back to far mailbox. Elephant: post carrier wave from distance. Crocodile: curious about sender."
  },
  "when": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "All mascots watching an hourglass with sand falling — when time comes.",
    "expressions": "All four: patient anticipation watching sand fall (Cat focused, Dog eager waiting, Cow calm, Pig impatient cute foot-tap). Waiting for WHEN."
  },
  "back": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey walking back along footprints toward a cozy house — coming back.",
    "expressions": "Monkey: relieved homeward smile following footprints (NOT bored). Tiger: running back excited to house. Elephant: carrying home groceries happily. Crocodile: waving at house welcoming."
  },
  "okay": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger and purple monkey doing an OK paw circle gesture together — okay!",
    "expressions": "Tiger: relaxed OK sign, easygoing grin (NOT shocked). Monkey: matching OK gesture, satisfied smile (NOT bored). Cow and pig: thumbs up / OK hooves, all agreed."
  },
  "yes": {
    "cast": [
      "monkey",
      "elephant",
      "tiger",
      "crocodile"
    ],
    "scene": "All four at city park birthday picnic — checkmark flag in cake, confetti, playground behind.",
    "expressions": "All cheering — happy faces only. Elephant MUST keep giant round head + pencil stick body (NOT fat). Tiger MUST stay spherical ball.",
    "outfits": "Monkey: party cone hat. Elephant: blue birthday sash. Crocodile: none. Tiger: none."
  },
  "time": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey holding a round analog clock with visible hands, no numbers — time.",
    "expressions": "Monkey: serious timekeeper face checking clock (NOT bored). Tiger: worried about being late, glancing at clock. Elephant: calm punctual nod. Crocodile: rushing with toast in mouth comedic."
  },
  "look": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger with binoculars staring at a colorful bird in a tree — look!",
    "expressions": "Tiger: excited discovery pointing with binoculars (NOT O-mouth shock — eager look). Monkey: also looking up alert. Elephant: bending down to child's-eye view. Crocodile: gasping at colorful bird."
  },
  "take": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey taking the last cookie from a plate carefully — take one.",
    "expressions": "Monkey: careful gentle taking, respectful eyes on last cookie (NOT greedy bored). Tiger: watching politely waiting turn. Elephant: offering plate kindly. Crocodile: hopeful but patient."
  },
  "an": {
    "cast": [
      "monkey"
    ],
    "scene": "Orange tiger presenting a single orange to purple monkey — an orange (one of many types).",
    "expressions": "Tiger: offering one orange warmly (NOT shocked). Monkey: accepting with pleased smile (NOT bored). Elephant: basket of varied fruits behind showing one type. Crocodile: sniffing orange curiously."
  },
  "man": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey tipping a hat to a friendly adult stick-figure gardener with a rake.",
    "expressions": "Monkey: polite respectful nod tipping hat (NOT lazy). Tiger: friendly wave to man. Elephant: courteous bow. Crocodile: offering flower to gardener."
  },
  "where": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger studying a simple map with a red X destination — where?",
    "expressions": "Tiger: lost searching face studying map (NOT O-mouth — focused searching). Monkey: pointing different directions confused. Elephant: rotating map helpfully. Crocodile: looking under bench comedic search."
  },
  "would": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey daydreaming in a thought cloud of flying on a dragon — would imagine.",
    "expressions": "Monkey: dreamy wishful smile eyes half-closed imagining (NOT bored — blissful fantasy). Tiger: imagining same dream happily. Elephant: wistful gentle smile. Crocodile: starry-eyed fantasy face."
  },
  "some": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Lime-green crocodile picking some (not all) strawberries from a bush into a small basket.",
    "expressions": "Crocodile: selective picking satisfied smile, basket partially full (NOT tired). Monkey: showing full bush vs small basket. Tiger: eating one sneaked berry guilty-cute. Elephant: indicating SOME remaining on bush."
  },
  "hey": {
    "cast": [
      "monkey"
    ],
    "scene": "Orange tiger waving both paws loudly from behind a fence — hey!",
    "expressions": "Tiger: loud friendly HEY wave, big open smile calling attention (NOT scared shock). Monkey: surprised-turned-happy wave back. Elephant: calling over fence. Crocodile: popping up waving energetically."
  },
  "tell": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey whispering a secret into orange tiger's ear — tell you.",
    "expressions": "Monkey: conspiratorial whisper, hand cupped at mouth, sly smile (NOT bored). Tiger: surprised-interested listening ear (mild surprise OK, NOT frozen O). Elephant: trying to overhear comedic. Crocodile: shushing cow."
  },
  "or": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey choosing between a cupcake OR an ice cream cone on two plates.",
    "expressions": "Monkey: torn decision face looking left-right between choices (NOT bored). Tiger: pointing at both options helpfully. Elephant: weighing choices with scales. Crocodile: wanting both hands out."
  },
  "say": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger speaking with speech-bubble shapes but NO letters inside — saying something.",
    "expressions": "Tiger: animated talking mouth open mid-speech, expressive paws (NOT frozen O-shock — natural speaking). Monkey: listening attentively nodding. Elephant: responding with own bubble. Crocodile: excited interrupting."
  },
  "something": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Mystery object under a teal cloth on a table — something hidden.",
    "expressions": "Monkey: curious finger on chin guessing (NOT bored). Tiger: excited reaching for cloth (NOT horror shock). Elephant: guessing shapes with hands. Crocodile: peeking under cloth edge sneaky."
  },
  "down": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey sliding down a playground slide toward orange sand — down.",
    "expressions": "Monkey: thrilled sliding face wind-in-fur, eyes wide joy (NOT bored). Tiger: waiting at bottom arms open. Elephant: watching from top gentle smile. Crocodile: queued excited on ladder."
  },
  "then": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey finishing breakfast, empty plate, then walking toward open door — first eat, then leave.",
    "expressions": "Monkey: sequence shown — satisfied after-eating smile then eager exit face (NOT bored throughout). Tiger: pointing from plate to door teaching sequence. Elephant: first-this-then-that gesture. Crocodile: following sequence."
  },
  "little": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Pink elephant looking down at a tiny lime-green crocodile on a stool — little vs big.",
    "expressions": "Elephant: gentle giant kind smile looking down, mouth closed (NO tongue). Crocodile: small cute proud standing on stool, happy little smile (NOT tired). Monkey: size comparison gesture. Tiger: measuring height amused."
  },
  "way": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger at start of a winding path leading to a small white house — the way home.",
    "expressions": "Tiger: hopeful path-finding expression, pointing down road (NOT shocked). Monkey: reading path confidently. Elephant: pointing direction kindly. Crocodile: marching on path determined."
  },
  "make": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey mixing batter in a bowl with flour and eggs — make a cake.",
    "expressions": "Monkey: focused baker concentration, slight flour on cheek (NOT bored lazy). Tiger: cracking eggs helpfully. Elephant: stirring gently. Crocodile: watching oven excited anticipation."
  },
  "too": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "White mug overflowing with hot cocoa down the sides — too full.",
    "expressions": "Crocodile: panicked too-much face as mug overflows (NOT tired — flustered). Monkey: backing away from spill. Tiger: grabbing napkins alarmed. Elephant: gentle oops expression offering towel."
  },
  "never": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey crossing arms, turning from a 'closed forever' treasure chest — never.",
    "expressions": "Monkey: firm NEVER face, arms crossed, looking away (NOT lazy — absolute refusal). Tiger: supporting stern head-shake. Elephant: blocking chest with arm. Crocodile: X gesture with paws."
  },
  "by": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey painting a picture beside orange tiger at easels — by each other / created by.",
    "expressions": "Monkey: focused painting beside partner, collaborative smile (NOT bored). Tiger: painting at adjacent easel, happy side-by-side (NOT shocked). Elephant: displaying finished art. Crocodile: signing painting proudly."
  },
  "over": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger jumping over a low teal hurdle on a track — over.",
    "expressions": "Tiger: athletic mid-jump determined grin (NOT shocked O — athletic focus). Monkey: cheering from sideline. Elephant: holding hurdle steady. Crocodile: impressed jaw-drop happy."
  },
  "more": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Lime-green crocodile pouring more cookies from a jar onto a plate that already has cookies.",
    "expressions": "Crocodile: eager MORE gesture pouring happily (NOT tired). Monkey: trying to stop overflow amused. Tiger: excited at growing pile. Elephant: gentle caution hand up."
  },
  "mean": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey with stern face pointing at broken vase while dog looks guilty — mean behavior.",
    "expressions": "Monkey: stern scolding disappointed face (NOT bored — actively upset). Tiger: guilty ashamed drooped ears (NOT shocked O). Elephant: sad disapproving look. Crocodile: hiding behind cow worried."
  },
  "very": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger beside a VERY giant ice cream tower twice its height — very big.",
    "expressions": "Tiger: awestruck amazed eyes at giant tower (wonder not horror shock). Monkey: tiny comparison gesture. Elephant: measuring tower height. Crocodile: ready to eat giant scoop excited."
  },
  "off": {
    "cast": [
      "monkey"
    ],
    "scene": "Purple monkey switching off a lamp, room going dark — off.",
    "expressions": "Monkey: sleepy satisfied click-OFF face, drowsy eyes (NOT bored default — tired bedtime). Tiger: yawning ready for sleep. Elephant: dimming lights gently. Crocodile: already asleep sitting up."
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
    "scene": "Lime-green crocodile handing a wrapped gift box to purple monkey — give a gift.",
    "expressions": "Crocodile: generous giving smile extending gift (NOT tired). Monkey: surprised-touched receiving, happy eyes (NOT bored). Tiger: applauding the giving. Elephant: warm approving nod."
  },
  "thank": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger bowing with a thank-you bouquet to purple monkey — thank you.",
    "expressions": "Tiger: grateful bow, sincere thankful eyes (NOT O-mouth). Monkey: modest accepting smile, paws together (NOT bored). Elephant: touched hand on heart. Crocodile: blowing kiss gratitude."
  },
  "love": {
    "cast": [
      "monkey",
      "elephant",
      "tiger"
    ],
    "scene": "Three only (no crocodile) — group hug on park bench at sunset, floating hearts.",
    "expressions": "Warm closed-eye smiles. Elephant: stick-thin body + giant round head unchanged. Tiger: sphere unchanged.",
    "outfits": "Monkey: red scarf. Elephant: none. Tiger: none."
  },
  "people": {
    "cast": [
      "monkey"
    ],
    "scene": "Four diverse stick-figure people silhouettes chatting in a park while mascots picnic nearby.",
    "expressions": "Mascots: friendly observing PEOPLE — warm curious smiles watching humans (Cat interested, Dog happy calm, Cow gentle wave to people, Pig excited pointing). Not interacting as main focus."
  },
  "please": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey with pleading eyes offering a small empty cup — please?",
    "expressions": "Monkey: big pleading puppy-dog eyes, paws together begging (NOT bored lazy — earnest please). Tiger: sympathetic considering. Elephant: kindly reaching to help. Crocodile: passing teapot generously."
  },
  "sure": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger nodding confidently with a thumbs up — sure!",
    "expressions": "Tiger: confident sure nod, relaxed thumbs up grin (NOT shocked O). Monkey: agreeing nod smile. Elephant: hoof thumbs up. Crocodile: enthusiastic double thumbs up."
  },
  "any": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey pointing at any of three identical teal doors — any one works.",
    "expressions": "Monkey: casual any-will-do shrug, relaxed pick-any face (NOT bored — easygoing). Tiger: opening one door experimentally. Elephant: counting doors. Crocodile: eeny-meeny choosing comedic."
  },
  "only": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Lime-green crocodile guarding the ONLY cookie left on an otherwise empty plate.",
    "expressions": "Crocodile: protective possessive guarding face over last cookie (NOT tired — vigilant). Monkey: reaching sneaky. Tiger: negotiating trade. Elephant: gentle sharing suggestion."
  },
  "because": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger pointing at dark clouds as reason for carrying umbrella — because of rain.",
    "expressions": "Tiger: explaining BECAUSE gesture at clouds, teaching face (NOT shocked). Monkey: understanding ah-ha nod. Elephant: logical connecting dots gesture. Crocodile: already under umbrella smart face."
  },
  "two": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Purple monkey holding up two fingers next to exactly two cupcakes on a tray.",
    "expressions": "Monkey: counting TWO proudly, clear V fingers (NOT bored). Tiger: confirming count nodding. Elephant: holding up two hooves. Crocodile: trying to eat one of two guilty."
  },
  "much": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Lime-green crocodile buried under a mountain of pillows — too much stuff.",
    "expressions": "Crocodile: overwhelmed buried face, muffled help expression (NOT tired default — comedic overload). Monkey: adding one more pillow mischievous. Tiger: digging pig out. Elephant: concerned gentle rescue."
  },
  "sir": {
    "cast": [
      "monkey"
    ],
    "scene": "Purple monkey politely tipping hat to a kind elderly gentleman silhouette with cane.",
    "expressions": "Monkey: formal polite bow, respectful eyes (NOT lazy). Tiger: straight posture salute. Elephant: curtsy-like polite nod. Crocodile: offering seat to sir kindly."
  },
  "maybe": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger balancing on a fence looking unsure between two paths — maybe.",
    "expressions": "Tiger: uncertain maybe shrug, wobbly balance, hesitant eyes (NOT shocked). Monkey: equally undecided. Elephant: listing pros on hooves. Crocodile: flipping coin comedic."
  },
  "help": {
    "cast": [
      "monkey",
      "elephant",
      "crocodile",
      "tiger"
    ],
    "scene": "Orange tiger helping tired lime-green crocodile carry heavy grocery bags up steps — help.",
    "expressions": "Tiger: supportive helpful strain smile carrying bags (NOT shocked). Crocodile: relieved grateful tired-but-thankful face (NOT default sweat — helped relief). Monkey: holding door open. Elephant: carrying extra bag kindly."
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
  if (approved) {
    const castNote = `Characters (${approved.cast.length}): ${approved.cast.join(", ")}.`;
    const outfitNote = approved.outfits ? ` OUTFITS: ${approved.outfits}` : "";
    const monkeyNote = approved.cast.includes("monkey")
      ? ` ${JUNGLE_CAST_MONKEY_POSE_RULE}`
      : "";
    return `${JUNGLE_CAST_DESIGN_ONLY} ${castNote} ${JUNGLE_CAST_SHAPE_REMINDER}${monkeyNote} Word "${key}": ${approved.scene} EXPRESSIONS: ${approved.expressions}.${outfitNote}`;
  }
  const entry = JUNGLE_WORD_IMAGE_ENTRIES[key];
  if (!entry) return null;
  const castNote = `Characters (${entry.cast.length}): ${entry.cast.join(", ")}.`;
  const outfitNote = entry.outfits ? ` OUTFITS: ${entry.outfits}` : "";
  const monkeyNote = entry.cast.includes("monkey")
    ? ` ${JUNGLE_CAST_MONKEY_POSE_RULE}`
    : "";
  return `${JUNGLE_CAST_DESIGN_ONLY} ${castNote} ${JUNGLE_CAST_SHAPE_REMINDER}${monkeyNote} Word "${key}": ${entry.scene} EXPRESSIONS: ${entry.expressions}.${outfitNote}`;
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
