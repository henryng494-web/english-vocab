"use client";

import { API_BASE_URL } from "@/lib/api-base";
import { createClientIfConfigured } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { displayFontClass } from "@/lib/fonts";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type Mode = "signin" | "signup";
type Feedback = { kind: "error" | "success"; text: string } | null;

const SUPABASE_UNAVAILABLE =
  "Không thể đăng nhập: ứng dụng chưa được cấu hình Supabase.";

function describeAuthError(message: string | undefined, mode: Mode): string {
  const text = (message ?? "").toLowerCase();
  if (text.includes("invalid login credentials")) {
    return "Email hoặc mật khẩu không đúng. Vui lòng kiểm tra lại.";
  }
  if (text.includes("email not confirmed")) {
    return "Email chưa được xác nhận. Hãy kiểm tra hộp thư và bấm vào liên kết xác nhận.";
  }
  if (text.includes("already registered") || text.includes("already been registered")) {
    return "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng \"Quên mật khẩu?\".";
  }
  if (text.includes("password") && text.includes("least")) {
    return "Mật khẩu cần có ít nhất 6 ký tự.";
  }
  if (text.includes("rate limit") || text.includes("too many")) {
    return "Bạn thao tác quá nhanh. Vui lòng thử lại sau ít phút.";
  }
  if (text.includes("fetch") || text.includes("network")) {
    return "Không có kết nối mạng. Vui lòng kiểm tra internet và thử lại.";
  }
  if (text.includes("valid email") || text.includes("invalid email")) {
    return "Email không hợp lệ.";
  }
  return mode === "signin"
    ? "Đăng nhập không thành công. Vui lòng thử lại."
    : "Đăng ký không thành công. Vui lòng thử lại.";
}

function EyeIcon({ off }: { off: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
      {off ? <path d="M4 4l16 16" /> : null}
    </svg>
  );
}

function Spinner() {
  return (
    <span
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
      aria-hidden="true"
    />
  );
}

const inputClass =
  "w-full rounded-xl border border-primary-200 bg-background px-3 py-3 text-base text-foreground placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [supabaseReady] = useState(() => isSupabaseConfigured());
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const redirectBase = API_BASE_URL || (typeof window !== "undefined" ? window.location.origin : "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setFeedback(null);

    if (mode === "signup" && password !== confirmPassword) {
      setFeedback({ kind: "error", text: "Mật khẩu xác nhận không khớp. Vui lòng nhập lại." });
      return;
    }

    setLoading(true);

    const supabase = createClientIfConfigured();
    if (!supabase) {
      setFeedback({ kind: "error", text: SUPABASE_UNAVAILABLE });
      setLoading(false);
      return;
    }

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (!mountedRef.current) return;
        if (error) {
          setFeedback({ kind: "error", text: describeAuthError(error.message, mode) });
          setLoading(false);
          return;
        }
        router.replace("/discover");
        router.refresh();
        return;
      }

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { emailRedirectTo: `${redirectBase}/auth/callback` },
      });
      if (!mountedRef.current) return;
      if (error) {
        setFeedback({ kind: "error", text: describeAuthError(error.message, mode) });
      } else if (data.session) {
        router.replace("/discover");
        router.refresh();
        return;
      } else {
        setFeedback({
          kind: "success",
          text: "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.",
        });
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (mountedRef.current) {
        setFeedback({
          kind: "error",
          text: describeAuthError(error instanceof Error ? error.message : "network", mode),
        });
      }
    }
    if (mountedRef.current) setLoading(false);
  }

  async function handleForgotPassword() {
    if (loading) return;
    setFeedback(null);
    if (!email.trim()) {
      setFeedback({
        kind: "error",
        text: "Hãy nhập email của bạn ở trên, rồi bấm \"Quên mật khẩu?\" lần nữa.",
      });
      return;
    }
    const supabase = createClientIfConfigured();
    if (!supabase) {
      setFeedback({ kind: "error", text: SUPABASE_UNAVAILABLE });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${redirectBase}/auth/callback?next=/account`,
      });
      if (!mountedRef.current) return;
      setFeedback(
        error
          ? { kind: "error", text: describeAuthError(error.message, "signin") }
          : {
              kind: "success",
              text: "Chúng tôi đã gửi liên kết đặt lại mật khẩu tới email của bạn.",
            },
      );
    } catch (error) {
      if (mountedRef.current) {
        setFeedback({
          kind: "error",
          text: describeAuthError(error instanceof Error ? error.message : "network", "signin"),
        });
      }
    }
    if (mountedRef.current) setLoading(false);
  }

  const isSignIn = mode === "signin";

  function switchMode(next: Mode) {
    if (loading || next === mode) return;
    setMode(next);
    setFeedback(null);
    setConfirmPassword("");
  }

  return (
    <main
      className="flex min-h-dvh items-center justify-center bg-background px-4"
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-primary-200 bg-surface p-6 shadow-sm sm:p-8">
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon-192.png"
            alt="Jungle Jokers"
            width={72}
            height={72}
            className="h-[72px] w-[72px] rounded-2xl shadow-sm"
          />
          <h1 className={`${displayFontClass} mt-4 text-3xl font-bold text-foreground`}>
            {isSignIn ? "Đăng nhập" : "Tạo tài khoản"}
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            {isSignIn
              ? "Đăng nhập để lưu tiến trình học từ vựng của bạn"
              : "Đăng ký để lưu và đồng bộ tiến trình học trên mọi thiết bị"}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Chế độ xác thực"
          className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-primary-50 p-1"
        >
          {(["signin", "signup"] as const).map((tab) => {
            const active = mode === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={active}
                disabled={loading}
                onClick={() => switchMode(tab)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-60 ${
                  active
                    ? "bg-primary text-foreground shadow-sm"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {tab === "signin" ? "Đăng nhập" : "Đăng ký"}
              </button>
            );
          })}
        </div>

        {!supabaseReady ? (
          <p
            role="alert"
            className="mt-4 rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-800"
          >
            {SUPABASE_UNAVAILABLE}
          </p>
        ) : null}

        <form className="mt-5 space-y-4" onSubmit={handleSubmit} noValidate={false}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground/80">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              inputMode="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              autoComplete="email"
              enterKeyHint="next"
              placeholder="ban@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mt-1 ${inputClass}`}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground/80">
              Mật khẩu
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete={isSignIn ? "current-password" : "new-password"}
                enterKeyHint={isSignIn ? "go" : "next"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-foreground/50 hover:text-foreground"
              >
                <EyeIcon off={showPassword} />
              </button>
            </div>
            {isSignIn ? (
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={loading || !supabaseReady}
                  className="text-sm font-medium text-primary-700 hover:underline disabled:opacity-50"
                >
                  Quên mật khẩu?
                </button>
              </div>
            ) : null}
          </div>

          {!isSignIn ? (
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-foreground/80"
              >
                Xác nhận mật khẩu
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type={showPassword ? "text" : "password"}
                autoCapitalize="none"
                autoCorrect="off"
                autoComplete="new-password"
                enterKeyHint="go"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                aria-invalid={confirmPassword.length > 0 && confirmPassword !== password}
                className={`mt-1 ${inputClass}`}
              />
              {confirmPassword.length > 0 && confirmPassword !== password ? (
                <p className="mt-1 text-xs text-red-700">Mật khẩu xác nhận không khớp.</p>
              ) : null}
            </div>
          ) : null}

          {feedback ? (
            <p
              role={feedback.kind === "error" ? "alert" : "status"}
              aria-live="polite"
              className={
                feedback.kind === "error"
                  ? "rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  : "rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
              }
            >
              {feedback.text}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading || !supabaseReady}
            aria-busy={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-foreground hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Spinner /> : null}
            <span>
              {loading
                ? "Đang xử lý..."
                : isSignIn
                  ? "Đăng nhập"
                  : "Đăng ký"}
            </span>
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-foreground/70">
          {isSignIn ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button
            type="button"
            onClick={() => switchMode(isSignIn ? "signup" : "signin")}
            disabled={loading}
            className="font-semibold text-primary-700 hover:underline disabled:opacity-50"
          >
            {isSignIn ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>

        <Link
          href="/account"
          className="mt-4 block text-center text-sm text-foreground/60 hover:text-primary-700"
        >
          ← Quay lại ứng dụng
        </Link>
      </div>
    </main>
  );
}
