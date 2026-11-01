import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import type { Difficulty, SheetQuestion } from "@/lib/sheets/types";

const difficulties: Difficulty[] = ["Easy", "Medium", "Hard", "Uncategorized"];
const localDevelopmentUserId = "local-development-user";

function getUserId(session: unknown) {
  if (!session || typeof session !== "object") return undefined;
  const user = (session as { user?: { id?: unknown } }).user;
  return typeof user?.id === "string" ? user.id : undefined;
}

async function getEffectiveUserId() {
  const sessionUserId = getUserId(await getServerSession(authOptions));
  if (sessionUserId) return sessionUserId;
  return process.env.NODE_ENV === "development" ? localDevelopmentUserId : undefined;
}

function toSheetQuestion(row: {
  id: string;
  sheet_id: string;
  pattern_id: string;
  title: string;
  difficulty: Difficulty;
  url: string | null;
}): SheetQuestion & { patternId: string; sheetId: string; isCustom: true } {
  return {
    id: `custom:${row.id}`,
    title: row.title,
    difficulty: row.difficulty,
    links: row.url
      ? [{ label: "Question", url: row.url, platform: "Other", kind: "question" }]
      : [],
    platform: row.url ? "Other" : "",
    patternId: row.pattern_id,
    sheetId: row.sheet_id,
    isCustom: true,
  };
}

export async function GET(request: Request) {
  const userId = await getEffectiveUserId();

  if (!userId) {
    return NextResponse.json({ questions: [] });
  }

  const sheetId = new URL(request.url).searchParams.get("sheetId");
  if (!sheetId) {
    return NextResponse.json({ error: "sheetId is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("custom_questions")
    .select("id, sheet_id, pattern_id, title, difficulty, url")
    .eq("user_id", userId)
    .eq("sheet_id", sheetId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Custom question fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch custom questions" }, { status: 500 });
  }

  return NextResponse.json({ questions: (data ?? []).map(toSheetQuestion) });
}

export async function POST(request: Request) {
  const userId = await getEffectiveUserId();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    sheetId?: unknown;
    patternId?: unknown;
    title?: unknown;
    difficulty?: unknown;
    url?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const sheetId = typeof body.sheetId === "string" ? body.sheetId.trim() : "";
  const patternId = typeof body.patternId === "string" ? body.patternId.trim() : "";
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const difficulty = body.difficulty;
  const url = typeof body.url === "string" ? body.url.trim() : "";

  if (!sheetId || !patternId || !title || title.length > 200) {
    return NextResponse.json({ error: "A title, sheet, and pattern are required" }, { status: 400 });
  }
  if (!difficulties.includes(difficulty as Difficulty)) {
    return NextResponse.json({ error: "Invalid difficulty" }, { status: 400 });
  }
  if (url && !/^https?:\/\/\S+$/i.test(url)) {
    return NextResponse.json({ error: "URL must start with http:// or https://" }, { status: 400 });
  }

  if (process.env.NODE_ENV === "development" && userId === localDevelopmentUserId) {
    const { error: userError } = await supabaseAdmin
      .from("users")
      .upsert(
        { id: localDevelopmentUserId, name: "Local development user" },
        { onConflict: "id" },
      );

    if (userError) {
      console.error("Local development user setup error:", userError);
      return NextResponse.json({ error: "Failed to prepare local development storage" }, { status: 500 });
    }
  }

  const { data, error } = await supabaseAdmin
    .from("custom_questions")
    .insert({
      user_id: userId,
      sheet_id: sheetId,
      pattern_id: patternId,
      title,
      difficulty,
      url: url || null,
    })
    .select("id, sheet_id, pattern_id, title, difficulty, url")
    .single();

  if (error || !data) {
    console.error("Custom question create error:", error);
    return NextResponse.json({ error: "Failed to create custom question" }, { status: 500 });
  }

  return NextResponse.json({ question: toSheetQuestion(data) }, { status: 201 });
}
