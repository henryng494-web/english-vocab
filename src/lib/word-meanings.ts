import { capitalizeFirst } from "@/lib/format-text";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";

export const WORD_REGISTERS = [
  "everyday",
  "formal",
  "legal",
  "technical",
  "literary",
  "slang",
] as const;

export type WordRegister = (typeof WORD_REGISTERS)[number];

const MEANING_LINE_DELIMITER = "\n";
const REGISTER_COLLATION_PREFIX = "__register:";

const REGISTER_LABELS_EN: Record<WordRegister, string> = {
  everyday: "Everyday",
  formal: "Formal",
  legal: "Formal",
  technical: "Technical",
  literary: "Literary",
  slang: "Slang",
};

const REGISTER_LABELS_VI: Record<WordRegister, string> = {
  everyday: "Đời thường",
  formal: "Trang trọng",
  legal: "Trang trọng",
  technical: "Chuyên ngành",
  literary: "Văn học",
  slang: "Lóng",
};

const EMBEDDED_REGISTER_HINT_RE =
  /\((trang trọng|pháp lý|học thuật|văn học|lóng|thân mật)\)/i;

const EMBEDDED_REGISTER_HINT_STRIP_RE =
  /\s*\((trang trọng|pháp lý|học thuật|văn học|lóng|thân mật)\)\s*/gi;

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
  const key = value.trim().toLowerCase() as WordRegister;
  return WORD_REGISTERS.includes(key) ? key : null;
}

/** English register label for app UI (Formal, Everyday, …). */
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
  return input.register ?? decodeRegisterFromCollocation(input.collocations);
}

/** UI fallback while cached rows still lack register metadata. */
export function displayWordRegister(
  register: WordRegister | null | undefined,
): WordRegister {
  return register ?? "everyday";
}

export function formatMeaningsForDisplay(text: string | null | undefined): string[] {
  return parseVietnameseMeanings(text)
    .map((line) => stripEmbeddedRegisterHints(line))
    .filter(Boolean)
    .map((line) => capitalizeFirst(line));
}
