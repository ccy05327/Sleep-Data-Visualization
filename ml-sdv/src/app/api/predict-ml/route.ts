import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface RequestBody {
  date: string;
  timezone: string;
}

interface ModelWeights {
  dayOfWeek: number;
  previousDuration: number;
  previousScore: number;
  timeFromLast: number;
  weekdayPattern: number;
  sleepDebt: number;
  bias: number;
}

interface MLModel {
  startTimeWeights: ModelWeights;
  durationWeights: ModelWeights;
  trainingDate: string;
  recordCount: number;
  accuracy: { startTime: number; duration: number };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, timezone }: RequestBody = body;

    if (!date || !timezone) {
      return NextResponse.json(
        { error: "Date and timezone are required." },
        { status: 400 }
      );
    }

    // Try to get trained ML model first
    const { data: modelData, error: modelError } = await supabase
      .from("ml_models")
      .select("*")
      .eq("model_type", "sleep_prediction")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (!modelError && modelData) {
      // Use ML model for prediction
      return await predictWithMLModel(date, timezone, modelData.model_data);
    } else {
      // Fallback to simple average-based prediction
      console.log("No ML model found, using fallback method");
      return await predictWithFallback(date, timezone);
    }
  } catch (error: unknown) {
    console.error("Error in ML prediction:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: (error as Error).message },
      { status: 500 }
    );
  }
}

async function predictWithMLModel(
  date: string,
  timezone: string,
  model: MLModel
) {
  // Get recent sleep data for feature extraction
  const { data: sleepRecords, error: fetchError } = await supabase
    .from("sleep_records")
    .select("*")
    .order("start_time", { ascending: false })
    .limit(10);

  if (fetchError || !sleepRecords || sleepRecords.length === 0) {
    throw new Error("Unable to fetch recent sleep data");
  }

  const mostRecent = sleepRecords[0];
  const targetDate = new Date(date);

  // Extract features for prediction
  const features = {
    dayOfWeek: targetDate.getDay(),
    previousSleepDuration: calculateDuration(
      mostRecent.start_time,
      mostRecent.end_time
    ),
    previousSleepScore: mostRecent.sleep_score || 75,
    timeFromLastSleep:
      (targetDate.getTime() - new Date(mostRecent.end_time).getTime()) /
      (1000 * 60 * 60),
    weekdayPattern:
      targetDate.getDay() >= 1 && targetDate.getDay() <= 5 ? 1 : 0,
    sleepDebt: calculateSleepDebt(sleepRecords.slice(0, 7)),
  };

  // Predict start time (in minutes from midnight)
  const predictedStartMinutes = predictValue(features, model.startTimeWeights);
  const predictedDurationMinutes = predictValue(
    features,
    model.durationWeights
  );

  // Convert to actual times
  const startHour = Math.floor(predictedStartMinutes / 60);
  const startMinute = Math.round(predictedStartMinutes % 60);

  const predictedStartTime = new Date(targetDate);
  predictedStartTime.setHours(startHour, startMinute, 0, 0);

  const predictedEndTime = new Date(
    predictedStartTime.getTime() + predictedDurationMinutes * 60 * 1000
  );

  // Validate predictions
  if (
    isNaN(predictedStartTime.getTime()) ||
    isNaN(predictedEndTime.getTime())
  ) {
    throw new Error("Invalid predicted times");
  }

  // Store prediction
  const prediction = {
    predicted_for_date: date,
    predicted_start_time: predictedStartTime.toISOString(),
    predicted_end_time: predictedEndTime.toISOString(),
    timezone: timezone,
    prediction_method: "ml_model",
    model_accuracy: model.accuracy,
  };

  const { error: insertError } = await supabase
    .from("predictions")
    .insert(prediction);

  if (insertError) throw insertError;

  return NextResponse.json({
    predictions: [prediction],
    modelInfo: {
      accuracy: model.accuracy,
      trainingDate: model.trainingDate,
      recordCount: model.recordCount,
      method: "Machine Learning Model",
    },
  });
}

async function predictWithFallback(date: string, timezone: string) {
  // Original fallback method
  const { data: sleepRecords, error: fetchError } = await supabase
    .from("sleep_records")
    .select("*")
    .order("start_time", { ascending: false })
    .limit(7);

  if (fetchError || !sleepRecords || sleepRecords.length < 3) {
    return NextResponse.json({
      message: "Not enough historical data for prediction",
      predictions: [],
    });
  }

  // Simple averaging approach
  const avgStartTime = calculateAverageStartTime(sleepRecords);
  const avgDuration = calculateAverageDuration(sleepRecords);

  const targetDate = new Date(date);
  const predictedStartTime = new Date(targetDate);
  predictedStartTime.setHours(avgStartTime.hour, avgStartTime.minute, 0, 0);

  const predictedEndTime = new Date(
    predictedStartTime.getTime() + avgDuration * 60 * 1000
  );

  const prediction = {
    predicted_for_date: date,
    predicted_start_time: predictedStartTime.toISOString(),
    predicted_end_time: predictedEndTime.toISOString(),
    timezone: timezone,
    prediction_method: "simple_average",
  };

  const { error: insertError } = await supabase
    .from("predictions")
    .insert(prediction);

  if (insertError) throw insertError;

  return NextResponse.json({
    predictions: [prediction],
    modelInfo: {
      method: "Simple Average (Fallback)",
      note: "Train ML model for better predictions",
    },
  });
}

function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60); // minutes
}

function calculateSleepDebt(recentRecords: any[]): number {
  const targetSleep = 8 * 60; // 8 hours in minutes
  let debt = 0;

  for (const record of recentRecords) {
    const duration = calculateDuration(record.start_time, record.end_time);
    debt += Math.max(0, targetSleep - duration);
  }

  return debt / 60; // return in hours
}

function predictValue(input: any, weights: ModelWeights): number {
  return (
    (input.dayOfWeek / 7) * weights.dayOfWeek +
    (input.previousSleepDuration / 600) * weights.previousDuration +
    (input.previousSleepScore / 100) * weights.previousScore +
    (input.timeFromLastSleep / 24) * weights.timeFromLast +
    input.weekdayPattern * weights.weekdayPattern +
    (input.sleepDebt / 10) * weights.sleepDebt +
    weights.bias
  );
}

function calculateAverageStartTime(records: any[]) {
  let totalMinutes = 0;

  for (const record of records) {
    const startTime = new Date(record.start_time);
    const minutes = startTime.getHours() * 60 + startTime.getMinutes();
    totalMinutes += minutes;
  }

  const avgMinutes = totalMinutes / records.length;
  return {
    hour: Math.floor(avgMinutes / 60),
    minute: Math.round(avgMinutes % 60),
  };
}

function calculateAverageDuration(records: any[]): number {
  let totalDuration = 0;

  for (const record of records) {
    totalDuration += calculateDuration(record.start_time, record.end_time);
  }

  return totalDuration / records.length;
}
