import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import { getSupabaseConfig } from "@/lib/supabase/env";

function bearerToken(authorization: string | null): string | null {
  const match = authorization?.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

/**
 * Cookie session on the web; `Authorization: Bearer <access token>` for the
 * Capacitor app (cookies do not cross origins there).
 */
export async function createClient() {
  const cookieStore = await cookies();
  const token = bearerToken((await headers()).get("authorization"));
  const { url, anonKey } = getSupabaseConfig();

  const client = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // setAll is called from a Server Component; ignore if middleware handles refresh.
        }
      },
    },
    ...(token ? { global: { headers: { Authorization: `Bearer ${token}` } } } : {}),
  });

  if (token) {
    const getUser = client.auth.getUser.bind(client.auth);
    client.auth.getUser = (jwt?: string) => getUser(jwt ?? token);
  }
  return client;
}
