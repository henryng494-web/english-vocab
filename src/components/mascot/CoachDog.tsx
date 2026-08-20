type CoachDogPose = "neutral" | "wave" | "wink" | "sad" | "happy" | "smirk";

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
 * Flat head-only Coach Dog — Vocab Journey design board:
 * black silhouette, oversized white eyes, floppy ears, thin red collar, yellow bell.
 */
export function CoachDog({
  pose = "neutral",
  size = 48,
  className = "",
  title = "Coach Dog",
}: CoachDogProps) {
  const sad = pose === "sad";
  const chevronEyes = pose === "happy" || pose === "wave";
  const wink = pose === "wink" || pose === "smirk";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      {/* floppy ears — large, droopy, behind head */}
      <ellipse cx="12" cy="44" rx="13" ry="20" fill={INK} />
      <ellipse cx="88" cy="44" rx="13" ry="20" fill={INK} />

      {/* round head */}
      <circle cx="50" cy="47" r="31" fill={INK} />

      {sad ? (
        <>
          <path
            d="M34 49 Q39 44 44 49"
            stroke={EYE}
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M56 49 Q61 44 66 49"
            stroke={EYE}
            strokeWidth="3.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M67 53 C68 59 70 65 72 71"
            stroke={TEAR}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M33 53 C32 59 30 65 28 71"
            stroke={TEAR}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M41 60 Q50 64 59 60"
            stroke={EYE}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
            opacity="0.9"
          />
        </>
      ) : chevronEyes ? (
        <>
          <path
            d="M35 45 L42 49 L35 53"
            stroke={EYE}
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M65 45 L58 49 L65 53"
            stroke={EYE}
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </>
      ) : (
        <>
          {wink ? (
            <path
              d="M33 49 Q39 53 45 49"
              stroke={EYE}
              strokeWidth="3.4"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <>
              <circle cx="39" cy="47" r="13.5" fill={EYE} />
              <circle cx="39" cy="47" r="4.5" fill={INK} />
            </>
          )}
          <circle cx="61" cy="47" r="13.5" fill={EYE} />
          <circle cx="61" cy="47" r="4.5" fill={INK} />
        </>
      )}

      {/* thin red collar band */}
      <path
        d="M23 70 Q50 78 77 70"
        stroke={COLLAR}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* small yellow bell */}
      <circle cx="50" cy="76" r="4.5" fill={BELL} />
    </svg>
  );
}
