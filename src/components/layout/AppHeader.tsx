import { JungleMascot, type JungleMascotName } from "@/components/mascot/JungleMascot";
import { displayFontClass } from "@/lib/fonts";

type AppHeaderProps = {
  title: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  /** Optional mascot peeking from the bottom edge of header. */
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

  const innerClass = hasMascot
    ? isSm
      ? "app-header__inner app-header__inner--mascot-sm"
      : "app-header__inner app-header__inner--mascot"
    : "app-header__inner";

  return (
    <header className="app-header">
      <div className={innerClass}>
        <div className="app-header__side app-header__side--left">
          {leading ?? <span className="app-header__spacer" aria-hidden />}
          {hasMascot ? (
            <div
              className={`app-header__mascot${isSm ? " app-header__mascot--sm" : ""}`}
              aria-hidden
            >
              <JungleMascot
                character={mascotCharacter}
                size={isSm ? 44 : 64}
                className="transition-transform duration-200"
              />
            </div>
          ) : null}
        </div>
        <h1 className={`app-header__title ${displayFontClass}`}>{title}</h1>
        <div className="app-header__side app-header__side--right">
          {trailing ?? <span className="app-header__spacer" aria-hidden />}
        </div>
      </div>
    </header>
  );
}
