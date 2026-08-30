"use client";

import {
  DAILY_GOAL_LABELS,
  DAILY_GOAL_OPTIONS,
  type DailyGoalMinutes,
} from "@/lib/app-settings";
import { useAppSettings } from "@/context/AppSettingsContext";
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
  } = useAppSettings();

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
        aria-label="Close menu"
        onClick={onClose}
      />
      <aside className="app-menu__panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="app-menu__header">
          <h2 className={`app-menu__title ${displayFontClass}`}>Menu</h2>
          <button type="button" className="app-menu__close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="app-menu__body">
          <section className="app-menu__section">
            <h3 className="app-menu__section-title">Learning</h3>
            <ToggleRow
              label="Auto-pronounce"
              description="Speak each new word automatically"
              checked={autoSpeakEnabled}
              onChange={setAutoSpeakEnabled}
            />
          </section>

          <section className="app-menu__section">
            <h3 className="app-menu__section-title">Daily study goal</h3>
            <p className="app-menu__hint">How long do you want to study each day?</p>
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
                  {DAILY_GOAL_LABELS[minutes]}
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
                  {DAILY_GOAL_LABELS[minutes]}
                </button>
              ))}
            </div>
          </section>

          <section className="app-menu__section">
            <h3 className="app-menu__section-title">Study reminder</h3>
            <ToggleRow
              label="Daily reminder"
              description="Browser notification at your chosen time"
              checked={reminderEnabled}
              onChange={setReminderEnabled}
            />
            <label className="app-menu__time-field">
              <span className="app-menu__time-label">Reminder time</span>
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
            <h3 className="app-menu__section-title">Tài khoản</h3>
            <nav className="app-menu__links">
              <Link href="/account" className="app-menu__link" onClick={onClose}>
                Tài khoản & đăng nhập
              </Link>
            </nav>
          </section>

          <section className="app-menu__section">
            <h3 className="app-menu__section-title">Hỗ trợ</h3>
            <nav className="app-menu__links">
              <Link href="/settings/bug-report" className="app-menu__link" onClick={onClose}>
                Báo lỗi
              </Link>
              <Link href="/about" className="app-menu__link" onClick={onClose}>
                Giới thiệu
              </Link>
              <Link href="/privacy" className="app-menu__link" onClick={onClose}>
                Chính sách bảo mật
              </Link>
              <Link href="/terms" className="app-menu__link" onClick={onClose}>
                Điều khoản sử dụng
              </Link>
            </nav>
          </section>
        </div>
      </aside>
    </div>,
    document.body,
  );
}
