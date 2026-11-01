"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { createPasswordRecoveryClient } from "@/lib/supabase/client";
import { initializePasswordRecovery, validRecoveryPassword } from "@/lib/password-recovery";

const COPY = {
  vi: {
    title: "Đặt mật khẩu mới", checking: "Đang kiểm tra liên kết…",
    invalid: "Liên kết không hợp lệ hoặc đã hết hạn. Hãy quay lại màn hình đăng nhập và yêu cầu liên kết mới.",
    password: "Mật khẩu mới (ít nhất 8 ký tự)", confirm: "Nhập lại mật khẩu mới",
    mismatch: "Mật khẩu cần ít nhất 8 ký tự và hai lần nhập phải giống nhau.",
    submit: "Lưu mật khẩu", saving: "Đang lưu…",
    failed: "Chưa lưu được mật khẩu. Hãy kiểm tra kết nối và thử mật khẩu mạnh hơn hoặc yêu cầu liên kết mới.",
    done: "Đã đổi mật khẩu. Hãy mở lại ứng dụng Jungle Jokers và đăng nhập bằng mật khẩu mới.",
    login: "Đăng nhập trên web",
  },
  en: {
    title: "Set a new password", checking: "Checking your link…",
    invalid: "This link is invalid or expired. Return to sign in and request a new reset link.",
    password: "New password (at least 8 characters)", confirm: "Confirm new password",
    mismatch: "Use at least 8 characters and enter the same password twice.",
    submit: "Save password", saving: "Saving…",
    failed: "Could not save your password. Check your connection and try a stronger password or request a new link.",
    done: "Password changed. Reopen Jungle Jokers and sign in with your new password.",
    login: "Sign in on the web",
  },
};

export default function ResetPasswordPage() {
  const [locale, setLocale] = useState<"vi" | "en">("vi");
  const t = COPY[locale];
  const client = useRef<ReturnType<typeof createPasswordRecoveryClient>>(null);
  const initialization = useRef<Promise<void> | null>(null);
  const [state, setState] = useState<"checking" | "ready" | "invalid" | "done">("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<"mismatch" | "failed" | null>(null);

  useEffect(() => {
    let active = true;
    if (!initialization.current) {
      const url = window.location.href;
      // Remove bearer credentials even when the link is malformed. Do not log them.
      window.history.replaceState(null, "", window.location.pathname);
      client.current = createPasswordRecoveryClient();
      initialization.current = client.current
        ? initializePasswordRecovery(client.current, url)
        : Promise.reject(new Error("unconfigured"));
    }
    void initialization.current.then(
      () => { if (active) setState("ready"); },
      () => { if (active) setState("invalid"); },
    );
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy || state !== "ready" || !client.current) return;
    if (!validRecoveryPassword(password, confirmation)) { setError("mismatch"); return; }
    setBusy(true);
    setError(null);
    try {
      const { error } = await client.current.auth.updateUser({ password });
      if (error) throw error;
      setPassword("");
      setConfirmation("");
      setState("done");
      // Revoke old sessions where supported; the recovery client never persists tokens.
      await client.current.auth.signOut().catch(() => {});
    } catch { setError("failed"); }
    finally { setBusy(false); }
  }

  return (
    <main lang={locale} className="mx-auto min-h-dvh max-w-md px-6 py-12">
      <div className="mb-6 flex justify-end gap-3" aria-label="Language">
        <button type="button" onClick={() => setLocale("vi")} aria-pressed={locale === "vi"}>Tiếng Việt</button>
        <button type="button" onClick={() => setLocale("en")} aria-pressed={locale === "en"}>English</button>
      </div>
      <h1 className="mb-6 text-2xl font-bold">{t.title}</h1>
      {state === "ready" ? (
        <form onSubmit={submit} className="space-y-5">
          <label className="block">{t.password}
            <input className="mt-2 w-full rounded-xl border p-3" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e => setPassword(e.target.value)} disabled={busy} />
          </label>
          <label className="block">{t.confirm}
            <input className="mt-2 w-full rounded-xl border p-3" type="password" autoComplete="new-password" minLength={8} required value={confirmation} onChange={e => setConfirmation(e.target.value)} disabled={busy} />
          </label>
          {error ? <p role="alert">{t[error]}</p> : null}
          <button className="w-full rounded-full bg-purple-700 px-4 py-3 font-bold text-white" disabled={busy}>{busy ? t.saving : t.submit}</button>
        </form>
      ) : <p role="status">{t[state]}</p>}
      {state === "invalid" || state === "done" ? <a className="mt-6 inline-block underline" href="/auth/login">{t.login}</a> : null}
    </main>
  );
}
