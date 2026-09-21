import { capitalizeFirst } from "@/lib/format-text";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";
import { getStaticVietnamese } from "@/lib/static-vietnamese";
import { primaryVietnameseMeaning } from "@/lib/word-meanings";
import {
  translateDefinitionWithGemini,
  translateLearnerMeaningWithGemini,
} from "@/lib/gemini-core";
import {
  DEFAULT_LEARNER_LOCALE,
  type LearnerLocale,
} from "@/lib/learner-locale";
import { sanitizeLearnerText } from "@/lib/sanitize-learner";

export type ResolveViOptions = {
  /** Prefer Gemini; MyMemory is last resort when Gemini is unavailable. */
  allowGemini?: boolean;
  learnerLocale?: LearnerLocale;
};

type MyMemoryResponse = {
  responseData?: { translatedText?: string };
  responseStatus?: number;
};

async function fetchMyMemoryLangPair(
  text: string,
  langpair: string,
  locale: LearnerLocale,
): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      q: text.trim(),
      langpair,
    });
    const response = await fetch(
      `https://api.mymemory.translated.net/get?${params}`,
      { next: { revalidate: 86400 } },
    );
    if (!response.ok) return null;

    const data = (await response.json()) as MyMemoryResponse;
    const translated = data.responseData?.translatedText?.trim();
    if (!translated) return null;

    const normalized = translated.toLowerCase();
    const sourceLower = text.trim().toLowerCase();
    if (normalized === sourceLower) return null;

    // MyMemory quota warning text
    if (normalized.includes("mymemory warning")) return null;

    return sanitizeLearnerText(translated, locale) || null;
  } catch {
    return null;
  }
}

/** Free EN→learner lookup via MyMemory (no key required). */
export async function fetchMyMemoryTranslation(
  word: string,
  locale: LearnerLocale = DEFAULT_LEARNER_LOCALE,
): Promise<string | null> {
  const target = locale === "es" ? "es" : "vi";
  return fetchMyMemoryLangPair(word, `en|${target}`, locale);
}

/** Vietnamese gloss line → Spanish (fallback when Gemini is unavailable). */
export async function fetchMyMemoryViToLearner(
  text: string,
  locale: LearnerLocale,
): Promise<string | null> {
  if (locale === "vi") return text.trim() || null;
  if (locale === "es") {
    return fetchMyMemoryLangPair(text, "vi|es", locale);
  }
  return null;
}

/** Heuristic: text is likely English (not a Vietnamese gloss). */
export function looksLikeEnglish(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const vietnameseDiacritics =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  if (vietnameseDiacritics.test(trimmed)) return false;

  const englishMarkers =
    /\b(the|and|or|of|to|in|for|with|a|an|is|are|was|were|that|this|which|used|meaning|refer|describe|someone|something|person|people|object|action)\b/i;
  if (englishMarkers.test(trimmed)) return true;

  // ASCII-only text without English function words is usually a Vietnamese gloss
  // written without diacritics (e.g. "xung quanh, bao quanh").
  return false;
}

/** Detect auto-built glosses like "Có nghĩa là chết đói một điều gì đó." */
export function isTemplateVietnameseDefinition(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  if (/một điều gì đó/i.test(trimmed)) return true;
  if (/^có nghĩa là\s+/i.test(trimmed)) return true;
  return false;
}

/** Strip legacy template wrapper; returns empty when nothing usable remains. */
export function stripTemplateVietnameseDefinition(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return "";
  const match = trimmed.match(
    /^có nghĩa là\s+(.+?)(?:\s+một điều gì đó)?\.?$/iu,
  );
  if (!match?.[1]) return trimmed;
  return capitalizeFirst(match[1].trim());
}

/** Build a short Vietnamese gloss from meaning text (no meta "Có nghĩa là…" wrapper). */
export function buildDefinitionFromVietnameseMeaning(
  vietnameseMeaning: string,
  _wordType?: string | null,
): string {
  const raw = primaryVietnameseMeaning(vietnameseMeaning) || vietnameseMeaning.trim();
  if (!raw || raw === "—") return "";

  const segments = raw
    .split(/[/|,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!segments.length) return "";

  const phrase = segments
    .map((seg, index) => {
      const s = seg.trim();
      if (index === 0) {
        return s.charAt(0).toUpperCase() + s.slice(1);
      }
      return s.toLowerCase();
    })
    .join(", ");

  return phrase.endsWith(".") ? phrase : `${phrase}.`;
}

export function isMissingDefinition(text: string | null | undefined): boolean {
  if (!text?.trim()) return true;
  const t = text.trim().toLowerCase();
  return t === "—" || t.includes("không tìm thấy định nghĩa");
}

/**
 * Resolve a short Vietnamese definition — never returns raw English when possible.
 */
export async function resolveVietnameseDefinition(
  word: string,
  sourceDefinition: string,
  options?: ResolveViOptions & {
    vietnameseMeaning?: string;
    wordType?: string | null;
  },
): Promise<string> {
  const trimmed = sourceDefinition?.trim();
  let result = "—";

  if (trimmed && !isMissingDefinition(trimmed)) {
    if (!looksLikeEnglish(trimmed)) {
      result = capitalizeFirst(trimmed);
    } else if (options?.allowGemini && process.env.GEMINI_API_KEY?.trim()) {
      try {
        const geminiDef = await translateDefinitionWithGemini(
          word,
          trimmed,
          options?.learnerLocale,
        );
        if (geminiDef?.trim()) result = capitalizeFirst(geminiDef.trim());
      } catch (error) {
        console.warn(`Gemini VI definition failed for "${word}":`, error);
      }
    }

    if (isMissingDefinition(result)) {
      const fromMyMemory = await fetchMyMemoryTranslation(
        trimmed,
        options?.learnerLocale,
      );
      if (fromMyMemory && !looksLikeEnglish(fromMyMemory)) {
        result = capitalizeFirst(fromMyMemory);
      }
    }
  }

  if (isMissingDefinition(result) && options?.vietnameseMeaning) {
    const built = buildDefinitionFromVietnameseMeaning(
      options.vietnameseMeaning,
      options.wordType,
    );
    if (built) return built;
  }

  if (isMissingDefinition(result) && options?.allowGemini && process.env.GEMINI_API_KEY?.trim()) {
    try {
      const geminiDef = await translateDefinitionWithGemini(
        word,
        undefined,
        options?.learnerLocale ?? DEFAULT_LEARNER_LOCALE,
      );
      if (geminiDef?.trim()) return capitalizeFirst(geminiDef.trim());
    } catch (error) {
      console.warn(`Gemini VI definition (no source) failed for "${word}":`, error);
    }
  }

  return isMissingDefinition(result) ? "—" : result;
}

/**
 * Resolve Vietnamese meaning — never falls back to English definition text.
 */
export async function resolveVietnameseMeaning(
  word: string,
  options?: ResolveViOptions,
): Promise<string> {
  const locale = options?.learnerLocale ?? DEFAULT_LEARNER_LOCALE;

  if (locale === "vi") {
    const staticVi = getStaticVietnamese(word);
    if (staticVi) return sanitizeVietnameseText(staticVi) || staticVi;
  }

  if (options?.allowGemini && process.env.GEMINI_API_KEY?.trim()) {
    try {
      const gemini = await translateLearnerMeaningWithGemini(word, locale);
      if (gemini?.trim()) return gemini.trim();
    } catch (error) {
      console.warn(`Gemini ${locale} translation failed for "${word}":`, error);
    }
  }

  const fromMyMemory = await fetchMyMemoryTranslation(word, locale);
  if (fromMyMemory) {
    return sanitizeLearnerText(fromMyMemory, locale) || fromMyMemory;
  }

  return "—";
}

/** Detect cached rows where EN definition was stored as Vietnamese. */
export function isLikelyEnglishAsVietnamese(
  vietnamese?: string | null,
  english?: string | null,
): boolean {
  if (!vietnamese?.trim() || !english?.trim()) return false;
  const vi = vietnamese.trim().toLowerCase();
  const en = english.trim().toLowerCase();
  return vi === en || en.startsWith(vi) || vi.startsWith(en);
}
