"use client";

import {
  DAILY_GOAL_OPTIONS,
  type DailyGoalMinutes,
} from "@/lib/app-settings";
import { APP_LOCALES } from "@/lib/i18n/messages";
import { useAppSettings } from "@/context/AppSettingsContext";
import { useI18n } from "@/hooks/use-i18n";
import { displayFontClass } from "@/lib/fonts";
import Link from "next/link";
import { useEffect, useId } from "react";
import { createPortal } from "react-dom";

type AppMenuDrawerProps = {
  open: boolean;
  onClose: () => void;
};

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
}) {
  const id = useId();
  return (
    <label htmlFor={id} className="app-menu__toggle-row">
      <span className="app-menu__toggle-copy">
        <span className="app-menu__toggle-label">{label}</span>
        {description ? (
          <span className="app-menu__toggle-desc">{description}</span>
        ) : null}
      </span>
      <input
        id={id}
        type="checkbox"
        className="app-menu__toggle-input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

export function AppMenuDrawer({ open, onClose }: AppMenuDrawerProps) {
  const {
    autoSpeakEnabled,
    setAutoSpeakEnabled,
    dailyGoalMinutes,
    setDailyGoalMinutes,
    reminderEnabled,
    setReminderEnabled,
    reminderTime,
    setReminderTime,
    appLanguage,
    setAppLanguage,
  } = useAppSettings();
  const { t, dailyGoalLabel } = useI18n();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  const goalRowOne = DAILY_GOAL_OPTIONS.slice(0, 3);
  const goalRowTwo = DAILY_GOAL_OPTIONS.slice(3);

  return createPortal(
    <div className="app-menu" role="presentation">
      <button
        type="button"
        className="app-menu__backdrop"
        aria-label={t("menu.close")}
        onClick={onClose}
      />
      <aside className="app-menu__panel" role="dialog" aria-modal="true" aria-label={t("menu.title")}>
        <div className="app-menu__header">
          <h2 className={`app-menu__title ${displayFontClass}`}>{t("menu.title")}</h2>
          <button type="button" className="app-menu__close" onClick={onClose} aria-label={t("menu.close")}>
            ✕
          </button>
        </div>

        <div className="app-menu__body">
          <section className="app-menu__section">
            <h3 className="app-menu__section-title">{t("menu.language")}</h3>
            <p className="app-menu__hint">{t("menu.languageHint")}</p>
            <div className="app-menu__chips">
              {APP_LOCALES.map((locale) => (
                <button
                  key={locale}
                  type="button"
                  className={`app-menu__chip${appLanguage === locale ? " is-active" : ""}`}
                  onClick={() => setAppLanguage(locale)}
                >
                  {locale === "vi" ? t("menu.langVi") : t("menu.langEn")}
                </button>
              ))}
            </div>
          </section>

          <section className="app-menu__section">
            <h3 className="app-menu__section-title">{t("menu.learning")}</h3>
            <ToggleRow
              label={t("menu.autoSpeak")}
              description={t("menu.autoSpeakDesc")}
              checked={autoSpeakEnabled}
              onChange={setAutoSpeakEnabled}
            />
          </section>

          <section className="app-menu__section">
            <h3 className="app-menu__section-title">{t("menu.dailyGoal")}</h3>
            <p className="app-menu__hint">{t("menu.dailyGoalHint")}</p>
            <div className="app-menu__chips">
              {goalRowOne.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  className={`app-menu__chip${
                    dailyGoalMinutes === minutes ? " is-active" : ""
                  }`}
                  onClick={() => setDailyGoalMinutes(minutes as DailyGoalMinutes)}
                >
                  {dailyGoalLabel(minutes as DailyGoalMinutes)}
                </button>
              ))}
            </div>
            <div className="app-menu__chips app-menu__chips--secondary">
              {goalRowTwo.map((minutes) => (
                <button
                  key={minutes}
                  type="button"
                  className={`app-menu__chip${
                    dailyGoalMinutes === minutes ? " is-active" : ""
                  }`}
                  onClick={() => setDailyGoalMinutes(minutes as DailyGoalMinutes)}
                >
                  {dailyGoalLabel(minutes as DailyGoalMinutes)}
                </button>
              ))}
            </div>
          </section>

          <section className="app-menu__section">
            <h3 className="app-menu__section-title">{t("menu.reminder")}</h3>
            <ToggleRow
              label={t("menu.reminder")}
              description={t("menu.reminderDesc")}
              checked={reminderEnabled}
              onChange={setReminderEnabled}
            />
            <label className="app-menu__time-field">
              <span className="app-menu__time-label">{t("menu.reminderTime")}</span>
              <input
                type="time"
                className="app-menu__time-input"
                value={reminderTime}
                disabled={!reminderEnabled}
                onChange={(event) => setReminderTime(event.target.value)}
              />
            </label>
          </section>

          <section className="app-menu__section">
            <h3 className="app-menu__section-title">{t("menu.account")}</h3>
            <nav className="app-menu__links">
              <Link href="/account" className="app-menu__link" onClick={onClose}>
                {t("menu.accountLink")}
              </Link>
            </nav>
          </section>

          <section className="app-menu__section">
            <h3 className="app-menu__section-title">{t("menu.support")}</h3>
            <nav className="app-menu__links">
              <Link href="/settings/bug-report" className="app-menu__link" onClick={onClose}>
                {t("menu.bugReport")}
              </Link>
              <Link href="/about" className="app-menu__link" onClick={onClose}>
                {t("menu.about")}
              </Link>
              <Link href="/privacy" className="app-menu__link" onClick={onClose}>
                {t("menu.privacy")}
              </Link>
              <Link href="/terms" className="app-menu__link" onClick={onClose}>
                {t("menu.terms")}
              </Link>
            </nav>
          </section>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
