"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  primeJourneyAudioFromUserGesture,
  warmFirstReviewWordPronunciation,
} from "@/lib/pronunciation-preload";
import { useI18n } from "@/hooks/use-i18n";

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

function AccountIcon({ active }: { active: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className={`h-6 w-6 ${active ? "text-pink" : "text-foreground/45"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" strokeLinecap="round" />
    </svg>
  );
}

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();

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
    },
    {
      href: "/account",
      label: t("tab.account"),
      match: (path) => path.startsWith("/account"),
      icon: (active) => <AccountIcon active={active} />,
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
                : tab.href.startsWith("/account")
                  ? "text-pink"
                  : "text-primary";
          const activeBgClass =
            tab.href.startsWith("/journey")
              ? "bg-accent-50"
              : tab.href.startsWith("/learn")
                ? "bg-secondary-50"
                : tab.href.startsWith("/account")
                  ? "bg-pink-50"
                  : "bg-primary-50";

          const pillTone =
            tab.href.startsWith("/journey")
              ? "journey"
              : tab.href.startsWith("/learn")
                ? "review"
                : tab.href.startsWith("/account")
                  ? "library"
                  : "home";

          const journeyTab = tab.href === "/journey";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              onPointerDown={(event) => {
                if (tab.href === "/learn") {
                  warmFirstReviewWordPronunciation();
                  return;
                }
                if (!journeyTab) return;
                event.preventDefault();
                primeJourneyAudioFromUserGesture();
                if (!pathname.startsWith("/journey")) {
                  router.push("/journey");
                }
              }}
              className={`tab-bar-link ${
                active ? `tab-bar-link--active ${activeColorClass}` : "tab-bar-link--inactive"
              }`}
            >
              <span
                className={`tab-bar-link__pill tab-bar-link__pill--${pillTone}${
                  active ? ` ${activeBgClass}` : ""
                }`}
              >
                <span className="tab-bar-link__icon">{tab.icon(active)}</span>
              </span>
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
