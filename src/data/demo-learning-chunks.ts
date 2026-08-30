/** Pilot: collocation + chunk hints for a handful of words (Van review). */

export type LearningChunkPhrase = {
  en: string;
  vi: string;
  /** 1-based gloss line when the headword has multiple meanings. */
  sense?: number;
};

export type LearningChunkEntry = {
  /** Words/phrases that pair naturally with the headword (max 2 shown). */
  collocations: LearningChunkPhrase[];
  /** Fixed expressions worth learning as a whole unit (max 1 shown). */
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
      { en: "come loose", vi: "bị lỏng / tuột ra", sense: 1 },
      { en: "loose clothing", vi: "quần áo rộng", sense: 2 },
    ],
    chunks: [
      {
        en: "The screw came loose.",
        vi: "Con ốc vít bị lỏng ra.",
        sense: 1,
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
  bank: {
    collocations: [
      { en: "open a bank account", vi: "mở tài khoản ngân hàng", sense: 1 },
      { en: "the river bank", vi: "bờ sông", sense: 2 },
    ],
    chunks: [
      {
        en: "I need to go to the bank.",
        vi: "Tôi cần đến ngân hàng.",
        sense: 1,
      },
    ],
  },
  light: {
    collocations: [
      { en: "turn on the light", vi: "bật đèn lên", sense: 1 },
      { en: "light luggage", vi: "hành lý nhẹ", sense: 2 },
    ],
    chunks: [
      {
        en: "The room is full of light.",
        vi: "Căn phòng tràn ngập ánh sáng.",
        sense: 1,
      },
    ],
  },
  spring: {
    collocations: [
      { en: "in the spring", vi: "vào mùa xuân", sense: 1 },
      { en: "a metal spring", vi: "lò xo kim loại", sense: 2 },
    ],
    chunks: [
      {
        en: "Flowers bloom in spring.",
        vi: "Hoa nở vào mùa xuân.",
        sense: 1,
      },
    ],
  },
  right: {
    collocations: [
      { en: "the right answer", vi: "câu trả lời đúng", sense: 1 },
      { en: "turn right", vi: "rẽ phải", sense: 2 },
    ],
    chunks: [
      {
        en: "You are absolutely right.",
        vi: "Bạn hoàn toàn đúng.",
        sense: 1,
      },
    ],
  },
};

export const MAX_DEMO_COLLOCATIONS = 2;
export const MAX_DEMO_CHUNKS = 1;
