import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// --- Supabase Client Initialization ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface SleepRecord {
  id: number;
  start_time: string;
  end_time: string;
  sleep_duration: number | null;
  sleep_score?: number | null;
  mental_recovery?: number | null;
  physical_recovery?: number | null;
  sleep_cycle?: number | null;
}

interface PredictionInput {
  dayOfWeek: number; // 0-6
  previousSleepDuration: number; // minutes
  previousSleepScore?: number;
  timeFromLastSleep: number; // hours
  weekdayPattern: number; // 0 for weekend, 1 for weekday
  sleepDebt: number; // accumulated sleep debt
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

export async function POST(request: Request) {
  try {
    const { data: sleepRecords, error: fetchError } = await supabase
      .from("sleep_records")
      .select("*")
      .order("start_time", { ascending: true });

    if (fetchError) {
      console.error("Error fetching sleep records:", fetchError);
      throw fetchError;
    }

    if (!sleepRecords || sleepRecords.length < 30) {
      return NextResponse.json(
        { error: "Not enough data to train model (minimum 30 records)" },
        { status: 400 }
      );
    }

    console.log(`Training model with ${sleepRecords.length} records`);

    // Feature engineering
    const features = extractFeatures(sleepRecords);

    // Train models for both start time and duration
    const startTimeModel = trainLinearRegression(
      features.map((f) => f.inputs),
      features.map((f) => f.startTimeMinutes)
    );
    const durationModel = trainLinearRegression(
      features.map((f) => f.inputs),
      features.map((f) => f.durationMinutes)
    );

    // Store the trained model weights
    const modelData = {
      startTimeWeights: startTimeModel,
      durationWeights: durationModel,
      trainingDate: new Date().toISOString(),
      recordCount: sleepRecords.length,
      accuracy: calculateAccuracy(features, startTimeModel, durationModel),
    };

    // Store model in database or file system
    await storeModel(modelData);

    return NextResponse.json({
      success: true,
      message: `Model trained successfully with ${sleepRecords.length} records`,
      accuracy: modelData.accuracy,
      trainingDate: modelData.trainingDate,
    });
  } catch (error: unknown) {
    console.error("Error training model:", error);
    return NextResponse.json(
      { error: "Failed to train model", details: (error as Error).message },
      { status: 500 }
    );
  }
}

function extractFeatures(records: SleepRecord[]): Array<{
  inputs: PredictionInput;
  startTimeMinutes: number;
  durationMinutes: number;
}> {
  const features: Array<{
    inputs: PredictionInput;
    startTimeMinutes: number;
    durationMinutes: number;
  }> = [];

  for (let i = 1; i < records.length; i++) {
    const current = records[i];
    const previous = records[i - 1];

    const currentStart = new Date(current.start_time);
    const previousEnd = new Date(previous.end_time);

    // Calculate features
    const dayOfWeek = currentStart.getDay();
    const previousDuration = calculateDuration(
      previous.start_time,
      previous.end_time
    );
    const timeFromLastSleep =
      (currentStart.getTime() - previousEnd.getTime()) / (1000 * 60 * 60); // hours
    const weekdayPattern = dayOfWeek >= 1 && dayOfWeek <= 5 ? 1 : 0; // weekday = 1, weekend = 0

    // Calculate sleep debt (simplified)
    const sleepDebt = calculateSleepDebt(records.slice(Math.max(0, i - 7), i));

    const inputs: PredictionInput = {
      dayOfWeek,
      previousSleepDuration: previousDuration,
      previousSleepScore: previous.sleep_score || 75, // default if null
      timeFromLastSleep,
      weekdayPattern,
      sleepDebt,
    };

    // Target values
    const startTimeMinutes =
      currentStart.getHours() * 60 + currentStart.getMinutes();
    const durationMinutes = calculateDuration(
      current.start_time,
      current.end_time
    );

    features.push({
      inputs,
      startTimeMinutes,
      durationMinutes,
    });
  }

  return features;
}

function calculateDuration(startTime: string, endTime: string): number {
  const start = new Date(startTime);
  const end = new Date(endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60); // minutes
}

function calculateSleepDebt(recentRecords: SleepRecord[]): number {
  const targetSleep = 8 * 60; // 8 hours in minutes
  let debt = 0;

  for (const record of recentRecords) {
    const duration = calculateDuration(record.start_time, record.end_time);
    debt += Math.max(0, targetSleep - duration);
  }

  return debt / 60; // return in hours
}

function trainLinearRegression(
  X: PredictionInput[],
  y: number[]
): ModelWeights {
  // Simple linear regression implementation
  // Convert inputs to feature vectors
  const features = X.map((input) => [
    input.dayOfWeek / 7, // normalize
    input.previousSleepDuration / 600, // normalize (10 hours)
    (input.previousSleepScore || 75) / 100, // normalize
    input.timeFromLastSleep / 24, // normalize
    input.weekdayPattern,
    input.sleepDebt / 10, // normalize
    1, // bias term
  ]);

  // Use gradient descent (simplified)
  let weights = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]; // initialize
  const learningRate = 0.01;
  const epochs = 1000;

  for (let epoch = 0; epoch < epochs; epoch++) {
    const gradients = [0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < features.length; i++) {
      const prediction = features[i].reduce(
        (sum, feature, j) => sum + feature * weights[j],
        0
      );
      const error = prediction - y[i];

      for (let j = 0; j < weights.length; j++) {
        gradients[j] += error * features[i][j];
      }
    }

    // Update weights
    for (let j = 0; j < weights.length; j++) {
      weights[j] -= (learningRate * gradients[j]) / features.length;
    }
  }

  return {
    dayOfWeek: weights[0],
    previousDuration: weights[1],
    previousScore: weights[2],
    timeFromLast: weights[3],
    weekdayPattern: weights[4],
    sleepDebt: weights[5],
    bias: weights[6],
  };
}

function calculateAccuracy(
  features: Array<{
    inputs: PredictionInput;
    startTimeMinutes: number;
    durationMinutes: number;
  }>,
  startModel: ModelWeights,
  durationModel: ModelWeights
): { startTime: number; duration: number } {
  let startTimeErrors = 0;
  let durationErrors = 0;

  for (const feature of features) {
    // Predict start time
    const startPrediction = predictValue(feature.inputs, startModel);
    const startError = Math.abs(startPrediction - feature.startTimeMinutes);
    startTimeErrors += startError;

    // Predict duration
    const durationPrediction = predictValue(feature.inputs, durationModel);
    const durationError = Math.abs(
      durationPrediction - feature.durationMinutes
    );
    durationErrors += durationError;
  }

  return {
    startTime: Math.round((1 - startTimeErrors / features.length / 60) * 100), // Convert to percentage
    duration: Math.round((1 - durationErrors / features.length / 60) * 100),
  };
}

function predictValue(input: PredictionInput, weights: ModelWeights): number {
  return (
    (input.dayOfWeek / 7) * weights.dayOfWeek +
    (input.previousSleepDuration / 600) * weights.previousDuration +
    ((input.previousSleepScore || 75) / 100) * weights.previousScore +
    (input.timeFromLastSleep / 24) * weights.timeFromLast +
    input.weekdayPattern * weights.weekdayPattern +
    (input.sleepDebt / 10) * weights.sleepDebt +
    weights.bias
  );
}

async function storeModel(modelData: any) {
  // Store in Supabase or local storage
  // For now, we'll create a simple storage mechanism
  console.log("Storing model:", modelData);

  // You could store this in a dedicated table or file
  const { error } = await supabase.from("ml_models").upsert({
    id: 1,
    model_type: "sleep_prediction",
    model_data: modelData,
    created_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error storing model:", error);
  }
}
