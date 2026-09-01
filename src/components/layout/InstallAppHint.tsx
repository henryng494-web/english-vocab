"use client";

import { useEffect, useState } from "react";

type NavigatorStandalone = Navigator & { standalone?: boolean };

export function InstallAppHint() {
  const [mode, setMode] = useState<"checking" | "browser" | "installed">(
    "checking",
  );
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
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
      <h2 className="text-base font-bold text-foreground">Install Jungle Jokers</h2>
      <p className="mt-1 text-sm text-foreground/70">
        Add this app to your home screen for full-screen layout without the browser
        bar covering the bottom menu — the best experience on iPhone and iPad.
      </p>

      {isIos ? (
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-foreground/80">
          <li>Open this page in <strong>Safari</strong></li>
          <li>Tap the <strong>Share</strong> button (square with arrow)</li>
          <li>Choose <strong>Add to Home Screen</strong></li>
          <li>Open <strong>Jungle Jokers</strong> from your home screen</li>
        </ol>
      ) : (
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-foreground/80">
          <li>Open the browser menu (⋮)</li>
          <li>Tap <strong>Install app</strong> or <strong>Add to Home screen</strong></li>
          <li>Launch from your home screen for the best layout</li>
        </ol>
      )}
    </section>
  );
}
