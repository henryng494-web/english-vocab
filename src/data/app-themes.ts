export type AppThemeId = "sky-canvas" | "peach-glow" | "mint-pulse";

export type AppTheme = {
  id: AppThemeId;
  letter: "A" | "B" | "C";
  name: string;
  tagline: string;
  swatches: [string, string, string, string];
  cssVars: Record<string, string>;
};

const SKY_CANVAS: AppTheme = {
  id: "sky-canvas",
  letter: "A",
  name: "Sky Canvas",
  tagline: "Cool, fresh, modern blue canvas",
  swatches: ["#2563EB", "#F97316", "#22C55E", "#DBEAFE"],
  cssVars: {
    "--background": "#dbeafe",
    "--foreground": "#0c4a6e",
    "--surface": "#bfdbfe",
    "--surface-strong": "#93c5fd",
    "--primary": "#2563eb",
    "--primary-hover": "#1d4ed8",
    "--primary-50": "#eff6ff",
    "--primary-100": "#dbeafe",
    "--primary-200": "#bfdbfe",
    "--primary-300": "#93c5fd",
    "--primary-700": "#1d4ed8",
    "--primary-800": "#1e40af",
    "--secondary": "#f97316",
    "--secondary-hover": "#ea580c",
    "--accent": "#22c55e",
    "--accent-hover": "#16a34a",
  },
};

const PEACH_GLOW: AppTheme = {
  id: "peach-glow",
  letter: "B",
  name: "Peach Glow",
  tagline: "Warm, friendly coral and peach canvas",
  swatches: ["#F97316", "#F43F5E", "#7C3AED", "#FFE8D6"],
  cssVars: {
    "--background": "#ffe8d6",
    "--foreground": "#7c2d12",
    "--surface": "#ffd6ba",
    "--surface-strong": "#fdba74",
    "--primary": "#f97316",
    "--primary-hover": "#ea580c",
    "--primary-50": "#fff7ed",
    "--primary-100": "#ffedd5",
    "--primary-200": "#fed7aa",
    "--primary-300": "#fdba74",
    "--primary-700": "#c2410c",
    "--primary-800": "#9a3412",
    "--secondary": "#f43f5e",
    "--secondary-hover": "#e11d48",
    "--accent": "#7c3aed",
    "--accent-hover": "#6d28d9",
  },
};

const MINT_PULSE: AppTheme = {
  id: "mint-pulse",
  letter: "C",
  name: "Mint Pulse",
  tagline: "Fresh teal and lime on mint canvas",
  swatches: ["#0D9488", "#14B8A6", "#EAB308", "#CCFBF1"],
  cssVars: {
    "--background": "#ccfbf1",
    "--foreground": "#134e4a",
    "--surface": "#99f6e4",
    "--surface-strong": "#5eead4",
    "--primary": "#0d9488",
    "--primary-hover": "#0f766e",
    "--primary-50": "#f0fdfa",
    "--primary-100": "#ccfbf1",
    "--primary-200": "#99f6e4",
    "--primary-300": "#5eead4",
    "--primary-700": "#0f766e",
    "--primary-800": "#115e59",
    "--secondary": "#14b8a6",
    "--secondary-hover": "#0d9488",
    "--accent": "#eab308",
    "--accent-hover": "#ca8a04",
  },
};

export const APP_THEMES: Record<AppThemeId, AppTheme> = {
  "sky-canvas": SKY_CANVAS,
  "peach-glow": PEACH_GLOW,
  "mint-pulse": MINT_PULSE,
};

export const APP_THEME_LIST: AppTheme[] = [
  SKY_CANVAS,
  PEACH_GLOW,
  MINT_PULSE,
];

export const DEFAULT_THEME_ID: AppThemeId = "sky-canvas";

export const THEME_STORAGE_KEY = "app-color-theme-v1";

export function isAppThemeId(value: string): value is AppThemeId {
  return value in APP_THEMES;
}
