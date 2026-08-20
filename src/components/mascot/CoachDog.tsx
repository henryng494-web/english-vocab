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

/** PNG assets extracted from the Vocab Journey design board reference. */
const POSE_ASSETS: Record<
  "neutral" | "happy" | "sad",
  { src: string; width: number; height: number }
> = {
  neutral: { src: "/mascot/coach-dog-neutral.png", width: 275, height: 280 },
  happy: { src: "/mascot/coach-dog-happy.png", width: 48, height: 48 },
  sad: { src: "/mascot/coach-dog-sad.png", width: 185, height: 300 },
};

function assetForPose(pose: CoachDogPose): (typeof POSE_ASSETS)["neutral"] {
  if (pose === "sad") return POSE_ASSETS.sad;
  if (pose === "happy" || pose === "wave" || pose === "smirk") return POSE_ASSETS.happy;
  return POSE_ASSETS.neutral;
}

/**
 * Coach Dog — 100% design-board artwork (reference PNGs, not hand-drawn SVG).
 * Head-only black silhouette, white eyes, red collar, gold bell.
 */
export function CoachDog({
  pose = "neutral",
  size = 48,
  className = "",
  title = "Coach Dog",
}: CoachDogProps) {
  const asset = assetForPose(pose);

  return (
    <Image
      src={asset.src}
      alt={title}
      width={asset.width}
      height={asset.height}
      className={className}
      style={{ width: size, height: "auto" }}
      priority={size >= 80}
      unoptimized
    />
  );
}
