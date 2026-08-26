/**
 * Compact header strip — all four Jungle Jokers mascots at small size.
 */
import Image from "next/image";
import {
  MASCOT_HEADER_SIZES,
  MASCOT_PUBLIC_PATHS,
  type MascotBrandMember,
} from "@/data/jungle-cast-brand";

const MEMBERS: readonly MascotBrandMember[] = [
  "monkey",
  "elephant",
  "crocodile",
  "tiger",
];

export function HeaderMascotStrip() {
  return (
    <div className="app-header__mascots" aria-hidden>
      {MEMBERS.map((member) => {
        const size = MASCOT_HEADER_SIZES[member];
        return (
          <Image
            key={member}
            src={MASCOT_PUBLIC_PATHS[member]}
            alt=""
            width={size.width}
            height={size.height}
            className="app-header__mascot"
            unoptimized
          />
        );
      })}
    </div>
  );
}
