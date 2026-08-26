import {
  JungleMascot,
  type JungleMascotName,
} from "@/components/mascot/JungleMascot";
import { MASCOT_HEADER_SIZES } from "@/data/jungle-cast-brand";
import { displayFontClass } from "@/lib/fonts";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Optional mascot peeking from the bottom edge of header like hanging from a wooden beam. */
  peekMascot?: JungleMascotName | boolean | "sm";
};

export function AppHeader({
  title,
  leading,
  trailing,
  peekMascot = false,
}: AppHeaderProps) {
  const mascotCharacter: JungleMascotName =
    typeof peekMascot === "string" && peekMascot !== "sm"
      ? peekMascot
      : "monkey";

  const isSm = peekMascot === "sm";
  const hasMascot = Boolean(peekMascot);
  const mascotSize =
    mascotCharacter !== "lineup"
      ? MASCOT_HEADER_SIZES[mascotCharacter]
      : { width: 44, height: 44 };
  const scale = isSm ? 0.82 : 1;

  return (
    <header className={`app-header${hasMascot ? " app-header--mascot" : ""}`}>
      <div className="app-header__beam" aria-hidden />
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

      {hasMascot ? (
        <div
          className={`app-header__mascot-anchor app-header__mascot-anchor--${mascotCharacter}${isSm ? " app-header__mascot-anchor--sm" : ""}`}
          aria-hidden
        >
          <JungleMascot
            character={mascotCharacter}
            width={Math.round(mascotSize.width * scale)}
            height={Math.round(mascotSize.height * scale)}
          />
        </div>
      ) : null}
    </header>
  );
}
