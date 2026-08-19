"use client";

import { useCallback, useEffect, useState } from "react";

type SpeakButtonProps = {
  text: string;
  variant?: "dark" | "light";
  /** Icon-only round button (no "Phát âm" label). */
  iconOnly?: boolean;
};

function SpeakerIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "h-5 w-5"}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 5L6 9H3v6h3l5 4V5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.54 8.46a5 5 0 010 7.07M17.66 6.34a8 8 0 010 11.32"
      />
    </svg>
  );
}

export function SpeakButton({
  text,
  variant = "dark",
  iconOnly = false,
}: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);

  const speak = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!text || typeof window === "undefined") return;

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [text],
  );

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const className = iconOnly
    ? variant === "light"
      ? "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-600 bg-neutral-800 text-white transition hover:bg-white hover:text-black disabled:opacity-60"
      : "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white shadow-sm transition hover:bg-white hover:text-black disabled:opacity-60"
    : variant === "light"
      ? "inline-flex items-center gap-2 rounded-full border border-neutral-600 bg-neutral-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-white hover:text-black disabled:opacity-60"
      : "inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-white hover:text-black disabled:opacity-60";

  return (
    <button
      type="button"
      onClick={speak}
      disabled={speaking}
      className={className}
      aria-label={speaking ? "Đang phát âm" : "Phát âm"}
    >
      <SpeakerIcon className={iconOnly ? "h-4 w-4" : "h-5 w-5"} />
      {!iconOnly && (speaking ? "Đang phát..." : "Phát âm")}
    </button>
  );
}
