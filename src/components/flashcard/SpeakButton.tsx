"use client";

import { speakEnglishText, unlockSpeechFromUserGesture } from "@/lib/speak-word";
import { useCallback, useRef } from "react";
import { useI18n } from "@/hooks/use-i18n";

type SpeakButtonProps = {
  text: string;
  variant?: "dark" | "light";
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
  const { t } = useI18n();
  const pointerSpokeRef = useRef(false);

  const speak = useCallback(() => {
    if (!text) return;
    unlockSpeechFromUserGesture();
    speakEnglishText(text, { force: true });
  }, [text]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      event.stopPropagation();
      pointerSpokeRef.current = true;
      speak();
    },
    [speak],
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      if (pointerSpokeRef.current) {
        pointerSpokeRef.current = false;
        return;
      }
      speak();
    },
    [speak],
  );

  const toneClass = iconOnly
    ? variant === "light"
      ? "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-primary-800 transition hover:bg-primary hover:text-foreground"
      : "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-primary text-foreground shadow-sm transition hover:bg-primary-hover"
    : variant === "light"
      ? "inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-2 text-sm font-medium text-primary-800 transition hover:bg-primary hover:text-foreground"
      : "inline-flex items-center gap-2 rounded-full border border-white/40 bg-primary px-4 py-2 text-sm font-medium text-foreground shadow-sm transition hover:bg-primary-hover";

  return (
    <button
      type="button"
      data-pronounce-speak
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={`${toneClass} ${className}`.trim()}
      style={{ touchAction: "manipulation" }}
      aria-label={t("speak.aria")}
    >
      <SpeakerIcon className={iconOnly ? "h-4 w-4" : "h-5 w-5"} />
      {!iconOnly && t("speak.pronounce")}
    </button>
  );
}
