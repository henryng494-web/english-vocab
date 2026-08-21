import { Inter, Nunito } from "next/font/google";

/** UI / body — brand-board “Clean • Readable • Modern”. */
export const inter = Inter({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Display / logo — rounded sans close to Fredoka, with a Vietnamese subset
 * so clues and meanings keep their diacritics.
 * CSS still reads `--font-fredoka` so existing display rules keep working.
 */
export const nunito = Nunito({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-fredoka",
  display: "swap",
});

export const displayFontClass = nunito.className;
