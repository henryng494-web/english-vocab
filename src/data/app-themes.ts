export type AppThemeId = "coach-cat" | "sky-canvas" | "peach-glow" | "mint-pulse";

export type AppTheme = {
  id: AppThemeId;
  letter: "A" | "B" | "C" | "D";
  name: string;
  tagline: string;
  swatches: [string, string, string, string];
  cssVars: Record<string, string>;
};

function withUiTokens(
  base: Record<string, string>,
  ui: {
    card: string;
    cardBorder: string;
    headerMid: string;
    headerEnd: string;
    meaning: string;
    exampleBg: string;
    exampleVi: string;
    badgeBg: string;
    badgeText: string;
    tabBarBg: string;
  },
): Record<string, string> {
  return {
    ...base,
    "--card": ui.card,
    "--card-border": ui.cardBorder,
    "--header-mid": ui.headerMid,
    "--header-end": ui.headerEnd,
    "--meaning": ui.meaning,
    "--example-bg": ui.exampleBg,
    "--example-vi": ui.exampleVi,
    "--badge-bg": ui.badgeBg,
    "--badge-text": ui.badgeText,
    "--tab-bar-bg": ui.tabBarBg,
  };
}

const COACH_CAT: AppTheme = {
  id: "coach-cat",
  letter: "D",
  name: "Coach Cat",
  tagline: "Friendly blue canvas with Miu the mascot",
  swatches: ["#3B82F6", "#EF4444", "#FBBF24", "#E8F4FF"],
  cssVars: withUiTokens(
    {
      "--background": "#e8f4ff",
      "--foreground": "#0f172a",
      "--surface": "#dbeafe",
      "--surface-strong": "#bfdbfe",
      "--primary": "#3b82f6",
      "--primary-hover": "#2563eb",
      "--primary-50": "#eff6ff",
      "--primary-100": "#dbeafe",
      "--primary-200": "#bfdbfe",
      "--primary-300": "#93c5fd",
      "--primary-700": "#1d4ed8",
      "--primary-800": "#1e40af",
      "--secondary": "#ef4444",
      "--secondary-hover": "#dc2626",
      "--accent": "#fbbf24",
      "--accent-hover": "#f59e0b",
      "--header-bg": "#ffffff",
      "--header-fg": "#0f172a",
      "--header-muted": "#64748b",
      "--card-shadow": "0 8px 24px rgba(59, 130, 246, 0.12)",
    },
    {
      card: "#ffffff",
      cardBorder: "#bfdbfe",
      headerMid: "#3b82f6",
      headerEnd: "#fbbf24",
      meaning: "#1d4ed8",
      exampleBg: "#f0f9ff",
      exampleVi: "#0369a1",
      badgeBg: "#fef3c7",
      badgeText: "#92400e",
      tabBarBg: "#ffffff",
    },
  ),
};

const SKY_CANVAS: AppTheme = {
  id: "sky-canvas",
  letter: "A",
  name: "Sky Canvas",
  tagline: "Cool, fresh, modern blue canvas",
  swatches: ["#2563EB", "#F97316", "#22C55E", "#DBEAFE"],
  cssVars: withUiTokens(
    {
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
    {
      card: "#ffffff",
      cardBorder: "#93c5fd",
      headerMid: "#1d4ed8",
      headerEnd: "#f97316",
      meaning: "#1d4ed8",
      exampleBg: "#eff6ff",
      exampleVi: "#0369a1",
      badgeBg: "#dcfce7",
      badgeText: "#166534",
      tabBarBg: "#f8fbff",
    },
  ),
};

const PEACH_GLOW: AppTheme = {
  id: "peach-glow",
  letter: "B",
  name: "Peach Glow",
  tagline: "Warm, friendly coral and peach canvas",
  swatches: ["#F97316", "#F43F5E", "#7C3AED", "#FFE8D6"],
  cssVars: withUiTokens(
    {
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
    {
      card: "#ffffff",
      cardBorder: "#fda4af",
      headerMid: "#f43f5e",
      headerEnd: "#7c3aed",
      meaning: "#be123c",
      exampleBg: "#f5f3ff",
      exampleVi: "#7c3aed",
      badgeBg: "#ede9fe",
      badgeText: "#5b21b6",
      tabBarBg: "#fffbf7",
    },
  ),
};

const MINT_PULSE: AppTheme = {
  id: "mint-pulse",
  letter: "C",
  name: "Mint Pulse",
  tagline: "Fresh teal and lime on mint canvas",
  swatches: ["#0D9488", "#14B8A6", "#EAB308", "#CCFBF1"],
  cssVars: withUiTokens(
    {
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
    {
      card: "#ffffff",
      cardBorder: "#5eead4",
      headerMid: "#0f766e",
      headerEnd: "#eab308",
      meaning: "#0f766e",
      exampleBg: "#fefce8",
      exampleVi: "#a16207",
      badgeBg: "#fef9c3",
      badgeText: "#854d0e",
      tabBarBg: "#f0fdfa",
    },
  ),
};

export const APP_THEMES: Record<AppThemeId, AppTheme> = {
  "coach-cat": COACH_CAT,
  "sky-canvas": SKY_CANVAS,
  "peach-glow": PEACH_GLOW,
  "mint-pulse": MINT_PULSE,
};

export const APP_THEME_LIST: AppTheme[] = [
  COACH_CAT,
  SKY_CANVAS,
  PEACH_GLOW,
  MINT_PULSE,
];

export const DEFAULT_THEME_ID: AppThemeId = "coach-cat";

export const THEME_STORAGE_KEY = "app-color-theme-v1";

export function isAppThemeId(value: string): value is AppThemeId {
  return value in APP_THEMES;
}
