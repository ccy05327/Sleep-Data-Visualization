// In /pages/api/add-record.ts

import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Supabase URL or anonymous key is not set in environment variables."
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- API Handler for adding a new sleep record ---
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { startTime, endTime, timezone } = req.body; // Expects local time strings and a timezone

    if (!startTime || !endTime || !timezone) {
      return res
        .status(400)
        .json({ error: "startTime, endTime, and timezone are required." });
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

    if (error) throw error;

    res.status(200).json({ success: true, record: data[0] });
  } catch (error: any) {
    console.error("Error in /api/add-record:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
