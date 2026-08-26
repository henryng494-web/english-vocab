"use client";

import Image from "next/image";
import { MASCOT_PUBLIC_PATHS } from "@/data/jungle-cast-brand";

export type JungleMascotName = "monkey" | "elephant" | "crocodile" | "tiger" | "lineup";

type JungleMascotProps = {
  character?: JungleMascotName;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  title?: string;
  priority?: boolean;
};

const MASCOT_DEFAULT_TITLES: Record<JungleMascotName, string> = {
  monkey: "Jungle Monkey",
  elephant: "Jungle Elephant",
  crocodile: "Jungle Crocodile",
  tiger: "Jungle Tiger",
  lineup: "Jungle Jokers Cast",
};

export function JungleMascot({
  character = "monkey",
  size = 48,
  width,
  height,
  className = "",
  title,
  priority = false,
}: JungleMascotProps) {
  const src = MASCOT_PUBLIC_PATHS[character] ?? MASCOT_PUBLIC_PATHS.monkey;
  const w = width ?? size;
  const h = height ?? size;
  const displayTitle = title ?? MASCOT_DEFAULT_TITLES[character];

  return (
    <Image
      src={src}
      alt={displayTitle}
      width={w * 2}
      height={h * 2}
      className={className}
      style={{ width: w, height: h, objectFit: "contain" }}
      priority={priority}
      unoptimized
    />
  );
}

/** Small avatar cluster showing the 4 Jungle Jokers friends. */
export function JungleCastPill({ size = 28, className = "" }: { size?: number; className?: string }) {
  return (
    <div className={`inline-flex items-center -space-x-2 ${className}`}>
      <Image
        src={MASCOT_PUBLIC_PATHS.monkey}
        alt="Monkey"
        width={size * 2}
        height={size * 2}
        className="rounded-full border-2 border-white bg-violet-100 shadow-sm"
        style={{ width: size, height: size, objectFit: "contain" }}
        unoptimized
      />
      <Image
        src={MASCOT_PUBLIC_PATHS.elephant}
        alt="Elephant"
        width={size * 2}
        height={size * 2}
        className="rounded-full border-2 border-white bg-pink-100 shadow-sm"
        style={{ width: size, height: size, objectFit: "contain" }}
        unoptimized
      />
      <Image
        src={MASCOT_PUBLIC_PATHS.crocodile}
        alt="Crocodile"
        width={size * 2}
        height={size * 2}
        className="rounded-full border-2 border-white bg-lime-100 shadow-sm"
        style={{ width: size, height: size, objectFit: "contain" }}
        unoptimized
      />
      <Image
        src={MASCOT_PUBLIC_PATHS.tiger}
        alt="Tiger"
        width={size * 2}
        height={size * 2}
        className="rounded-full border-2 border-white bg-orange-100 shadow-sm"
        style={{ width: size, height: size, objectFit: "contain" }}
        unoptimized
      />
    </div>
  );
}
