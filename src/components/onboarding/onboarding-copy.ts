import type { AppLocale } from "@/lib/i18n/messages";
import type { LearnerLocale } from "@/lib/learner-locale";

export const ONBOARDING_STEP1_TITLE = "Choose your language";

export const LEARNER_LOCALE_FLAGS: Record<LearnerLocale, string> = {
  vi: "🇻🇳",
  es: "🇪🇸",
  pt: "🇧🇷",
  ja: "🇯🇵",
  ko: "🇰🇷",
  zh: "🇨🇳",
  th: "🇹🇭",
  id: "🇮🇩",
  fr: "🇫🇷",
  de: "🇩🇪",
  it: "🇮🇹",
  tr: "🇹🇷",
  ar: "🇸🇦",
};

export const APP_LOCALE_FLAGS: Record<AppLocale, string> = {
  ...LEARNER_LOCALE_FLAGS,
  en: "🇬🇧",
};

export const ONBOARDING_STEP2_COPY: Record<
  AppLocale,
  { title: string; continue: string; back: string }
> = {
  en: { title: "Choose app language", continue: "Continue", back: "Back" },
  vi: { title: "Chọn ngôn ngữ ứng dụng", continue: "Tiếp tục", back: "Quay lại" },
  es: { title: "Elige el idioma de la app", continue: "Continuar", back: "Atrás" },
  pt: { title: "Escolha o idioma do app", continue: "Continuar", back: "Voltar" },
  ja: { title: "アプリの言語を選択", continue: "続ける", back: "戻る" },
  ko: { title: "앱 언어 선택", continue: "계속", back: "뒤로" },
  zh: { title: "选择应用语言", continue: "继续", back: "返回" },
  th: { title: "เลือกภาษาของแอป", continue: "ต่อไป", back: "กลับ" },
  id: { title: "Pilih bahasa aplikasi", continue: "Lanjutkan", back: "Kembali" },
  fr: { title: "Choisissez la langue de l'app", continue: "Continuer", back: "Retour" },
  de: { title: "App-Sprache wählen", continue: "Weiter", back: "Zurück" },
  it: { title: "Scegli la lingua dell'app", continue: "Continua", back: "Indietro" },
  tr: { title: "Uygulama dilini seç", continue: "Devam", back: "Geri" },
  ar: { title: "اختر لغة التطبيق", continue: "متابعة", back: "رجوع" },
};
