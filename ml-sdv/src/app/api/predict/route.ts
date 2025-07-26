import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// --- Type Definitions ---
interface SleepRecord {
  id: number;
  start_time: string;
  end_time: string;
  sleep_duration: number | null;
}

interface Prediction {
  predicted_for_date: string;
  predicted_start_time: string;
  predicted_end_time: string;
  timezone: string;
}

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
    const { date, timezone } = body;

    if (!date || !timezone) {
      return NextResponse.json(
        { error: "Date and timezone are required." },
        { status: 400 }
      );
    }

    const { data: sleepRecords, error: fetchError } = await supabase
      .from("sleep_records")
      .select("*")
      .order("start_time", { ascending: false });

    if (fetchError) {
      console.error("Error fetching sleep records:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch sleep records." },
        { status: 500 }
      );
    }

    const LOOKBACK_PERIOD = 7;

    if (sleepRecords.length < LOOKBACK_PERIOD) {
      return NextResponse.json({
        message: "Not enough historical data.",
        predictions: [],
      });
    }

    const recentSleeps = sleepRecords.slice(0, LOOKBACK_PERIOD);

    const awakeIntervalsMs: number[] = [];
    for (let i = 0; i < recentSleeps.length - 1; i++) {
      const newerSleepStartTime = new Date(
        recentSleeps[i].start_time
      ).getTime();
      const olderSleepEndTime = new Date(
        recentSleeps[i + 1].end_time
      ).getTime();
      const awakeTimeMs = newerSleepStartTime - olderSleepEndTime;
      if (awakeTimeMs > 0) awakeIntervalsMs.push(awakeTimeMs);
    }

    if (awakeIntervalsMs.length === 0) {
      return NextResponse.json({
        message: "Could not calculate awake intervals.",
        predictions: [],
      });
    }

    const durationValuesMs: number[] = [];
    for (const sleep of recentSleeps) {
      if (typeof sleep.sleep_duration === "number") {
        durationValuesMs.push(sleep.sleep_duration * 60 * 1000);
      } else {
        const startTime = new Date(sleep.start_time).getTime();
        const endTime = new Date(sleep.end_time).getTime();
        const calculatedDuration = endTime - startTime;
        if (calculatedDuration > 0) durationValuesMs.push(calculatedDuration);
      }
    }

    if (durationValuesMs.length === 0) {
      return NextResponse.json(
        { error: "Could not determine sleep duration." },
        { status: 500 }
      );
    }

    const avgAwakeMs =
      awakeIntervalsMs.reduce((sum, val) => sum + val, 0) /
      awakeIntervalsMs.length;
    const avgDurationMs =
      durationValuesMs.reduce((sum, val) => sum + val, 0) /
      durationValuesMs.length;

    const lastSleepEndTime = new Date(sleepRecords[0].end_time).getTime();
    const predictedStartTime = new Date(lastSleepEndTime + avgAwakeMs);
    const predictedEndTime = new Date(
      predictedStartTime.getTime() + avgDurationMs
    );

    const generatedPredictions: Prediction[] = [
      {
        predicted_for_date: date,
        predicted_start_time: predictedStartTime.toISOString(),
        predicted_end_time: predictedEndTime.toISOString(),
        timezone: timezone,
      },
    ];

    const { error: insertError } = await supabase
      .from("predictions")
      .insert(generatedPredictions);
    if (insertError) {
      console.error("Error inserting predictions:", insertError);
      return NextResponse.json(
        { error: "Failed to save predictions." },
        { status: 500 }
      );
    }

    return NextResponse.json({ predictions: generatedPredictions });
  } catch (error: any) {
    console.error("Error in /api/predict:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
