"use client";

import {
  APP_LOCALE_FLAGS,
  LEARNER_LOCALE_FLAGS,
  ONBOARDING_STEP1_TITLE,
  ONBOARDING_STEP2_COPY,
} from "@/components/onboarding/onboarding-copy";
import { useAppSettings } from "@/context/AppSettingsContext";
import { displayFontClass } from "@/lib/fonts";
import {
  LEARNER_LOCALE_LABELS,
  LEARNER_LOCALE_MENU_OPTIONS,
  type LearnerLocale,
} from "@/lib/app-settings";
import { APP_LOCALE_LABELS, type AppLocale } from "@/lib/i18n/messages";
import { useState } from "react";

export function OnboardingScreen() {
  const { setAppLanguage, setLearnerLocale, completeOnboarding } =
    useAppSettings();
  const [picked, setPicked] = useState<LearnerLocale | null>(null);
  const [appChoice, setAppChoice] = useState<AppLocale>("en");

  function chooseLearner(locale: LearnerLocale) {
    setLearnerLocale(locale);
    setAppLanguage("en");
    setAppChoice("en");
    setPicked(locale);
  }

  function chooseApp(locale: AppLocale) {
    setAppChoice(locale);
    setAppLanguage(locale);
  }

  if (!picked) {
    return (
      <main className="onboarding" aria-labelledby="onboarding-title">
        <div className="onboarding__scroll">
          <h1 id="onboarding-title" className={`onboarding__title ${displayFontClass}`}>
            {ONBOARDING_STEP1_TITLE}
          </h1>
          <ul className="onboarding__list">
            {LEARNER_LOCALE_MENU_OPTIONS.map((locale) => (
              <li key={locale}>
                <button
                  type="button"
                  className="onboarding__row"
                  onClick={() => chooseLearner(locale)}
                >
                  <span className="onboarding__flag" aria-hidden>
                    {LEARNER_LOCALE_FLAGS[locale]}
                  </span>
                  <span className="onboarding__label">
                    {LEARNER_LOCALE_LABELS[locale]}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    );
  }

  const copy = ONBOARDING_STEP2_COPY[appChoice];
  const titleCopy = ONBOARDING_STEP2_COPY[picked];
  const options: AppLocale[] = ["en", picked];

  return (
    <main className="onboarding" aria-labelledby="onboarding-title">
      <div className="onboarding__scroll">
        <button
          type="button"
          className="onboarding__back"
          onClick={() => setPicked(null)}
        >
          ← {copy.back}
        </button>
        <h1 id="onboarding-title" className={`onboarding__title ${displayFontClass}`}>
          {titleCopy.title}
        </h1>
        <ul className="onboarding__list">
          {options.map((locale) => (
            <li key={locale}>
              <button
                type="button"
                className={`onboarding__row${appChoice === locale ? " is-active" : ""}`}
                aria-pressed={appChoice === locale}
                onClick={() => chooseApp(locale)}
              >
                <span className="onboarding__flag" aria-hidden>
                  {APP_LOCALE_FLAGS[locale]}
                </span>
                <span className="onboarding__label">{APP_LOCALE_LABELS[locale]}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="onboarding__footer">
        <button type="button" className="onboarding__cta" onClick={completeOnboarding}>
          {copy.continue}
        </button>
      </div>
    </main>
  );
}
