/**
 * Header branch scene — rightTreeSection (210×85) + mascot overlay per tab.
 */
import Image from "next/image";
import {
  HEADER_BRANCH_TEMPLATE,
  MASCOT_HEADER_SIZES,
  MASCOT_PUBLIC_PATHS,
  SPLASH_HANGING_MONKEY,
} from "@/data/jungle-cast-brand";
import type { JungleMascotName } from "@/components/mascot/JungleMascot";

export type HeaderBranchCharacter = Exclude<JungleMascotName, "lineup">;

type HeaderBranchSceneProps = {
  character: HeaderBranchCharacter;
};

function mascotSrc(character: HeaderBranchCharacter): string {
  if (character === "monkey") return SPLASH_HANGING_MONKEY;
  return MASCOT_PUBLIC_PATHS[character];
}

export function HeaderBranchScene({ character }: HeaderBranchSceneProps) {
  const size = MASCOT_HEADER_SIZES[character];

  return (
    <div className="rightTreeSection app-header__branch-scene" aria-hidden>
      <Image
        src={HEADER_BRANCH_TEMPLATE}
        alt=""
        width={220}
        height={96}
        className="app-header__branch-art"
        priority
        unoptimized
      />
      <Image
        src={mascotSrc(character)}
        alt=""
        width={character === "monkey" ? 233 : size.width}
        height={character === "monkey" ? 293 : size.height}
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
