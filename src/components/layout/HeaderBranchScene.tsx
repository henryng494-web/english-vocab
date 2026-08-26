/**
 * Header branch scene — locked branch template + one mascot overlay per tab.
 * Branch image is NEVER modified; mascot is composited in CSS.
 */
import Image from "next/image";
import {
  HEADER_BRANCH_TEMPLATE,
  MASCOT_HEADER_SIZES,
  MASCOT_PUBLIC_PATHS,
} from "@/data/jungle-cast-brand";
import type { JungleMascotName } from "@/components/mascot/JungleMascot";

export type HeaderBranchCharacter = Exclude<JungleMascotName, "lineup">;

type HeaderBranchSceneProps = {
  character: HeaderBranchCharacter;
};

export function HeaderBranchScene({ character }: HeaderBranchSceneProps) {
  const size = MASCOT_HEADER_SIZES[character];

  return (
    <div className="app-header__branch-scene" aria-hidden>
      <Image
        src={HEADER_BRANCH_TEMPLATE}
        alt=""
        width={960}
        height={540}
        className="app-header__branch-art"
        priority
        unoptimized
      />
      <Image
        src={MASCOT_PUBLIC_PATHS[character]}
        alt=""
        width={size.width}
        height={size.height}
        className={`app-header__mascot-on-branch app-header__mascot-on-branch--${character}`}
        priority
        unoptimized
      />
    </div>
  );
}

export function resolveHeaderBranchCharacter(
  peekMascot: JungleMascotName | boolean | "sm",
): HeaderBranchCharacter | null {
  if (!peekMascot || peekMascot === "sm" || peekMascot === "lineup") return null;
  if (peekMascot === true) return "monkey";
  return peekMascot;
}
