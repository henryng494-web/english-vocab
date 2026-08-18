import { createClient } from "@/lib/supabase/server";
import type { LearningStatus } from "@/types/database";
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
    const body = (await request.json()) as {
      word?: string;
      status?: LearningStatus;
    };

    const word = body.word?.trim().toLowerCase();
    const status = body.status;

    if (!word) {
      return NextResponse.json({ error: "Word is required" }, { status: 400 });
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const now = new Date().toISOString();

    const { data: existing } = await supabase
      .from("user_learning")
      .select("id")
      .eq("word", word)
      .maybeSingle();

    let result;
    if (existing) {
      result = await supabase
        .from("user_learning")
        .update({ status, last_reviewed_at: now })
        .eq("word", word)
        .select("*")
        .single();
    } else {
      result = await supabase
        .from("user_learning")
        .insert({
          word,
          user_id: null,
          status,
          last_reviewed_at: now,
        })
        .select("*")
        .single();
    }

    if (result.error) throw result.error;

    return NextResponse.json({ learning: result.data });
  } catch (error) {
    console.error("Update learning status error:", error);
    return NextResponse.json(
      { error: "Failed to update status", details: errorMessage(error) },
      { status: 500 },
    );
  }
}
