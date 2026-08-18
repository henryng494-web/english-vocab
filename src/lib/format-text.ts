/** Capitalize the first character (supports Vietnamese). */
export function capitalizeFirst(text: string | null | undefined): string {
  if (!text?.trim()) return text ?? "";
  const trimmed = text.trim();
  return trimmed[0].toLocaleUpperCase("vi") + trimmed.slice(1);
}
