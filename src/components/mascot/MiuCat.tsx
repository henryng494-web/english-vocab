type MiuPose = "neutral" | "wave" | "wink" | "sad" | "happy";

type MiuCatProps = {
  pose?: MiuPose;
  size?: number;
  className?: string;
  title?: string;
};

/** Coach Cat mascot — flat vector Miu with yellow eyes, red collar, gold bell. */
export function MiuCat({
  pose = "neutral",
  size = 48,
  className = "",
  title = "Miu",
}: MiuCatProps) {
  const wink = pose === "wink";
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
      {/* ears */}
      <path d="M14 22 L10 8 L22 18 Z" fill="#0a0a0a" />
      <path d="M50 22 L54 8 L42 18 Z" fill="#0a0a0a" />
      {/* head */}
      <circle cx="32" cy="34" r="22" fill="#0a0a0a" />
      {/* left eye */}
      {wink ? (
        <path
          d="M20 32 Q26 36 32 32"
          stroke="#FBBF24"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <>
          <circle cx="24" cy="32" r={sad ? 5 : 7} fill="#FBBF24" />
          <circle cx="26" cy="30" r="2.2" fill="#fff" />
        </>
      )}
      {/* right eye */}
      {sad ? (
        <>
          <path
            d="M38 32 Q44 28 50 32"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M46 38 C47 42 49 44 51 46"
            stroke="#60A5FA"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : happy ? (
        <>
          <path
            d="M38 32 Q44 26 50 32"
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
          <circle cx="40" cy="32" r="7" fill="#FBBF24" />
          <circle cx="42" cy="30" r="2.2" fill="#fff" />
        </>
      )}
      {/* mouth */}
      {!sad && (
        <path
          d="M26 42 Q32 46 38 42"
          stroke="#FB7185"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {happy && !sad && (
        <ellipse cx="32" cy="44" rx="3" ry="2" fill="#FB7185" opacity="0.9" />
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
        <g transform="translate(46 38) rotate(-18)">
          <ellipse cx="0" cy="0" rx="5" ry="4" fill="#0a0a0a" />
          <circle cx="-2" cy="-3" r="1.3" fill="#0a0a0a" />
          <circle cx="0" cy="-4" r="1.3" fill="#0a0a0a" />
          <circle cx="2" cy="-3" r="1.3" fill="#0a0a0a" />
        </g>
      )}
    </svg>
  );
}
