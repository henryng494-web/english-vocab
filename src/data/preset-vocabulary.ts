import { SPOKEN_FREQUENCY_RANKS } from "@/data/spoken-frequency-ranks";

export type WordRange = {
  id: string;
  label: string;
  min: number;
  max: number;
};

export type PresetWord = {
  word: string;
  rank: number;
};

export const WORD_RANGES: WordRange[] = [
  { id: "1-100", label: "Rank 1 - 100", min: 1, max: 100 },
  { id: "101-200", label: "Rank 101 - 200", min: 101, max: 200 },
  { id: "201-300", label: "Rank 201 - 300", min: 201, max: 300 },
  { id: "301-500", label: "Rank 301 - 500", min: 301, max: 500 },
  { id: "501-1000", label: "Rank 501 - 1000", min: 501, max: 1000 },
  { id: "1001-3000", label: "Rank 1001 - 3000", min: 1001, max: 3000 },
  { id: "3001-5000", label: "Rank 3001 - 5000", min: 3001, max: 5000 },
  {
    id: "5001-plus",
    label: "Rank 5001+",
    min: 5001,
    max: Number.MAX_SAFE_INTEGER,
  },
];

/** Vocabulary inventory. Frequency ranks are assigned from SUBTLEX-US below. */
const VOCABULARY_GROUPS: string[][] = [
  // Foundation words
  [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
    "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
    "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
    "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
    "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
    "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
    "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
    "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
    "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",
  ],
  // Numbers, colors, days, and common words
  [
    "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "red", "white", "blue", "green", "yellow", "black", "orange", "brown", "color",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty",
    "week", "month", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
    "man", "find", "here", "thing", "many", "need", "feel", "great", "where",
    "help", "through", "much", "before", "line", "right", "too", "mean", "old",
    "same", "tell", "boy", "follow", "came", "show", "every", "around",
    "form", "small", "put", "end", "does", "another", "read", "hand", "port",
    "large", "spell", "add", "land", "must", "big", "high", "such",
    "house", "picture", "try", "again", "animal", "point", "mother", "world", "near",
    "father", "head", "stand",
  ],
  // Months, larger numbers, and common words
  [
    "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december",
    "thirty", "forty", "fifty", "hundred", "thousand", "pink", "purple", "gray",
    "sea", "draw", "left", "late", "run", "don't", "while", "press", "close", "night",
    "real", "life", "few", "north", "open", "seem", "together", "next", "children",
    "begin", "got", "walk", "example", "ease", "paper", "group", "always", "music", "those",
    "both", "mark", "often", "letter", "until", "mile", "river", "car", "feet", "care",
    "second", "book", "carry", "took", "science", "eat", "room", "friend", "began", "idea",
    "fish", "mountain", "stop", "once", "base", "hear", "horse", "cut", "sure", "watch",
    "face", "wood", "main", "enough", "plain", "girl", "usual", "young", "ready",
    "above", "ever", "list", "though", "talk", "bird", "soon", "body",
    "dog", "family", "direct", "pose", "leave", "song", "measure", "door", "product",
    "short", "numeral", "class", "wind", "question", "happen", "complete", "ship", "area", "half",
    "rock", "order", "fire", "south", "problem",
  ],
  // Extended vocabulary
  [
    "top", "whole", "king", "space", "heard", "best", "hour", "better", "during", "state",
    "remember", "step", "early", "hold", "west", "ground", "interest", "reach", "fast", "keep",
    "verb", "sing", "listen", "table", "travel", "less", "morning", "simple",
    "several", "vowel", "toward", "war", "lay", "against", "pattern", "slow", "center", "love",
    "person", "money", "serve", "appear", "road", "map", "rain", "rule", "govern", "pull",
    "cold", "notice", "voice", "unit", "power", "town", "fine", "certain", "fall", "lead",
    "cry", "dark", "machine", "note", "wait", "plan", "figure", "star", "box", "noun",
    "field", "rest", "correct", "able", "pound", "done", "beauty", "drive", "stood", "contain",
    "front", "teach", "final", "gave", "quick", "develop", "ocean", "warm",
    "free", "minute", "strong", "special", "mind", "behind", "clear", "tail", "produce", "fact",
    "street", "inch", "multiply", "nothing", "course", "stay", "wheel", "full", "force",
    "object", "decide", "surface", "deep", "moon", "island", "foot", "system", "busy", "test",
    "record", "boat", "common", "gold", "possible", "plane", "stead", "dry", "wonder", "laugh",
    "ago", "ran", "check", "game", "shape", "equate", "hot", "miss", "brought",
    "heat", "snow", "tire", "bring", "yes", "distant", "fill", "east", "paint", "language",
    "among", "grand", "ball", "yet", "wave", "drop", "heart", "present", "heavy", "dance",
    "engine", "position", "arm", "wide", "sail", "material", "size", "vary", "settle", "speak",
    "weight", "general", "matter", "circle", "pair", "include", "divide", "syllable", "felt", "perhaps",
    "pick", "sudden", "count", "square", "reason", "length", "represent", "art", "subject", "region",
    "energy", "hunt", "probable", "bed", "brother", "egg", "ride", "cell", "believe", "fraction",
    "forest", "sit", "race", "window", "store", "summer", "train", "sleep", "prove", "lone",
    "leg", "exercise", "sat", "written", "wild", "school", "grow", "study", "still", "learn",
    "plant", "cover", "food",
  ],
  // Extended vocabulary
  [
    "sign", "visit", "past", "soft", "fun", "bright", "gas", "weather", "million",
    "bear", "finish", "happy", "hope", "flower", "clothe", "strange", "gone", "jump", "baby",
    "village", "meet", "root", "buy", "raise", "solve", "metal", "whether", "push",
    "paragraph", "third", "shall", "held", "hair", "describe", "cook", "floor", "either",
    "result", "burn", "hill", "safe", "cat", "century", "consider", "type", "law", "bit",
    "coast", "copy", "phrase", "silent", "tall", "sand", "soil", "roll", "temperature", "finger",
    "industry", "value", "fight", "lie", "beat", "excite", "natural", "view", "sense", "ear",
    "else", "quite", "broke", "case", "middle", "kill", "son", "lake", "moment", "scale",
    "loud", "spring", "observe", "child", "straight", "consonant", "nation", "dictionary", "milk", "speed",
    "method", "organ", "pay", "age", "section", "dress", "cloud", "surprise", "quiet", "stone",
    "tiny", "climb", "cool", "design", "poor", "lot", "experiment", "bottom", "key", "iron",
  ],
  // Extended vocabulary
  [
    "single", "stick", "flat", "skin", "smile", "crease", "hole", "trade", "melody",
    "trip", "office", "receive", "row", "mouth", "exact", "symbol", "die", "least", "trouble",
    "shout", "except", "wrote", "seed", "tone", "join", "suggest", "clean", "break", "lady",
    "yard", "rise", "bad", "blow", "oil", "blood", "touch", "grew", "cent", "mix",
    "team", "wire", "cost", "lost", "brown", "wear", "garden", "equal", "sent", "choose",
    "fell", "fit", "flow", "fair", "bank", "collect", "save", "control", "decimal", "gentle",
    "woman", "captain", "practice", "separate", "difficult", "doctor", "please", "protect", "noon", "whose",
    "locate", "ring", "character", "insect", "caught", "period", "indicate", "radio", "spoke", "atom",
  ],
  // Extended vocabulary
  [
    "human", "history", "effect", "electric", "expect", "crop", "modern", "element", "hit", "student",
    "corner", "party", "supply", "bone", "rail", "imagine", "provide", "agree", "thus", "capital",
    "won't", "chair", "danger", "fruit", "rich", "thick", "soldier", "process", "operate", "guess",
    "necessary", "sharp", "wing", "create", "neighbor", "wash", "bat", "rather", "crowd", "corn",
    "compare", "poem", "string", "bell", "depend", "meat", "rub", "tube", "famous", "dollar",
    "stream", "fear", "sight", "thin", "triangle", "planet", "hurry", "chief", "colony", "clock",
  ],
];

/**
 * SUBTLEX-US measures spoken-conversation frequency from movie/TV subtitles,
 * which systematically undercounts two closed word classes that this app's
 * curriculum still needs to teach early:
 *
 * 1. Spelled-out numbers and month names — subtitle transcribers usually
 *    write dates/quantities as digits ("14", "Dec. 25") rather than spelling
 *    them out, so words like "fourteen" or "december" look far rarer than
 *    they actually are in spoken English.
 * 2. Basic grammar/math terms ("noun", "verb", "vowel", "consonant",
 *    "syllable", "numeral", "decimal", "fraction", "multiply", "divide",
 *    "equate") — these are genuinely rare in casual conversation, but they
 *    are exactly the vocabulary a structured English course introduces
 *    early to describe the language and counting system itself, so ranking
 *    them as "rare/advanced" alongside topic-specific words like "colony"
 *    or "insect" is misleading for a learner.
 * 3. "triangle" — the app already ranks its usual companions "circle" and
 *    "square" as common (below 3000), so leaving the third basic shape at
 *    rank 7592 made the trio inconsistent for no good pedagogical reason.
 * 4. "length" — its close synonyms "size" (961), "weight" (1665) and
 *    "measure" (4221) all rank far lower; "length" is a clear outlier
 *    within its own word family rather than a genuinely rarer concept.
 *
 * These overrides only touch that narrow, well-defined set of closed-class
 * curriculum words; every other word keeps its real SUBTLEX-derived rank.
 */
const CURRICULUM_RANK_OVERRIDES: Readonly<Record<string, number>> = {
  thirteen: 3700,
  fourteen: 3800,
  seventeen: 4200,
  eighteen: 4300,
  nineteen: 4900,
  january: 3950,
  february: 4150,
  december: 4950,
  verb: 3050,
  noun: 3150,
  fraction: 3250,
  multiply: 3350,
  divide: 3450,
  vowel: 3550,
  syllable: 3650,
  decimal: 3750,
  numeral: 3850,
  equate: 3950,
  consonant: 4050,
  triangle: 2650,
  length: 1750,
};

export const PRESET_WORDS: PresetWord[] = [
  ...new Set(VOCABULARY_GROUPS.flat()),
]
  .map((word) => ({
    word,
    rank:
      CURRICULUM_RANK_OVERRIDES[word] ??
      SPOKEN_FREQUENCY_RANKS[word] ??
      Number.MAX_SAFE_INTEGER,
  }))
  .sort((a, b) => a.rank - b.rank || a.word.localeCompare(b.word));

export function getRangeById(id: string): WordRange | undefined {
  return WORD_RANGES.find((r) => r.id === id);
}

export function getWordsInRange(min: number, max: number): PresetWord[] {
  return PRESET_WORDS.filter((w) => w.rank >= min && w.rank <= max);
}

export function getWordsByRangeId(rangeId: string): PresetWord[] {
  const range = getRangeById(rangeId);
  if (!range) return [];
  return getWordsInRange(range.min, range.max);
}
