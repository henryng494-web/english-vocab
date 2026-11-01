import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
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
