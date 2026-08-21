import Image from "next/image";

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

/** Artwork cropped from the Vocab Journey design-board PNG (275×280 / 185×300). */
const REF_ASSETS = {
  neutral: { src: "/mascot/coach-dog-neutral.png", w: 275, h: 280 },
  sad: { src: "/mascot/coach-dog-sad.png", w: 185, h: 300 },
} as const;

const INK = "#0A0A0A";
const EYE = "#FFFFFF";
const COLLAR = "#EF4444";
const BELL = "#FBBF24";
const TEAR = "#38BDF8";

/** SVG poses share the same proportions as the reference neutral PNG. */
function CoachDogSvg({
  pose,
  size,
  className,
  title,
}: {
  pose: "happy" | "wave" | "smirk" | "wink";
  size: number;
  className: string;
  title: string;
}) {
  const chevrons = pose === "happy" || pose === "wave" || pose === "smirk";
  const wink = pose === "wink";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 275 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
      shapeRendering="geometricPrecision"
    >
      {/* droopy ears — hang down the cheeks, not bear ears */}
      <ellipse cx="42" cy="118" rx="34" ry="52" fill={INK} />
      <ellipse cx="233" cy="118" rx="34" ry="52" fill={INK} />

      {/* wide rounded head */}
      <ellipse cx="137" cy="132" rx="96" ry="92" fill={INK} />

      {chevrons ? (
        <>
          <path
            d="M92 118 L108 132 L92 146"
            stroke={EYE}
            strokeWidth="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M183 118 L167 132 L183 146"
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
              d="M88 132 Q104 142 120 132"
              stroke={EYE}
              strokeWidth="9"
              strokeLinecap="round"
            />
          ) : (
            <>
              <circle cx="104" cy="128" r="36" fill={EYE} />
              <circle cx="104" cy="128" r="12" fill={INK} />
            </>
          )}
          <circle cx="170" cy="128" r="36" fill={EYE} />
          <circle cx="170" cy="128" r="12" fill={INK} />
        </>
      )}

      <path
        d="M58 198 Q137 218 216 198"
        stroke={COLLAR}
        strokeWidth="12"
        strokeLinecap="round"
      />
      <circle cx="137" cy="212" r="14" fill={BELL} />
    </svg>
  );
}

/**
 * Coach Dog — reference PNG for neutral/sad; matched SVG for happy/wink.
 * Proportions traced from the design-board artwork (floppy ears, low wide eyes).
 */
export function CoachDog({
  pose = "neutral",
  size = 48,
  className = "",
  title = "Coach Dog",
}: CoachDogProps) {
  if (pose === "happy" || pose === "wave" || pose === "smirk" || pose === "wink") {
    return (
      <CoachDogSvg
        pose={pose}
        size={size}
        className={className}
        title={title}
      />
    );
  }

  if (pose === "sad") {
    const asset = REF_ASSETS.sad;
    return (
      <Image
        src={asset.src}
        alt={title}
        width={asset.w}
        height={asset.h}
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
        unoptimized
      />
    );
  }

  const asset = REF_ASSETS.neutral;
  return (
    <Image
      src={asset.src}
      alt={title}
      width={asset.w}
      height={asset.h}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
      priority={size >= 80}
      unoptimized
    />
  );
}
