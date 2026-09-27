/**
 * Typography tokens — Inter (body) + Nunito (display).
 * Fonts load at runtime via `globals.css` + preconnect in root layout, not
 * `next/font/google`, so production builds on Vercel never call
 * `nextFontGoogleFontLoader` (avoids null metadata failures when Google Fonts
 * is unreachable at build time).
 */
export const displayFontClass = "font-display";
