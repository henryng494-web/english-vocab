type MobileTopBarProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
};

export function MobileTopBar({ title, subtitle, trailing }: MobileTopBarProps) {
  return (
    <header
      className="sticky top-0 z-40 border-b border-primary-100 bg-white/90 backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      <div className="flex items-start justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
          {subtitle ? (
            <p className="text-xs text-foreground/60">{subtitle}</p>
          ) : null}
        </div>
        {trailing ? <div className="shrink-0">{trailing}</div> : null}
      </div>
    </header>
  );
}
