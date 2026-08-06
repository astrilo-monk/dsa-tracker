import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { ProblemState } from "@/store/useTrackerStore";

// The schema for the incoming local state
type LocalStates = Record<string, ProblemState>;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const localStates: LocalStates = body.problemStates || {};

    // 1. Fetch cloud states
    const { data: cloudData, error: fetchError } = await supabaseAdmin
      .from("problems")
      .select("problem_id, status, notes, bookmarked, important, updated_at")
      .eq("user_id", userId);

    if (fetchError) {
      console.error("Supabase fetch error:", fetchError);
      return NextResponse.json({ error: "Failed to fetch cloud sync data" }, { status: 500 });
    }

    // Convert cloud data to Record<string, ProblemState>
    const cloudStates: LocalStates = {};
    if (cloudData) {
      for (const row of cloudData) {
        cloudStates[row.problem_id] = {
          status: row.status as ProblemState['status'],
          notes: row.notes || "",
          bookmarked: !!row.bookmarked,
          important: !!row.important,
          updatedAt: new Date(row.updated_at).getTime(),
        };
      }
    }

    // 2. Merge local and cloud states (Last Write Wins)
    const mergedStates: LocalStates = { ...cloudStates };
    const toUpsert = [];

    for (const [probId, localState] of Object.entries(localStates)) {
      const cloudState = cloudStates[probId];
      
      const localTime = localState.updatedAt || 0;
      const cloudTime = cloudState?.updatedAt || 0;

      // If local is newer or doesn't exist in cloud, use local
      if (!cloudState || localTime > cloudTime) {
        mergedStates[probId] = localState;
        
        toUpsert.push({
          user_id: userId,
          problem_id: probId,
          status: localState.status,
          notes: localState.notes,
          bookmarked: localState.bookmarked,
          important: localState.important,
          updated_at: new Date(localTime || Date.now()).toISOString(),
        });
      }
    }

    // 3. Update user's last_synced_at timestamp and ensure user exists
    const now = new Date().toISOString();
    const { error: userUpsertError } = await supabaseAdmin
      .from("users")
      .upsert(
        { 
          id: userId, 
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          last_synced_at: now 
        }, 
        { onConflict: "id" }
      );

    if (userUpsertError) {
      console.error("Supabase user upsert error:", userUpsertError);
      // We can continue, but it's good to log
    }

    // 4. Upsert newer local states to Supabase
    if (toUpsert.length > 0) {
      const { error: upsertError } = await supabaseAdmin
        .from("problems")
        .upsert(toUpsert, { onConflict: "user_id,problem_id" });

      if (upsertError) {
        console.error("Supabase upsert error:", upsertError);
        return NextResponse.json({ error: "Failed to update cloud data" }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      mergedStates,
      syncTime: Date.now(),
    });

  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
