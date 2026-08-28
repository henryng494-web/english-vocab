"use client";

import { useAppSettings } from "@/context/AppSettingsContext";
import { useEffect, useRef } from "react";

const REMINDER_TITLE = "Time to practice English!";
const REMINDER_BODY = "Open Jungle Jokers and keep your daily streak going.";

function parseTime(value: string): { hour: number; minute: number } | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(value.trim());
  if (!match) return null;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

function sameMinute(a: Date, b: { hour: number; minute: number }): boolean {
  return a.getHours() === b.hour && a.getMinutes() === b.minute;
}

/** Fire a browser notification at the configured local time once per day. */
export function StudyReminderScheduler() {
  const { reminderEnabled, reminderTime } = useAppSettings();
  const lastFiredRef = useRef<string | null>(null);

  useEffect(() => {
    if (!reminderEnabled) return;

    const requestPermission = async () => {
      if (typeof Notification === "undefined") return;
      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }
    };
    void requestPermission();

    const parsed = parseTime(reminderTime);
    if (!parsed) return;

    const check = () => {
      const now = new Date();
      const dayKey = now.toISOString().slice(0, 10);
      if (lastFiredRef.current === dayKey) return;
      if (!sameMinute(now, parsed)) return;
      if (typeof Notification === "undefined") return;
      if (Notification.permission !== "granted") return;
      new Notification(REMINDER_TITLE, { body: REMINDER_BODY });
      lastFiredRef.current = dayKey;
    };

    check();
    const timer = window.setInterval(check, 30_000);
    return () => window.clearInterval(timer);
  }, [reminderEnabled, reminderTime]);

  return null;
}
