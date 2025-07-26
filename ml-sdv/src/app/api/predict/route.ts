// In /pages/api/predict.ts

import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

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
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { date, timezone }: RequestBody = req.body;
    if (!date || !timezone) {
      return res.status(400).json({ error: "Date and timezone are required." });
    }

    const { data: sleepRecords, error: fetchError } = await supabase
      .from("sleep_records")
      .select("*")
      .order("start_time", { ascending: false })
      .returns<SleepRecord[]>();

    if (fetchError) throw fetchError;

    const LOOKBACK_PERIOD = 7;

    if (sleepRecords.length < LOOKBACK_PERIOD) {
      return res
        .status(200)
        .json({ message: `Not enough historical data.`, predictions: [] });
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
      return res.status(200).json({
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
      return res
        .status(500)
        .json({ error: "Could not determine sleep duration." });
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

    res.status(200).json({ predictions: generatedPredictions });
  } catch (error: unknown) {
    console.error("Error in /api/predict:", error);
    return res
      .status(500)
      .json({
        error: "Internal Server Error",
        details: (error as Error).message,
      });
  }
}
