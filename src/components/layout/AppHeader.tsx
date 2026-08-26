import Image from "next/image";
import { HEADER_CAST_BANNER, type HeaderCastMascot } from "@/data/jungle-cast-brand";
import { displayFontClass } from "@/lib/fonts";
import type { JungleMascotName } from "@/components/mascot/JungleMascot";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Highlights this cast member on the shared header banner. */
  peekMascot?: JungleMascotName | boolean | "sm";
};

function resolveActiveCast(
  peekMascot: JungleMascotName | boolean | "sm",
): HeaderCastMascot | null {
  if (!peekMascot || peekMascot === "sm" || peekMascot === "lineup") return null;
  if (peekMascot === true) return "monkey";
  return peekMascot;
}

export function AppHeader({
  title,
  leading,
  trailing,
  peekMascot = false,
}: AppHeaderProps) {
  const activeCast = resolveActiveCast(peekMascot);
  const showCast = Boolean(peekMascot);

  return (
    <header className={`app-header${showCast ? " app-header--cast" : ""}`}>
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

      {showCast ? (
        <div className="app-header__cast" aria-hidden>
          <Image
            src={HEADER_CAST_BANNER.path}
            alt=""
            width={HEADER_CAST_BANNER.width}
            height={HEADER_CAST_BANNER.height}
            className="app-header__cast-art"
            priority
            unoptimized
          />
          {activeCast ? (
            <span
              className={`app-header__cast-highlight app-header__cast-highlight--${activeCast}`}
            />
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
