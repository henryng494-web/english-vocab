"use client";

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = createClient();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      window.location.href = "/learn";
    }
    setLoading(false);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Đăng ký thành công! Kiểm tra email để xác nhận tài khoản.");
    }
    setLoading(false);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-white">Đăng nhập</h1>
        <p className="mt-2 text-sm text-neutral-400">
          Sử dụng tài khoản Supabase Auth để lưu tiến trình học
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSignIn}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-black px-3 py-2 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-300"
            >
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="mt-1 w-full rounded-lg border border-neutral-700 bg-black px-3 py-2 text-white placeholder:text-neutral-500 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
            />
          </div>

          {message && (
            <p className="rounded-lg bg-neutral-800 px-3 py-2 text-sm text-neutral-300">
              {message}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-white px-4 py-2 font-medium text-black hover:bg-neutral-200 disabled:opacity-50"
            >
              {loading ? "Đang xử lý..." : "Đăng nhập"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleSignUp}
              className="flex-1 rounded-lg border border-neutral-600 px-4 py-2 font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
            >
              Đăng ký
            </button>
          </div>
        </form>

        <Link
          href="/"
          className="mt-6 block text-center text-sm text-neutral-500 hover:text-white"
        >
          ← Quay lại trang chủ
        </Link>
      </div>
    </main>
  );
}
