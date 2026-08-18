const EXAMPLE_DELIMITER = "\n---\n";
const PAIR_DELIMITER = "|||";

export type VocabExample = {
  en: string;
  vi: string;
};

function normalizeExample(item: string | VocabExample): VocabExample | null {
  if (typeof item === "string") {
    const trimmed = item.trim();
    if (!trimmed) return null;
    if (trimmed.includes(PAIR_DELIMITER)) {
      const [en, ...rest] = trimmed.split(PAIR_DELIMITER);
      return { en: en.trim(), vi: rest.join(PAIR_DELIMITER).trim() };
    }
    const dash = trimmed.match(/^(.+?)\s+[—–-]\s+(.+)$/);
    if (dash && /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(dash[2])) {
      return { en: dash[1].trim(), vi: dash[2].trim() };
    }
    return { en: trimmed, vi: "" };
  }
  const en = item.en?.trim() ?? "";
  if (!en) return null;
  return { en, vi: item.vi?.trim() ?? "" };
}

export function serializeExamples(
  examples: Array<string | VocabExample>,
): string {
  return examples
    .map(normalizeExample)
    .filter((item): item is VocabExample => Boolean(item))
    .map((item) =>
      item.vi ? `${item.en}${PAIR_DELIMITER}${item.vi}` : item.en,
    )
    .join(EXAMPLE_DELIMITER);
}

export function parseExamples(raw: unknown): VocabExample[] {
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((item) =>
        typeof item === "string" || (item && typeof item === "object")
          ? normalizeExample(item as string | VocabExample)
          : null,
      )
      .filter((item): item is VocabExample => Boolean(item));
  }
  if (typeof raw !== "string" || !raw.trim()) return [];

  const parts = raw.includes(EXAMPLE_DELIMITER)
    ? raw.split(EXAMPLE_DELIMITER)
    : [raw];

  return parts
    .map((part) => normalizeExample(part))
    .filter((item): item is VocabExample => Boolean(item));
}
