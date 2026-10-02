"use client";

import { useEffect, useState } from "react";

import { useI18n } from "@/hooks/use-i18n";
import { IS_MOBILE_BUILD } from "@/lib/api-base";

type NavigatorStandalone = Navigator & { standalone?: boolean };
type CapacitorWindow = Window & { Capacitor?: { isNativePlatform?: () => boolean } };

export function InstallAppHint() {
  const { t } = useI18n();
  const [mode, setMode] = useState<"checking" | "browser" | "installed">(
    "checking",
  );
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const native =
      IS_MOBILE_BUILD ||
      (window as CapacitorWindow).Capacitor?.isNativePlatform?.() === true;
    if (native) {
      setMode("installed");
      return;
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as NavigatorStandalone).standalone === true;

    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIos(ios);
    setMode(standalone ? "installed" : "browser");
  }, []);

  if (mode !== "browser") return null;

  return (
    <section className="rounded-2xl border border-primary-200 bg-surface p-4 shadow-sm">
      <h2 className="text-base font-bold text-foreground">{t("install.title")}</h2>
      <p className="mt-1 text-sm text-foreground/70">{t("install.desc")}</p>

      <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-foreground/80">
        {(isIos
          ? (["install.ios1", "install.ios2", "install.ios3", "install.ios4"] as const)
          : (["install.android1", "install.android2", "install.android3"] as const)
        ).map((key) => (
          <li key={key}>{t(key)}</li>
        ))}
      </ol>
    </section>
  );
}
