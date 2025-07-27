import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- API Handler for POST requests ---
export async function POST(request: Request) {
  try {
    const { start_time, end_time, sleep_duration } = await request.json();

    if (!start_time || !end_time || typeof sleep_duration !== "number") {
      return NextResponse.json(
        { error: "start_time, end_time, and sleep_duration are required." },
        { status: 400 }
      );
    }

    const sleepRecord = {
      start_time,
      end_time,
      sleep_duration,
    };

    const { error: insertError } = await supabase
      .from("sleep_records")
      .insert(sleepRecord);

    if (insertError) {
      console.error("Error inserting sleep record:", insertError);
      return NextResponse.json(
        { error: "Failed to insert sleep record." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, sleepRecord });
  } catch (error: unknown) {
    console.error("Error in /api/add-sleep-record:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}
