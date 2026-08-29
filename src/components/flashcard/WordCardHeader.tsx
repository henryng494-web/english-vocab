"use client";

import { useAutoSpeakWord } from "@/hooks/use-auto-speak-word";
import { capitalizeFirst } from "@/lib/format-text";
import { normalizeWordType } from "@/lib/word-type";
import {
  displayWordRegister,
  formatMeaningsForDisplay,
  registerLabel,
  type WordRegister,
} from "@/lib/word-meanings";
import { SpeakButton } from "./SpeakButton";

type WordCardHeaderProps = {
  word: string;
  phonetic?: string | null;
  wordType?: string | null;
  meanings?: string | null;
  register?: WordRegister | null;
  loadingPhonetic?: boolean;
  compact?: boolean;
};

export function WordCardHeader({
  word,
  phonetic,
  wordType,
  meanings,
  register,
  loadingPhonetic,
  compact = false,
}: WordCardHeaderProps) {
  useAutoSpeakWord(word);
  const wordTypeLabel = normalizeWordType(wordType, word);
  const meaningLines = meanings ? formatMeaningsForDisplay(meanings) : [];
  const registerLabelText = registerLabel(displayWordRegister(register));

  return (
    <div
      className={`word-card-header${compact ? " word-card-header--compact" : ""}`}
    >
      <div className="word-card-header__top">
        <h2
          className={`word-card-header__word ${
            compact ? "text-3xl" : "text-4xl"
          }`}
        >
          {capitalizeFirst(word)}
        </h2>

        <div className="word-card-header__pronounce">
          <SpeakButton text={word} variant="light" iconOnly />
          {phonetic ? (
            <span className="word-card-header__phonetic">{phonetic}</span>
          ) : loadingPhonetic ? (
            <span
              className="word-card-header__phonetic word-card-header__phonetic--loading"
              aria-hidden
            />
          ) : null}
        </div>
      </div>

      {meaningLines.length > 0 || registerLabelText || wordTypeLabel ? (
        <div className="word-card-header__body">
          {meaningLines.length > 0 ? (
            <div className="word-card-header__meanings" aria-label="Meanings">
              {meaningLines.map((line, index) => (
                <p key={`${line}-${index}`} className="word-card-header__meaning">
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <div className="word-card-header__meanings" aria-hidden />
          )}

          <div className="word-card-header__meta">
            {registerLabelText ? (
              <span
                className="word-card-header__register-value"
                aria-label={`Register: ${registerLabelText}`}
              >
                {registerLabelText}
              </span>
            ) : null}

            {wordTypeLabel ? (
              <span className="word-card-header__pos word-type-badge">
                {capitalizeFirst(wordTypeLabel)}
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
