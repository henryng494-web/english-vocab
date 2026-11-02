import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

function confirmationResult(success: boolean) {
  const title = success ? "Email verified successfully" : "Unable to verify this link";
  const message = success
    ? "Your Jungle Jokers account is ready. You can return to the app and sign in with your email and password."
    : "This confirmation link may have expired or already been used. If you have already confirmed your email, try signing in. Otherwise, request a new confirmation email.";
  // No scripts, external assets, tokens, or automatic navigation on this page.
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Jungle Jokers</title><style>body{margin:0;background:#f6f7fb;color:#1e293b;font:16px/1.6 system-ui,sans-serif;display:grid;min-height:100svh;place-items:center}main{box-sizing:border-box;width:calc(100% - 32px);max-width:480px;background:white;padding:32px;border:1px solid #e2e8f0;border-radius:24px}strong{color:#7135e8}h1{font-size:28px;line-height:1.3}p{color:#64748b}a{display:inline-block;background:#7135e8;color:white;text-decoration:none;padding:14px 22px;border-radius:12px;font-weight:600}small{display:block;margin-top:20px;color:#64748b}</style></head><body><main><strong>Jungle Jokers</strong><h1>${title}</h1><p>${message}</p><a href="/auth/login">Continue on the web</a><small>Using the iPhone app? Switch back to Jungle Jokers to sign in.</small></main></body></html>`, {
    status: success ? 200 : 400,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, private",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  // A token hash verifies in the browser that opens the email, without needing
  // the PKCE verifier stored inside the separate Capacitor WebView.
  if (searchParams.get("type") === "email") {
    const token_hash = searchParams.get("token_hash");
    if (!token_hash) return confirmationResult(false);
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.verifyOtp({ token_hash, type: "email" });
      return confirmationResult(!error && Boolean(data.user?.email_confirmed_at));
    } catch {
      return confirmationResult(false);
    }
  }
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/discover";

  // An implicit recovery link carries tokens in its fragment (never sent to this
  // server). HTTP redirects preserve that fragment so only the isolated recovery
  // page reads it. Reuse the already-allowed email callback URL on mobile.
  if (!code && next === "/auth/reset-password") {
    return NextResponse.redirect(`${origin}/auth/reset-password`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/login`);
}
