// In /pages/api/predict.ts

import { createClient } from "@supabase/supabase-js";

// --- Type Definitions ---
interface RequestBody {
  date: string;
  timezone: string; // e.g., "Asia/Taipei"
}

interface Prediction {
  predicted_for_date: string;
  predicted_start_time: string;
  predicted_end_time: string;
  timezone: string; // Store the context
}

type ResponseData = {
  predictions?: Prediction[];
  message?: string;
  error?: string;
  details?: string;
};

interface SleepRecord {
  id: number;
  start_time: string;
  end_time: string;
  sleep_duration: number | null;
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

// --- API Handler ---
export const POST = async (req: Request) => {
  if (req.method !== "POST") {
    return new Response(`Method ${req.method} Not Allowed`, {
      status: 405,
      headers: { Allow: "POST" },
    });
  }

  try {
    const body = await req.json();
    const { date, timezone }: RequestBody = body;
    if (!date || !timezone) {
      return new Response(
        JSON.stringify({ error: "Date and timezone are required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { data: sleepRecords, error: fetchError } = await supabase
      .from("sleep_records")
      .select("*")
      .order("start_time", { ascending: false })
      .returns<SleepRecord[]>();

    if (fetchError) throw fetchError;

    const LOOKBACK_PERIOD = 7;

    if (sleepRecords.length < LOOKBACK_PERIOD) {
      return new Response(
        JSON.stringify({
          message: `Not enough historical data.`,
          predictions: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
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
      return new Response(
        JSON.stringify({
          message: "Could not calculate awake intervals.",
          predictions: [],
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
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
      return new Response(
        JSON.stringify({ error: "Could not determine sleep duration." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
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
        timezone: timezone, // Save the provided timezone
      },
    ];

    const { error: insertError } = await supabase
      .from("predictions")
      .insert(generatedPredictions);
    if (insertError) throw insertError;

    return new Response(JSON.stringify({ predictions: generatedPredictions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Error in /api/predict:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: (error as Error).message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};
