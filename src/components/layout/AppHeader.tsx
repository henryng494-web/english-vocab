import { HeaderMascotStrip } from "@/components/layout/HeaderMascotStrip";
import { displayFontClass } from "@/lib/fonts";
import type { JungleMascotName } from "@/components/mascot/JungleMascot";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Colored brand header with all four Jungle Jokers mascots. */
  peekMascot?: JungleMascotName | boolean | "sm";
};

export function AppHeader({
  title,
  leading,
  trailing,
  peekMascot = false,
}: AppHeaderProps) {
  const showBrand = Boolean(peekMascot);

  return (
    <header className={`app-header${showBrand ? " app-header--brand" : ""}`}>
      <div className="app-header__inner">
        <div className="app-header__side app-header__side--left">
          {leading ?? <span className="app-header__spacer" aria-hidden />}
        </div>

        <div className="app-header__title-container">
          {showBrand ? <HeaderMascotStrip /> : null}
          <h1 className={`app-header__title ${displayFontClass}`}>{title}</h1>
        </div>

        <div className="app-header__side app-header__side--right">
          {trailing ?? <span className="app-header__spacer" aria-hidden />}
        </div>
      </div>
    </header>
  );
}
