type CoachDogPose = "neutral" | "wave" | "wink" | "sad" | "happy" | "smirk";

type CoachDogProps = {
  pose?: CoachDogPose;
  size?: number;
  className?: string;
  title?: string;
};

/** Flat Figma-style black dog — white circle eyes, red collar, gold bell. */
export function CoachDog({
  pose = "neutral",
  size = 48,
  className = "",
  title = "Coach Dog",
}: CoachDogProps) {
  const wink = pose === "wink" || pose === "smirk";
  const sad = pose === "sad";
  const happy = pose === "happy" || pose === "wave";
  const wave = pose === "wave";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      {/* floppy ears */}
      <ellipse cx="17" cy="24" rx="7" ry="11" fill="#0a0a0a" />
      <ellipse cx="47" cy="24" rx="7" ry="11" fill="#0a0a0a" />
      {/* head */}
      <circle cx="32" cy="34" r="21" fill="#0a0a0a" />
      {/* left eye */}
      {wink && !sad ? (
        <path
          d="M21 32 Q27 36 33 32"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : sad ? (
        <>
          <path
            d="M21 33 Q27 29 33 33"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
          <circle cx="25" cy="32" r="7" fill="#fff" />
          <circle cx="27" cy="30" r="2.2" fill="#0a0a0a" />
        </>
      )}
      {/* right eye */}
      {sad ? (
        <>
          <path
            d="M38 33 Q44 29 50 33"
            stroke="#fff"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M46 39 C47 43 49 45 51 47"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : happy ? (
        <path
          d="M38 32 Q44 26 50 32"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <>
          <circle cx="39" cy="32" r="7" fill="#fff" />
          <circle cx="41" cy="30" r="2.2" fill="#0a0a0a" />
        </>
      )}
      {/* nose + mouth */}
      <ellipse cx="32" cy="40" rx="3" ry="2.2" fill="#1f2937" />
      {!sad && (
        <path
          d={pose === "smirk" ? "M27 44 Q32 47 40 42" : "M27 44 Q32 48 37 44"}
          stroke="#fff"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {/* collar + bell */}
      <path
        d="M18 48 Q32 54 46 48"
        stroke="#EF4444"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="32" cy="51" r="3.5" fill="#FBBF24" />
      {/* wave paw */}
      {wave && (
        <g transform="translate(46 38) rotate(-16)">
          <ellipse cx="0" cy="0" rx="5" ry="4" fill="#0a0a0a" />
          <circle cx="-2" cy="-3" r="1.2" fill="#0a0a0a" />
          <circle cx="0" cy="-4" r="1.2" fill="#0a0a0a" />
          <circle cx="2" cy="-3" r="1.2" fill="#0a0a0a" />
        </g>
      )}
    </svg>
  );
}
