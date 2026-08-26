import Image from "next/image";
import {
  HEADER_SCENE_ART,
  type HeaderSceneMascot,
} from "@/data/jungle-cast-brand";
import { displayFontClass } from "@/lib/fonts";
import type { JungleMascotName } from "@/components/mascot/JungleMascot";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Pre-baked branch + mascot scene for this page's brand character. */
  peekMascot?: JungleMascotName | boolean | "sm";
};

function resolveSceneMascot(
  peekMascot: JungleMascotName | boolean | "sm",
): HeaderSceneMascot | null {
  if (!peekMascot || peekMascot === "sm") return null;
  if (peekMascot === true) return "monkey";
  if (peekMascot === "lineup") return null;
  return peekMascot;
}

export function AppHeader({
  title,
  leading,
  trailing,
  peekMascot = false,
}: AppHeaderProps) {
  const sceneMascot = resolveSceneMascot(peekMascot);
  const scene = sceneMascot ? HEADER_SCENE_ART[sceneMascot] : null;

  return (
    <header className={`app-header${scene ? " app-header--scene" : ""}`}>
      <div className="app-header__inner">
        <div className="app-header__side app-header__side--left">
          {leading ?? <span className="app-header__spacer" aria-hidden />}
        </div>

        <div className="app-header__title-container">
          <h1 className={`app-header__title ${displayFontClass}`}>{title}</h1>
        </div>

        <div className="app-header__side app-header__side--right">
          {trailing ?? <span className="app-header__spacer" aria-hidden />}
        </div>
      </div>

      {scene ? (
        <Image
          src={scene.path}
          alt=""
          width={scene.width}
          height={scene.height}
          className="app-header__scene"
          priority
          unoptimized
          aria-hidden
        />
      ) : null}
    </header>
  );
}
