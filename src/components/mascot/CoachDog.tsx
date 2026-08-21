export type CoachDogPose =
  | "neutral"
  | "peek"
  | "wave"
  | "wink"
  | "sad"
  | "happy"
  | "smirk";

type CoachDogProps = {
  pose?: CoachDogPose;
  size?: number;
  className?: string;
  title?: string;
};

const INK = "#0A0A0A";
const EYE = "#FFFFFF";
const COLLAR = "#EF4444";
const BELL = "#FBBF24";
const BELL_DOT = "#B45309";
const TEAR = "#38BDF8";

/**
 * Flat Coach Dog matching the Vocab Journey design board:
 * black silhouette, floppy ears, huge white eyes, red collar, gold bell.
 * Single SVG — no PNG crops.
 */
export function CoachDog({
  pose = "neutral",
  size = 48,
  className = "",
  title = "Coach Dog",
}: CoachDogProps) {
  const sad = pose === "sad";
  const chevrons = pose === "happy" || pose === "wave" || pose === "smirk";
  const wink = pose === "wink";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 220 230"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
      overflow="visible"
    >
      <ellipse
        cx="36"
        cy="118"
        rx="30"
        ry="62"
        transform="rotate(-12 36 118)"
        fill={INK}
      />
      <ellipse
        cx="184"
        cy="118"
        rx="30"
        ry="62"
        transform="rotate(12 184 118)"
        fill={INK}
      />
      <ellipse cx="110" cy="108" rx="80" ry="76" fill={INK} />

      {sad ? (
        <>
          <circle cx="82" cy="110" r="32" fill={EYE} />
          <circle cx="82" cy="112" r="11" fill={INK} />
          <circle cx="138" cy="110" r="32" fill={EYE} />
          <circle cx="138" cy="112" r="11" fill={INK} />
          <path
            d="M148 128 C152 148 158 168 164 184"
            stroke={TEAR}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M72 128 C68 148 62 168 56 184"
            stroke={TEAR}
            strokeWidth="8"
            strokeLinecap="round"
          />
        </>
      ) : chevrons ? (
        <>
          <path
            d="M68 100 L84 114 L68 128"
            stroke={EYE}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M152 100 L136 114 L152 128"
            stroke={EYE}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          {wink ? (
            <path
              d="M64 112 Q82 124 100 112"
              stroke={EYE}
              strokeWidth="9"
              strokeLinecap="round"
            />
          ) : (
            <>
              <circle cx="82" cy="110" r="32" fill={EYE} />
              <circle cx="82" cy="110" r="11" fill={INK} />
            </>
          )}
          <circle cx="138" cy="110" r="32" fill={EYE} />
          <circle cx="138" cy="110" r="11" fill={INK} />
        </>
      )}

      <path
        d="M48 164 Q110 184 172 164 L170 176 Q110 196 50 176 Z"
        fill={COLLAR}
      />
      <circle cx="110" cy="180" r="13" fill={BELL} />
      <circle cx="110" cy="185" r="3.2" fill={BELL_DOT} />
    </svg>
  );
}
