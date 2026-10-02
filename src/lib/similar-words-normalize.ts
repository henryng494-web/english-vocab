/** Normalize learner-facing similar words (1–3 English tokens). */
export function normalizeSimilarWords(
  raw: unknown,
  headword: string,
  familyWords: string[] = [],
  max = 3,
): string[] {
  const blocked = new Set(
    [headword, ...familyWords].map((item) => item.trim().toLowerCase()),
  );
  const items = Array.isArray(raw) ? raw : [];
  const out: string[] = [];

  for (const item of items) {
    const word = String(item ?? "")
      .trim()
      .toLowerCase();
    if (!/^[a-z][a-z'-]{0,24}$/.test(word)) continue;
    if (blocked.has(word)) continue;
    if (out.includes(word)) continue;
    out.push(word);
    if (out.length >= max) break;
  }

  return out;
}
