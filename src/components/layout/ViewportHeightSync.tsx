"use client";

import { useEffect } from "react";

function syncViewportHeight() {
  const height = Math.round(
    window.visualViewport?.height ?? window.innerHeight,
  );
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}

export function ViewportHeightSync() {
  useEffect(() => {
    syncViewportHeight();

    const vv = window.visualViewport;
    vv?.addEventListener("resize", syncViewportHeight);
    window.addEventListener("orientationchange", syncViewportHeight);

    return () => {
      vv?.removeEventListener("resize", syncViewportHeight);
      window.removeEventListener("orientationchange", syncViewportHeight);
    };
  }, []);

  return null;
}
