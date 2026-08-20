"use client";

import { useEffect } from "react";

function syncViewportVars() {
  const root = document.documentElement;
  const vv = window.visualViewport;

  if (!vv) {
    root.style.setProperty("--app-height", `${window.innerHeight}px`);
    root.style.setProperty("--browser-chrome-bottom", "0px");
    return;
  }

  const bottomInset = Math.max(
    0,
    window.innerHeight - vv.height - vv.offsetTop,
  );

  root.style.setProperty(
    "--app-height",
    `${Math.round(vv.height + vv.offsetTop)}px`,
  );
  root.style.setProperty("--browser-chrome-bottom", `${Math.round(bottomInset)}px`);
}

export function ViewportHeightSync() {
  useEffect(() => {
    syncViewportVars();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", syncViewportVars);
    vv?.addEventListener("scroll", syncViewportVars);
    window.addEventListener("resize", syncViewportVars);
    window.addEventListener("orientationchange", syncViewportVars);

    return () => {
      vv?.removeEventListener("resize", syncViewportVars);
      vv?.removeEventListener("scroll", syncViewportVars);
      window.removeEventListener("resize", syncViewportVars);
      window.removeEventListener("orientationchange", syncViewportVars);
    };
  }, []);

  return null;
}
