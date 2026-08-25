import { createClient } from "@/lib/supabase/server";
import type { LearningStatus } from "@/types/database";
import { getFamilyHeadword } from "@/lib/word-family";
import { normalizeVocabInput } from "@/lib/word-validation";
import { NextResponse } from "next/server";

const VALID_STATUSES: LearningStatus[] = [
  "new",
  "learning",
  "need_review",
  "mastered",
];

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }
  return "Unknown error";
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const body = (await request.json()) as {
      word?: string;
      status?: LearningStatus;
    };

    const normalized = normalizeVocabInput(body.word ?? "");
    const word = normalized ? getFamilyHeadword(normalized) : null;
    const status = body.status;

    if (!word) {
      return NextResponse.json(
        { error: "Word is required or invalid format" },
        { status: 400 },
      );
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const now = new Date().toISOString();
    const userId = user?.id ?? null;

    const existingQuery = supabase
      .from("user_learning")
      .select("id")
      .eq("word", word);
    const { data: existing } = userId
      ? await existingQuery.eq("user_id", userId).maybeSingle()
      : await existingQuery.is("user_id", null).maybeSingle();

    let result;
    if (existing) {
      const updateQuery = supabase
        .from("user_learning")
        .update({ status, last_reviewed_at: now })
        .eq("word", word);
      result = userId
        ? await updateQuery.eq("user_id", userId).select("*").single()
        : await updateQuery.is("user_id", null).select("*").single();
    } else {
      result = await supabase
        .from("user_learning")
        .insert({
          word,
          user_id: userId,
          status,
          last_reviewed_at: now,
        })
        .select("*")
        .single();
    }

    if (result.error) {
      const message = result.error.message ?? "";
      if (
        message.includes("row-level security") ||
        message.includes("permission denied")
      ) {
        return NextResponse.json({
          learning: null,
          local_only: true,
          warning:
            "Saved on this device. Sign in or run Supabase guest-mode SQL to sync across devices.",
        });
      }
      throw result.error;
    }

    return NextResponse.json({ learning: result.data });
  } catch (error) {
    console.error("Update learning status error:", error);
    return NextResponse.json(
      { error: "Failed to update status", details: errorMessage(error) },
      { status: 500 },
    );
  }
}
