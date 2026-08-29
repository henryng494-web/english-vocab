/** Shared POS + register rules for Gemini vocabulary prompts. */

export const VALID_POS =
  "noun|verb|adjective|adverb|pronoun|preposition|conjunction|article|number|interjection|determiner";

export const REGISTER_CLASSIFICATION_RULES = `REGISTER — exactly TWO values (like Informal vs Formal English):

informal (DEFAULT for most vocabulary)
  • Everyday speech, texting, casual conversation, phrasal verbs
  • Common verbs/adjectives people use with friends, family, colleagues informally
  • Examples: get, buy, tell, check, help, start, end, ask, go up, find out, run, table, happy, hereditary
  • If the word has a more formal synonym pair (get/obtain, buy/purchase) and THIS word is the casual side → informal
  • General health/family words stay informal even in medical examples (hereditary, chronic, tired)

formal
  • Professional, academic, official, legal, or ceremonial English
  • Words you would use in reports, emails to bosses, contracts, news broadcasts, essays
  • Examples: obtain, purchase, inform, verify, assist, commence, terminate, inquire, hereby, nevertheless
  • If this word is the formal counterpart in a pair (purchase not buy) → formal
  • Legal connectives (hereby, pursuant), business verbs (commence, ensure), elevated adverbs (nevertheless)

How to decide:
1. Would you say this word casually to a friend? → informal
2. Would it sound stiff or professional in casual chat? → formal
3. Dual meanings: register = FIRST meaning (most frequent). Do NOT split register per line.

JSON register field MUST be exactly "informal" or "formal" — no other values.`;

export const POS_CLASSIFICATION_RULES = `STEP 1 — Classify the word BEFORE translating:
- pos: one of ${VALID_POS}
- register: informal | formal

${REGISTER_CLASSIFICATION_RULES}

Pick the PRIMARY sense learners meet most often for that word's rank — but NEVER force a formal word into casual "bằng cách này" if the real sense is trang trọng/văn bản.`;

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
  • formal (hereby → theo đây; thereby → do đó/nhờ đó; henceforth → kể từ nay)
  • NEVER use "bằng cách này" for formal hereby/herein/hereof
preposition → giới từ (e.g. "Trong, ở", "Về, liên quan đến")
conjunction → liên từ (e.g. "Nhưng", "Mặc dù")
pronoun → đại từ (e.g. "Anh ấy", "Cái đó")
number → số đếm (twenty → Hai mươi)
article/determiner → mạo từ/hạn định (e.g. "Một", "Các")
interjection → thán từ (e.g. "Ôi!", "Wow")

register tweaks:
- NEVER write register hints inside meanings — no "(trang trọng)" in the gloss; the register JSON field carries tone
- register follows the FIRST meaning when there are 2 senses
- formal → examples sound professional or official
- informal → natural spoken Vietnamese and casual English examples`;

export const EXAMPLE_RULES = (word: string) => `STEP 3 — Examples (EXACTLY 2):
- English: 5–10 words, MUST contain "${word}"
- If 2 meanings → example 1 illustrates meaning 1 ONLY, example 2 illustrates meaning 2 ONLY (set senseIndex 1 and 2)
- If 1 meaning → both examples illustrate that same meaning (senseIndex 1 for both)
- Match register (formal word → formal sentence; informal → casual natural sentence)
- Vietnamese: natural, not word-by-word
- NEVER meta lines ("I learned the word...", "Please use ... in a sentence")`;

export const SHARED_OUTPUT_RULES = `- Vietnamese: Latin quốc ngữ only — never Chinese/Japanese/Korean characters
- phonetic: American English IPA in slashes — NEVER echo spelling (wrong: /spent/)
- searchKeyword: 2–4 English words for a clear stock photo linked to the primary meaning`;

export function buildEnrichPrompt(word: string): string {
  return `You are an expert English–Vietnamese lexicographer writing a learner flashcard.

Word: "${word}"

Gold standards (informal vs formal):
• get (verb, informal) — meanings: ["Lấy, nhận"] · register: "informal"
• obtain (verb, formal) — meanings: ["Có được, đạt được"] · register: "formal"
• buy (verb, informal) vs purchase (verb, formal)
• run (verb, informal) — 2 senses: ["Chạy", "Vận hành"]
• hereby (adverb, formal) — meanings: ["Theo đây"] · register: "formal"
• hereditary (adjective, informal) — meanings: ["Di truyền", "Nối ngôi, thừa kế"] · register: "informal"

${POS_CLASSIFICATION_RULES}

${MEANING_COUNT_RULES}

${POS_MEANING_RULES}

${EXAMPLE_RULES(word)}

${SHARED_OUTPUT_RULES}

Respond with ONLY valid JSON:
{
  "word": "${word}",
  "pos": "noun",
  "register": "informal",
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
- Match register (formal English → formal Vietnamese; informal → conversational)
- Natural idiom, not word-by-word
- Function words like hereby → "theo đây" at natural position in Vietnamese
- Latin Vietnamese only

Reply with ONLY the Vietnamese sentence. No quotes, no explanation.`;
}
