import { capitalizeFirst } from "@/lib/format-text";
import {
  hasQualityExamples,
  isGenericExample,
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
  const type = normalizeWordType(pos, w) ?? "unknown";
  const vi = meaningLabel(meaning);
  const viWord = vi ? vi.toLowerCase() : w;

  const byPos: Record<string, VocabExample[]> = {
    noun: [
      {
        en: `There is a ${w} in my pocket.`,
        vi: `Có một ${viWord} trong túi quần của tôi.`,
      },
      {
        en: `I found a ${w} in the garden.`,
        vi: `Tôi tìm thấy một ${viWord} trong vườn.`,
      },
    ],
    verb: [
      {
        en: `Please ${w} the door for me.`,
        vi: `Làm ơn ${viWord} cửa giúp tôi.`,
      },
      {
        en: `They ${w} after dinner.`,
        vi: `Họ ${viWord} sau bữa tối.`,
      },
    ],
    adjective: [
      {
        en: `The sky looks ${w} today.`,
        vi: `Bầu trời hôm nay trông ${viWord}.`,
      },
      {
        en: `She wore a ${w} dress.`,
        vi: `Cô ấy mặc một chiếc váy ${viWord}.`,
      },
    ],
    adverb: [
      {
        en: `Please speak ${w} to them.`,
        vi: `Hãy nói ${viWord} với họ.`,
      },
      {
        en: `He walked ${w} down the street.`,
        vi: `Anh ấy đi ${viWord} trên phố.`,
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
    byPos[type] ?? [
      {
        en: `There is a ${w} near the door.`,
        vi: `Có một ${viWord} gần cửa.`,
      },
      {
        en: `She talked about the ${w}.`,
        vi: `Cô ấy nói về ${viWord}.`,
      },
    ]
  );
}

/** Fill missing Vietnamese lines via free EN→VI lookup (static preset cards). */
export async function fillExampleTranslations(
  examples: VocabExample[],
): Promise<VocabExample[]> {
  const filled: VocabExample[] = [];
  for (const item of examples) {
    const en = item.en?.trim() ?? "";
    if (!en) continue;
    const existingVi = item.vi?.trim() ?? "";
    const vi = existingVi || (await fetchMyMemoryTranslation(en)) || "";
    if (!vi) continue;
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
  const kept = keepNaturalExamples(word, examples);
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
