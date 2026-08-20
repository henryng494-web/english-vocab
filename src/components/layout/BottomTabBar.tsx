"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type TabItem = {
  href: string;
  label: string;
  match: (path: string) => boolean;
  icon: (active: boolean) => React.ReactNode;
};

function DiscoverIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-primary" : "text-foreground/45"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function LearnIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-primary" : "text-foreground/45"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
    </svg>
  );
}

function AccountIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-primary" : "text-foreground/45"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M5 20c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5" strokeLinecap="round" />
    </svg>
  );
}

const TABS: TabItem[] = [
  {
    href: "/discover",
    label: "Vocab Journey",
    match: (path) => path.startsWith("/discover"),
    icon: (active) => <DiscoverIcon active={active} />,
  },
  {
    href: "/learn",
    label: "Review",
    match: (path) => path.startsWith("/learn"),
    icon: (active) => <LearnIcon active={active} />,
  },
  {
    href: "/account",
    label: "Account",
    match: (path) => path.startsWith("/account") || path.startsWith("/auth"),
    icon: (active) => <AccountIcon active={active} />,
  },
];

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-primary-200 bg-surface/95 backdrop-blur-lg"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      aria-label="Main navigation"
    >
      <div className="mx-auto grid h-[var(--tab-bar-height)] max-w-lg grid-cols-3">
        {TABS.map((tab) => {
          const active = tab.match(pathname);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 text-sm font-semibold transition ${
                active ? "text-primary" : "text-foreground/50"
              }`}
            >
              {tab.icon(active)}
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
