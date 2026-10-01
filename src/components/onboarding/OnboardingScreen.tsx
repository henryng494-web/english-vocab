"use client";

import { useAppSettings } from "@/context/AppSettingsContext";
import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";
import {
  LEARNER_LOCALE_LABELS,
  LEARNER_LOCALE_MENU_OPTIONS,
} from "@/lib/app-settings";
import { APP_LOCALES, APP_LOCALE_LABELS } from "@/lib/i18n/messages";

export function OnboardingScreen() {
  const {
    appLanguage,
    setAppLanguage,
    learnerLocale,
    setLearnerLocale,
    completeOnboarding,
  } = useAppSettings();
  const { t } = useI18n();

  return (
    <main className="onboarding" aria-labelledby="onboarding-title">
      <div className="onboarding__scroll">
        <h1 id="onboarding-title" className={`onboarding__title ${displayFontClass}`}>
          {t("onboarding.title")}
        </h1>
        <p className="app-menu__hint">{t("onboarding.subtitle")}</p>

        <section className="app-menu__section onboarding__section">
          <h2 className="app-menu__section-title">{t("menu.language")}</h2>
          <p className="app-menu__hint">{t("menu.languageHint")}</p>
          <div className="app-menu__chips">
            {APP_LOCALES.map((locale) => (
              <button
                key={locale}
                type="button"
                className={`app-menu__chip${appLanguage === locale ? " is-active" : ""}`}
                aria-pressed={appLanguage === locale}
                onClick={() => setAppLanguage(locale)}
              >
                {APP_LOCALE_LABELS[locale]}
              </button>
            ))}
          </div>
        </section>

        <section className="app-menu__section onboarding__section">
          <h2 className="app-menu__section-title">{t("menu.learnerLocale")}</h2>
          <p className="app-menu__hint">{t("menu.learnerLocaleHint")}</p>
          <div className="app-menu__chips">
            {LEARNER_LOCALE_MENU_OPTIONS.map((locale) => (
              <button
                key={locale}
                type="button"
                className={`app-menu__chip${learnerLocale === locale ? " is-active" : ""}`}
                aria-pressed={learnerLocale === locale}
                onClick={() => setLearnerLocale(locale)}
              >
                {LEARNER_LOCALE_LABELS[locale]}
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="onboarding__footer">
        <button type="button" className="onboarding__cta" onClick={completeOnboarding}>
          {t("onboarding.continue")}
        </button>
      </div>
    </main>
  );
}
