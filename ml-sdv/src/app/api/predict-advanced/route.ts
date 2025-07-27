import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import * as tf from "@tensorflow/tfjs-node";
import path from "path";
import fs from "fs";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Model cache
let loadedModel: any = null;
let modelConfig: any = null;
let featureScaler: any = null;

// Load model configuration
async function loadModelConfig() {
  if (modelConfig) return modelConfig;

  try {
    const configPath = path.join(process.cwd(), "models", "model_config.json");
    if (fs.existsSync(configPath)) {
      const configData = fs.readFileSync(configPath, "utf8");
      modelConfig = JSON.parse(configData);
      return modelConfig;
    }
  } catch (error) {
    console.warn("No pre-trained model config found, using fallback");
  }

  return null;
}

// Load TensorFlow model
async function loadTensorFlowModel() {
  if (loadedModel) return loadedModel;

  try {
    const modelPath = path.join(
      process.cwd(),
      "models",
      "sleep_prediction_model.h5"
    );
    if (fs.existsSync(modelPath)) {
      loadedModel = await tf.loadLayersModel(`file://${modelPath}`);

      // Load scaler parameters (simplified for JS)
      const scalerPath = path.join(
        process.cwd(),
        "models",
        "scaler_params.json"
      );
      if (fs.existsSync(scalerPath)) {
        const scalerData = fs.readFileSync(scalerPath, "utf8");
        featureScaler = JSON.parse(scalerData);
      }

      return loadedModel;
    }
  } catch (error) {
    console.warn("Failed to load TensorFlow model:", error);
  }

  return null;
}

// Feature engineering function (matches Colab notebook)
function extractAdvancedFeatures(
  records: any[],
  targetDate: string,
  timezone: string
) {
  const targetDateObj = new Date(targetDate);

  // Sort records by date
  const sortedRecords = records.sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );

  // Calculate rolling averages and features
  const recentRecords = sortedRecords.slice(-30); // Last 30 days
  const weekRecords = sortedRecords.slice(-7); // Last 7 days

  if (recentRecords.length === 0) {
    throw new Error("Insufficient data for advanced prediction");
  }

  // Basic time features
  const dayOfWeek = targetDateObj.getDay();
  const month = targetDateObj.getMonth();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6 ? 1 : 0;

  // Cyclical encoding
  const dayOfWeekSin = Math.sin((2 * Math.PI * dayOfWeek) / 7);
  const dayOfWeekCos = Math.cos((2 * Math.PI * dayOfWeek) / 7);
  const monthSin = Math.sin((2 * Math.PI * month) / 12);
  const monthCos = Math.cos((2 * Math.PI * month) / 12);

  // Calculate averages from recent data
  const durations = recentRecords.map((r) => {
    const start = new Date(r.start_time);
    const end = new Date(r.end_time);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60); // hours
  });

  const startHours = recentRecords.map((r) => {
    const start = new Date(r.start_time);
    return start.getHours() + start.getMinutes() / 60;
  });

  // 7-day rolling averages
  const duration7dAvg =
    weekRecords.length > 0
      ? weekRecords.reduce((sum, r) => {
          const start = new Date(r.start_time);
          const end = new Date(r.end_time);
          return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        }, 0) / weekRecords.length
      : durations[durations.length - 1] || 8;

  const duration7dStd =
    weekRecords.length > 1
      ? Math.sqrt(
          weekRecords.reduce((sum, r) => {
            const start = new Date(r.start_time);
            const end = new Date(r.end_time);
            const duration =
              (end.getTime() - start.getTime()) / (1000 * 60 * 60);
            return sum + Math.pow(duration - duration7dAvg, 2);
          }, 0) /
            (weekRecords.length - 1)
        )
      : 0;

  const startHour7dAvg =
    weekRecords.length > 0
      ? weekRecords.reduce((sum, r) => {
          const start = new Date(r.start_time);
          return sum + start.getHours() + start.getMinutes() / 60;
        }, 0) / weekRecords.length
      : startHours[startHours.length - 1] || 23;

  // Sleep debt calculation
  const targetSleep = 8.0;
  const cumulativeSleepDebt = weekRecords.reduce((debt, r) => {
    const start = new Date(r.start_time);
    const end = new Date(r.end_time);
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return debt + (targetSleep - duration);
  }, 0);

  // Previous day features
  const lastRecord = sortedRecords[sortedRecords.length - 1];
  const prevDuration = lastRecord
    ? (new Date(lastRecord.end_time).getTime() -
        new Date(lastRecord.start_time).getTime()) /
      (1000 * 60 * 60)
    : duration7dAvg;

  const prevStartHour = lastRecord
    ? new Date(lastRecord.start_time).getHours() +
      new Date(lastRecord.start_time).getMinutes() / 60
    : startHour7dAvg;

  // Cyclical encoding for start hour (using average as estimate)
  const startHourSin = Math.sin((2 * Math.PI * startHour7dAvg) / 24);
  const startHourCos = Math.cos((2 * Math.PI * startHour7dAvg) / 24);

  return [
    startHourSin,
    startHourCos,
    dayOfWeekSin,
    dayOfWeekCos,
    monthSin,
    monthCos,
    isWeekend,
    duration7dAvg,
    duration7dStd,
    startHour7dAvg,
    cumulativeSleepDebt,
    prevDuration,
    prevStartHour,
  ];
}

// Scale features using pre-computed parameters
function scaleFeatures(features: number[], scalerParams: any) {
  if (!scalerParams || !scalerParams.mean || !scalerParams.scale) {
    return features; // Return unscaled if no scaler
  }

  return features.map((feature, index) => {
    const mean = scalerParams.mean[index] || 0;
    const scale = scalerParams.scale[index] || 1;
    return (feature - mean) / scale;
  });
}

// Advanced ML prediction using pre-trained model
async function predictWithAdvancedML(
  records: any[],
  targetDate: string,
  timezone: string
) {
  try {
    const config = await loadModelConfig();
    if (!config) {
      throw new Error("No model configuration found");
    }

    // Extract features
    const features = extractAdvancedFeatures(records, targetDate, timezone);

    if (config.requires_tensorflow) {
      // Use TensorFlow model
      const model = await loadTensorFlowModel();
      if (!model) {
        throw new Error("Failed to load TensorFlow model");
      }

      // Scale features
      const scaledFeatures = featureScaler
        ? scaleFeatures(features, featureScaler)
        : features;

      // Make prediction
      const inputTensor = tf.tensor2d([scaledFeatures]);
      const prediction = model.predict(inputTensor) as tf.Tensor;
      const predictionData = await prediction.data();

      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();

      const predictedStartHour = predictionData[0];
      const predictedDuration = Math.max(4, Math.min(12, predictionData[1])); // Clamp duration

      return {
        startHour: Math.max(0, Math.min(24, predictedStartHour)),
        duration: predictedDuration,
        method: "tensorflow_deep_learning",
        confidence: config.performance?.combined_r2 || 0.8,
      };
    } else {
      // Use scikit-learn models (would need JS ML library for production)
      // For now, fall back to enhanced heuristics based on features

      const dayOfWeek = new Date(targetDate).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      // Enhanced prediction based on patterns
      const baseStartHour = features[9]; // startHour7dAvg
      const baseDuration = features[7]; // duration7dAvg
      const sleepDebt = features[10]; // cumulativeSleepDebt

      // Adjust for weekend/weekday patterns
      let adjustedStartHour = baseStartHour;
      let adjustedDuration = baseDuration;

      if (isWeekend) {
        adjustedStartHour += 0.5; // Tend to sleep later on weekends
        adjustedDuration += 0.3; // Tend to sleep longer
      }

      // Adjust for sleep debt
      if (sleepDebt > 2) {
        adjustedDuration += Math.min(1, sleepDebt * 0.1); // Compensate for sleep debt
        adjustedStartHour -= 0.2; // Go to bed slightly earlier
      }

      return {
        startHour: Math.max(0, Math.min(24, adjustedStartHour)),
        duration: Math.max(4, Math.min(12, adjustedDuration)),
        method: "enhanced_heuristic",
        confidence: 0.75,
      };
    }
  } catch (error) {
    console.error("Advanced ML prediction failed:", error);
    throw error;
  }
}

// Fallback prediction (same as before)
async function predictWithFallback(
  records: any[],
  targetDate: string,
  timezone: string
) {
  const recentRecords = records.slice(-7);

  if (recentRecords.length === 0) {
    return {
      startHour: 23,
      duration: 8,
      method: "default",
      confidence: 0.3,
    };
  }

  const avgStartHour =
    recentRecords.reduce((sum, record) => {
      const start = new Date(record.start_time);
      return sum + start.getHours() + start.getMinutes() / 60;
    }, 0) / recentRecords.length;

  const avgDuration =
    recentRecords.reduce((sum, record) => {
      const start = new Date(record.start_time);
      const end = new Date(record.end_time);
      return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, 0) / recentRecords.length;

  return {
    startHour: avgStartHour,
    duration: Math.max(4, Math.min(12, avgDuration)),
    method: "simple_average",
    confidence: 0.5,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { date, timezone } = await req.json();

    if (!date || !timezone) {
      return NextResponse.json(
        { error: "Date and timezone are required" },
        { status: 400 }
      );
    }

    // Fetch sleep records
    const { data: records, error } = await supabase
      .from("sleep_records")
      .select("*")
      .order("start_time", { ascending: true });

    if (error) {
      throw new Error(`Database error: ${error.message}`);
    }

    let prediction;
    let usedMethod = "unknown";

    try {
      // Try advanced ML prediction first
      prediction = await predictWithAdvancedML(records || [], date, timezone);
      usedMethod = prediction.method;
    } catch (mlError) {
      console.warn("Advanced ML prediction failed, using fallback:", mlError);
      // Fall back to simple prediction
      prediction = await predictWithFallback(records || [], date, timezone);
      usedMethod = prediction.method;
    }

    // Convert to actual times
    const targetDate = new Date(date);
    const startHours = Math.floor(prediction.startHour);
    const startMinutes = Math.round((prediction.startHour - startHours) * 60);

    const startTime = new Date(targetDate);
    startTime.setHours(startHours, startMinutes, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(endTime.getHours() + Math.floor(prediction.duration));
    endTime.setMinutes(
      endTime.getMinutes() + Math.round((prediction.duration % 1) * 60)
    );

    // Store prediction in database
    const { error: insertError } = await supabase.from("predictions").insert({
      predicted_for_date: date,
      predicted_start_time: startTime.toISOString(),
      predicted_end_time: endTime.toISOString(),
      timezone: timezone,
      prediction_method: usedMethod,
      confidence_score: prediction.confidence,
    });

    if (insertError) {
      console.error("Failed to store prediction:", insertError);
    }

    return NextResponse.json({
      message: "Prediction generated successfully",
      prediction: {
        date,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        duration: prediction.duration,
        method: usedMethod,
        confidence: prediction.confidence,
      },
    });
  } catch (error) {
    console.error("Prediction error:", error);
    return NextResponse.json(
      { error: `Failed to generate prediction: ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
