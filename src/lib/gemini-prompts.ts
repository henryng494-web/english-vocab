/** Shared POS + register rules for Gemini vocabulary prompts. */

export const VALID_POS =
  "noun|verb|adjective|adverb|pronoun|preposition|conjunction|article|number|interjection|determiner";

export const POS_CLASSIFICATION_RULES = `STEP 1 — Classify the word BEFORE translating:
- pos: one of ${VALID_POS}
- register: everyday | formal | legal | technical | literary | slang
  • everyday = common speech, daily life
  • formal = polite official speech, announcements, business
  • legal = contracts, laws, official documents (hereby, pursuant, aforesaid) — still set register to "formal" for learner display unless truly slang/technical
  • technical = science, medicine, engineering jargon
  • literary = rare literary/archaic usage
  • slang = informal / very casual (skip unless it is the ONLY common sense)

Pick the PRIMARY sense learners meet most often for that word's rank — but NEVER force a formal/legal word into casual "bằng cách này" if the real sense is trang trọng/văn bản.`;

export const MEANING_COUNT_RULES = `STEP 2 — Vietnamese meanings (MAX 2 lines):
- If the word has ONE common sense → "meanings" array with 1 short gloss.
- If TWO distinct common senses → "meanings" with exactly 2 glosses, most frequent FIRST.
- Each gloss: short (2–6 words), correct pos + register — never merge unrelated senses with commas on one line.
- NEVER return more than 2 meanings.`;

export const POS_MEANING_RULES = `Translate each meaning by pos + register:

noun → danh từ cụ thể/trừu tượng (e.g. "Lỗ, hố", "Hợp đồng")
verb → động từ, nêu hành động chính (e.g. "Chấp nhận", "Đào, xới")
adjective → tính từ (e.g. "Quan trọng", "Sạch sẽ")
adverb → trạng từ — match register:
  • manner (quickly → nhanh chóng)
  • formal/legal (hereby → theo đây; thereby → do đó/nhờ đó; henceforth → kể từ nay)
  • NEVER use "bằng cách này" for legal hereby/herein/hereof
preposition → giới từ (e.g. "Trong, ở", "Về, liên quan đến")
conjunction → liên từ (e.g. "Nhưng", "Mặc dù")
pronoun → đại từ (e.g. "Anh ấy", "Cái đó")
number → số đếm (twenty → Hai mươi) — NEVER money/slang
article/determiner → mạo từ/hạn định (e.g. "Một", "Các")
interjection → thán từ (e.g. "Ôi!", "Wow")

register tweaks:
- NEVER write register hints inside meanings — no "(trang trọng)", "(pháp lý)" in the gloss; the register JSON field carries tone
- formal/legal → examples may be official sentences
- technical → keep precise domain term if standard in Vietnamese
- everyday → natural spoken Vietnamese`;

export const EXAMPLE_RULES = (word: string) => `STEP 3 — Examples (EXACTLY 2):
- English: 5–10 words, MUST contain "${word}"
- If 2 meanings → example 1 illustrates meaning 1 ONLY, example 2 illustrates meaning 2 ONLY (set senseIndex 1 and 2)
- If 1 meaning → both examples illustrate that same meaning (senseIndex 1 for both)
- Match register (formal word → formal sentence, not casual chat)
- Vietnamese: natural, not word-by-word
- NEVER meta lines ("I learned the word...", "Please use ... in a sentence")`;

export const SHARED_OUTPUT_RULES = `- Vietnamese: Latin quốc ngữ only — never Chinese/Japanese/Korean characters
- phonetic: American English IPA in slashes — NEVER echo spelling (wrong: /spent/)
- searchKeyword: 2–4 English words for a clear stock photo linked to the primary meaning`;

export function buildEnrichPrompt(word: string): string {
  return `You are an expert English–Vietnamese lexicographer writing a learner flashcard.

Word: "${word}"

Gold standards:
• run (verb, everyday) — 2 senses:
  meanings: ["Chạy", "Vận hành"]
  examples: sense 1 "I run every morning." / sense 2 "She runs a small cafe."
• hole (noun, everyday) — 1 sense:
  meanings: ["Lỗ, hố"]
  examples: both about a physical hole
• hereby (adverb, formal) — 1 sense:
  meanings: ["Theo đây"]
  register: "formal"
  - I hereby accept your job offer. → Tôi theo đây chấp nhận lời mời làm việc của bạn.

${POS_CLASSIFICATION_RULES}

${MEANING_COUNT_RULES}

${POS_MEANING_RULES}

${EXAMPLE_RULES(word)}

${SHARED_OUTPUT_RULES}

Respond with ONLY valid JSON:
{
  "word": "${word}",
  "pos": "noun",
  "register": "everyday",
  "phonetic": "/ipa/",
  "meanings": ["Nghĩa 1", "Nghĩa 2 hoặc bỏ nếu chỉ 1 nghĩa"],
  "examples": [
    { "en": "English for meaning 1.", "vi": "Bản dịch.", "senseIndex": 1 },
    { "en": "English for meaning 2.", "vi": "Bản dịch.", "senseIndex": 2 }
  ],
  "searchKeyword": "concrete photo phrase"
}`;
}

export function buildMeaningPrompt(word: string): string {
  return `English word: "${word}".

${POS_CLASSIFICATION_RULES}

${MEANING_COUNT_RULES}

${POS_MEANING_RULES}

Reply with ONLY the short Vietnamese meanings for the primary sense(s), max 2 lines separated by newline.
For numbers like "twenty", reply "Hai mươi".
No English, no JSON, no explanation.`;
}

export function buildDefinitionPrompt(
  word: string,
  englishDefinition?: string,
): string {
  const context = englishDefinition?.trim()
    ? `English definition: "${englishDefinition.trim()}".`
    : "";
  return `English word: "${word}". ${context}

${POS_CLASSIFICATION_RULES}

${POS_MEANING_RULES}

Write ONE short natural Vietnamese definition sentence using the correct pos and register.
For "twenty": "Số đếm hai mươi (20)."
Reply with ONLY the Vietnamese definition. No English, no JSON.`;
}

export function buildExamplesPrompt(
  word: string,
  pos?: string | null,
  meaning?: string | null,
): string {
  const posHint = pos?.trim() ? `Known pos: ${pos.trim()}.` : "Infer pos and register first.";
  const meaningHint = meaning?.trim()
    ? `Vietnamese meaning: ${meaning.trim()}.`
    : "";
  return `Write example sentences for "${word}".
${posHint} ${meaningHint}

${POS_CLASSIFICATION_RULES}

${MEANING_COUNT_RULES}

${EXAMPLE_RULES(word)}

ONLY JSON:
{"examples":[{"en":"...","vi":"...","senseIndex":1},{"en":"...","vi":"...","senseIndex":2}]}`;
}

export function buildExampleTranslationPrompt(
  englishSentence: string,
  word: string,
  pos?: string | null,
  meaning?: string | null,
): string {
  const posHint = pos?.trim() ? `Part of speech: ${pos}.` : "";
  const meaningHint = meaning?.trim() ? `Word meaning: ${meaning}.` : "";
  return `Translate this English sentence to natural Vietnamese for a vocabulary learner.

Sentence: "${englishSentence}"
Headword: "${word}"
${posHint} ${meaningHint}

Rules:
- Match register (formal English → formal Vietnamese)
- Natural idiom, not word-by-word
- Function words like hereby → "theo đây" at natural position in Vietnamese
- Latin Vietnamese only

Reply with ONLY the Vietnamese sentence. No quotes, no explanation.`;
}
