import type { LearnerLocale } from "@/lib/learner-locale";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";

/** Normalize learner gloss / example translation for display and storage. */
export function sanitizeLearnerText(
  text: string | null | undefined,
  locale: LearnerLocale,
): string {
  const trimmed = text?.trim() ?? "";
  if (!trimmed) return "";
  if (locale === "vi") return sanitizeVietnameseText(trimmed) || trimmed;
  return trimmed.replace(/\s+/g, " ");
}
