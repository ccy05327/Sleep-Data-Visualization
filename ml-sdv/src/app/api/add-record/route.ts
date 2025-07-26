// In /app/api/add-record/route.ts

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
    const { startTime, endTime, timezone } = body; // Expects local time strings and a timezone

    if (!startTime || !endTime || !timezone) {
      return NextResponse.json(
        { error: "startTime, endTime, and timezone are required." },
        { status: 400 }
      );
    }

    // Convert the local time strings into Date objects.
    // The trick is to treat them as UTC and then adjust for the offset.
    const start = new Date(startTime + "Z");
    const end = new Date(endTime + "Z");

    // Get the timezone offset for the given date in that timezone
    const dateForOffset = new Date(start);
    const utcTime = dateForOffset.toLocaleString("en-US", {
      timeZone: "UTC",
      hour12: false,
    });
    const tzTime = dateForOffset.toLocaleString("en-US", {
      timeZone: timezone,
      hour12: false,
    });
    const offsetMs = new Date(utcTime).getTime() - new Date(tzTime).getTime();

    // Apply the offset to get the true UTC time
    const correctStartTime = new Date(start.getTime() + offsetMs);
    const correctEndTime = new Date(end.getTime() + offsetMs);

    const newRecord = {
      start_time: correctStartTime.toISOString(),
      end_time: correctEndTime.toISOString(),
      time_offset: timezone, // Store the IANA timezone name
    };

    const { data, error } = await supabase
      .from("sleep_records")
      .insert(newRecord)
      .select();

    if (error) {
      console.error("Error inserting sleep record:", error);
      return NextResponse.json(
        { error: "Failed to save sleep record." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, record: data[0] });
  } catch (error: any) {
    console.error("Error in /api/add-record:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
