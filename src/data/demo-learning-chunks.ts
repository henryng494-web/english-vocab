/** Pilot: collocation + chunk hints for a handful of words (Van review). */

export type LearningChunkPhrase = {
  en: string;
  vi: string;
};

export type LearningChunkEntry = {
  /** Words/phrases that pair naturally with the headword. */
  collocations: LearningChunkPhrase[];
  /** Fixed expressions worth learning as a whole unit. */
  chunks: LearningChunkPhrase[];
};

export const DEMO_LEARNING_CHUNKS: Record<string, LearningChunkEntry> = {
  hole: {
    collocations: [
      { en: "a hole in my pocket", vi: "lỗ trong túi quần" },
      { en: "dig a hole", vi: "đào hố" },
    ],
    chunks: [
      {
        en: "There is a hole in my pocket.",
        vi: "Có một cái lỗ trong túi quần của tôi.",
      },
    ],
  },
  delightful: {
    collocations: [
      { en: "a delightful meal", vi: "bữa ăn ngon" },
      { en: "delightful weather", vi: "thời tiết dễ chịu" },
    ],
    chunks: [
      {
        en: "We had a delightful time.",
        vi: "Chúng tôi đã có khoảng thời gian rất vui.",
      },
    ],
  },
  loose: {
    collocations: [
      { en: "loose change", vi: "tiền lẻ" },
      { en: "come loose", vi: "bị lỏng / tuột ra" },
      { en: "loose clothing", vi: "quần áo rộng" },
    ],
    chunks: [
      {
        en: "The screw came loose.",
        vi: "Con ốc vít bị lỏng ra.",
      },
    ],
  },
  decision: {
    collocations: [
      { en: "make a decision", vi: "đưa ra quyết định" },
      { en: "a tough decision", vi: "quyết định khó" },
    ],
    chunks: [
      {
        en: "It's time to make a decision.",
        vi: "Đã đến lúc đưa ra quyết định.",
      },
    ],
  },
  piece: {
    collocations: [
      { en: "a piece of cake", vi: "dễ như ăn bánh" },
      { en: "a piece of advice", vi: "một lời khuyên" },
    ],
    chunks: [
      {
        en: "Don't worry — it's a piece of cake.",
        vi: "Đừng lo — chuyện đó dễ lắm.",
      },
    ],
  },
};
