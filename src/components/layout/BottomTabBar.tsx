"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { countDueReviewWords } from "@/lib/review-schedule";
import { fetchLearningSummary } from "@/lib/review-fetch";
import { useI18n } from "@/hooks/use-i18n";

type TabItem = {
  href: string;
  label: string;
  match: (path: string) => boolean;
  icon: (active: boolean) => React.ReactNode;
  showBadge?: boolean;
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

function JourneyIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-accent-700" : "text-foreground/45"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M5 19l4-2 6 2 4-2V7l-4 2-6-2-4 2v12z"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LearnIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-secondary" : "text-foreground/45"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="4" y="3" width="16" height="18" rx="2.5" />
      <path d="M8 8h8M8 12h8M8 16h5" strokeLinecap="round" />
    </svg>
  );
}

function LibraryIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-pink" : "text-foreground/45"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M5 4h5v16H6a1 1 0 01-1-1V4zM14 4h5v16h-4a1 1 0 01-1-1V4z" strokeLinejoin="round" />
      <path d="M5 4h14" strokeLinecap="round" />
    </svg>
  );
}


export function BottomTabBar() {
  const pathname = usePathname();
  const [dueCount, setDueCount] = useState(0);
  const { t } = useI18n();

  useEffect(() => {
    let cancelled = false;
    const refresh = async () => {
      let count = countDueReviewWords();
      try {
        const summary = await fetchLearningSummary();
        count = countDueReviewWords(summary);
      } catch {
        /* keep local count */
      }
      if (!cancelled) setDueCount(count);
    };
    void refresh();
    window.addEventListener("vocab-learning-changed", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("vocab-learning-changed", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [pathname]);

  const tabs: TabItem[] = [
    {
      href: "/discover",
      label: t("tab.home"),
      match: (path) =>
        path.startsWith("/discover") ||
        path.startsWith("/search") ||
        path.startsWith("/word/"),
      icon: (active) => <DiscoverIcon active={active} />,
    },
    {
      href: "/journey",
      label: t("tab.journey"),
      match: (path) => path.startsWith("/journey"),
      icon: (active) => <JourneyIcon active={active} />,
    },
    {
      href: "/learn",
      label: t("tab.review"),
      match: (path) => path.startsWith("/learn"),
      icon: (active) => <LearnIcon active={active} />,
      showBadge: true,
    },
    {
      href: "/words",
      label: t("tab.library"),
      match: (path) => path.startsWith("/words"),
      icon: (active) => <LibraryIcon active={active} />,
    },
  ];

  return (
    <nav
      className="bottom-tab-bar border-t border-slate-200"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 0.5rem)",
      }}
      aria-label="Main navigation"
    >
      <div className="mx-auto grid h-[var(--tab-bar-height)] max-w-lg grid-cols-4 overflow-visible">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const activeColorClass =
            tab.href.startsWith("/journey")
              ? "text-accent-700"
              : tab.href.startsWith("/learn")
                ? "text-secondary"
                : tab.href.startsWith("/words")
                  ? "text-pink"
                  : "text-primary";
          const activeBgClass =
            tab.href.startsWith("/journey")
              ? "bg-accent-50"
              : tab.href.startsWith("/learn")
                ? "bg-secondary-50"
                : tab.href.startsWith("/words")
                  ? "bg-pink-50"
                  : "bg-primary-50";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`tab-bar-link ${
                active ? `tab-bar-link--active ${activeColorClass}` : "tab-bar-link--inactive"
              }`}
            >
              <span className={`tab-bar-link__pill ${active ? activeBgClass : ""}`}>
                <span className="tab-bar-link__icon">
                  {tab.icon(active)}
                  {tab.showBadge && dueCount > 0 ? (
                    <span
                      className="tab-bar-badge"
                      aria-label={t("tab.dueAria", { count: dueCount })}
                    >
                      {dueCount > 99 ? "99+" : dueCount}
                    </span>
                  ) : null}
                </span>
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
