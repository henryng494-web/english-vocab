import type { HomeLayoutVariant } from "@/components/discover/home-layouts/types";
import { HOME_LAYOUT_VARIANTS } from "@/components/discover/home-layouts/types";

const STORAGE_KEY = "english-vocab-home-layout-v1";
const DEFAULT_VARIANT: HomeLayoutVariant = "1";

export function readHomeLayoutVariant(): HomeLayoutVariant {
  if (typeof window === "undefined") return DEFAULT_VARIANT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw && HOME_LAYOUT_VARIANTS.includes(raw as HomeLayoutVariant)) {
      return raw as HomeLayoutVariant;
    }
  } catch {
    /* ignore */
  }
  return DEFAULT_VARIANT;
}

export function writeHomeLayoutVariant(variant: HomeLayoutVariant): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, variant);
  window.dispatchEvent(new CustomEvent("home-layout-changed", { detail: variant }));
}

export function getDefaultHomeLayoutVariant(): HomeLayoutVariant {
  return DEFAULT_VARIANT;
}

export function subscribeHomeLayout(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => onStoreChange();
  window.addEventListener("home-layout-changed", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("home-layout-changed", handler);
    window.removeEventListener("storage", handler);
  };
}
