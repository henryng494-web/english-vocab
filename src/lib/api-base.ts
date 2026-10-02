import { createClientIfConfigured } from "@/lib/supabase/client";

/** Base URL of the deployed web app for the Capacitor (static export) build. Empty on the web. */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "")
  .trim()
  .replace(/\/+$/, "");

export const IS_MOBILE_BUILD = process.env.NEXT_PUBLIC_MOBILE_BUILD === "1";

/** Large bundled assets that are not shipped inside the mobile app (served by the deployed site). */
const REMOTE_ASSET_PREFIXES = ["/word-images/"];

export function apiUrl(path: string): string {
  return API_BASE_URL && path.startsWith("/api/") ? `${API_BASE_URL}${path}` : path;
}

export function remoteAssetUrl(path: string): string {
  if (!API_BASE_URL) return path;
  return REMOTE_ASSET_PREFIXES.some((prefix) => path.startsWith(prefix))
    ? `${API_BASE_URL}${path}`
    : path;
}

function resolveRemote(path: string): string {
  return remoteAssetUrl(apiUrl(path));
}

/**
 * Static export has no `/word/<anything>` pages, so mobile links go through the
 * prerendered `/word/_/` page and pass the word in the query string.
 */
export function wordPageHref(word: string, query?: string): string {
  const encoded = encodeURIComponent(word.toLowerCase());
  const extra = query ? `&${query}` : "";
  return IS_MOBILE_BUILD
    ? `/word/_/?w=${encoded}${extra}`
    : `/word/${encoded}${query ? `?${query}` : ""}`;
}

async function accessToken(): Promise<string | null> {
  try {
    const supabase = createClientIfConfigured();
    if (!supabase) return null;
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token ?? null;
  } catch {
    return null;
  }
}

let patched = false;

/**
 * Mobile (file-served) build only: send `/api/*` fetches to the remote site with the
 * Supabase access token in `Authorization` (cookies do not cross origins), and load
 * the big `/word-images/*` assets from the remote site instead of the app bundle.
 */
export function installApiBase(): void {
  if (patched || !API_BASE_URL || typeof window === "undefined") return;
  patched = true;

  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input !== "string") return nativeFetch(input, init);
    const url = resolveRemote(input);
    if (url === input || !input.startsWith("/api/")) return nativeFetch(url, init);

    const token = await accessToken();
    if (!token) return nativeFetch(url, init);
    const headers = new Headers(init?.headers);
    if (!headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
    return nativeFetch(url, { ...init, headers });
  };

  const srcDescriptor = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  if (srcDescriptor?.set && srcDescriptor.get) {
    const { get, set } = srcDescriptor;
    Object.defineProperty(HTMLImageElement.prototype, "src", {
      configurable: true,
      enumerable: srcDescriptor.enumerable,
      get,
      set(value: string) {
        set.call(this, typeof value === "string" ? remoteAssetUrl(value) : value);
      },
    });
  }

  const nativeSetAttribute = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (name: string, value: string) {
    if (name === "src" && this instanceof HTMLImageElement && typeof value === "string") {
      return nativeSetAttribute.call(this, name, remoteAssetUrl(value));
    }
    return nativeSetAttribute.call(this, name, value);
  };
}
