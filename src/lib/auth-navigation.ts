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

/** Preserve the authenticated React tree; a document reload restarts the splash. */
export function navigateAfterAuth(path: string, router: { replace: (href: string) => void }): void {
  router.replace(normalizeMobileAppPath(path));
}
