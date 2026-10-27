import { IS_MOBILE_BUILD } from "@/lib/api-base";
import { isMobileAuthContext } from "@/lib/auth-redirect";

/** Static Capacitor export uses trailing slashes — normalize in-app paths. */
export function normalizeMobileAppPath(path: string): string {
  if (!path.startsWith("/")) return path;
  if (path.includes("?")) {
    const [pathname, query] = path.split("?", 2);
    const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
    return `${normalized}?${query}`;
  }
  return path.endsWith("/") ? path : `${path}/`;
}

export function shouldUseHardNavigationAfterAuth(): boolean {
  return IS_MOBILE_BUILD || isMobileAuthContext();
}

export function navigateAfterAuth(path: string): void {
  window.location.assign(normalizeMobileAppPath(path));
}
