import { HeaderBranch } from "@/components/layout/HeaderBranch";
import {
  JungleMascot,
  type JungleMascotName,
} from "@/components/mascot/JungleMascot";
import {
  HEADER_BRANCH_RIM_REM,
  MASCOT_HEADER_CONTACT,
  MASCOT_HEADER_LEFT_REM,
  MASCOT_HEADER_SIZES,
  MASCOT_HEADER_TILT,
} from "@/data/jungle-cast-brand";
import { displayFontClass } from "@/lib/fonts";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Optional mascot perched/hanging on the curved branch border. */
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
  const contact =
    mascotCharacter !== "lineup" ? MASCOT_HEADER_CONTACT[mascotCharacter] : 0.7;
  const tilt =
    mascotCharacter !== "lineup" ? MASCOT_HEADER_TILT[mascotCharacter] : 0;
  const scale = isSm ? 0.82 : 1;
  const imgHeightPx = Math.round(mascotSize.height * scale);
  const imgHeightRem = imgHeightPx / 16;
  /* Place image so the contact point (waist/seat/belly) sits on the branch rim. */
  const mascotBottomRem =
    HEADER_BRANCH_RIM_REM - imgHeightRem * (1 - contact);
  const mascotLeftRem =
    mascotCharacter !== "lineup" ? MASCOT_HEADER_LEFT_REM[mascotCharacter] : 2.5;
  const pivotPct = Math.round(contact * 100);

  return (
    <header className={`app-header${hasMascot ? " app-header--mascot" : ""}`}>
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

      <HeaderBranch />

      {hasMascot ? (
        <div
          className={`app-header__mascot-anchor app-header__mascot-anchor--${mascotCharacter}`}
          style={{ left: `${mascotLeftRem}rem`, bottom: `${mascotBottomRem}rem` }}
          aria-hidden
        >
          <div
            className="app-header__mascot-figure"
            style={{
              transform: tilt ? `rotate(${tilt}deg)` : undefined,
              transformOrigin: `50% ${pivotPct}%`,
            }}
          >
            <JungleMascot
              character={mascotCharacter}
              width={Math.round(mascotSize.width * scale)}
              height={Math.round(mascotSize.height * scale)}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}
