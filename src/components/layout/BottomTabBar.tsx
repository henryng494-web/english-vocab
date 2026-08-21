"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { countLearningWords } from "@/lib/learning-storage";

type TabItem = {
  href: string;
  label: string;
  match: (path: string) => boolean;
  icon: (active: boolean) => React.ReactNode;
  badge?: number;
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
      <path d="M3 10.5L12 4l9 6.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" strokeLinejoin="round" />
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

export function BottomTabBar() {
  const pathname = usePathname();
  const [learningCount, setLearningCount] = useState(0);

  useEffect(() => {
    const refresh = () => setLearningCount(countLearningWords());
    refresh();
    window.addEventListener("vocab-learning-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("vocab-learning-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [pathname]);

  const tabs: TabItem[] = [
    {
      href: "/discover",
      label: "Home",
      match: (path) => path.startsWith("/discover"),
      icon: (active) => <DiscoverIcon active={active} />,
    },
    {
      href: "/learn",
      label: "Review",
      match: (path) => path.startsWith("/learn"),
      icon: (active) => <LearnIcon active={active} />,
      badge: learningCount,
    },
    {
      href: "/account",
      label: "Account",
      match: (path) => path.startsWith("/account") || path.startsWith("/auth"),
      icon: (active) => <AccountIcon active={active} />,
    },
  ];

  return (
    <nav
      className="bottom-tab-bar border-t border-primary-100"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.5rem)",
      }}
      aria-label="Main navigation"
    >
      <div className="mx-auto grid h-[var(--tab-bar-height)] max-w-lg grid-cols-3">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const badge = tab.badge ?? 0;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tab-bar-link ${
                active ? "tab-bar-link--active" : "tab-bar-link--inactive"
              }`}
            >
              <span className="tab-bar-link__pill">
                {tab.icon(active)}
                {badge > 0 ? (
                  <span className="tab-bar-badge" aria-label={`${badge} words learning`}>
                    {badge > 99 ? "99+" : badge}
                  </span>
                ) : null}
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
