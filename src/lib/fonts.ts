import { Fredoka, Inter } from "next/font/google";

/** UI / body — brand-board “Clean • Readable • Modern”. */
export const inter = Inter({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

/**
 * Display / logo — bold rounded sans with a long curved “y”
 * (Fredoka matches the Vocab Journey type sheet).
 */
export const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const displayFontClass = fredoka.className;
