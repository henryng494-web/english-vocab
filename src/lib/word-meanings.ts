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

const REGISTER_LABELS_VI: Record<WordRegister, string> = {
  everyday: "Đời thường",
  formal: "Trang trọng",
  legal: "Pháp lý",
  technical: "Chuyên ngành",
  literary: "Văn học",
  slang: "Lóng",
};

export function normalizeWordRegister(value: unknown): WordRegister | null {
  if (typeof value !== "string") return null;
  const key = value.trim().toLowerCase() as WordRegister;
  return WORD_REGISTERS.includes(key) ? key : null;
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

export function formatMeaningsForDisplay(text: string | null | undefined): string[] {
  return parseVietnameseMeanings(text).map((line) => capitalizeFirst(line));
}
