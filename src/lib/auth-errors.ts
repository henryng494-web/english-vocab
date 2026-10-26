import type { MessageKey } from "@/lib/i18n/messages";

type Translate = (key: MessageKey, params?: Record<string, string | number>) => string;

export type AuthMode = "signin" | "signup";

export type AuthErrorLike = {
  message?: string;
  code?: string;
  status?: number;
  name?: string;
};

/** Raw error text for UI (TestFlight debugging). Never maps to generic "network" copy. */
export function formatAuthErrorForUi(error: unknown): string {
  if (error == null) return "Unknown error";
  if (typeof error === "string") {
    const s = error.trim();
    return s || "Unknown error";
  }
  if (error instanceof Error) {
    const msg = error.message?.trim();
    if (msg) return msg;
    return error.toString();
  }
  if (typeof error === "object") {
    const msg = "message" in error ? String(error.message ?? "").trim() : "";
    const code = "code" in error && error.code ? String(error.code) : "";
    const name = "name" in error && error.name ? String(error.name) : "";
    if (msg && code) return `${msg} (${code})`;
    if (msg) return msg;
    if (code) return code;
    if (name) return name;
    try {
      return String(error);
    } catch {
      return "Unknown error";
    }
  }
  return String(error);
}

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

/**
 * Maps known Supabase Auth errors to friendly copy. Anything else (including fetch failures)
 * returns the raw server/runtime message on the UI — never a generic "no network" string.
 */
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
  if (
    code === "email_address_invalid" ||
    text.includes("valid email") ||
    text.includes("invalid email") ||
    text.includes("unable to validate email")
  ) {
    return t("auth.err.invalidEmail");
  }

  const raw = formatAuthErrorForUi(error);
  if (raw && raw !== "Unknown error") return raw;

  return mode === "signin" ? t("auth.err.signInFailed") : t("auth.err.signUpFailed");
}
