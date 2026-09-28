/**
 * One-off / refresh: translate English UI strings to all learner app locales.
 * Output: src/lib/i18n/locale-messages.json
 */
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "node:fs";
import path from "node:path";
import { enFallbackMessages } from "../src/lib/i18n/messages";
import {
  LEARNER_LOCALE_OPTIONS,
  type LearnerLocale,
} from "../src/lib/learner-locale";

const OUT = path.join(process.cwd(), "src/lib/i18n/locale-messages.json");

const TARGET_LANGUAGE: Record<Exclude<LearnerLocale, "vi">, string> = {
  es: "Spanish (Latin American, neutral)",
  pt: "Portuguese (Brazilian, neutral)",
  ja: "Japanese",
  ko: "Korean",
  zh: "Chinese (Simplified)",
  th: "Thai",
  id: "Indonesian",
  fr: "French",
  de: "German",
  it: "Italian",
  tr: "Turkish",
  ar: "Modern Standard Arabic",
};

const enTree = enFallbackMessages;
const keys = Object.keys(enTree) as (keyof typeof enTree)[];

function extractJsonObject(text: string): Record<string, string> {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) {
    throw new Error("No JSON object in model response");
  }
  return JSON.parse(text.slice(start, end + 1)) as Record<string, string>;
}

async function translateLocale(
  locale: Exclude<LearnerLocale, "vi">,
): Promise<Record<string, string>> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error("GEMINI_API_KEY required");

  const language = TARGET_LANGUAGE[locale];
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model:
      process.env.GEMINI_TRANSLATION_MODEL?.trim() ||
      process.env.GEMINI_MODEL?.trim() ||
      "gemini-flash-lite-latest",
  });

  const prompt = `You localize a mobile English-learning app UI from English to ${language}.

Rules:
- Return ONE JSON object only (no markdown fences).
- Use the EXACT same keys as the input.
- Keep placeholders like {count}, {minutes}, {name} unchanged.
- Keep brand names: Jungle Jokers, Duolingo, Babbel, Memrise, Busuu, Quizlet, Supabase.
- menu.langVi stays "Tiếng Việt"; menu.learnerLocaleVi stays "Tiếng Việt"; menu.learnerLocaleEs stays "Español".
- Natural, concise mobile UI copy.
- For ar: use Modern Standard Arabic.

Input JSON:
${JSON.stringify(enTree, null, 0)}`;

  const result = await model.generateContent(prompt);
  const parsed = extractJsonObject(result.response.text().trim());
  for (const key of keys) {
    if (typeof parsed[key] !== "string" || !parsed[key].trim()) {
      parsed[key] = enTree[key];
    }
  }
  return parsed;
}

async function main() {
  const locales = LEARNER_LOCALE_OPTIONS.filter(
    (l): l is Exclude<LearnerLocale, "vi"> => l !== "vi",
  );

  let existing: Partial<Record<LearnerLocale, Record<string, string>>> = {};
  if (fs.existsSync(OUT)) {
    existing = JSON.parse(fs.readFileSync(OUT, "utf8")) as typeof existing;
  }

  const out: Partial<Record<LearnerLocale, Record<string, string>>> = {
    ...existing,
  };

  const only = process.argv.slice(2);
  const todo = only.length
    ? locales.filter((l) => only.includes(l))
    : locales.filter((l) => !out[l]);

  console.log(`Translating ${todo.length} locale(s): ${todo.join(", ") || "(none)"}`);

  for (const locale of todo) {
    console.log(`→ ${locale}…`);
    out[locale] = await translateLocale(locale);
    fs.writeFileSync(OUT, `${JSON.stringify(out, null, 2)}\n`);
    console.log(`  saved ${locale} (${Object.keys(out[locale]!).length} keys)`);
  }

  console.log(`Done. ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
