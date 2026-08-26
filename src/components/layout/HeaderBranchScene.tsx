/**
 * Header branch scene — one mascot interacting with the locked branch template.
 * Each app tab uses a single iconic character (monkey / elephant / crocodile / tiger).
 */
import Image from "next/image";
import { HEADER_BRANCH_SCENES } from "@/data/jungle-cast-brand";
import type { JungleMascotName } from "@/components/mascot/JungleMascot";

export type HeaderBranchCharacter = Exclude<JungleMascotName, "lineup">;

type HeaderBranchSceneProps = {
  character: HeaderBranchCharacter;
};

export function HeaderBranchScene({ character }: HeaderBranchSceneProps) {
  const src = HEADER_BRANCH_SCENES[character];

  return (
    <div className="app-header__branch-scene" aria-hidden>
      <Image
        src={src}
        alt=""
        width={640}
        height={360}
        className="app-header__branch-art"
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
