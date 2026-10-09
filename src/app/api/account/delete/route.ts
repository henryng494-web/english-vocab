import { createClient } from "@/lib/supabase/server";
import { createServiceSupabase } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Deletes the signed-in user's learning rows and their auth account. */
export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not signed in" }, { status: 401 });
    }

    const admin = createServiceSupabase();
    const { error: dataError } = await admin
      .from("user_learning")
      .delete()
      .eq("user_id", user.id);
    if (dataError) throw dataError;

    const { error: authError } = await admin.auth.admin.deleteUser(user.id);
    if (authError) throw authError;

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
