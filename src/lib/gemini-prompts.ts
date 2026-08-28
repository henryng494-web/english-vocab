/** Shared POS + register rules for Gemini vocabulary prompts. */

export const VALID_POS =
  "noun|verb|adjective|adverb|pronoun|preposition|conjunction|article|number|interjection|determiner";

export const POS_CLASSIFICATION_RULES = `STEP 1 — Classify the word BEFORE translating:
- pos: one of ${VALID_POS}
- register: everyday | formal | legal | technical | literary | slang
  • everyday = common speech, daily life
  • formal = polite official speech, announcements, business
  • legal = contracts, laws, official documents (hereby, hereby, pursuant, aforesaid)
  • technical = science, medicine, engineering jargon
  • literary = rare literary/archaic usage
  • slang = informal / very casual (skip unless it is the ONLY common sense)

Pick the PRIMARY sense learners meet most often for that word's rank — but NEVER force a formal/legal word into casual "bằng cách này" if the real sense is trang trọng/văn bản.`;

export const POS_MEANING_RULES = `STEP 2 — Translate by pos + register (short Vietnamese gloss, not a paragraph):

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
- formal/legal → gloss may add "(trang trọng)" when helpful; examples may be official sentences
- technical → keep precise domain term if standard in Vietnamese
- everyday → natural spoken Vietnamese`;

export const EXAMPLE_RULES = (word: string) => `STEP 3 — Examples (EXACTLY 2):
- English: 5–10 words, MUST contain "${word}"
- Match the register of the primary sense (formal word → formal sentence, not casual chat)
- Vietnamese: natural, not word-by-word; place function words (theo đây, do đó) where Vietnamese idiom expects them
- NEVER meta lines ("I learned the word...", "Please use ... in a sentence")`;

export const SHARED_OUTPUT_RULES = `- Vietnamese: Latin quốc ngữ only — never Chinese/Japanese/Korean characters
- phonetic: American English IPA in slashes — NEVER echo spelling (wrong: /spent/)
- searchKeyword: 2–4 English words for a clear stock photo linked to the primary meaning`;

export function buildEnrichPrompt(word: string): string {
  return `You are an expert English–Vietnamese lexicographer writing a learner flashcard.

Word: "${word}"

Gold standards:
• hole (noun, everyday): meaning "Lỗ, hố"
  - There is a hole in my pocket. → Có một cái lỗ trong túi quần của tôi.
  - Dig a hole in the garden. → Đào một cái hố trong vườn.
• hereby (adverb, legal): meaning "Theo đây (trang trọng)"
  - I hereby accept your job offer. → Tôi theo đây chấp nhận lời mời làm việc của bạn.
  - We hereby declare the meeting closed. → Chúng tôi theo đây tuyên bố cuộc họp bế mạc.

${POS_CLASSIFICATION_RULES}

${POS_MEANING_RULES}

${EXAMPLE_RULES(word)}

${SHARED_OUTPUT_RULES}

Respond with ONLY valid JSON:
{
  "word": "${word}",
  "pos": "noun",
  "register": "everyday",
  "phonetic": "/ipa/",
  "meaning": "Nghĩa tiếng Việt ngắn gọn theo đúng loại từ",
  "examples": [
    { "en": "English sentence.", "vi": "Bản dịch tự nhiên." },
    { "en": "English sentence.", "vi": "Bản dịch tự nhiên." }
  ],
  "searchKeyword": "concrete photo phrase"
}`;
}

export function buildMeaningPrompt(word: string): string {
  return `English word: "${word}".

${POS_CLASSIFICATION_RULES}

${POS_MEANING_RULES}

Reply with ONLY the short Vietnamese meaning (primary sense), matching pos and register.
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

${EXAMPLE_RULES(word)}

ONLY JSON:
{"examples":[{"en":"...","vi":"..."},{"en":"...","vi":"..."}]}`;
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
