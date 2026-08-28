import { capitalizeFirst } from "@/lib/format-text";
import { sanitizeVietnameseText } from "@/lib/sanitize-vi";
import { normalizeWordType } from "@/lib/word-type";
import { getStaticVietnamese } from "@/lib/static-vietnamese";
import {
  translateDefinitionWithGemini,
  translateVietnameseWithGemini,
} from "@/lib/gemini-core";

export type ResolveViOptions = {
  /** Prefer Gemini; MyMemory is last resort when Gemini is unavailable. */
  allowGemini?: boolean;
};

type MyMemoryResponse = {
  responseData?: { translatedText?: string };
  responseStatus?: number;
};

/** Free EN→VI lookup via MyMemory (no key required). */
export async function fetchMyMemoryTranslation(word: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({
      q: word.trim(),
      langpair: "en|vi",
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
    const wordLower = word.trim().toLowerCase();
    if (normalized === wordLower) return null;

    // MyMemory quota warning text
    if (normalized.includes("mymemory warning")) return null;

    return sanitizeVietnameseText(translated) || null;
  } catch {
    return null;
  }
}

/** Heuristic: text is likely English (no Vietnamese diacritics). */
export function looksLikeEnglish(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  const vietnameseDiacritics =
    /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
  if (vietnameseDiacritics.test(trimmed)) return false;
  return /[a-zA-Z]/.test(trimmed);
}

/** Build a short Vietnamese definition sentence from meaning text. */
export function buildDefinitionFromVietnameseMeaning(
  vietnameseMeaning: string,
  wordType?: string | null,
): string {
  const raw = vietnameseMeaning.trim();
  if (!raw || raw === "—") return "";

  const segments = raw
    .split(/[/|,;]/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (!segments.length) return "";

  const lowered = segments
    .map((seg, index) => {
      const s = seg.trim();
      if (index === 0) {
        return s.charAt(0).toLowerCase() + s.slice(1);
      }
      return s.toLowerCase();
    })
    .join(", ");

  const pos = normalizeWordType(wordType, undefined);
  const isVerb = pos === "verb";

  const sentence = isVerb
    ? `Có nghĩa là ${lowered} một điều gì đó.`
    : `Có nghĩa là ${lowered}.`;

  return capitalizeFirst(sentence);
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
        const geminiDef = await translateDefinitionWithGemini(word, trimmed);
        if (geminiDef?.trim()) result = capitalizeFirst(geminiDef.trim());
      } catch (error) {
        console.warn(`Gemini VI definition failed for "${word}":`, error);
      }
    }

    if (isMissingDefinition(result)) {
      const fromMyMemory = await fetchMyMemoryTranslation(trimmed);
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
      const geminiDef = await translateDefinitionWithGemini(word);
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
  const staticVi = getStaticVietnamese(word);
  if (staticVi) return sanitizeVietnameseText(staticVi) || staticVi;

  if (options?.allowGemini && process.env.GEMINI_API_KEY?.trim()) {
    try {
      const geminiVi = await translateVietnameseWithGemini(word);
      if (geminiVi?.trim()) return geminiVi.trim();
    } catch (error) {
      console.warn(`Gemini VI translation failed for "${word}":`, error);
    }
  }

  const fromMyMemory = await fetchMyMemoryTranslation(word);
  if (fromMyMemory) return sanitizeVietnameseText(fromMyMemory) || fromMyMemory;

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
