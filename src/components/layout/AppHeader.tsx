import { HeaderBranch } from "@/components/layout/HeaderBranch";
import {
  JungleMascot,
  type JungleMascotName,
} from "@/components/mascot/JungleMascot";
import {
  MASCOT_HEADER_CONTACT,
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
  /* Shift the image down so its contact point (e.g. hands, hips) lands on the branch line. */
  const contactShiftPct = Math.round((1 - contact) * 100);

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
          aria-hidden
        >
          <div
            className="app-header__mascot-figure"
            style={{
              transform: `translateY(${contactShiftPct}%)${tilt ? ` rotate(${tilt}deg)` : ""}`,
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
