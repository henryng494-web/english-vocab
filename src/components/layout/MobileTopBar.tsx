type MobileTopBarProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
};

export function MobileTopBar({ title, subtitle, trailing }: MobileTopBarProps) {
  return (
    <header className="mobile-top-bar">
      <div className="mobile-top-bar__surface">
        <div className="mobile-top-bar__glow" aria-hidden />
        <div className="mobile-top-bar__glow mobile-top-bar__glow--left" aria-hidden />

        <div className="relative flex items-start justify-between gap-3">
          <div className="min-w-0 pt-0.5">
            <h1 className="mobile-top-bar__title">{title}</h1>
            {subtitle ? (
              <p className="mobile-top-bar__subtitle">{subtitle}</p>
            ) : null}
          </div>
          {trailing ? (
            <div className="mobile-top-bar__trailing shrink-0">{trailing}</div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
