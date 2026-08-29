import { capitalizeFirst } from "@/lib/format-text";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";

export const WORD_REGISTERS = ["informal", "neutral", "formal"] as const;

export type WordRegister = (typeof WORD_REGISTERS)[number];

const MEANING_LINE_DELIMITER = "\n";
const REGISTER_COLLATION_PREFIX = "__register:v2:";
const LEGACY_REGISTER_COLLATION_PREFIX = "__register:";

const REGISTER_LABELS_EN: Record<WordRegister, string> = {
  informal: "Informal",
  neutral: "Neutral",
  formal: "Formal",
};

const REGISTER_LABELS_VI: Record<WordRegister, string> = {
  informal: "Không trang trọng",
  neutral: "Trung tính",
  formal: "Trang trọng",
};

const EMBEDDED_REGISTER_HINT_RE =
  /\((trang trọng|trung tính|pháp lý|học thuật|văn học|lóng|thân mật|informal|neutral|formal)\)/i;

const EMBEDDED_REGISTER_HINT_STRIP_RE =
  /\s*\((trang trọng|trung tính|pháp lý|học thuật|văn học|lóng|thân mật|informal|neutral|formal)\)\s*/gi;

/** True when meaning text still carries old inline register hints. */
export function hasEmbeddedRegisterHints(text: string | null | undefined): boolean {
  if (!text?.trim()) return false;
  return EMBEDDED_REGISTER_HINT_RE.test(text);
}

/** Remove register hints duplicated from the Register badge, e.g. "(trang trọng)". */
export function stripEmbeddedRegisterHints(text: string): string {
  return text
    .replace(EMBEDDED_REGISTER_HINT_STRIP_RE, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function normalizeWordRegister(value: unknown): WordRegister | null {
  if (typeof value !== "string") return null;
  const key = value.trim().toLowerCase();
  if (key === "informal" || key === "neutral" || key === "formal") return key;
  return null;
}

/** True when collocations use pre-v2 register storage and need re-classification. */
export function isLegacyRegisterCollocation(
  collocations: string | null | undefined,
): boolean {
  if (!collocations?.startsWith(LEGACY_REGISTER_COLLATION_PREFIX)) return false;
  return !collocations.startsWith(REGISTER_COLLATION_PREFIX);
}

/** English register label for app UI (Informal, Formal). */
export function registerLabel(
  register: WordRegister | null | undefined,
): string | null {
  if (!register) return null;
  return REGISTER_LABELS_EN[register] ?? capitalizeFirst(register);
}

export function registerLabelVi(register: WordRegister | null | undefined): string | null {
  if (!register) return null;
  return REGISTER_LABELS_VI[register] ?? capitalizeFirst(register);
}

/** Parse up to 2 Vietnamese gloss lines from stored text. */
export function parseVietnameseMeanings(text: string | null | undefined): string[] {
  const raw = sanitizeVietnameseText(text);
  if (!raw) return [];

  const byLine = raw
    .split(MEANING_LINE_DELIMITER)
    .map((line) => line.trim())
    .filter(Boolean);
  if (byLine.length > 1) return byLine.slice(0, 2);

  const single = byLine[0] ?? raw;
  if (single.includes(" / ")) {
    return single
      .split(/\s+\/\s+/)
      .map((part) => part.trim())
      .filter(Boolean)
      .slice(0, 2);
  }

  return [single];
}

export function primaryVietnameseMeaning(text: string | null | undefined): string {
  return parseVietnameseMeanings(text)[0] ?? "";
}

export function serializeVietnameseMeanings(meanings: string[]): string {
  return meanings
    .map((item) => sanitizeVietnameseText(item))
    .filter(Boolean)
    .slice(0, 2)
    .join(MEANING_LINE_DELIMITER);
}

export function encodeRegisterCollocation(
  register: WordRegister | null | undefined,
): string | null {
  if (!register) return null;
  return `${REGISTER_COLLATION_PREFIX}${register}`;
}

export function decodeRegisterFromCollocation(
  collocations: string | null | undefined,
): WordRegister | null {
  if (!collocations?.startsWith(REGISTER_COLLATION_PREFIX)) return null;
  return normalizeWordRegister(
    collocations.slice(REGISTER_COLLATION_PREFIX.length),
  );
}

export function resolveWordRegister(input: {
  register?: WordRegister | null;
  collocations?: string | null;
}): WordRegister | null {
  const fromField = input.register ? normalizeWordRegister(input.register) : null;
  if (fromField) return fromField;
  return decodeRegisterFromCollocation(input.collocations);
}

/** UI fallback when register metadata is missing on cached rows. */
export function displayWordRegister(
  register: WordRegister | null | undefined,
): WordRegister {
  return normalizeWordRegister(register ?? "") ?? "neutral";
}

/** Extract a short domain hint from parentheses, e.g. "(âm thanh)" → "âm thanh". */
function extractMeaningContext(line: string): string | null {
  const match = line.match(/\(([^)]+)\)/);
  if (!match?.[1]?.trim()) return null;
  const inner = match[1].trim();
  const firstPhrase = inner.split(/[,，;；]/)[0]?.trim();
  return firstPhrase || null;
}

/** Remove parenthetical clarifiers like "(âm thanh)" from a gloss line. */
function stripMeaningClarifiers(line: string): string {
  return line
    .replace(/\([^)]*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Split a gloss into comma-separated synonym parts. */
export function splitMeaningSynonyms(line: string): string[] {
  const cleaned = stripMeaningClarifiers(stripEmbeddedRegisterHints(line));
  if (!cleaned) return [];
  return cleaned
    .split(/[,，;；]/)
    .map((part) => part.trim())
    .filter(Boolean);
}

/**
 * Vietnamese phrases that should appear in an example translation for this gloss.
 * Longest phrases first so "rút ra" is preferred over "rút".
 */
export function glossAlignmentTerms(line: string): string[] {
  const terms = new Set<string>();
  const parts = splitMeaningSynonyms(line);

  for (const part of parts) {
    const lower = part.toLowerCase();
    if (lower) terms.add(lower);
    const words = lower.split(/\s+/).filter(Boolean);
    if (words.length > 1) {
      terms.add(words[0]!);
      terms.add(words[words.length - 1]!);
    }
    if (lower.includes("/")) {
      for (const segment of lower.split("/")) {
        const trimmed = segment.trim();
        if (trimmed) terms.add(trimmed);
        const segmentWords = trimmed.split(/\s+/).filter(Boolean);
        if (segmentWords.length > 0) {
          terms.add(segmentWords[segmentWords.length - 1]!);
        }
      }
    }
  }

  const full = stripMeaningClarifiers(stripEmbeddedRegisterHints(line)).toLowerCase();
  if (full) terms.add(full);

  return [...terms].sort((a, b) => b.length - a.length);
}

/** Lowercase gloss text; only the first character of the displayed line should be capitalized. */
function normalizeGlossCasing(text: string): string {
  return text.trim().toLocaleLowerCase("vi");
}

/**
 * Compact one gloss line for card display.
 * When multiple senses are shown, keep one core word per line.
 * When only one sense is shown, allow up to two descriptive words.
 * If a domain hint exists in parentheses, prefix it to avoid ambiguity
 * (e.g. "To, lớn (âm thanh)" → "Âm thanh to").
 */
export function compactMeaningLineForDisplay(
  line: string,
  maxSynonyms: number,
): string {
  const context = extractMeaningContext(line);
  const parts = splitMeaningSynonyms(line);

  if (parts.length === 0) {
    const fallback = stripMeaningClarifiers(stripEmbeddedRegisterHints(line));
    return capitalizeFirst(normalizeGlossCasing(fallback));
  }

  const synonyms = parts
    .slice(0, maxSynonyms)
    .map((part) => normalizeGlossCasing(part))
    .join(", ");

  if (context) {
    return capitalizeFirst(
      `${normalizeGlossCasing(context)} ${synonyms}`.trim(),
    );
  }

  return capitalizeFirst(synonyms);
}

export function formatMeaningsForDisplay(text: string | null | undefined): string[] {
  const meanings = parseVietnameseMeanings(text)
    .map((line) => line.trim())
    .filter(Boolean);

  const maxSynonymsPerLine = meanings.length >= 2 ? 1 : 2;

  return meanings
    .slice(0, 2)
    .map((line) => compactMeaningLineForDisplay(line, maxSynonymsPerLine));
}

/** Gloss lines shown on the card — examples must follow these, not hidden synonyms. */
export function alignmentMeaningLines(text: string | null | undefined): string[] {
  return formatMeaningsForDisplay(text);
}
