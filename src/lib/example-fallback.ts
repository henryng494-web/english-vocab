import { capitalizeFirst } from "@/lib/format-text";
import {
  hasQualityExamples,
  isGenericExample,
  containsUntranslatedHeadword,
  isLikelyVietnameseGloss,
  isNaturalExample,
  keepNaturalExamples,
} from "@/lib/example-quality";
import type { VocabExample } from "@/lib/parse-examples";
import { fetchMyMemoryTranslation } from "@/lib/translate-vi";
import { normalizeWordType } from "@/lib/word-type";

const TARGET_COUNT = 2;

export {
  hasQualityExamples,
  isGenericExample,
  isNaturalExample,
  keepNaturalExamples,
} from "@/lib/example-quality";

function displayWord(word: string): string {
  return word.trim() || "word";
}

/** Primary Vietnamese gloss only — never join multiple senses with semicolons. */
export function primaryMeaningLabel(meaning?: string | null): string {
  const trimmed = meaning?.trim();
  if (!trimmed || trimmed === "—") return "";
  return trimmed.split(/[/|,;]/)[0]?.trim() ?? trimmed;
}

function meaningLabel(meaning?: string | null): string {
  return primaryMeaningLabel(meaning);
}

function vietnameseExampleWord(
  meaning?: string | null,
  fallback = "từ này",
): string {
  const label = meaningLabel(meaning);
  if (label && isLikelyVietnameseGloss(label)) {
    return label.toLowerCase();
  }
  return fallback;
}

/**
 * Last-resort everyday sentences (Hole-style), never meta study templates.
 * Used only when Gemini is unavailable.
 */
export function buildNaturalExamples(
  word: string,
  pos?: string | null,
  meaning?: string | null,
): VocabExample[] {
  const w = displayWord(word);
  const type = normalizeWordType(pos, w) ?? "noun";
  const viWord = vietnameseExampleWord(meaning, "từ này");

  const byPos: Record<string, VocabExample[]> = {
    noun: [
      {
        en: `I saw a ${w} on the table.`,
        vi: `Tôi thấy một ${viWord} trên bàn.`,
      },
      {
        en: `The ${w} is in the kitchen.`,
        vi: `${capitalizeFirst(viWord)} ở trong bếp.`,
      },
    ],
    verb: [
      {
        en: `She ${w} the door every morning.`,
        vi: `Cô ấy ${viWord} cửa mỗi sáng.`,
      },
      {
        en: `He ${w} it before he leaves.`,
        vi: `Anh ấy ${viWord} nó trước khi đi.`,
      },
    ],
    adjective: [
      {
        en: `Good rest is ${w} after a long day.`,
        vi: `Nghỉ ngơi tốt ${viWord} sau một ngày dài.`,
      },
      {
        en: `This step is ${w} for success.`,
        vi: `Bước này ${viWord} cho thành công.`,
      },
      {
        en: `The room looks ${w} in this light.`,
        vi: `Căn phòng trông ${viWord} trong ánh sáng này.`,
      },
      {
        en: `It feels ${w} outside today.`,
        vi: `Hôm nay ngoài trời cảm thấy ${viWord}.`,
      },
    ],
    adverb: [
      {
        en: `She spoke ${w} to the whole class.`,
        vi: `Cô ấy nói ${viWord} với cả lớp.`,
      },
      {
        en: `He finished the race ${w}.`,
        vi: `Anh ấy chạy xong cuộc đua ${viWord}.`,
      },
    ],
    number: [
      {
        en: `I have ${w} books at home.`,
        vi: `Tôi có ${viWord} quyển sách ở nhà.`,
      },
      {
        en: `She is ${w} years old.`,
        vi: `Cô ấy ${viWord} tuổi.`,
      },
    ],
    pronoun: [
      {
        en: `${capitalizeFirst(w)} is waiting outside.`,
        vi: `${capitalizeFirst(viWord)} đang đợi bên ngoài.`,
      },
      {
        en: `I saw ${w} at school today.`,
        vi: `Hôm nay tôi gặp ${viWord} ở trường.`,
      },
    ],
    preposition: [
      {
        en: `The keys are ${w} the bag.`,
        vi: `Chìa khóa ở ${viWord} túi.`,
      },
      {
        en: `We sat ${w} the old tree.`,
        vi: `Chúng tôi ngồi ${viWord} cây cũ.`,
      },
    ],
    conjunction: [
      {
        en: `I like tea ${w} coffee.`,
        vi: `Tôi thích trà ${viWord} cà phê.`,
      },
      {
        en: `Stay here ${w} wait for me.`,
        vi: `Ở lại đây ${viWord} đợi tôi.`,
      },
    ],
    article: [
      {
        en: `${capitalizeFirst(w)} cat sat on the chair.`,
        vi: `${capitalizeFirst(viWord)} con mèo ngồi trên ghế.`,
      },
      {
        en: `I need ${w} new notebook.`,
        vi: `Tôi cần ${viWord} quyển vở mới.`,
      },
    ],
    interjection: [
      {
        en: `${capitalizeFirst(w)}, that was so close.`,
        vi: `${capitalizeFirst(viWord)}, suýt nữa thì.`,
      },
      {
        en: `${capitalizeFirst(w)}! The food is ready.`,
        vi: `${capitalizeFirst(viWord)}! Đồ ăn đã sẵn sàng.`,
      },
    ],
    determiner: [
      {
        en: `${capitalizeFirst(w)} students arrived early.`,
        vi: `${capitalizeFirst(viWord)} học sinh đến sớm.`,
      },
      {
        en: `I like ${w} song a lot.`,
        vi: `Tôi rất thích ${viWord} bài hát.`,
      },
    ],
  };

  return (
    byPos[type] ?? byPos.noun ?? [
      {
        en: `I saw a ${w} on the table.`,
        vi: `Tôi thấy ${viWord} trên bàn.`,
      },
      {
        en: `The ${w} is in the kitchen.`,
        vi: `${capitalizeFirst(viWord)} ở trong bếp.`,
      },
    ]
  );
}

/** Fill missing or English-leaked Vietnamese lines via EN→VI lookup. */
export async function fillExampleTranslations(
  examples: VocabExample[],
  word?: string,
): Promise<VocabExample[]> {
  const filled: VocabExample[] = [];
  for (const item of examples) {
    const en = item.en?.trim() ?? "";
    if (!en) continue;
    let vi = item.vi?.trim() ?? "";
    const head = word?.trim() ?? "";
    if (
      !vi ||
      (head && containsUntranslatedHeadword(vi, head))
    ) {
      vi = (await fetchMyMemoryTranslation(en)) || vi;
    }
    if (!vi) continue;
    if (head && containsUntranslatedHeadword(vi, head)) continue;
    filled.push({ en, vi });
  }
  return filled;
}

/** Keep natural examples; fill with everyday sentences only — never study-meta templates. */
export function ensureExamples(
  word: string,
  examples: VocabExample[] | undefined,
  pos?: string | null,
  meaning?: string | null,
): VocabExample[] {
  const kept = keepNaturalExamples(word, examples, pos);
  if (kept.length >= TARGET_COUNT) return kept.slice(0, TARGET_COUNT);

  const fallback = buildNaturalExamples(word, pos, meaning);
  const usedEn = new Set(kept.map((item) => item.en.toLowerCase()));
  for (const item of fallback) {
    if (kept.length >= TARGET_COUNT) break;
    if (isGenericExample(item.en)) continue;
    if (usedEn.has(item.en.toLowerCase())) continue;
    kept.push(item);
  }
  return kept.slice(0, TARGET_COUNT);
}
