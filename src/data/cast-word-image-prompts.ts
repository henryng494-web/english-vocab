/** Full-scene cast mascot prompts for preset rank 1–100 (expression-flexible v3). */

export const CAST_DESIGN_ONLY =
  "Flat 2D children's-book illustration, wide 16:9 landscape. Keep exact character DESIGNS only: (1) gray tabby cat, teal collar, gold bell; (2) tall tubular light-blue cow, one dark-blue head patch, cream horns, navy hooves; (3) golden-yellow dog, blue collar; (4) round fat pink pig. Same body shapes and colors every time. IMPORTANT: Do NOT copy default expressions — adapt eyes, mouth, eyebrows, and body language to the word meaning. Full rich environment. NO text, NO letters, NO watermark.";

export type CastWordImageEntry = {
  scene: string;
  expressions: string;
};

/** Word-specific scene + per-character expression direction. */
export const CAST_WORD_IMAGE_ENTRIES: Readonly<
  Record<string, CastWordImageEntry>
> = {
  you: {
    scene:
      "Golden dog and gray cat face the viewer with welcoming paws outstretched in a sunny park path.",
    expressions:
      "Cat: warm friendly smile, bright open eyes inviting the viewer (NOT bored half-lidded). Dog: cheerful welcoming grin, paws open toward viewer (NOT frozen shocked O-mouth). Cow and pig in background: happy wave, friendly eyes.",
  },
  the: {
    scene:
      "Gray cat points its paw at ONE bright red apple on a wooden table while other apples are faded gray — definite article.",
    expressions:
      "Cat: focused teaching expression, one paw pointing precisely, confident eyes (NOT lazy). Dog: attentive curious look following the cat's point (NOT shocked). Cow: interested lean-in. Pig: nodding understanding.",
  },
  to: {
    scene:
      "Gray cat walks along a teal arrow path toward an open cottage door — movement to a destination.",
    expressions:
      "Cat: determined forward-looking eyes, purposeful stride (NOT bored). Dog: eager excited trot beside cat, happy anticipation (NOT O-mouth shock). Cow: gentle encouraging smile from behind. Pig: waddling happily along.",
  },
  it: {
    scene:
      "Gray cat sits proudly on a small brown wooden platform in a spotlight — the cat is 'it'.",
    expressions:
      "Cat: proud spotlight pose, chest out, satisfied smile (NOT lazy unamused). Dog: impressed admiring eyes, small clap (NOT shocked). Cow: applauding gently. Pig: star-struck happy look.",
  },
  that: {
    scene:
      "Gray cat points far away at a red kite in the sky while ignoring a blue ball at its feet — distant 'that'.",
    expressions:
      "Cat: arm stretched pointing far, eyes squinting at distance (NOT bored). Dog: looking where cat points, curious interested face (NOT frozen shock). Cow: shading eyes looking far. Pig: leaning forward curious.",
  },
  and: {
    scene:
      "Gray cat and golden dog share one plate of cookies together at a picnic table — connection 'and'.",
    expressions:
      "Cat: happy sharing smile, offering cookie (NOT half-lidded bored). Dog: delighted grateful grin eating together (NOT O-mouth). Cow and pig: cozy together on same bench, content smiles.",
  },
  of: {
    scene:
      "Pink pig proudly holds a glass jar full of cookies — a jar of treats.",
    expressions:
      "Pig: proud possessive happy grin showing jar contents (NOT tired sweat). Cat: admiring the jar, interested eyes. Dog: excited hopeful look at cookies. Cow: gentle pleased smile, mouth closed.",
  },
  what: {
    scene:
      "Golden dog staring at a closed mystery gift box with colorful ribbons, question-curve shapes floating nearby (no letters).",
    expressions:
      "Dog: curious puzzled wonder — head tilt, wide questioning eyes but calm mouth (NOT frozen O-shock). Cat: equally curious, one eyebrow raised. Cow: confused cute head tilt. Pig: scratching head puzzled.",
  },
  in: {
    scene:
      "Gray cat peeking out from inside a large orange cardboard box, only head and paws visible.",
    expressions:
      "Cat: playful peek-a-boo eyes, mischievous smile from inside box (NOT bored). Dog: surprised-delighted discovery face finding cat (happy surprise, NOT horror shock). Cow: amused chuckle. Pig: giggling.",
  },
  me: {
    scene:
      "Golden dog points both paws at its own chest with a shy smile — means 'me'.",
    expressions:
      "Dog: shy self-pointing, soft blush, gentle smile (NOT O-mouth). Cat: warm acknowledging nod. Cow: kind encouraging look. Pig: supportive thumbs-up.",
  },
  is: {
    scene:
      "Tall blue cow strikes a proud pose on a small stage pedestal like a statue — something IS here.",
    expressions:
      "Cow: dignified proud statue pose, calm confident eyes, mouth closed (NO silly tongue). Cat: presenting cow with open paw, proud curator face. Dog: impressed wide happy eyes. Pig: applauding.",
  },
  we: {
    scene:
      "All four mascots stand together as a team on a green hill, arms linked — 'we' together.",
    expressions:
      "All four: united team pride — warm smiles, linked arms, belonging (Cat NOT bored, Dog NOT O-mouth, Cow NO tongue, Pig NOT tired). Each looks happy to be together.",
  },
  this: {
    scene:
      "Gray cat taps a green book on the desk right in front of it, ignoring books on a distant shelf.",
    expressions:
      "Cat: emphatic this-one gesture, focused eyes on nearby book (NOT lazy). Dog: leaning in looking at same book, interested (NOT shocked). Cow: nodding at near book. Pig: ignoring far shelf like cat.",
  },
  he: {
    scene:
      "Gray cat watches a male stick-figure silhouette waving from a doorway — 'he'.",
    expressions:
      "Cat: observant pointing toward silhouette, neutral friendly face (NOT bored). Dog: waving back cheerfully. Cow: gentle wave. Pig: curious peek.",
  },
  on: {
    scene:
      "Gray cat sitting on top of a brown wooden table, not beside it — clearly ON the surface.",
    expressions:
      "Cat: comfortable perched ON table, relaxed satisfied smile (NOT bored default). Dog: looking up pointing at cat ON table, teaching expression. Cow: confirming nod. Pig: impressed look up.",
  },
  for: {
    scene:
      "Golden dog offers a red heart-shaped cookie to gray cat — gift for you.",
    expressions:
      "Dog: generous giving smile, offering cookie warmly (NOT shocked). Cat: touched grateful happy eyes receiving gift (NOT lazy unamused). Cow: touched aww expression. Pig: clasped paws happy.",
  },
  have: {
    scene:
      "Pink pig hugging a huge stack of colorful donuts — has many treats.",
    expressions:
      "Pig: delighted possessive hug, big happy grin (NOT tired sweat). Cat: jealous-amused look. Dog: amazed happy eyes at pile. Cow: gentle laugh at pig's hoard.",
  },
  do: {
    scene:
      "Gray cat washing dishes at a sink with soap bubbles — doing a chore.",
    expressions:
      "Cat: focused diligent scrubbing, determined but not angry face (NOT bored lazy — actively working). Dog: drying dishes helpfully, earnest helpful smile. Cow: stacking clean plates. Pig: wiping counter diligently.",
  },
  no: {
    scene:
      "Gray cat and golden dog firmly refuse a giant tempting candy jar offered by a shadowy hand from off-screen — arms crossed, stepping back.",
    expressions:
      "Cat: stern firm NO — narrowed eyes, flat mouth, one paw in stop gesture (NOT lazy unamused default). Dog: serious head-shake, lips pressed, eyebrows angled down (NOT surprised). Cow: disapproving look with arms crossed. Pig: skeptical one eyebrow raised, arms folded.",
  },
  know: {
    scene:
      "Gray cat with a lightbulb glowing above its head, smiling confidently — I know!",
    expressions:
      "Cat: eureka confident grin, bright eyes, chest puffed (NOT bored half-lidded). Dog: impressed amazed smile (NOT O-mouth shock). Cow: nodding wise approval. Pig: applauding the idea.",
  },
  not: {
    scene:
      "Gray cat pushes away a slice of cake with a firm paw — not eating that.",
    expressions:
      "Cat: firm refusal face, pushing plate away, decisive eyes (NOT lazy). Dog: supporting head-shake no. Cow: arms crossed declining. Pig: turning away politely from cake.",
  },
  can: {
    scene:
      "Golden dog lifting a heavy teal dumbbell easily, flexing — I can!",
    expressions:
      "Dog: confident strong grin, flexing proudly (NOT shocked O-mouth). Cat: impressed cheering. Cow: amazed proud smile. Pig: fan cheering with paws up.",
  },
  all: {
    scene:
      "All four mascots gather around a table covered with every kind of fruit — all of them.",
    expressions:
      "All four: excited abundance — happy eyes at full table (Cat alert not bored, Dog joyful not shocked, Cow delighted mouth closed, Pig happy not tired). Gesturing at ALL the fruit.",
  },
  with: {
    scene:
      "Gray cat and golden dog walking side by side sharing one umbrella in gentle rain — with each other.",
    expressions:
      "Cat: cozy companion smile under shared umbrella (NOT bored). Dog: happy walking together, content side-glance (NOT O-mouth). Cow and pig: also paired under second umbrella, warm friendship.",
  },
  just: {
    scene:
      "Gray cat holding up a single tiny cookie while a huge empty jar sits behind — just one.",
    expressions:
      "Cat: emphasizing ONE with raised single paw, slightly smug small smile (NOT bored). Dog: understanding nod at single cookie. Cow: surprised-at-small-amount raised eyebrow. Pig: disappointed cute pout at empty jar.",
  },
  get: {
    scene:
      "Golden dog catching a falling star-shaped cookie mid-air — get it!",
    expressions:
      "Dog: athletic focused leap, determined happy eyes catching cookie (NOT frozen shock). Cat: cheering excited. Cow: watching tensely then relieved smile. Pig: paws over eyes then celebrating.",
  },
  here: {
    scene:
      "Gray cat planting a small flag on the ground right at its feet — right here.",
    expressions:
      "Cat: proud HERE gesture stomping paw on spot, confident smile (NOT lazy). Dog: looking down at exact spot, understanding nod. Cow: pointing at ground. Pig: circling the spot curiously.",
  },
  but: {
    scene:
      "Gray cat wants sunshine yet holds a teal umbrella in rain — contrast, but.",
    expressions:
      "Cat: conflicted expression — half hopeful sun-side, half resigned rain-side (NOT flat bored). Dog: sympathetic confused tilt. Cow: gentle shrug. Pig: split reaction amused.",
  },
  there: {
    scene:
      "Golden dog pointing across a meadow at a tiny house on the far hill — over there.",
    expressions:
      "Dog: pointing arm extended, eyes on distant house (NOT O-mouth shock). Cat: squinting far away. Cow: shading eyes looking there. Pig: tiptoeing to see farther.",
  },
  so: {
    scene:
      "Pink pig eating a very spicy red pepper with steam from ears — so hot!",
    expressions:
      "Pig: comedic spicy reaction — watering eyes, open panting mouth, steam puffs (NOT tired default — active spicy reaction). Cat: wincing sympathetically. Dog: fanning pig. Cow: offering milk glass.",
  },
  they: {
    scene:
      "Three identical teal birds on a branch while all four mascots watch together — they.",
    expressions:
      "All mascots: collective watching — pointing at the three birds together (Cat interested, Dog curious calm, Cow gentle smile, Pig excited pointing). Group observing THEY.",
  },
  right: {
    scene:
      "Golden dog gives a big green checkmark card to gray cat — correct, right answer.",
    expressions:
      "Dog: approving proud grin presenting checkmark (NOT shocked). Cat: pleased relieved correct-answer smile (NOT bored). Cow: clapping approval. Pig: victory dance.",
  },
  like: {
    scene:
      "Gray cat hugging a fish-shaped plush toy lovingly — I like this.",
    expressions:
      "Cat: affectionate hugging plush, eyes closed happy smile (NOT lazy unamused). Dog: warm smile watching. Cow: gentle fond expression. Pig: heart-eyes admiring the plush.",
  },
  out: {
    scene:
      "Gray cat stepping out through an open front door into bright sunshine — going out.",
    expressions:
      "Cat: eager exit stride, excited eyes toward sunshine (NOT bored). Dog: holding door open helpfully, encouraging smile. Cow: waving goodbye from inside. Pig: following cat out happily.",
  },
  go: {
    scene:
      "Golden dog mid-run on a path with motion lines, eager expression — go!",
    expressions:
      "Dog: energetic running grin, forward momentum (NOT frozen shocked O). Cat: running alongside determined. Cow: jogging gently. Pig: waddling fast with effort face.",
  },
  she: {
    scene:
      "Golden dog offering flowers to a female stick-figure silhouette in a window — she.",
    expressions:
      "Dog: gentle respectful offering smile (NOT O-mouth). Cat: supportive smile from behind. Cow: kind warm expression. Pig: shy happy clasped paws.",
  },
  up: {
    scene:
      "Tall blue cow stretching neck even higher toward fluffy clouds — up above.",
    expressions:
      "Cow: stretching upward curious wonder, eyes on clouds, mouth closed (NO tongue). Cat: pointing up amazed. Dog: jumping trying to reach. Pig: looking up with wide happy eyes.",
  },
  about: {
    scene:
      "Gray cat surrounded by floating icons: clock, heart, book, apple — talking about many things.",
    expressions:
      "Cat: animated explaining gesture, engaged storyteller face (NOT bored half-lidded). Dog: listening fascinated. Cow: thoughtful nod at each icon. Pig: curious pointing at icons.",
  },
  if: {
    scene:
      "Gray cat at a fork in the road with two paths, thinking hard — if this or that.",
    expressions:
      "Cat: weighing options, one eyebrow up, paw on chin (thoughtful NOT bored). Dog: equally torn looking both ways. Cow: pondering. Pig: scratching head uncertain cute.",
  },
  at: {
    scene:
      "Golden dog sitting at a bus stop bench under a clock — at the stop.",
    expressions:
      "Dog: patient waiting sit, calm content eyes checking clock (NOT shocked O). Cat: sitting AT bench too, relaxed. Cow: standing AT stop sign. Pig: reading schedule board AT stop.",
  },
  now: {
    scene:
      "All mascots looking at a wall clock whose hands point to current moment — now.",
    expressions:
      "All four: urgent present-moment focus — eyes on clock, slight hurry or attention (Cat alert, Dog attentive calm, Cow serious gentle, Pig excited ready). NOW urgency.",
  },
  come: {
    scene:
      "Golden dog beckoning with paw toward a cozy open door with warm light — come here.",
    expressions:
      "Dog: inviting beckoning wave, warm welcoming eyes (NOT shocked). Cat: also beckoning from doorway, friendly smile. Cow: holding door open kindly. Pig: patting seat inviting.",
  },
  one: {
    scene:
      "Gray cat holding up exactly one finger while other paw hides a pile — only one.",
    expressions:
      "Cat: precise ONE gesture, sly smile showing single item (NOT bored). Dog: counting on paw confirming one. Cow: holding up one hoof. Pig: trying to grab hidden pile playfully.",
  },
  how: {
    scene:
      "Golden dog with tools and blueprint, scratching head — how to build.",
    expressions:
      "Dog: puzzled builder face, scratching head with wrench, curious frown (NOT O-mouth shock). Cat: studying blueprint seriously. Cow: measuring with tape. Pig: confused by instructions.",
  },
  well: {
    scene:
      "Pink pig drinking water and giving thumbs up, rosy cheeks — feeling well.",
    expressions:
      "Pig: healthy refreshed grin, thumbs up, rosy cheeks (NOT tired sweat — vibrant wellness). Cat: relieved happy for pig. Dog: cheerful check-up approval. Cow: gentle approving nod.",
  },
  want: {
    scene:
      "Gray cat reaching toward a shiny star cookie on a high shelf — want it.",
    expressions:
      "Cat: longing reaching eyes, eager open mouth wanting (NOT bored lazy). Dog: also reaching helpfully. Cow: lifting cat up to shelf. Pig: drooling hopeful cute face.",
  },
  think: {
    scene:
      "Gray cat at desk with puzzle pieces and a half-built teal block tower, one paw on chin, looking up at floating question-mark shapes (no letters, just curved hook shapes).",
    expressions:
      "Cat: curious thinking — one eyebrow up, eyes looking upward, paw on chin (thoughtful wonder, NOT default bored half-lidded). Dog: leaning in interested, curious wide eyes but calm mouth (NOT shocked gasp). Cow: pondering with hoof on chin. Pig: scratching head confused-cute.",
  },
  good: {
    scene:
      "Golden dog presenting a gold star sticker to gray cat — good job.",
    expressions:
      "Dog: proud praising smile giving star (NOT shocked). Cat: pleased proud receiving, happy eyes (NOT bored). Cow: applauding. Pig: cheering confetti toss.",
  },
  see: {
    scene:
      "Gray cat looking through a teal telescope at a sailboat on the sea — see far away.",
    expressions:
      "Cat: focused peering through telescope, wonder-smile (NOT bored). Dog: pointing at horizon excited discovery (NOT O-mouth). Cow: shading eyes looking. Pig: amazed at view.",
  },
  let: {
    scene:
      "Gray cat holding a gate open for golden dog to pass — let through.",
    expressions:
      "Cat: generous permitting gesture, kind smile holding gate (NOT lazy). Dog: grateful passing through, thankful eyes. Cow: waiting turn patiently. Pig: skipping through happily.",
  },
  why: {
    scene:
      "Golden dog shrugging with confused expression, scattered puzzle pieces — why?",
    expressions:
      "Dog: baffled shrug, raised eyebrows, palms up (NOT O-mouth shock — puzzled not scared). Cat: equally confused head tilt. Cow: pondering deeply. Pig: question-curve shapes above head.",
  },
  who: {
    scene:
      "All mascots in a lineup behind a curtain, one peeking — who is it?",
    expressions:
      "All four: mystery guessing game — curious suspicious playful faces (Cat sly peek, Dog excited guess, Cow thoughtful, Pig wide curious eyes). Identity mystery.",
  },
  as: {
    scene:
      "Gray cat dressed in a chef hat pretending to cook like a pro — as a chef.",
    expressions:
      "Cat: proud chef roleplay, confident cooking smile in hat (NOT bored). Dog: impressed customer eyes. Cow: sous-chef helping seriously. Pig: tasting soup happily.",
  },
  will: {
    scene:
      "Golden dog pointing at a calendar future date with a planned picnic marked — will happen.",
    expressions:
      "Dog: confident future-planning smile pointing ahead (NOT shocked). Cat: excited anticipation for future event. Cow: marking calendar carefully. Pig: packing picnic basket early.",
  },
  from: {
    scene:
      "Gray cat receiving a letter delivered from a distant blue mailbox — from far away.",
    expressions:
      "Cat: surprised-happy receiving letter, reading envelope (NOT bored). Dog: pointing back to far mailbox. Cow: post carrier wave from distance. Pig: curious about sender.",
  },
  when: {
    scene:
      "All mascots watching an hourglass with sand falling — when time comes.",
    expressions:
      "All four: patient anticipation watching sand fall (Cat focused, Dog eager waiting, Cow calm, Pig impatient cute foot-tap). Waiting for WHEN.",
  },
  back: {
    scene:
      "Gray cat walking back along footprints toward a cozy house — coming back.",
    expressions:
      "Cat: relieved homeward smile following footprints (NOT bored). Dog: running back excited to house. Cow: carrying home groceries happily. Pig: waving at house welcoming.",
  },
  okay: {
    scene:
      "Golden dog and gray cat doing an OK paw circle gesture together — okay!",
    expressions:
      "Dog: relaxed OK sign, easygoing grin (NOT shocked). Cat: matching OK gesture, satisfied smile (NOT bored). Cow and pig: thumbs up / OK hooves, all agreed.",
  },
  yes: {
    scene:
      "All four mascots at a picnic celebrating — green checkmark flag planted in cake, confetti in air, sunny meadow.",
    expressions:
      "Cat: big happy squint-smile, paws up cheering (NOT half-lidded bored). Dog: joyful open smile with normal round eyes (NOT frozen shocked O). Cow: delighted grin, one eye wink, horns bouncing (NO tongue out unless laughing). Pig: laughing with closed happy crescents for eyes (NOT tired squeezed / sweat drop).",
  },
  time: {
    scene:
      "Gray cat holding a round analog clock with visible hands, no numbers — time.",
    expressions:
      "Cat: serious timekeeper face checking clock (NOT bored). Dog: worried about being late, glancing at clock. Cow: calm punctual nod. Pig: rushing with toast in mouth comedic.",
  },
  look: {
    scene:
      "Golden dog with binoculars staring at a colorful bird in a tree — look!",
    expressions:
      "Dog: excited discovery pointing with binoculars (NOT O-mouth shock — eager look). Cat: also looking up alert. Cow: bending down to child's-eye view. Pig: gasping at colorful bird.",
  },
  take: {
    scene:
      "Gray cat taking the last cookie from a plate carefully — take one.",
    expressions:
      "Cat: careful gentle taking, respectful eyes on last cookie (NOT greedy bored). Dog: watching politely waiting turn. Cow: offering plate kindly. Pig: hopeful but patient.",
  },
  an: {
    scene:
      "Golden dog presenting a single orange to gray cat — an orange (one of many types).",
    expressions:
      "Dog: offering one orange warmly (NOT shocked). Cat: accepting with pleased smile (NOT bored). Cow: basket of varied fruits behind showing one type. Pig: sniffing orange curiously.",
  },
  man: {
    scene:
      "Gray cat tipping a hat to a friendly adult stick-figure gardener with a rake.",
    expressions:
      "Cat: polite respectful nod tipping hat (NOT lazy). Dog: friendly wave to man. Cow: courteous bow. Pig: offering flower to gardener.",
  },
  where: {
    scene:
      "Golden dog studying a simple map with a red X destination — where?",
    expressions:
      "Dog: lost searching face studying map (NOT O-mouth — focused searching). Cat: pointing different directions confused. Cow: rotating map helpfully. Pig: looking under bench comedic search.",
  },
  would: {
    scene:
      "Gray cat daydreaming in a thought cloud of flying on a dragon — would imagine.",
    expressions:
      "Cat: dreamy wishful smile eyes half-closed imagining (NOT bored — blissful fantasy). Dog: imagining same dream happily. Cow: wistful gentle smile. Pig: starry-eyed fantasy face.",
  },
  some: {
    scene:
      "Pink pig picking some (not all) strawberries from a bush into a small basket.",
    expressions:
      "Pig: selective picking satisfied smile, basket partially full (NOT tired). Cat: showing full bush vs small basket. Dog: eating one sneaked berry guilty-cute. Cow: indicating SOME remaining on bush.",
  },
  hey: {
    scene:
      "Golden dog waving both paws loudly from behind a fence — hey!",
    expressions:
      "Dog: loud friendly HEY wave, big open smile calling attention (NOT scared shock). Cat: surprised-turned-happy wave back. Cow: calling over fence. Pig: popping up waving energetically.",
  },
  tell: {
    scene:
      "Gray cat whispering a secret into golden dog's ear — tell you.",
    expressions:
      "Cat: conspiratorial whisper, hand cupped at mouth, sly smile (NOT bored). Dog: surprised-interested listening ear (mild surprise OK, NOT frozen O). Cow: trying to overhear comedic. Pig: shushing cow.",
  },
  or: {
    scene:
      "Gray cat choosing between a cupcake OR an ice cream cone on two plates.",
    expressions:
      "Cat: torn decision face looking left-right between choices (NOT bored). Dog: pointing at both options helpfully. Cow: weighing choices with scales. Pig: wanting both hands out.",
  },
  say: {
    scene:
      "Golden dog speaking with speech-bubble shapes but NO letters inside — saying something.",
    expressions:
      "Dog: animated talking mouth open mid-speech, expressive paws (NOT frozen O-shock — natural speaking). Cat: listening attentively nodding. Cow: responding with own bubble. Pig: excited interrupting.",
  },
  something: {
    scene:
      "Mystery object under a teal cloth on a table — something hidden.",
    expressions:
      "Cat: curious finger on chin guessing (NOT bored). Dog: excited reaching for cloth (NOT horror shock). Cow: guessing shapes with hands. Pig: peeking under cloth edge sneaky.",
  },
  down: {
    scene:
      "Gray cat sliding down a playground slide toward orange sand — down.",
    expressions:
      "Cat: thrilled sliding face wind-in-fur, eyes wide joy (NOT bored). Dog: waiting at bottom arms open. Cow: watching from top gentle smile. Pig: queued excited on ladder.",
  },
  then: {
    scene:
      "Gray cat finishing breakfast, empty plate, then walking toward open door — first eat, then leave.",
    expressions:
      "Cat: sequence shown — satisfied after-eating smile then eager exit face (NOT bored throughout). Dog: pointing from plate to door teaching sequence. Cow: first-this-then-that gesture. Pig: following sequence.",
  },
  little: {
    scene:
      "Tall blue cow looking down at a tiny pink pig on a stool — little vs big.",
    expressions:
      "Cow: gentle giant kind smile looking down, mouth closed (NO tongue). Pig: small cute proud standing on stool, happy little smile (NOT tired). Cat: size comparison gesture. Dog: measuring height amused.",
  },
  way: {
    scene:
      "Golden dog at start of a winding path leading to a small white house — the way home.",
    expressions:
      "Dog: hopeful path-finding expression, pointing down road (NOT shocked). Cat: reading path confidently. Cow: pointing direction kindly. Pig: marching on path determined.",
  },
  make: {
    scene:
      "Gray cat mixing batter in a bowl with flour and eggs — make a cake.",
    expressions:
      "Cat: focused baker concentration, slight flour on cheek (NOT bored lazy). Dog: cracking eggs helpfully. Cow: stirring gently. Pig: watching oven excited anticipation.",
  },
  too: {
    scene:
      "White mug overflowing with hot cocoa down the sides — too full.",
    expressions:
      "Pig: panicked too-much face as mug overflows (NOT tired — flustered). Cat: backing away from spill. Dog: grabbing napkins alarmed. Cow: gentle oops expression offering towel.",
  },
  never: {
    scene:
      "Gray cat crossing arms, turning from a 'closed forever' treasure chest — never.",
    expressions:
      "Cat: firm NEVER face, arms crossed, looking away (NOT lazy — absolute refusal). Dog: supporting stern head-shake. Cow: blocking chest with arm. Pig: X gesture with paws.",
  },
  by: {
    scene:
      "Gray cat painting a picture beside golden dog at easels — by each other / created by.",
    expressions:
      "Cat: focused painting beside partner, collaborative smile (NOT bored). Dog: painting at adjacent easel, happy side-by-side (NOT shocked). Cow: displaying finished art. Pig: signing painting proudly.",
  },
  over: {
    scene:
      "Golden dog jumping over a low teal hurdle on a track — over.",
    expressions:
      "Dog: athletic mid-jump determined grin (NOT shocked O — athletic focus). Cat: cheering from sideline. Cow: holding hurdle steady. Pig: impressed jaw-drop happy.",
  },
  more: {
    scene:
      "Pink pig pouring more cookies from a jar onto a plate that already has cookies.",
    expressions:
      "Pig: eager MORE gesture pouring happily (NOT tired). Cat: trying to stop overflow amused. Dog: excited at growing pile. Cow: gentle caution hand up.",
  },
  mean: {
    scene:
      "Gray cat with stern face pointing at broken vase while dog looks guilty — mean behavior.",
    expressions:
      "Cat: stern scolding disappointed face (NOT bored — actively upset). Dog: guilty ashamed drooped ears (NOT shocked O). Cow: sad disapproving look. Pig: hiding behind cow worried.",
  },
  very: {
    scene:
      "Golden dog beside a VERY giant ice cream tower twice its height — very big.",
    expressions:
      "Dog: awestruck amazed eyes at giant tower (wonder not horror shock). Cat: tiny comparison gesture. Cow: measuring tower height. Pig: ready to eat giant scoop excited.",
  },
  off: {
    scene:
      "Gray cat switching off a lamp, room going dark — off.",
    expressions:
      "Cat: sleepy satisfied click-OFF face, drowsy eyes (NOT bored default — tired bedtime). Dog: yawning ready for sleep. Cow: dimming lights gently. Pig: already asleep sitting up.",
  },
  sorry: {
    scene:
      "Gray cat offering a small flower bouquet with both paws to golden dog who sits with drooped ears on a park bench after a broken vase on the ground.",
    expressions:
      "Cat: guilty apologetic face — downturned mouth, ears back, teary eyes (NOT bored lazy). Dog: sad disappointed but forgiving — soft eyes, small frown (NOT shocked O-mouth). Pig in background: concerned sympathetic look. Cow: gentle worried tilt of head (mouth closed, NO silly tongue).",
  },
  give: {
    scene:
      "Pink pig handing a wrapped gift box to gray cat — give a gift.",
    expressions:
      "Pig: generous giving smile extending gift (NOT tired). Cat: surprised-touched receiving, happy eyes (NOT bored). Dog: applauding the giving. Cow: warm approving nod.",
  },
  thank: {
    scene:
      "Golden dog bowing with a thank-you bouquet to gray cat — thank you.",
    expressions:
      "Dog: grateful bow, sincere thankful eyes (NOT O-mouth). Cat: modest accepting smile, paws together (NOT bored). Cow: touched hand on heart. Pig: blowing kiss gratitude.",
  },
  love: {
    scene:
      "All four mascots forming a group hug in front of a sunset hill, small floating heart shapes (no text) in warm orange-pink sky.",
    expressions:
      "Cat: warm gentle closed-eye smile, leaning into hug (affectionate, NOT bored). Dog: happy soft smile, eyes closed content (NOT O-mouth shock). Cow: tender happy eyes, slight smile, leaning down to hug (NO silly tongue). Pig: blissful happy grin, rosy cheeks, eyes as happy arcs (NOT tired / sweat).",
  },
  people: {
    scene:
      "Four diverse stick-figure people silhouettes chatting in a park while mascots picnic nearby.",
    expressions:
      "Mascots: friendly observing PEOPLE — warm curious smiles watching humans (Cat interested, Dog happy calm, Cow gentle wave to people, Pig excited pointing). Not interacting as main focus.",
  },
  please: {
    scene:
      "Gray cat with pleading eyes offering a small empty cup — please?",
    expressions:
      "Cat: big pleading puppy-dog eyes, paws together begging (NOT bored lazy — earnest please). Dog: sympathetic considering. Cow: kindly reaching to help. Pig: passing teapot generously.",
  },
  sure: {
    scene:
      "Golden dog nodding confidently with a thumbs up — sure!",
    expressions:
      "Dog: confident sure nod, relaxed thumbs up grin (NOT shocked O). Cat: agreeing nod smile. Cow: hoof thumbs up. Pig: enthusiastic double thumbs up.",
  },
  any: {
    scene:
      "Gray cat pointing at any of three identical teal doors — any one works.",
    expressions:
      "Cat: casual any-will-do shrug, relaxed pick-any face (NOT bored — easygoing). Dog: opening one door experimentally. Cow: counting doors. Pig: eeny-meeny choosing comedic.",
  },
  only: {
    scene:
      "Pink pig guarding the ONLY cookie left on an otherwise empty plate.",
    expressions:
      "Pig: protective possessive guarding face over last cookie (NOT tired — vigilant). Cat: reaching sneaky. Dog: negotiating trade. Cow: gentle sharing suggestion.",
  },
  because: {
    scene:
      "Golden dog pointing at dark clouds as reason for carrying umbrella — because of rain.",
    expressions:
      "Dog: explaining BECAUSE gesture at clouds, teaching face (NOT shocked). Cat: understanding ah-ha nod. Cow: logical connecting dots gesture. Pig: already under umbrella smart face.",
  },
  two: {
    scene:
      "Gray cat holding up two fingers next to exactly two cupcakes on a tray.",
    expressions:
      "Cat: counting TWO proudly, clear V fingers (NOT bored). Dog: confirming count nodding. Cow: holding up two hooves. Pig: trying to eat one of two guilty.",
  },
  much: {
    scene:
      "Pink pig buried under a mountain of pillows — too much stuff.",
    expressions:
      "Pig: overwhelmed buried face, muffled help expression (NOT tired default — comedic overload). Cat: adding one more pillow mischievous. Dog: digging pig out. Cow: concerned gentle rescue.",
  },
  sir: {
    scene:
      "Gray cat politely tipping hat to a kind elderly gentleman silhouette with cane.",
    expressions:
      "Cat: formal polite bow, respectful eyes (NOT lazy). Dog: straight posture salute. Cow: curtsy-like polite nod. Pig: offering seat to sir kindly.",
  },
  maybe: {
    scene:
      "Golden dog balancing on a fence looking unsure between two paths — maybe.",
    expressions:
      "Dog: uncertain maybe shrug, wobbly balance, hesitant eyes (NOT shocked). Cat: equally undecided. Cow: listing pros on hooves. Pig: flipping coin comedic.",
  },
  help: {
    scene:
      "Golden dog helping tired pink pig carry heavy grocery bags up steps — help.",
    expressions:
      "Dog: supportive helpful strain smile carrying bags (NOT shocked). Pig: relieved grateful tired-but-thankful face (NOT default sweat — helped relief). Cat: holding door open. Cow: carrying extra bag kindly.",
  },
};

/** @deprecated Use CAST_WORD_IMAGE_ENTRIES — scene text only for script checks. */
export const CAST_WORD_IMAGE_SCENES: Readonly<Record<string, string>> =
  Object.fromEntries(
    Object.entries(CAST_WORD_IMAGE_ENTRIES).map(([word, entry]) => [
      word,
      entry.scene,
    ]),
  );

/** @deprecated Use CAST_DESIGN_ONLY */
export const CAST_IMAGE_STYLE = CAST_DESIGN_ONLY;

export function buildCastWordImagePrompt(word: string): string | null {
  const key = word.trim().toLowerCase();
  const entry = CAST_WORD_IMAGE_ENTRIES[key];
  if (!entry) return null;
  return `${CAST_DESIGN_ONLY} Word "${key}": ${entry.scene} EXPRESSIONS: ${entry.expressions}`;
}
