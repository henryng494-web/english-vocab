"use client";

import { useAppSettings } from "@/context/AppSettingsContext";
import { useEffect } from "react";

/** Keeps document lang in sync with the learner's app language setting. */
export function AppLocaleSync() {
  const { appLanguage } = useAppSettings();

  useEffect(() => {
    document.documentElement.lang = appLanguage;
  }, [appLanguage]);

  return null;
}
