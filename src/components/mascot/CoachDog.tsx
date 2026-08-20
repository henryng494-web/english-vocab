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
const TEAR = "#38BDF8";

/**
 * Design-board Coach Dog — flat black head, huge white eyes, red collar, gold bell.
 * SVG scales cleanly at every size (tab bar, bubble, welcome card).
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
      viewBox="0 0 88 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
      shapeRendering="geometricPrecision"
    >
      <ellipse cx="14" cy="40" rx="11" ry="17" fill={INK} />
      <ellipse cx="74" cy="40" rx="11" ry="17" fill={INK} />
      <circle cx="44" cy="46" r="28" fill={INK} />

      {sad ? (
        <>
          <circle cx="34" cy="44" r="11" fill={EYE} />
          <circle cx="34" cy="45" r="3.8" fill={INK} />
          <circle cx="54" cy="44" r="11" fill={EYE} />
          <circle cx="54" cy="45" r="3.8" fill={INK} />
          <path
            d="M58 49 C59 55 61 61 63 67"
            stroke={TEAR}
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M30 49 C29 55 27 61 25 67"
            stroke={TEAR}
            strokeWidth="3"
            strokeLinecap="round"
          />
        </>
      ) : chevrons ? (
        <>
          <path
            d="M29 42 L35 46 L29 50"
            stroke={EYE}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M59 42 L53 46 L59 50"
            stroke={EYE}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          {wink ? (
            <path
              d="M27 46 Q33 50 39 46"
              stroke={EYE}
              strokeWidth="3"
              strokeLinecap="round"
            />
          ) : (
            <>
              <circle cx="34" cy="44" r="11" fill={EYE} />
              <circle cx="34" cy="44" r="3.8" fill={INK} />
            </>
          )}
          <circle cx="54" cy="44" r="11" fill={EYE} />
          <circle cx="54" cy="44" r="3.8" fill={INK} />
        </>
      )}

      <path
        d="M20 68 Q44 76 68 68"
        stroke={COLLAR}
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="44" cy="74" r="4.5" fill={BELL} />
    </svg>
  );
}
