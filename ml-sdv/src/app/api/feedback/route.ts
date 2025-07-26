import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or anonymous key is not set in environment variables."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { predictionId, feedback } = body;

    if (!predictionId || !feedback) {
      return NextResponse.json(
        { error: "predictionId and feedback are required." },
        { status: 400 }
      );
    }

    if (!["accurate", "inaccurate"].includes(feedback)) {
      return NextResponse.json(
        { error: "Feedback must be 'accurate' or 'inaccurate'." },
        { status: 400 }
      );
    }

    // Update the feedback in the predictions table
    const { error } = await supabase
      .from("predictions")
      .update({ feedback })
      .eq("id", predictionId);

    if (error) {
      console.error("Error updating feedback:", error);
      return NextResponse.json(
        { error: "Failed to update feedback." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Feedback updated successfully.",
    });
  } catch (error: any) {
    console.error("Error in /api/feedback:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
