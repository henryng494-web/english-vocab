/** Base URL of the deployed API for the Capacitor (static export) build. Empty on the web. */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

export function apiUrl(path: string): string {
  return API_BASE_URL && path.startsWith("/api/") ? `${API_BASE_URL}${path}` : path;
}

let patched = false;

/** Route relative `/api/...` fetches to the remote API when the app runs from local files. */
export function installApiBaseFetch(): void {
  if (patched || !API_BASE_URL || typeof window === "undefined") return;
  patched = true;
  const nativeFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string") return nativeFetch(apiUrl(input), init);
    return nativeFetch(input, init);
  };
}
