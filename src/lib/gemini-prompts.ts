/** Shared POS + register rules for Gemini vocabulary prompts. */

export const VALID_POS =
  "noun|verb|adjective|adverb|pronoun|preposition|conjunction|article|number|interjection|determiner";

export const REGISTER_CLASSIFICATION_RULES = `REGISTER — exactly THREE values. Think informal ↔ neutral ↔ formal:

neutral (DEFAULT — everyday standard vocabulary)
  • Common words used comfortably in chat AND work/school without being slang or legalese
  • Examples: big, happy, water, tree, walk, think, wrong, important
  • If the word is NOT clearly the casual half of a pair AND NOT clearly stiff/legal → neutral
  • Examples tone: natural daily English — conversation, school, news all OK

formal (polished / professional / written register)
  • The stiff side of informal↔formal pairs: continue, mention, obtain, purchase, assist, verify
  • Legal/academic/business-only words: hereby, thereby, henceforth, commence, terminate
  • If you'd ONLY expect it in reports, contracts, ceremonies, or news briefs → formal
  • Pairs (informal → formal): go on→continue, bring up→mention, get→obtain, buy→purchase

informal (ONLY clearly casual / spoken / slang)
  • Short chat verbs & phrasal verbs: get, buy, tell, check, go on, bring up, find out, pick up
  • Slang: gonna, kinda, dude
  • MUST be the informal half of a pair — obtain/continue/mention → formal, NOT informal
  • Do NOT tag neutral words informal just because examples sound friendly

Decision checklist:
1. Informal half of a known pair or clear slang? → informal
2. Legal/academic/stiff OR formal half of a pair? → formal
3. Otherwise everyday standard headword → neutral

Dual meanings: register = FIRST meaning (most frequent).

JSON register MUST be exactly "informal", "neutral", or "formal".`;

export const POS_CLASSIFICATION_RULES = `STEP 1 — Classify the word BEFORE translating:
- pos: one of ${VALID_POS}
- register: informal | neutral | formal

${REGISTER_CLASSIFICATION_RULES}

Pick the PRIMARY sense learners meet most often for that word's rank — but NEVER force a formal word into casual "bằng cách này" if the real sense is trang trọng/văn bản.`;

export const MEANING_COUNT_RULES = `STEP 2 — Vietnamese meanings (MAX 2 lines):
- If the word has ONE common sense → "meanings" array with 1 short gloss.
- If TWO distinct common senses → "meanings" with exactly 2 glosses, most frequent FIRST.
- Each gloss: 1–4 everyday words — the translation learners expect in a dictionary, NOT an encyclopedia entry.
- NEVER write scientific/category descriptions (BAD: "Động vật giáp xác nhỏ", "Loại quả màu đỏ").
- GOOD: shrimp → "Tôm"; apple → "Quả táo"; river → "Con sông".
- NEVER return more than 2 meanings.`;

export const POS_MEANING_RULES = `Translate each meaning by pos + register:

noun → everyday Vietnamese noun (e.g. "Tôm", "Quả táo", "Con sông") — NOT "Động vật giáp xác nhỏ"
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
- neutral → everyday examples (chat, school, daily life — not slang, not legalese)
- formal → reports, meetings, contracts, news briefs
- informal → casual chat examples only for truly informal headwords (get, buy, go on…)`;

export const EXAMPLE_RULES = (word: string) => `STEP 3 — Examples (EXACTLY 2):
- English: 5–10 words, MUST contain "${word}"
- If 2 meanings → example 1 illustrates meaning 1 ONLY, example 2 illustrates meaning 2 ONLY (set senseIndex 1 and 2)
- If 1 meaning → both examples illustrate that same meaning (senseIndex 1 for both)
- English MUST match the assigned gloss sense — never a different dictionary sense
  (e.g. draw + gloss "Vẽ" / "Rút ra" → sketch + draw a conclusion; NOT attract visitors)
- Vietnamese MUST translate "${word}" using vocabulary from THAT gloss line only
- Do NOT substitute a different Vietnamese synonym (gloss "Rút ra" → use "rút ra"/"rút", NEVER "thu hút")
- Match register (informal → conversational; neutral → everyday natural; formal → workplace/news/legal)
- Vietnamese: natural, not word-by-word
- NEVER meta lines ("I learned the word...", "Please use ... in a sentence")`;

export const SHARED_OUTPUT_RULES = `- Vietnamese: Latin quốc ngữ only — never Chinese/Japanese/Korean characters
- phonetic: American English IPA in slashes — NEVER echo spelling (wrong: /spent/)
- searchKeyword: 2–4 English words for a clear stock photo linked to the primary meaning`;

export function buildEnrichPrompt(word: string): string {
  return `You are an expert English–Vietnamese lexicographer writing a learner flashcard.

Word: "${word}"

Gold standards (register):
• get (verb) → informal · obtain (verb) → formal
• wrong (adjective) → neutral · incorrect (adjective) → formal
• buy (verb) → informal · purchase (verb) → formal
• go on (phrasal) → informal · continue (verb) → formal
• bring up (phrasal) → informal · mention (verb) → formal
• talk about → informal · discuss (verb) → formal
• hereby (adverb) → formal · meanings: ["Theo đây"]
• happy (adjective) → neutral
• shrimp (noun) → meanings: ["Tôm", "Người nhỏ bé"] — NOT "Động vật giáp xác nhỏ"
• apple (noun) → meanings: ["Quả táo"] — NOT "Loại quả mọng màu đỏ"

${POS_CLASSIFICATION_RULES}

${MEANING_COUNT_RULES}

${POS_MEANING_RULES}

${EXAMPLE_RULES(word)}

${SHARED_OUTPUT_RULES}

Similar words (similarWords):
- 1–3 common English words with the same or very close meaning as the PRIMARY sense
- Learner-friendly everyday vocabulary; same part of speech when possible
- Never the headword or its inflections (e.g. for "shock" use "surprise", "jolt" — not "shocked")

Respond with ONLY valid JSON:
{
  "word": "${word}",
  "pos": "noun",
  "register": "neutral",
  "phonetic": "/ipa/",
  "meanings": ["Nghĩa 1", "Nghĩa 2 hoặc bỏ nếu chỉ 1 nghĩa"],
  "examples": [
    { "en": "English for meaning 1.", "vi": "Bản dịch.", "senseIndex": 1 },
    { "en": "English for meaning 2.", "vi": "Bản dịch.", "senseIndex": 2 }
  ],
  "searchKeyword": "concrete photo phrase",
  "similarWords": ["synonym1", "synonym2"]
}`;
}

export function buildSimilarWordsPrompt(
  word: string,
  pos?: string | null,
  meaning?: string | null,
  englishDefinition?: string | null,
  familyWords: string[] = [],
): string {
  const posHint = pos?.trim() ? `Part of speech: ${pos.trim()}.` : "";
  const meaningHint = meaning?.trim()
    ? `Vietnamese meaning(s): ${meaning.trim()}.`
    : "";
  const definitionHint = englishDefinition?.trim()
    ? `English definition: ${englishDefinition.trim()}.`
    : "";
  const blocked = [word, ...familyWords]
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");

  return `English learner flashcard — suggest 1–3 similar English words.

Headword: "${word}"
${posHint} ${meaningHint} ${definitionHint}

Rules:
- Words must be common everyday English (learner-friendly, not rare)
- Same or very close meaning to the PRIMARY sense shown above
- Prefer the same part of speech when possible
- NEVER include: ${blocked}
- Single English words only (no phrases)
- Return 1 word if only one good match exists; max 3

Reply with ONLY JSON:
{"similarWords":["word1","word2"]}`;
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
  meanings?: string[] | null,
): string {
  const posHint = pos?.trim() ? `Known pos: ${pos.trim()}.` : "Infer pos and register first.";
  const meaningLines =
    meanings?.filter(Boolean) ??
    (meaning?.trim()
      ? meaning
          .split(/\n/)
          .map((line) => line.trim())
          .filter(Boolean)
      : []);
  const meaningHint = meaningLines.length
    ? `Vietnamese meanings — each example MUST match its gloss exactly:
${meaningLines.map((line, index) => `${index + 1}. ${line}`).join("\n")}`
    : meaning?.trim()
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
- Match register (informal → conversational; neutral → everyday natural; formal → formal Vietnamese)
- Natural idiom, not word-by-word
- MUST use vocabulary from the provided meaning gloss when translating "${word}"
- Do NOT substitute a different synonym (if gloss is "Rút ra", use "rút ra"/"rút" — NEVER "thu hút")
- Function words like hereby → "theo đây" at natural position in Vietnamese
- Latin Vietnamese only

Reply with ONLY the Vietnamese sentence. No quotes, no explanation.`;
}

export type CollocationTranslationInput = {
  en: string;
  /** Full example sentence for context (optional). */
  contextEn?: string | null;
  contextVi?: string | null;
  senseMeaning?: string | null;
};

export function buildCollocationTranslationsPrompt(
  word: string,
  pos: string | null | undefined,
  meaning: string | null | undefined,
  phrases: CollocationTranslationInput[],
  options?: {
    register?: string | null;
    englishDefinition?: string | null;
  },
): string {
  const posHint = pos?.trim() ? `Part of speech: ${pos}.` : "";
  const meaningHint = meaning?.trim()
    ? `Vietnamese meaning on the card: ${meaning}.`
    : "";
  const registerHint = options?.register?.trim()
    ? `Register: ${options.register.trim()} (match this tone in Vietnamese).`
    : "";
  const definitionHint = options?.englishDefinition?.trim()
    ? `English definition: ${options.englishDefinition.trim()}.`
    : "";
  const lines = phrases
    .map((item, index) => {
      const example =
        item.contextEn?.trim() && item.contextVi?.trim()
          ? `\n   Useful phrase (full sentence for context): "${item.contextEn.trim()}" → "${item.contextVi.trim()}"`
          : "";
      const sense = item.senseMeaning?.trim()
        ? `\n   Sense gloss for "${word}" in this phrase: ${item.senseMeaning.trim()}`
        : "";
      return `${index + 1}. Goes-with of "${word}": "${item.en.trim()}"${sense}${example}`;
    })
    .join("\n");

  return `You translate "Goes with" collocation phrases for an English–Vietnamese vocabulary flashcard.

What "Goes with" means:
- Short English phrases (usually 2–4 words) showing words that naturally pair with the headword
- NOT full sentences — output a short Vietnamese phrase only
- Learners see English on top and Vietnamese below each collocation

Headword being studied: "${word}"
${posHint} ${meaningHint} ${registerHint} ${definitionHint}

Translate each "Goes-with of \\"${word}\\"" phrase below:
${lines}

Rules:
- Each translation MUST reflect the ENTIRE English collocation (e.g. "Big ram" → include "lớn", "Store hay" → include "lưu/cất", "Leaves drift" → include "lá")
- Use the useful phrase and sense gloss to pick the correct sense of "${word}"
- When translating "${word}", use vocabulary from the sense gloss — do NOT substitute a different synonym
- Natural Vietnamese learners expect — not word-by-word machine translation
- Match register (informal → conversational; neutral → everyday; formal/legal → formal Vietnamese)
- Short phrase only — never a full sentence unless the English collocation is already a sentence
- Latin Vietnamese only

Reply with ONLY JSON, same order as input:
{"translations":["...","..."]}`;
}

export function buildSupplementCollocationsPrompt(
  word: string,
  count: number,
  pos: string | null | undefined,
  meaning: string | null | undefined,
  existing: string[],
  usefulPhrase?: { en: string; vi: string } | null,
  options?: {
    register?: string | null;
    englishDefinition?: string | null;
  },
): string {
  const posHint = pos?.trim() ? `Part of speech: ${pos}.` : "";
  const meaningHint = meaning?.trim()
    ? `Vietnamese meaning on the card: ${meaning}.`
    : "";
  const registerHint = options?.register?.trim()
    ? `Register: ${options.register.trim()}.`
    : "";
  const definitionHint = options?.englishDefinition?.trim()
    ? `English definition: ${options.englishDefinition.trim()}.`
    : "";
  const existingHint = existing.length
    ? `Already shown (do NOT repeat): ${existing.map((item) => `"${item}"`).join(", ")}`
    : "";
  const phraseHint = usefulPhrase?.en?.trim()
    ? `Useful phrase for context: "${usefulPhrase.en.trim()}" → "${usefulPhrase.vi.trim()}"`
    : "";

  return `Create "Goes with" collocation phrases for an English–Vietnamese vocabulary flashcard.

Headword: "${word}"
${posHint} ${meaningHint} ${registerHint} ${definitionHint}
${existingHint}
${phraseHint}

Generate exactly ${count} NEW short English collocation phrase(s) (2–4 words each):
- EVERY phrase MUST contain "${word}"
- At least one phrase should show the base/literal meaning clearly
- Natural pairings learners actually say or read — not dictionary definitions
- Do NOT duplicate the existing phrases or the useful phrase
- Match register in Vietnamese translations

Reply with ONLY JSON:
{"collocations":[{"en":"...","vi":"..."}]}`;
}
