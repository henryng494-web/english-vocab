"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  primeJourneyAudioFromUserGesture,
  warmFirstReviewWordPronunciation,
} from "@/lib/pronunciation-preload";
import { usePaywall } from "@/context/PaywallContext";
import { useI18n } from "@/hooks/use-i18n";
import { IS_MOBILE_BUILD } from "@/lib/api-base";
import { normalizeMobileAppPath } from "@/lib/auth-navigation";
import { freeTierBlockReason } from "@/lib/free-tier-gate";

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

function tabHref(path: string): string {
  return IS_MOBILE_BUILD ? normalizeMobileAppPath(path) : path;
}

function pathsMatch(pathname: string, href: string): boolean {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const target = href.replace(/\/+$/, "") || "/";
  return normalized === target || normalized.startsWith(`${target}/`);
}

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useI18n();
  const { showUpgradePrompt } = usePaywall();

  const tabs: TabItem[] = [
    {
      href: "/discover",
      label: t("tab.home"),
      match: (path) =>
        pathsMatch(path, "/discover") ||
        pathsMatch(path, "/search") ||
        path.includes("/word/"),
      icon: (active) => <DiscoverIcon active={active} />,
    },
    {
      href: "/journey",
      label: t("tab.journey"),
      match: (path) => pathsMatch(path, "/journey"),
      icon: (active) => <JourneyIcon active={active} />,
    },
    {
      href: "/learn",
      label: t("tab.review"),
      match: (path) => pathsMatch(path, "/learn"),
      icon: (active) => <LearnIcon active={active} />,
    },
    {
      href: "/account",
      label: t("tab.account"),
      match: (path) => pathsMatch(path, "/account"),
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

          const href = tabHref(tab.href);

          return (
            <Link
              key={tab.href}
              href={href}
              onClick={(event) => {
                if (tab.href !== "/learn") return;
                const reason = freeTierBlockReason("review");
                if (reason) {
                  event.preventDefault();
                  showUpgradePrompt(reason);
                }
              }}
              onPointerDown={(event) => {
                if (tab.href === "/learn") {
                  warmFirstReviewWordPronunciation();
                  return;
                }
                if (!journeyTab) return;
                event.preventDefault();
                primeJourneyAudioFromUserGesture();
                if (!pathsMatch(pathname, "/journey")) {
                  router.push(tabHref("/journey"));
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
