const POS_ALIASES: Record<string, string> = {
  noun: "noun",
  n: "noun",
  verb: "verb",
  v: "verb",
  adjective: "adjective",
  adj: "adjective",
  a: "adjective",
  adverb: "adverb",
  adv: "adverb",
  preposition: "preposition",
  prep: "preposition",
  pronoun: "pronoun",
  conjunction: "conjunction",
  interjection: "interjection",
  article: "article",
  number: "number",
  numeral: "number",
  determiner: "determiner",
};

/** High-frequency verbs that heuristics may miss. */
const COMMON_VERBS = new Set([
  "be",
  "have",
  "do",
  "go",
  "get",
  "make",
  "take",
  "see",
  "know",
  "think",
  "say",
  "come",
  "want",
  "use",
  "find",
  "give",
  "tell",
  "work",
  "call",
  "try",
  "ask",
  "need",
  "feel",
  "become",
  "leave",
  "put",
  "mean",
  "keep",
  "let",
  "begin",
  "seem",
  "help",
  "show",
  "hear",
  "play",
  "run",
  "move",
  "live",
  "believe",
  "bring",
  "happen",
  "write",
  "provide",
  "sit",
  "stand",
  "lose",
  "pay",
  "meet",
  "include",
  "continue",
  "set",
  "learn",
  "change",
  "lead",
  "understand",
  "watch",
  "follow",
  "stop",
  "create",
  "speak",
  "read",
  "allow",
  "add",
  "spend",
  "grow",
  "open",
  "walk",
  "win",
  "offer",
  "remember",
  "love",
  "consider",
  "appear",
  "buy",
  "wait",
  "serve",
  "die",
  "send",
  "expect",
  "build",
  "stay",
  "fall",
  "cut",
  "reach",
  "kill",
  "remain",
  "suggest",
  "raise",
  "pass",
  "sell",
  "require",
  "report",
  "decide",
  "pull",
  "prove",
]);

function inferWordTypeFromShape(word: string): string | null {
  const w = word.trim().toLowerCase();
  if (!w) return null;
  if (COMMON_VERBS.has(w)) return "verb";
  if (w.endsWith("tion") || w.endsWith("ness") || w.endsWith("ment") || w.endsWith("ity")) {
    return "noun";
  }
  if (w.endsWith("ly")) return "adverb";
  if (
    w.endsWith("able") ||
    w.endsWith("ful") ||
    w.endsWith("ive") ||
    w.endsWith("ous") ||
    w.endsWith("less")
  ) {
    return "adjective";
  }
  return null;
}

/** Normalize POS for display; returns null when unknown / not inferable. */
export function normalizeWordType(
  pos: string | null | undefined,
  word?: string,
): string | null {
  const raw = pos?.trim().toLowerCase();
  if (raw && raw !== "unknown") {
    return POS_ALIASES[raw] ?? raw;
  }
  return inferWordTypeFromShape(word ?? "");
}

export function isDisplayableWordType(
  pos: string | null | undefined,
  word?: string,
): boolean {
  return normalizeWordType(pos, word) !== null;
}

/** Map Datamuse single-letter POS tags to full names. */
export function datamuseTagToPos(tag: string): string | null {
  return normalizeWordType(tag);
}

const POS_VIETNAMESE: Record<string, string> = {
  noun: "Danh từ",
  verb: "Động từ",
  adjective: "Tính từ",
  adverb: "Trạng từ",
  preposition: "Giới từ",
  pronoun: "Đại từ",
  conjunction: "Liên từ",
  interjection: "Thán từ",
  article: "Mạo từ",
  number: "Số từ",
  numeral: "Số từ",
  determiner: "Hạn định từ",
};

/** Vietnamese label for part of speech (e.g. noun → Danh từ). */
export function wordTypeLabelVi(
  pos: string | null | undefined,
  word?: string,
): string | null {
  const normalized = normalizeWordType(pos, word);
  if (!normalized) return null;
  return POS_VIETNAMESE[normalized] ?? null;
}

export function isDisplayableWordTypeVi(
  pos: string | null | undefined,
  word?: string,
): boolean {
  return wordTypeLabelVi(pos, word) !== null;
}
