"use client";

import { speakEnglishText } from "@/lib/speak-word";
import { useCallback, useRef, useState } from "react";

type SpeakButtonProps = {
  text: string;
  variant?: "dark" | "light";
  /** Icon-only round button (no "Phát âm" label). */
  iconOnly?: boolean;
  className?: string;
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
  className = "",
}: SpeakButtonProps) {
  const [speaking, setSpeaking] = useState(false);
  const lastTapRef = useRef(0);
  const pointerHandledRef = useRef(false);

  const speak = useCallback(() => {
    if (!text) return;
    const now = Date.now();
    if (now - lastTapRef.current < 400) return;
    lastTapRef.current = now;

    speakEnglishText(text, { force: true });
    setSpeaking(true);
    window.setTimeout(() => setSpeaking(false), 900);
  }, [text]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (e.pointerType === "mouse" && e.button !== 0) return;
      pointerHandledRef.current = true;
      speak();
    },
    [speak],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (pointerHandledRef.current) {
        pointerHandledRef.current = false;
        return;
      }
      speak();
    },
    [speak],
  );

  const toneClass = iconOnly
    ? variant === "light"
      ? "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-800 transition hover:bg-primary hover:text-foreground disabled:opacity-60"
      : "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-primary text-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-60"
    : variant === "light"
      ? "inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-800 transition hover:bg-primary hover:text-foreground disabled:opacity-60"
      : "inline-flex items-center gap-2 rounded-full border border-white/40 bg-primary px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-60";

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      disabled={speaking}
      className={`${toneClass} ${className}`.trim()}
      aria-label={speaking ? "Speaking" : "Pronounce"}
    >
      <SpeakerIcon className={iconOnly ? "h-4 w-4" : "h-5 w-5"} />
      {!iconOnly && (speaking ? "Speaking..." : "Pronounce")}
    </button>
  );
}
