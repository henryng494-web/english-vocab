"use client";

import { useEffect } from "react";
import "./keyboard-layout.css";

export function ViewportHeightSync() {
  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;
    let frame = 0;
    const editable = () => {
      const el = document.activeElement;
      return el instanceof HTMLElement && el.matches("input:not([type=checkbox]):not([type=radio]), textarea, [contenteditable=true]") ? el : null;
    };
    const reveal = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        editable()?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "instant" });
      });
    };
    const sync = () => {
      const height = Math.round(vv?.height ?? window.innerHeight);
      root.style.setProperty("--app-height", `${height}px`);
      // Browser chrome and pinch zoom must not be mistaken for a keyboard.
      const open = !!editable() && (!vv || Math.abs(vv.scale - 1) < 0.05) && window.innerHeight - height > 120;
      root.dataset.keyboardOpen = String(open);
      if (open) reveal();
    };
    sync();
    vv?.addEventListener("resize", sync);
    window.addEventListener("resize", sync);
    window.addEventListener("orientationchange", sync);
    document.addEventListener("focusin", sync);
    document.addEventListener("focusout", sync);
    return () => {
      cancelAnimationFrame(frame);
      vv?.removeEventListener("resize", sync);
      window.removeEventListener("resize", sync);
      window.removeEventListener("orientationchange", sync);
      document.removeEventListener("focusin", sync);
      document.removeEventListener("focusout", sync);
      delete root.dataset.keyboardOpen;
    };
  }, []);
  return null;
}
