import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

// Enhanced prediction using statistical methods (no external ML libraries required)
function extractAdvancedFeatures(records: SleepRecord[], targetDate: string) {
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
    throw new Error("Insufficient data for prediction");
  }

  // Basic time features
  const dayOfWeek = targetDateObj.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

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

  // Calculate standard deviations for variability
  const durationStd =
    durations.length > 1
      ? Math.sqrt(
          durations.reduce(
            (sum, d) => sum + Math.pow(d - duration7dAvg, 2),
            0
          ) /
            (durations.length - 1)
        )
      : 0;

  const startHourStd =
    startHours.length > 1
      ? Math.sqrt(
          startHours.reduce(
            (sum, s) => sum + Math.pow(s - startHour7dAvg, 2),
            0
          ) /
            (startHours.length - 1)
        )
      : 0;

  return {
    dayOfWeek,
    isWeekend,
    duration7dAvg,
    startHour7dAvg,
    cumulativeSleepDebt,
    durationStd,
    startHourStd,
    recentCount: recentRecords.length,
    weekCount: weekRecords.length,
  };
}

// Enhanced prediction using pattern recognition
interface ExtractedFeatures {
  dayOfWeek: number;
  isWeekend: boolean;
  duration7dAvg: number;
  startHour7dAvg: number;
  cumulativeSleepDebt: number;
  durationStd: number;
  startHourStd: number;
  recentCount: number;
  recentAvgStartHour: number;
  recentAvgDuration: number;
  weekdayPattern: number;
  weekendPattern: number;
  sleepDebt: number;
  consistencyScore: number;
  seasonalAdjustment: number;
  dayOfWeekFactor: number;
  previousSleepQuality: number;
  stressLevel: number;
  recoveryNeeded: number;
  rollingAvg7: number;
  rollingAvg30: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function predictWithAdvancedHeuristics(features: any) {
  const {
    dayOfWeek,
    isWeekend,
    duration7dAvg,
    startHour7dAvg,
    cumulativeSleepDebt,
    durationStd,
    startHourStd,
    recentCount,
  } = features;

  // Base predictions from averages
  let predictedStartHour = startHour7dAvg;
  let predictedDuration = duration7dAvg;

  // Weekend adjustments
  if (isWeekend) {
    predictedStartHour += 0.5; // Sleep later on weekends
    predictedDuration += 0.3; // Sleep longer
  }

  // Sleep debt compensation
  if (cumulativeSleepDebt > 2) {
    const debtFactor = Math.min(cumulativeSleepDebt / 10, 0.5); // Cap at 0.5
    predictedDuration += debtFactor; // Sleep longer to recover
    predictedStartHour -= debtFactor * 0.3; // Go to bed slightly earlier
  } else if (cumulativeSleepDebt < -2) {
    // If ahead on sleep, might sleep less
    predictedDuration -= Math.min(Math.abs(cumulativeSleepDebt) / 10, 0.3);
  }

  // Day of week patterns
  const dayFactors = [0.1, -0.1, -0.1, 0, 0.2, 0.4, 0.3]; // Sun through Sat
  predictedStartHour += dayFactors[dayOfWeek] || 0;

  // Variability adjustments (if sleep is usually inconsistent)
  if (startHourStd > 1.5) {
    // High variability - use more conservative prediction
    predictedStartHour = startHour7dAvg; // Stick closer to average
  }

  if (durationStd > 1.0) {
    // High duration variability - be conservative
    predictedDuration = Math.max(6.5, Math.min(9, duration7dAvg));
  }

  // Clamp to reasonable ranges
  predictedStartHour = Math.max(20, Math.min(26, predictedStartHour)); // 8 PM to 2 AM
  predictedDuration = Math.max(5, Math.min(11, predictedDuration)); // 5 to 11 hours

  // Calculate confidence based on data quality
  let confidence = 0.6; // Base confidence
  if (recentCount >= 14) confidence += 0.1; // More data
  if (recentCount >= 30) confidence += 0.1; // Lots of data
  if (durationStd < 0.8) confidence += 0.1; // Consistent sleep
  if (startHourStd < 1.0) confidence += 0.1; // Consistent bedtime

  confidence = Math.min(0.9, confidence); // Cap at 90%

  return {
    startHour: predictedStartHour,
    duration: predictedDuration,
    method: "enhanced_statistical",
    confidence: confidence,
    factors: {
      isWeekend,
      sleepDebt: cumulativeSleepDebt,
      dayOfWeek,
      dataPoints: recentCount,
    },
  };
}

// Simple fallback prediction
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function predictWithFallback(records: SleepRecord[]) {
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

    console.log(
      `🔍 Found ${records?.length || 0} sleep records for prediction`
    );

    let prediction;
    let usedMethod = "unknown";

    try {
      if (records && records.length >= 5) {
        // Try enhanced statistical prediction
        const features = extractAdvancedFeatures(records, date);
        prediction = predictWithAdvancedHeuristics(features);
        usedMethod = prediction.method;

        console.log(
          `✅ Enhanced prediction: ${prediction.startHour}h start, ${prediction.duration}h duration, ${prediction.confidence} confidence`
        );
      } else {
        throw new Error("Insufficient data for enhanced prediction");
      }
    } catch (enhancedError) {
      console.warn(
        "Enhanced prediction failed, using fallback:",
        enhancedError
      );
      // Fall back to simple prediction
      prediction = predictWithFallback(records || []);
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
        factors: "factors" in prediction ? prediction.factors : null,
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
