/**
 * Header branch scene — transparent branch (right edge) + one mascot overlay per tab.
 */
import Image from "next/image";
import {
  HANGING_PURPLE_MONKEY,
  HEADER_BRANCH_TEMPLATE,
  MASCOT_HEADER_SIZES,
  MASCOT_PUBLIC_PATHS,
} from "@/data/jungle-cast-brand";
import type { JungleMascotName } from "@/components/mascot/JungleMascot";

export type HeaderBranchCharacter = Exclude<JungleMascotName, "lineup">;

type HeaderBranchSceneProps = {
  character: HeaderBranchCharacter;
};

function mascotSrc(character: HeaderBranchCharacter): string {
  if (character === "monkey") return HANGING_PURPLE_MONKEY;
  return MASCOT_PUBLIC_PATHS[character];
}

export function HeaderBranchScene({ character }: HeaderBranchSceneProps) {
  const size = MASCOT_HEADER_SIZES[character];

  return (
    <div className="app-header__branch-scene" aria-hidden>
      <Image
        src={HEADER_BRANCH_TEMPLATE}
        alt=""
        width={960}
        height={294}
        className="app-header__branch-art"
        priority
        unoptimized
      />
      <Image
        src={mascotSrc(character)}
        alt=""
        width={character === "monkey" ? 80 : size.width}
        height={character === "monkey" ? 96 : size.height}
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
