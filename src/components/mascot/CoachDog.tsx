type CoachDogPose = "neutral" | "wave" | "wink" | "sad" | "happy" | "smirk";

type CoachDogProps = {
  pose?: CoachDogPose;
  size?: number;
  className?: string;
  title?: string;
};

const INK = "#0A0A0A";
const EYE_WHITE = "#FFFFFF";
const COLLAR = "#EF4444";
const BELL = "#FBBF24";
const TEAR = "#38BDF8";

/**
 * Flat head-only Coach Dog — matches Vocab Journey design board:
 * black silhouette, oversized white circle eyes, floppy ears, red collar, yellow bell.
 */
export function CoachDog({
  pose = "neutral",
  size = 48,
  className = "",
  title = "Coach Dog",
}: CoachDogProps) {
  const sad = pose === "sad";
  const happy = pose === "happy";
  const wink = pose === "wink" || pose === "smirk";
  const wave = pose === "wave";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      {/* ears behind head */}
      <ellipse cx="14" cy="42" rx="12" ry="18" fill={INK} />
      <ellipse cx="82" cy="42" rx="12" ry="18" fill={INK} />

      {/* head */}
      <circle cx="48" cy="46" r="30" fill={INK} />

      {/* eyes */}
      {sad ? (
        <>
          <path
            d="M33 48 Q38 43 43 48"
            stroke={EYE_WHITE}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M53 48 Q58 43 63 48"
            stroke={EYE_WHITE}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M64 52 C65 58 67 63 69 68"
            stroke={TEAR}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M32 52 C31 58 29 63 27 68"
            stroke={TEAR}
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M40 58 Q48 62 56 58"
            stroke={EYE_WHITE}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
        </>
      ) : happy || wave ? (
        <>
          <path
            d="M34 44 L40 48 L34 52"
            stroke={EYE_WHITE}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M62 44 L56 48 L62 52"
            stroke={EYE_WHITE}
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      ) : (
        <>
          {wink ? (
            <path
              d="M32 48 Q38 52 44 48"
              stroke={EYE_WHITE}
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <>
              <circle cx="38" cy="46" r="12" fill={EYE_WHITE} />
              <circle cx="38" cy="46" r="4.2" fill={INK} />
            </>
          )}
          <circle cx="58" cy="46" r="12" fill={EYE_WHITE} />
          <circle cx="58" cy="46" r="4.2" fill={INK} />
        </>
      )}

      {/* red collar band */}
      <path
        d="M22 68 C22 68 34 76 48 76 C62 76 74 68 74 68 L74 72 C74 72 62 80 48 80 C34 80 22 72 22 72 Z"
        fill={COLLAR}
      />

      {/* yellow bell */}
      <circle cx="48" cy="77" r="5" fill={BELL} />
      <path
        d="M46 79 H50"
        stroke="#B45309"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
