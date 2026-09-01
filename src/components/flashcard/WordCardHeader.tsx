"use client";

import { useAutoSpeakWord } from "@/hooks/use-auto-speak-word";
import { useI18n } from "@/hooks/use-i18n";
import { capitalizeFirst } from "@/lib/format-text";
import {
  displayWordRegister,
  formatMeaningsForDisplay,
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
  /** Auto-pronounce when the word changes (default: true). */
  autoSpeak?: boolean;
};

export function WordCardHeader({
  word,
  phonetic,
  wordType,
  meanings,
  register,
  loadingPhonetic,
  autoSpeak = true,
}: WordCardHeaderProps) {
  useAutoSpeakWord(word, autoSpeak);
  const { registerLabel, wordTypeLabel } = useI18n();
  const wordTypeLabelText = wordTypeLabel(wordType, word);
  const meaningLines = meanings ? formatMeaningsForDisplay(meanings) : [];
  const displayedRegister = displayWordRegister(register);
  const registerLabelText = registerLabel(displayedRegister);
  const showMeta =
    meaningLines.length > 0 && (registerLabelText || wordTypeLabelText);

  return (
    <div className="word-card-header">
      <div className="word-card-header__top">
        <h2 className="word-card-header__word text-3xl">
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

      {meaningLines.length > 0 || showMeta ? (
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

          {showMeta ? (
            <div className="word-card-header__meta">
              {registerLabelText ? (
                <span
                  className={`word-card-header__register-value word-card-header__register-value--${displayedRegister}`}
                  aria-label={`Register: ${registerLabelText}`}
                >
                  {registerLabelText}
                </span>
              ) : null}

              {wordTypeLabelText ? (
                <span className="word-card-header__pos word-type-badge">
                  {wordTypeLabelText}
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
