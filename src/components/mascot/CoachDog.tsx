type CoachDogPose =
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
const MUZZLE = "#FFFFFF";
const EYE = "#FFFFFF";
const COLLAR = "#E53935";
const BELL = "#F5B800";
const TEAR = "#4FC3F7";
const TONGUE = "#FF8A80";

/**
 * Coach Dog — matches the Vocab Journey character sheet mockup:
 * black head, white muzzle, big round eyes, red collar, gold bell.
 */
export function CoachDog({
  pose = "neutral",
  size = 48,
  className = "",
  title = "Coach Dog",
}: CoachDogProps) {
  const sad = pose === "sad";
  const happy = pose === "happy" || pose === "wave";
  const wink = pose === "wink" || pose === "smirk";
  const smirk = pose === "smirk";
  const peek = pose === "peek" || pose === "wave";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      {peek && (
        <g>
          <ellipse cx="34" cy="108" rx="11" ry="9" fill={INK} />
          <circle cx="28" cy="102" r="3" fill={INK} />
          <circle cx="34" cy="99" r="3" fill={INK} />
          <circle cx="40" cy="102" r="3" fill={INK} />
          <ellipse cx="86" cy="108" rx="11" ry="9" fill={INK} />
          <circle cx="80" cy="102" r="3" fill={INK} />
          <circle cx="86" cy="99" r="3" fill={INK} />
          <circle cx="92" cy="102" r="3" fill={INK} />
        </g>
      )}

      {/* ears */}
      <ellipse cx="22" cy="44" rx="14" ry="20" fill={INK} />
      <ellipse cx="98" cy="44" rx="14" ry="20" fill={INK} />

      {/* head */}
      <circle cx="60" cy="50" r="34" fill={INK} />

      {/* white muzzle */}
      <ellipse cx="60" cy="66" rx="22" ry="16" fill={MUZZLE} />

      {/* eyes */}
      {sad ? (
        <>
          <circle cx="46" cy="46" r="11" fill={EYE} />
          <circle cx="46" cy="47" r="4" fill={INK} />
          <circle cx="74" cy="46" r="11" fill={EYE} />
          <circle cx="74" cy="47" r="4" fill={INK} />
          <path
            d="M78 52 C79 58 81 64 83 70"
            stroke={TEAR}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M42 52 C41 58 39 64 37 70"
            stroke={TEAR}
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : happy ? (
        <>
          <path
            d="M40 44 Q46 38 52 44"
            stroke={EYE}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M68 44 Q74 38 80 44"
            stroke={EYE}
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
          {wink ? (
            <path
              d="M38 46 Q46 50 54 46"
              stroke={EYE}
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            <>
              <circle cx="46" cy="46" r="11" fill={EYE} />
              <circle cx="46" cy="46" r="4" fill={INK} />
            </>
          )}
          <circle cx="74" cy="46" r="11" fill={EYE} />
          <circle cx="74" cy="46" r="4" fill={INK} />
        </>
      )}

      {/* nose */}
      <ellipse cx="60" cy="62" rx="5" ry="4" fill={INK} />

      {/* mouth */}
      {sad ? (
        <path
          d="M52 72 Q60 68 68 72"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      ) : happy || peek ? (
        <>
          <path
            d="M52 70 Q60 78 68 70"
            stroke={INK}
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          <ellipse cx="60" cy="74" rx="4" ry="3" fill={TONGUE} />
        </>
      ) : smirk ? (
        <path
          d="M52 70 Q60 74 70 68"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M52 70 Q56 74 60 72 Q64 74 68 70"
          stroke={INK}
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* collar + bell */}
      <path
        d="M34 82 Q60 90 86 82"
        stroke={COLLAR}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="60" cy="88" r="5" fill={BELL} />
      <path
        d="M58 90 H62"
        stroke="#C17900"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
