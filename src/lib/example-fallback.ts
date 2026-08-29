import { capitalizeFirst } from "@/lib/format-text";
import {
  containsUntranslatedHeadword,
  isLikelyVietnameseGloss,
  keepNaturalExamples,
  viTranslationMatchesGloss,
} from "@/lib/example-quality";
import type { VocabExample } from "@/lib/parse-examples";
import { translateExampleWithGemini } from "@/lib/gemini-core";
import { fetchMyMemoryTranslation } from "@/lib/translate-vi";
import { normalizeWordType } from "@/lib/word-type";
import {
  alignmentMeaningLines,
  primaryVietnameseMeaning,
} from "@/lib/word-meanings";

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

/** Primary Vietnamese gloss only — first of up to two stored lines. */
export function primaryMeaningLabel(meaning?: string | null): string {
  return primaryVietnameseMeaning(meaning);
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

/** Offline examples that pass quality checks and match displayed gloss lines. */
const SENSE_ALIGNED_TEMPLATES: Record<
  string,
  Array<{ en: string; vi: string }>
> = {
  adjective: [
    {
      en: "The food at that restaurant was {w}.",
      vi: "Đồ ăn ở nhà hàng đó {term}.",
    },
    {
      en: "A {w} oak tree stood beside the road.",
      vi: "Một cây sồi {term} đứng bên cạnh con đường.",
    },
    {
      en: "My sister felt {w} after the good news.",
      vi: "Em gái tôi cảm thấy {term} sau tin vui.",
    },
  ],
  verb: [
    {
      en: "I like to {w} pictures on weekends.",
      vi: "Tôi thích {term} tranh vào cuối tuần.",
    },
    {
      en: "What did you {w} from that meeting?",
      vi: "Bạn đã {term} gì từ cuộc họp đó?",
    },
    {
      en: "They {w} together every Friday evening.",
      vi: "Họ {term} cùng nhau mỗi tối thứ Sáu.",
    },
  ],
  noun: [
    {
      en: "The {w} on the desk caught my eye.",
      vi: "{term} trên bàn đã thu hút sự chú ý của tôi.",
    },
    {
      en: "We talked about the {w} over coffee.",
      vi: "Chúng tôi nói về {term} trong lúc uống cà phê.",
    },
  ],
  adverb: [
    {
      en: "She answered the question {w}.",
      vi: "Cô ấy trả lời câu hỏi một cách {term}.",
    },
    {
      en: "He finished the task {w} than yesterday.",
      vi: "Anh ấy hoàn thành công việc {term} hơn hôm qua.",
    },
  ],
  preposition: [
    {
      en: "We walked {w} the park after lunch.",
      vi: "Chúng tôi đi dạo {term} công viên sau bữa trưa.",
    },
    {
      en: "It costs {w} fifty dollars.",
      vi: "Giá {term} năm mươi đô la.",
    },
    {
      en: "There are trees {w} the house.",
      vi: "Có cây {term} ngôi nhà.",
    },
  ],
  conjunction: [
    {
      en: "I like tea {w} coffee in the morning.",
      vi: "Buổi sáng tôi thích trà {term} cà phê.",
    },
    {
      en: "Stay here {w} wait for me, please.",
      vi: "Ở đây {term} đợi tôi, làm ơn.",
    },
  ],
  pronoun: [
    {
      en: "{W} is waiting outside the office.",
      vi: "{Term} đang đợi bên ngoài văn phòng.",
    },
    {
      en: "I saw {w} at school today.",
      vi: "Hôm nay tôi gặp {term} ở trường.",
    },
  ],
};

function viTermForGloss(line: string): string {
  const normalized = line.trim().toLowerCase();
  const words = normalized.split(/\s+/).filter(Boolean);
  if (words.length <= 2) return normalized;
  return words[words.length - 1] ?? normalized;
}

function applySenseTemplate(
  template: { en: string; vi: string },
  word: string,
  glossLine: string,
): VocabExample {
  const w = displayWord(word);
  const term = viTermForGloss(glossLine);
  const capitalized = capitalizeFirst(w);
  return {
    en: template.en.replace(/\{W\}/g, capitalized).replace(/\{w\}/g, w),
    vi: template.vi
      .replace(/\{Term\}/g, capitalizeFirst(term))
      .replace(/\{term\}/g, term),
  };
}

/** Gemini-free bilingual examples aligned to displayed Vietnamese glosses. */
export function buildSenseAlignedExamples(
  word: string,
  pos?: string | null,
  meaning?: string | null,
): VocabExample[] {
  const type = normalizeWordType(pos, word) ?? "noun";
  const templates =
    SENSE_ALIGNED_TEMPLATES[type] ??
    SENSE_ALIGNED_TEMPLATES.noun ??
    [];
  const meaningLines = alignmentMeaningLines(meaning);
  if (!templates.length || !meaningLines.length) return [];

  const results: VocabExample[] = [];
  if (meaningLines.length >= 2) {
    for (let index = 0; index < TARGET_COUNT; index += 1) {
      const line = meaningLines[Math.min(index, meaningLines.length - 1)]!;
      const template = templates[Math.min(index, templates.length - 1)]!;
      results.push({
        ...applySenseTemplate(template, word, line),
        senseIndex: index + 1,
      });
    }
    return results;
  }

  const line = meaningLines[0]!;
  for (let index = 0; index < TARGET_COUNT; index += 1) {
    const template = templates[Math.min(index, templates.length - 1)]!;
    results.push(applySenseTemplate(template, word, line));
  }
  return results;
}

function senseMeaningForExample(
  meaningLines: string[],
  index: number,
  senseIndex?: number,
): string | null {
  if (!meaningLines.length) return null;
  if (meaningLines.length >= 2) {
    const senseNumber = senseIndex ?? index + 1;
    return meaningLines[Math.min(Math.max(senseNumber, 1), meaningLines.length) - 1]!;
  }
  return meaningLines[0]!;
}

/** Fill missing or English-leaked Vietnamese lines — Gemini first, MyMemory last. */
export async function fillExampleTranslations(
  examples: VocabExample[],
  word?: string,
  pos?: string | null,
  meaning?: string | null,
): Promise<VocabExample[]> {
  const meaningLines = alignmentMeaningLines(meaning);
  const filled: VocabExample[] = [];
  for (const [index, item] of examples.entries()) {
    const en = item.en?.trim() ?? "";
    if (!en) continue;
    const senseMeaning = senseMeaningForExample(
      meaningLines,
      index,
      item.senseIndex,
    );
    let vi = item.vi?.trim() ?? "";
    const head = word?.trim() ?? "";
    const needsTranslation =
      !vi ||
      (head && containsUntranslatedHeadword(vi, head)) ||
      (senseMeaning && !viTranslationMatchesGloss(vi, senseMeaning));
    if (needsTranslation) {
      vi =
        (await translateExampleWithGemini(
          en,
          head || en,
          pos,
          senseMeaning ?? meaning,
        )) ||
        (await fetchMyMemoryTranslation(en)) ||
        vi;
    }
    if (!vi) continue;
    if (head && containsUntranslatedHeadword(vi, head)) continue;
    filled.push({ en, vi, senseIndex: item.senseIndex });
  }
  return filled;
}

/** Re-translate examples whose Vietnamese gloss does not match the stored meaning lines. */
export async function alignExampleTranslations(
  examples: VocabExample[],
  word: string,
  pos?: string | null,
  meaning?: string | null,
): Promise<VocabExample[]> {
  const meaningLines = alignmentMeaningLines(meaning);
  if (!meaningLines.length) return examples;

  const aligned: VocabExample[] = [];
  for (const [index, item] of examples.entries()) {
    const en = item.en?.trim() ?? "";
    if (!en) continue;
    const senseMeaning = senseMeaningForExample(
      meaningLines,
      index,
      item.senseIndex,
    );
    let vi = item.vi?.trim() ?? "";
    if (
      !vi ||
      (senseMeaning && !viTranslationMatchesGloss(vi, senseMeaning))
    ) {
      vi =
        (await translateExampleWithGemini(en, word, pos, senseMeaning ?? meaning)) ||
        vi;
    }
    if (!vi) continue;
    aligned.push({ en, vi, senseIndex: item.senseIndex });
  }
  return aligned;
}

/** Keep natural examples; fill with everyday sentences only — never study-meta templates. */
export function ensureExamples(
  word: string,
  examples: VocabExample[] | undefined,
  pos?: string | null,
  meaning?: string | null,
): VocabExample[] {
  const kept = keepNaturalExamples(word, examples, pos, meaning);
  if (kept.length >= TARGET_COUNT) return kept.slice(0, TARGET_COUNT);

  const fallback = buildNaturalExamples(word, pos, meaning);
  const usedEn = new Set(kept.map((item) => item.en.toLowerCase()));
  for (const item of fallback) {
    if (kept.length >= TARGET_COUNT) break;
    if (usedEn.has(item.en.toLowerCase())) continue;
    kept.push(item);
  }
  return kept.slice(0, TARGET_COUNT);
}
