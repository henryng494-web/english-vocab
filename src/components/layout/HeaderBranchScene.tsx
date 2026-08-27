/**
 * Header branch scene — rightTreeSection (66% header width) + mascot overlay per tab.
 */
import Image from "next/image";
import {
  HEADER_BRANCH_TEMPLATE,
  HEADER_HANGING_MONKEY,
  MASCOT_HEADER_SIZES,
  MASCOT_PUBLIC_PATHS,
} from "@/data/jungle-cast-brand";
import type { JungleMascotName } from "@/components/mascot/JungleMascot";

export type HeaderBranchCharacter = Exclude<JungleMascotName, "lineup">;

type HeaderBranchSceneProps = {
  character: HeaderBranchCharacter;
};

function mascotSrc(character: HeaderBranchCharacter): string {
  if (character === "monkey") return HEADER_HANGING_MONKEY;
  return MASCOT_PUBLIC_PATHS[character];
}

export function HeaderBranchScene({ character }: HeaderBranchSceneProps) {
  const size = MASCOT_HEADER_SIZES[character];

  return (
    <div className="rightTreeSection app-header__branch-scene" aria-hidden>
      <div className="app-header__branch-flip">
        <Image
          src={HEADER_BRANCH_TEMPLATE}
          alt=""
          width={1830}
          height={560}
          className="app-header__branch-art"
          priority
          unoptimized
        />
      </div>
      <Image
        src={mascotSrc(character)}
        alt=""
        width={character === "monkey" ? 130 : size.width}
        height={character === "monkey" ? 256 : size.height}
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
