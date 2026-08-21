import Image from "next/image";

export type CoachDogPose =
  | "neutral"
  | "peek"
  | "wave"
  | "wink"
  | "sad"
  | "happy"
  | "smirk"
  | "think";

type CoachDogProps = {
  pose?: CoachDogPose;
  size?: number;
  className?: string;
  title?: string;
};

const POSE_SRC: Record<string, string> = {
  happy: "/mascot/fox-happy.png",
  wave: "/mascot/fox-excited.png",
  peek: "/mascot/fox-excited.png",
  neutral: "/mascot/fox-neutral.png",
  sad: "/mascot/fox-sad.png",
  wink: "/mascot/fox-wink.png",
  smirk: "/mascot/fox-cool.png",
  think: "/mascot/fox-think.png",
};

/**
 * Coach Fox (set C) — navy chibi fox, teal collar, expression PNGs.
 */
export function CoachDog({
  pose = "neutral",
  size = 48,
  className = "",
  title = "Coach Fox",
}: CoachDogProps) {
  const src = POSE_SRC[pose] ?? POSE_SRC.neutral;

  return (
    <Image
      src={src}
      alt={title}
      width={512}
      height={512}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
      priority={size >= 80}
      unoptimized
    />
  );
}
