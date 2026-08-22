import { capitalizeFirst } from "@/lib/format-text";

/**
 * CJK / kana / hangul. Gemini sometimes drops a Chinese character into a
 * Vietnamese gloss (scheme → "âm谋" instead of "âm mưu").
 */
const FOREIGN_SCRIPT =
  /[\u3000-\u303F\u3040-\u30FF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uAC00-\uD7AF]/u;

/** Common Sino-Vietnamese substitutions Gemini uses instead of quốc ngữ. */
const CJK_TO_VI: Record<string, string> = {
  谋: "mưu",
  謀: "mưu",
  阴: "âm",
  陰: "âm",
  国: "quốc",
  國: "quốc",
  学: "học",
  學: "học",
  语: "ngữ",
  語: "ngữ",
  会: "hội",
  會: "hội",
  计: "kế",
  計: "kế",
  划: "hoạch",
  畫: "hoạch",
  图: "đồ",
  圖: "đồ",
};

export function containsForeignScript(text: string | null | undefined): boolean {
  return Boolean(text && FOREIGN_SCRIPT.test(text));
}

export function sanitizeVietnameseText(text: string | null | undefined): string {
  if (!text) return "";
  let out = "";
  for (const ch of text) {
    if (FOREIGN_SCRIPT.test(ch)) {
      const vi = CJK_TO_VI[ch];
      if (!vi) continue;
      if (out && !/[\s,;:/\-–—]$/.test(out) && !/^[\s,;]/.test(vi)) {
        out += " ";
      }
      out += vi;
      continue;
    }
    out += ch;
  }

  return out
    .replace(/[ \t]+/g, " ")
    .replace(/\s+([,;:./])/g, "$1")
    .replace(/([,;])\s*[,;]+/g, "$1 ")
    .replace(/^[,;\s]+|[,;\s]+$/g, "")
    .trim();
}

export function formatVietnameseMeaning(
  text: string | null | undefined,
): string {
  return capitalizeFirst(sanitizeVietnameseText(text));
}
