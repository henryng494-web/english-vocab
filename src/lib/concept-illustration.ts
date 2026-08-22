/**
 * Grammar and abstract words cannot be taught with stock photos
 * (too → a coffee cup, then → a random glass, way → pouring water).
 * These cards get a local diagram of the taught sense instead.
 */

export const CONCEPT_MARK = "vocab-concept-v1";

const CLOSED_POS = new Set([
  "preposition",
  "conjunction",
  "determiner",
  "pronoun",
  "article",
  "adverb",
]);

/** Verbs/nouns/adjectives that look like objects in photos but are grammar. */
const CONCEPT_WORDS = new Set([
  "too",
  "then",
  "way",
  "make",
  "why",
  "good",
  "want",
  "well",
  "just",
  "also",
  "only",
  "very",
  "more",
  "most",
  "so",
  "if",
  "but",
  "not",
  "and",
  "or",
  "than",
  "because",
  "maybe",
  "sure",
  "okay",
  "something",
  "let",
  "get",
  "do",
  "be",
  "have",
  "can",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "must",
  "how",
  "when",
  "where",
  "what",
  "who",
  "which",
  "whom",
  "whose",
  "now",
  "here",
  "there",
  "even",
  "still",
  "yet",
  "also",
  "a",
  "an",
  "the",
  "this",
  "that",
  "these",
  "those",
  "to",
  "of",
  "for",
  "with",
  "from",
  "as",
  "at",
  "by",
  "on",
  "in",
  "into",
  "onto",
  "over",
  "under",
  "up",
  "out",
  "off",
  "down",
  "about",
  "after",
  "before",
  "between",
  "through",
  "across",
  "without",
  "among",
  "against",
  "during",
  "while",
  "although",
  "whether",
  "since",
  "until",
  "unless",
  "though",
  "nor",
  "both",
  "each",
  "every",
  "any",
  "some",
  "all",
  "no",
  "none",
  "such",
  "own",
  "same",
  "other",
  "another",
  "much",
  "many",
  "few",
  "little",
  "enough",
  "almost",
  "already",
  "always",
  "never",
  "often",
  "sometimes",
  "again",
  "once",
  "ever",
  "else",
  "rather",
  "quite",
  "really",
  "actually",
  "perhaps",
  "maybe",
]);

export function shouldUseConceptIllustration(
  word: string,
  pos?: string | null,
): boolean {
  const key = word.trim().toLowerCase();
  if (!key) return false;
  if (CONCEPT_WORDS.has(key)) return true;
  const normalizedPos = pos?.trim().toLowerCase();
  return Boolean(normalizedPos && CLOSED_POS.has(normalizedPos));
}

export function isConceptIllustrationUrl(url: string | null | undefined): boolean {
  const trimmed = url?.trim();
  if (!trimmed?.startsWith("data:image/svg+xml")) return false;
  try {
    return decodeSvgDataUrl(trimmed).includes(CONCEPT_MARK);
  } catch {
    return false;
  }
}

function decodeSvgDataUrl(url: string): string {
  const comma = url.indexOf(",");
  if (comma < 0) return "";
  const data = url.slice(comma + 1);
  if (url.slice(0, comma).includes(";base64")) {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(data, "base64").toString("utf8");
    }
    return atob(data);
  }
  return decodeURIComponent(data);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toSvgDataUrl(svg: string): string {
  const payload = svg.includes(CONCEPT_MARK)
    ? svg
    : svg.replace("<svg ", `<svg data-concept="${CONCEPT_MARK}" `);
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(payload).toString("base64")
      : btoa(payload);
  return `data:image/svg+xml;base64,${base64}`;
}

function scene(
  caption: string,
  graphic: string,
): string {
  const safeCaption = escapeXml(caption);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="350" viewBox="0 0 600 350" data-concept="${CONCEPT_MARK}">
    <rect width="600" height="350" fill="#e8f7f4"/>
    <rect x="22" y="18" width="556" height="314" rx="28" fill="#ffffff" stroke="#99f6e4" stroke-width="3"/>
    ${graphic}
    <text x="300" y="318" text-anchor="middle" font-family="Nunito, Arial, sans-serif" font-size="20" font-weight="800" fill="#115e59">${safeCaption}</text>
  </svg>`;
}

function graphicFor(word: string, pos?: string | null): { caption: string; graphic: string } {
  const key = word.trim().toLowerCase();

  if (key === "too") {
    return {
      caption: "also  ·  too much",
      graphic: `
        <g stroke="#182030" stroke-width="4" stroke-linejoin="round">
          <ellipse cx="175" cy="230" rx="58" ry="16" fill="#ccfbf1"/>
          <path d="M132 168h86v54c0 18-19 32-43 32s-43-14-43-32z" fill="#18c8b8"/>
          <path d="M146 168c8-28 22-48 29-48s21 20 29 48" fill="#134e4a"/>
          <ellipse cx="400" cy="230" rx="70" ry="18" fill="#fecaca"/>
          <path d="M348 150h104v62c0 22-23 38-52 38s-52-16-52-38z" fill="#f97316"/>
          <path d="M366 92c10 18 18 38 22 58h24c4-22 14-44 26-62" fill="none" stroke="#f97316" stroke-width="7"/>
          <path d="M392 78l18 14M430 78l-18 14" fill="none" stroke="#dc2626" stroke-width="7" stroke-linecap="round"/>
        </g>
        <text x="175" y="268" text-anchor="middle" font-size="16" font-weight="700" fill="#0f766e" font-family="Nunito, Arial, sans-serif">OK</text>
        <text x="400" y="268" text-anchor="middle" font-size="16" font-weight="800" fill="#dc2626" font-family="Nunito, Arial, sans-serif">TOO HOT</text>`,
    };
  }

  if (key === "then") {
    return {
      caption: "first  →  then",
      graphic: `
        <g font-family="Nunito, Arial, sans-serif">
          <rect x="70" y="70" width="180" height="180" rx="24" fill="#ccfbf1"/>
          <circle cx="108" cy="108" r="22" fill="#0f766e"/>
          <text x="108" y="116" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">1</text>
          <circle cx="160" cy="168" r="28" fill="#fff"/>
          <circle cx="160" cy="168" r="14" fill="#f97316"/>
          <rect x="128" y="198" width="64" height="28" rx="8" fill="#18c8b8"/>
          <text x="160" y="232" text-anchor="middle" font-size="15" font-weight="800" fill="#115e59">breakfast</text>
          <path d="M270 160h52" fill="none" stroke="#0f766e" stroke-width="10" stroke-linecap="round"/>
          <path d="M308 142l28 18-28 18" fill="#0f766e"/>
          <rect x="350" y="70" width="180" height="180" rx="24" fill="#dbeafe"/>
          <circle cx="388" cy="108" r="22" fill="#1d4ed8"/>
          <text x="388" y="116" text-anchor="middle" font-size="22" font-weight="800" fill="#fff">2</text>
          <rect x="392" y="142" width="96" height="64" rx="10" fill="#1e293b"/>
          <rect x="404" y="154" width="72" height="40" rx="4" fill="#93c5fd"/>
          <text x="440" y="232" text-anchor="middle" font-size="15" font-weight="800" fill="#1e3a8a">work</text>
        </g>`,
    };
  }

  if (key === "way") {
    return {
      caption: "a way  ·  a path",
      graphic: `
        <path d="M40 250c80-20 110-90 190-90 70 0 90 70 170 70 70 0 110-50 160-50" fill="none" stroke="#99f6e4" stroke-width="46" stroke-linecap="round"/>
        <path d="M40 250c80-20 110-90 190-90 70 0 90 70 170 70 70 0 110-50 160-50" fill="none" stroke="#0f766e" stroke-width="18" stroke-linecap="round" stroke-dasharray="18 16"/>
        <circle cx="70" cy="250" r="16" fill="#f97316"/>
        <rect x="470" y="88" width="78" height="78" rx="12" fill="#18c8b8"/>
        <polygon points="509,70 548,108 470,108" fill="#115e59"/>
        <text x="90" y="286" font-size="16" font-weight="800" fill="#115e59" font-family="Nunito, Arial, sans-serif">you</text>
        <text x="509" y="200" text-anchor="middle" font-size="16" font-weight="800" fill="#115e59" font-family="Nunito, Arial, sans-serif">station</text>`,
    };
  }

  if (key === "make") {
    return {
      caption: "make  ·  create",
      graphic: `
        <ellipse cx="300" cy="250" rx="120" ry="22" fill="#ccfbf1"/>
        <path d="M210 168h180c8 0 14 8 12 16l-18 66H216l-18-66c-2-8 4-16 12-16z" fill="#fef3c7" stroke="#d97706" stroke-width="4"/>
        <path d="M230 140h140c6 0 10 6 9 12l-8 16H229l-8-16c-1-6 3-12 9-12z" fill="#fb7185"/>
        <circle cx="300" cy="118" r="10" fill="#f97316"/>
        <path d="M96 210c38-8 70-40 86-72" fill="none" stroke="#182030" stroke-width="10" stroke-linecap="round"/>
        <path d="M504 210c-38-8-70-40-86-72" fill="none" stroke="#182030" stroke-width="10" stroke-linecap="round"/>
        <circle cx="88" cy="222" r="22" fill="#18c8b8"/>
        <circle cx="512" cy="222" r="22" fill="#18c8b8"/>`,
    };
  }

  if (key === "why") {
    return {
      caption: "why?",
      graphic: `
        <circle cx="220" cy="168" r="78" fill="#ccfbf1"/>
        <circle cx="200" cy="150" r="10" fill="#182030"/>
        <circle cx="240" cy="150" r="10" fill="#182030"/>
        <path d="M198 198c14 16 30 16 44 0" fill="none" stroke="#182030" stroke-width="7" stroke-linecap="round"/>
        <path d="M288 96c40-8 92 18 104 70 10 46-18 86-70 96" fill="none" stroke="#0f766e" stroke-width="16" stroke-linecap="round"/>
        <text x="430" y="200" text-anchor="middle" font-size="120" font-weight="800" fill="#0f766e" font-family="Nunito, Arial, sans-serif">?</text>`,
    };
  }

  if (key === "good" || key === "well") {
    return {
      caption: key === "well" ? "well  ·  healthy" : "good",
      graphic: `
        <circle cx="300" cy="160" r="92" fill="#ccfbf1"/>
        <path d="M250 86c28 18 44 18 72 0 8 34 8 58 0 92H250c-8-34-8-58 0-92z" fill="#18c8b8"/>
        <path d="M268 70c22 48 42 48 64 0" fill="none" stroke="#0f766e" stroke-width="10" stroke-linecap="round"/>
        <circle cx="300" cy="168" r="36" fill="#ffffff"/>
        <path d="M282 166c8 14 28 14 36 0" fill="none" stroke="#0f766e" stroke-width="6" stroke-linecap="round"/>`,
    };
  }

  if (key === "want") {
    return {
      caption: "want",
      graphic: `
        <circle cx="168" cy="150" r="58" fill="#ccfbf1"/>
        <circle cx="150" cy="138" r="8" fill="#182030"/>
        <circle cx="178" cy="138" r="8" fill="#182030"/>
        <path d="M248 176c40-8 86-6 128 18" fill="none" stroke="#0f766e" stroke-width="12" stroke-linecap="round"/>
        <circle cx="430" cy="128" r="48" fill="#fef3c7" stroke="#d97706" stroke-width="6"/>
        <path d="M406 112c10-18 38-18 48 0" fill="#fb7185"/>
        <path d="M390 176l40 44 40-44" fill="none" stroke="#f97316" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>`,
    };
  }

  if (["over", "above"].includes(key)) {
    return {
      caption: key,
      graphic: `<rect x="210" y="210" width="180" height="24" rx="12" fill="#99f6e4"/><circle cx="300" cy="120" r="40" fill="#18c8b8"/><path d="M300 172v-24m-14 12 14-14 14 14" fill="none" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/>`,
    };
  }
  if (["under", "below"].includes(key)) {
    return {
      caption: key,
      graphic: `<rect x="210" y="96" width="180" height="24" rx="12" fill="#99f6e4"/><circle cx="300" cy="210" r="40" fill="#18c8b8"/><path d="M300 148v24m-14-12 14 14 14-14" fill="none" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/>`,
    };
  }
  if (["in", "inside", "into"].includes(key)) {
    return {
      caption: key,
      graphic: `<rect x="200" y="80" width="200" height="170" rx="24" fill="none" stroke="#0f766e" stroke-width="12"/><circle cx="300" cy="165" r="42" fill="#18c8b8"/>`,
    };
  }
  if (["on", "upon"].includes(key)) {
    return {
      caption: key,
      graphic: `<rect x="190" y="210" width="220" height="26" rx="13" fill="#99f6e4"/><circle cx="300" cy="158" r="42" fill="#18c8b8"/>`,
    };
  }
  if (["near", "beside", "by", "with"].includes(key)) {
    return {
      caption: key,
      graphic: `<circle cx="230" cy="165" r="48" fill="#18c8b8"/><rect x="330" y="118" width="96" height="96" rx="18" fill="#99f6e4"/><path d="M286 165h34" fill="none" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/>`,
    };
  }
  if (key === "between") {
    return {
      caption: key,
      graphic: `<rect x="120" y="110" width="90" height="110" rx="16" fill="#99f6e4"/><circle cx="300" cy="165" r="40" fill="#18c8b8"/><rect x="390" y="110" width="90" height="110" rx="16" fill="#99f6e4"/>`,
    };
  }
  if (["through", "across"].includes(key)) {
    return {
      caption: key,
      graphic: `<circle cx="300" cy="160" r="78" fill="none" stroke="#99f6e4" stroke-width="16"/><path d="M140 160h320m-28-22 28 22-28 22" fill="none" stroke="#0f766e" stroke-width="10" stroke-linecap="round"/>`,
    };
  }

  if (pos && CLOSED_POS.has(pos.trim().toLowerCase())) {
    return {
      caption: key,
      graphic: `<rect x="130" y="100" width="130" height="120" rx="20" fill="#ccfbf1"/><rect x="340" y="100" width="130" height="120" rx="20" fill="#ccfbf1"/><path d="M270 160h60" fill="none" stroke="#0f766e" stroke-width="10" stroke-linecap="round"/><circle cx="300" cy="160" r="12" fill="#f97316"/>`,
    };
  }

  return {
    caption: key,
    graphic: `<circle cx="230" cy="160" r="52" fill="#18c8b8"/><circle cx="370" cy="160" r="52" fill="#99f6e4"/><path d="M286 160h52m-16-16 16 16-16 16" fill="none" stroke="#0f766e" stroke-width="8" stroke-linecap="round"/>`,
  };
}

export function getConceptIllustrationDataUrl(
  word = "word",
  pos?: string | null,
): string {
  const { caption, graphic } = graphicFor(word, pos);
  return toSvgDataUrl(scene(caption, graphic));
}
