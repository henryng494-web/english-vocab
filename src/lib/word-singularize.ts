/** Singularize common English plurals for image keyword lookup. */
export function singularizeForLookup(word: string): string {
  const key = word.trim().toLowerCase();
  if (key.length < 4) return key;
  if (key.endsWith("ies") && key.length > 4) {
    return `${key.slice(0, -3)}y`;
  }
  if (
    key.endsWith("ches") ||
    key.endsWith("shes") ||
    key.endsWith("sses") ||
    key.endsWith("xes") ||
    key.endsWith("zes")
  ) {
    return key.slice(0, -2);
  }
  if (key.endsWith("s") && !key.endsWith("ss") && !key.endsWith("us")) {
    return key.slice(0, -1);
  }
  return key;
}
