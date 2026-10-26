import type { MessageKey } from "@/lib/i18n/messages";
import { isLikelyFetchFailure, isUnreliableNavigatorOnLine } from "@/lib/network-status";

type Translate = (key: MessageKey, params?: Record<string, string | number>) => string;

export type AuthMode = "signin" | "signup";

export type AuthErrorLike = {
  message?: string;
  code?: string;
  status?: number;
  name?: string;
};

/** Console diagnostics for TestFlight / mobile (no passwords). */
export function logSupabaseAuthError(
  scope: string,
  error: AuthErrorLike | unknown,
  extra?: Record<string, unknown>,
): void {
  if (typeof console === "undefined") return;
  const payload =
    error && typeof error === "object"
      ? {
          message: "message" in error ? String(error.message) : undefined,
          code: "code" in error ? String(error.code) : undefined,
          status: "status" in error ? error.status : undefined,
          name: "name" in error ? String(error.name) : undefined,
        }
      : { message: String(error) };
  console.warn(`[supabase-auth] ${scope}`, { ...payload, ...extra });
}

export function logAuthRedirect(scope: string, emailRedirectTo: string): void {
  if (typeof console === "undefined") return;
  console.info(`[supabase-auth] ${scope} emailRedirectTo=${emailRedirectTo}`);
}

function normalizeMessage(error: AuthErrorLike | string | undefined): string {
  if (!error) return "";
  if (typeof error === "string") return error;
  return (error.message ?? "").trim();
}

function errorCode(error: AuthErrorLike | string | undefined): string {
  if (!error || typeof error === "string") return "";
  return (error.code ?? "").trim().toLowerCase();
}

/** Maps Supabase Auth errors to user-facing copy; falls back to server message when safe. */
export function describeAuthError(
  t: Translate,
  error: AuthErrorLike | string | undefined,
  mode: AuthMode,
): string {
  const text = normalizeMessage(error).toLowerCase();
  const code = errorCode(error);

  if (code === "weak_password" || text.includes("weak password")) {
    return t("auth.err.weakPassword");
  }
  if (
    code === "signup_disabled" ||
    text.includes("signups not allowed") ||
    text.includes("signup is disabled")
  ) {
    return t("auth.err.signUpDisabled");
  }
  if (
    text.includes("redirect") &&
    (text.includes("not allowed") || text.includes("validate") || text.includes("invalid"))
  ) {
    return t("auth.err.redirectNotAllowed");
  }
  if (text.includes("invalid login credentials")) return t("auth.err.invalidCredentials");
  if (text.includes("email not confirmed")) return t("auth.err.emailNotConfirmed");
  if (
    code === "user_already_exists" ||
    text.includes("already registered") ||
    text.includes("already been registered") ||
    text.includes("user already registered")
  ) {
    return t("auth.err.alreadyRegistered");
  }
  if (
    text.includes("password") &&
    (text.includes("least") || text.includes("short") || text.includes("characters"))
  ) {
    return t("auth.err.passwordShort");
  }
  if (
    code === "over_email_send_rate_limit" ||
    code === "over_request_rate_limit" ||
    text.includes("rate limit") ||
    text.includes("too many")
  ) {
    return t("auth.err.rateLimit");
  }
  if (isLikelyFetchFailure(error)) {
    const raw = normalizeMessage(error);
    if (isUnreliableNavigatorOnLine()) {
      return raw
        ? t("auth.err.requestFailedDetail", { detail: raw })
        : t("auth.err.requestFailed");
    }
    return t("auth.err.network");
  }
  if (
    code === "email_address_invalid" ||
    text.includes("valid email") ||
    text.includes("invalid email") ||
    text.includes("unable to validate email")
  ) {
    return t("auth.err.invalidEmail");
  }

  const raw = normalizeMessage(error);
  if (raw && mode === "signup") {
    return t("auth.err.signUpDetail", { detail: raw });
  }
  if (raw && mode === "signin") {
    return t("auth.err.signInDetail", { detail: raw });
  }

  return mode === "signin" ? t("auth.err.signInFailed") : t("auth.err.signUpFailed");
}
